import { sanitizeUsername } from "./profile-utils.js";

/**
 * Chat + friends logic.
 * @param {object} deps
 * @param {object} deps.state
 * @param {object} deps.dom
 * @param {object} deps.ui
 * @param {object} deps.supabaseClient
 */
export const initChat = ({ state, dom, ui, supabaseClient }) => {
    const addFriendLocal = (id, username) => {
        const exists = state.friends.some((f) => f.id === id);
        if (!exists) state.friends.push({ id, username: username || id, status: "accepted" });
        if (!state.dmMessages[id]) state.dmMessages[id] = [];
        ui.renderDmList(id);
    };

    const fetchProfileName = async (userId) => {
        if (!supabaseClient) return userId;
        const { data } = await supabaseClient.from("profiles").select("username").eq("id", userId).maybeSingle();
        return data?.username || userId;
    };

    const mapMessageRow = (row, friend) => {
        const myId = state.currentUser?.id;
        const isSelf = row.sender_id === myId;
        const authorName = isSelf ? state.profile?.username || "You" : friend?.username || row.sender_id;
        const handle = isSelf ? "you" : friend?.username || "friend";
        const time = row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
        return { id: row.id, user: authorName, handle, content: row.content, time, self: isSelf };
    };

    const loadFriends = async () => {
        if (!supabaseClient || !state.currentUser) return;
        const userId = state.currentUser.id;
        const { data, error } = await supabaseClient
            .from("friendships")
            .select("id,sender_id,receiver_id,status")
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .eq("status", "accepted");
        if (error) {
            console.error("Load friends failed", error);
            return;
        }
        const otherIds = (data || []).map((row) => (row.sender_id === userId ? row.receiver_id : row.sender_id));
        let profiles = [];
        if (otherIds.length > 0) {
            const { data: profileData } = await supabaseClient
                .from("profiles")
                .select("id, username")
                .in("id", otherIds);
            profiles = profileData || [];
        }
        state.friends = (data || []).map((row) => {
            const otherId = row.sender_id === userId ? row.receiver_id : row.sender_id;
            const profile = profiles.find((p) => p.id === otherId);
            return { id: otherId, username: profile?.username || otherId, status: row.status };
        });
    };

    const loadPending = async () => {
        if (!supabaseClient || !state.currentUser) return;
        const userId = state.currentUser.id;
        const { data, error } = await supabaseClient
            .from("friendships")
            .select("id,sender_id,receiver_id,status")
            .eq("status", "pending")
            .eq("receiver_id", userId);
        if (error) {
            console.error("Load pending failed", error);
            return;
        }
        const senderIds = (data || []).map((row) => row.sender_id);
        let profiles = [];
        if (senderIds.length > 0) {
            const { data: profileData } = await supabaseClient
                .from("profiles")
                .select("id, username")
                .in("id", senderIds);
            profiles = profileData || [];
        }
        state.pending = (data || []).map((row) => {
            const profile = profiles.find((p) => p.id === row.sender_id);
            return { ...row, username: profile?.username || row.sender_id };
        });
    };

    const loadMessagesForFriend = async (friendId) => {
        if (!supabaseClient || !state.currentUser || !friendId) return;
        const myId = state.currentUser.id;
        const friend = state.friends.find((f) => f.id === friendId);
        const { data, error } = await supabaseClient
            .from("messages")
            .select("id,sender_id,receiver_id,content,created_at")
            .or(`and(sender_id.eq.${myId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${myId})`)
            .order("created_at", { ascending: true });
        if (error) {
            console.error("Load messages failed", error);
            return;
        }
        state.dmMessages[friendId] = (data || []).map((row) => mapMessageRow(row, friend));
        if (state.activeDm === friendId) ui.renderDmThread();
    };

    const addDmMessage = (message, friendId = state.activeDm) => {
        if (!message || !message.content?.trim() || !friendId) return;
        if (!state.dmMessages[friendId]) state.dmMessages[friendId] = [];
        const exists = state.dmMessages[friendId].some((m) => m.id === message.id && message.id !== undefined);
        if (exists) return;
        state.dmMessages[friendId].push(message);
        if (friendId !== state.activeDm) return;
        const node = ui.buildMessage(message, { isDm: true });
        dom.dmThread?.appendChild(node);
        if (dom.dmThread) dom.dmThread.scrollTop = dom.dmThread.scrollHeight;
    };

    const sendDmMessage = async (content) => {
        if (!content.trim()) return;
        if (!supabaseClient || !state.currentUser) {
            addDmMessage({
                id: Date.now(),
                user: "You",
                handle: "you",
                content,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                self: true,
            });
            return;
        }
        const myId = state.currentUser.id;
        const friendId = state.activeDm;
        if (!friendId) return;
        const { data, error } = await supabaseClient
            .from("messages")
            .insert({ sender_id: myId, receiver_id: friendId, content })
            .select("id,sender_id,receiver_id,content,created_at")
            .maybeSingle();
        if (error) {
            console.error("Send message failed", error);
            return;
        }
        const friend = state.friends.find((f) => f.id === friendId);
        const mapped = mapMessageRow(data, friend);
        addDmMessage(mapped, friendId);
    };

    const subscribeFriendships = async () => {
        if (!supabaseClient || !state.currentUser) return;
        const userId = state.currentUser.id;
        const channel = supabaseClient.channel("friendships-feed");
        const onChange = (payload) => {
            const row = payload.new;
            if (!row || (row.sender_id !== userId && row.receiver_id !== userId)) return;
            if (row.status === "pending" && row.receiver_id === userId) {
                void fetchProfileName(row.sender_id).then((username) => {
                    state.pending = [...state.pending, { ...row, username }];
                    ui.renderPending();
                    ui.updateBadge();
                });
            }
            if (row.status === "accepted") {
                const otherId = row.sender_id === userId ? row.receiver_id : row.sender_id;
                void fetchProfileName(otherId).then((username) => addFriendLocal(otherId, username));
                state.pending = state.pending.filter((p) => p.id !== row.id);
                ui.renderPending();
            }
        };
        channel
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "friendships", filter: `receiver_id=eq.${userId}` }, onChange)
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "friendships", filter: `sender_id=eq.${userId},receiver_id=eq.${userId}` }, onChange)
            .subscribe();
        return channel;
    };

    const subscribeMessages = async () => {
        if (!supabaseClient || !state.currentUser) return;
        const userId = state.currentUser.id;
        const channel = supabaseClient.channel("messages-feed");
        const handler = (payload) => {
            const row = payload.new;
            if (!row) return;
            const isMine = row.sender_id === userId;
            const involvesMe = isMine || row.receiver_id === userId;
            if (!involvesMe) return;
            if (isMine) return;
            const activeFriend = state.activeDm;
            const friendId = row.sender_id === userId ? row.receiver_id : row.sender_id;
            if (activeFriend && friendId !== activeFriend) return;
            const friend = state.friends.find((f) => f.id === friendId);
            const mapped = mapMessageRow(row, friend);
            addDmMessage(mapped, friendId);
        };
        channel
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${userId}` }, handler)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `sender_id=eq.${userId}` }, handler)
            .subscribe();
        return channel;
    };

    const sendFriendRequest = async (targetUsername) => {
        if (!supabaseClient || !state.currentUser) return { error: "Not authenticated." };
        const me = state.currentUser.id;
        const { data: profiles, error: findError } = await supabaseClient
            .from("profiles")
            .select("id, username")
            .eq("username", targetUsername)
            .maybeSingle();
        if (findError || !profiles) {
            console.error("User not found", findError);
            return { error: "User not found." };
        }
        if (profiles.id === me) return { error: "You cannot add yourself." };
        const { error } = await supabaseClient
            .from("friendships")
            .insert({ sender_id: me, receiver_id: profiles.id, status: "pending" });
        if (error) return { error: error.message };
        return { success: true };
    };

    const bindDmList = () => {
        dom.dmList?.querySelectorAll("[data-dm-id]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                dom.dmList.querySelectorAll(".dm").forEach((b) => b.classList.remove("is-active"));
                btn.classList.add("is-active");
                state.activeDm = btn.dataset.dmId || null;
                if (dom.activeDmLabel) dom.activeDmLabel.textContent = `Direct · ${btn.querySelector(".dm-name")?.textContent || state.activeDm}`;
                if (supabaseClient && state.currentUser) await loadMessagesForFriend(state.activeDm);
                ui.renderDmThread();
            });
        });
    };

    const bindFriendNavigation = () => {
        dom.addFriendNav?.addEventListener("click", () => {
            ui.setFriendFeedback?.({ error: "", success: "" });
            ui.setMode("friend-add");
        });
        dom.backToDmBtn?.addEventListener("click", () => {
            ui.setFriendFeedback?.({ error: "", success: "" });
            ui.setMode("dm");
        });
    };

    const bindFriendForm = () => {
        dom.friendForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const value = dom.friendInput?.value.trim();
            if (!value) {
                ui.setFriendFeedback?.({ error: "Enter a username.", success: "" });
                return;
            }
            ui.setFriendFeedback?.({ error: "", success: "" });
            if (supabaseClient && state.currentUser) {
                const result = await sendFriendRequest(value);
                if (result?.error) ui.setFriendFeedback?.({ error: result.error, success: "" });
                else {
                    ui.setFriendFeedback?.({ error: "", success: "Request sent." });
                    if (dom.friendInput) dom.friendInput.value = "";
                }
            }
        });
    };

    const bindDmComposer = () => {
        dom.dmComposer?.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!dom.dmInput) return;
            const content = dom.dmInput.value.trim();
            if (!content) return;
            void sendDmMessage(content);
            dom.dmInput.value = "";
        });
    };

    const bindComposer = () => {
        dom.composer?.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!dom.composerInput) return;
            const content = dom.composerInput.value.trim();
            if (!content) return;
            state.messages.push({
                id: Date.now(),
                user: "You",
                handle: "you",
                content,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                self: true,
            });
            ui.renderMessages();
        });
    };

    const bindChannels = () => {
        dom.channelButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                dom.channelButtons.forEach((b) => b.classList.remove("is-active"));
                btn.classList.add("is-active");
                state.activeChannel = btn.dataset.channel || "channel";
                if (dom.activeChannelLabel) dom.activeChannelLabel.textContent = `# ${state.activeChannel}`;
                if (dom.composerInput) dom.composerInput.placeholder = `Send to #${state.activeChannel}`;
            });
        });
    };

    const bindServers = () => {
        dom.serverButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                dom.serverButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                state.activeServer = btn.dataset.server || "core";
                ui.setMode("server");
            });
        });
    };

    const bindDmButton = () => {
        dom.dmButton?.addEventListener("click", () => ui.setMode("dm"));
    };

    return {
        loadFriends,
        loadPending,
        loadMessagesForFriend,
        addDmMessage,
        sendDmMessage,
        subscribeFriendships,
        subscribeMessages,
        renderDmList: ui.renderDmList,
        renderDmThread: ui.renderDmThread,
        renderPending: ui.renderPending,
        updateBadge: ui.updateBadge,
        bindDmList,
        bindFriendNavigation,
        bindFriendForm,
        bindDmComposer,
        bindComposer,
        bindChannels,
        bindServers,
        bindDmButton,
        addFriendLocal,
    };
};
