const qs = (selector, scope = document) => scope.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    const channelButtons = Array.from(document.querySelectorAll("[data-channel]"));
    const serverButtons = Array.from(document.querySelectorAll("[data-server]") );
    const dmButton = qs("[data-dm]");
    const dmBadge = qs("[data-dm-badge]");
    const dmList = qs("[data-dm-list]");
    const views = Array.from(document.querySelectorAll(".view"));
    const sidebar = qs(".sidebar");
    const channelBar = qs(".channel-bar");
    const activeChannelLabel = qs("[data-active-channel]");
    const activeDmLabel = qs("[data-active-dm]");
    const messageList = qs("[data-message-list]");
    const dmThread = qs("[data-dm-thread]");
    const composer = qs("[data-composer]");
    const composerInput = composer?.querySelector("input[name='message']");
    const dmComposer = qs("[data-dm-composer]");
    const dmInput = dmComposer?.querySelector("input[name='dm-message']");
    const tabs = Array.from(document.querySelectorAll(".tab"));
    const addFriendForm = qs("[data-add-friend]");
    const pendingList = qs("[data-pending-list]");

    const supabaseUrl = document.querySelector("meta[name='supabase-url']")?.content;
    const supabaseKey = document.querySelector("meta[name='supabase-key']")?.content;
    let supabaseClient = null;

    const state = {
        mode: "server",
        activeChannel: "quantum-lab",
        activeServer: "core",
        activeDm: "nora",
        currentUser: null,
        messages: [
            {
                id: 1,
                user: "Nora",
                handle: "nora.ai",
                content: "Deploy preview läuft. Bitte Neon-Glow auf mobile prüfen und Latency im Realtime feed loggen.",
                time: "09:12",
                self: false,
            },
            {
                id: 2,
                user: "Sven",
                handle: "sv3n",
                content: "Wir haben ein neues Motion-Preset für die Chat-Bubbles: blur-in + slide-up. Sieht crisp aus.",
                time: "09:14",
                self: false,
            },
            {
                id: 3,
                user: "Aury",
                handle: "auri.ops",
                content: "Pinned: Realtime schema + policies. Bitte bis 11:00h reviewn, dann merge.",
                time: "09:18",
                self: true,
            },
        ],
        dmMessages: {
            nora: [
                { id: 11, user: "Nora", handle: "nora.ai", content: "Kannst du das neon border preset pushen?", time: "09:20", self: false },
                { id: 12, user: "Aury", handle: "auri.ops", content: "Ja, shippe in 5. Check DM thread.", time: "09:21", self: true },
            ],
            sven: [
                { id: 21, user: "Sven", handle: "sv3n", content: "Hab den blur-in Effekt poliert.", time: "08:44", self: false },
            ],
            june: [
                { id: 31, user: "June", handle: "june.qa", content: "Latency logs sehen gut aus.", time: "07:55", self: false },
            ],
        },
        friends: [
            { id: "nora", username: "Nora", status: "accepted" },
            { id: "sven", username: "Sven", status: "accepted" },
            { id: "june", username: "June", status: "accepted" },
        ],
        pending: [],
    };

    const initials = (text) => (text || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

    const createSupabaseClient = () => {
        if (!window.supabase || !supabaseUrl || !supabaseKey || supabaseUrl.startsWith("YOUR_")) {
            console.warn("Supabase keys missing; running in demo mode.");
            return null;
        }
        return window.supabase.createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: true },
            realtime: { params: { eventsPerSecond: 3 } },
        });
    };

    const initSupabase = async () => {
        supabaseClient = createSupabaseClient();
        if (!supabaseClient) return;
        const { data: sessionData, error } = await supabaseClient.auth.getSession();
        if (error) {
            console.error("Supabase auth session error", error);
            return;
        }
        state.currentUser = sessionData.session?.user ?? null;
        if (!state.currentUser) {
            console.warn("No Supabase session; friendship features idle.");
            return;
        }
        await Promise.all([loadFriends(), loadPending(), subscribeFriendships()]);
        updateBadge();
        renderDmList();
        renderPending();
    };

    const animateMessage = (element) => {
        element.animate(
            [
                { opacity: 0, transform: "translateY(10px) scale(0.99)", filter: "blur(6px)" },
                { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
            ],
            { duration: 300, easing: "cubic-bezier(.22,.68,.18,1)" },
        );
    };

    const buildMessage = (message, { isDm = false } = {}) => {
        const wrapper = document.createElement("article");
        wrapper.className = "message";

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = initials(message.user);

        const status = document.createElement("div");
        status.className = "status-dot online";
        avatar.appendChild(status);

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        if (message.self) bubble.classList.add("self");
        if (isDm) bubble.classList.add("dm");

        const meta = document.createElement("div");
        meta.className = "meta-row";

        const author = document.createElement("span");
        author.className = "author";
        author.textContent = `${message.user} · ${message.handle}`;

        const time = document.createElement("span");
        time.className = "time";
        time.textContent = message.time;

        meta.append(author, time);

        const body = document.createElement("p");
        body.textContent = message.content;

        bubble.append(meta, body);
        wrapper.append(avatar, bubble);
        animateMessage(wrapper);

        return wrapper;
    };

    const renderMessages = () => {
        if (!messageList) return;
        messageList.innerHTML = "";
        state.messages.forEach((msg, index) => {
            const node = buildMessage(msg);
            node.style.animationDelay = `${index * 40}ms`;
            messageList.appendChild(node);
        });
        messageList.scrollTop = messageList.scrollHeight;
    };

    const renderDmThread = () => {
        if (!dmThread) return;
        dmThread.innerHTML = "";
        const thread = state.dmMessages[state.activeDm] || [];
        thread.forEach((msg, idx) => {
            const node = buildMessage(msg, { isDm: true });
            node.style.animationDelay = `${idx * 40}ms`;
            dmThread.appendChild(node);
        });
        dmThread.scrollTop = dmThread.scrollHeight;
    };

    const renderDmList = (slideInId = null) => {
        if (!dmList) return;
        dmList.innerHTML = "";
        const accepted = state.friends.filter((f) => f.status === "accepted");
        if (accepted.length === 0) {
            const empty = document.createElement("li");
            empty.textContent = "Keine Freunde · sende eine Anfrage";
            empty.className = "dm-empty";
            dmList.appendChild(empty);
            return;
        }
        accepted.forEach((friend, idx) => {
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.className = "dm";
            btn.dataset.dmId = friend.id;
            if (friend.id === state.activeDm || (idx === 0 && !state.activeDm)) {
                btn.classList.add("is-active");
                state.activeDm = friend.id;
                if (activeDmLabel) activeDmLabel.textContent = `Direct · ${friend.username}`;
            }
            if (slideInId && slideInId === friend.id) {
                btn.classList.add("slide-in");
                setTimeout(() => btn.classList.remove("slide-in"), 600);
            }

            const avatar = document.createElement("span");
            avatar.className = "dm-avatar";
            avatar.textContent = initials(friend.username);

            const meta = document.createElement("span");
            meta.className = "dm-meta";
            const name = document.createElement("span");
            name.className = "dm-name";
            name.textContent = friend.username;
            const sub = document.createElement("span");
            sub.className = "dm-sub";
            sub.textContent = "connected";
            meta.append(name, sub);

            const status = document.createElement("span");
            status.className = "dm-status glow";

            btn.append(avatar, meta, status);
            li.appendChild(btn);
            dmList.appendChild(li);
        });
        bindDmList();
    };

    const renderPending = () => {
        if (!pendingList) return;
        pendingList.innerHTML = "";
        if (state.pending.length === 0) {
            const li = document.createElement("li");
            li.textContent = "Keine ausstehenden Anfragen";
            li.className = "pending-empty";
            pendingList.appendChild(li);
            return;
        }
        state.pending.forEach((req) => {
            const li = document.createElement("li");
            li.className = "pending-card";
            const meta = document.createElement("div");
            meta.className = "pending-meta";
            const name = document.createElement("p");
            name.className = "pending-name";
            name.textContent = req.username || req.user_id || "Unbekannt";
            const sub = document.createElement("p");
            sub.className = "pending-sub";
            sub.textContent = "Freundschaftsanfrage";
            meta.append(name, sub);

            const accept = document.createElement("button");
            accept.className = "btn-accept";
            accept.textContent = "Annehmen";
            accept.addEventListener("click", () => handleRequest(req, "accepted"));

            const decline = document.createElement("button");
            decline.className = "btn-decline";
            decline.textContent = "Ablehnen";
            decline.addEventListener("click", () => handleRequest(req, "blocked"));

            li.append(meta, accept, decline);
            pendingList.appendChild(li);
        });
        updateBadge();
    };

    const updateBadge = () => {
        if (!dmBadge) return;
        const hasPending = state.pending.length > 0;
        dmBadge.classList.toggle("is-visible", hasPending);
        dmBadge.setAttribute("aria-hidden", hasPending ? "false" : "true");
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

    const addFriendLocal = (id, username) => {
        const exists = state.friends.some((f) => f.id === id);
        if (!exists) {
            state.friends.push({ id, username: username || id, status: "accepted" });
        }
        if (!state.dmMessages[id]) state.dmMessages[id] = [];
        renderDmList(id);
    };

    const fetchProfileName = async (userId) => {
        if (!supabaseClient) return userId;
        const { data } = await supabaseClient.from("profiles").select("username").eq("id", userId).maybeSingle();
        return data?.username || userId;
    };

    const handleRequest = async (request, newStatus) => {
        if (!supabaseClient || !state.currentUser) return;
        const { error } = await supabaseClient
            .from("friendships")
            .update({ status: newStatus })
            .eq("id", request.id);
        if (error) {
            console.error("Update request failed", error);
            return;
        }
        state.pending = state.pending.filter((r) => r.id !== request.id);
        if (newStatus === "accepted") {
            addFriendLocal(request.sender_id, request.username);
        } else {
            renderPending();
        }
    };

    const sendFriendRequest = async (targetUsername) => {
        if (!supabaseClient || !state.currentUser) return;
        const me = state.currentUser.id;
        const { data: profiles, error: findError } = await supabaseClient
            .from("profiles")
            .select("id, username")
            .eq("username", targetUsername)
            .maybeSingle();
        if (findError || !profiles) {
            console.error("User not found", findError);
            return;
        }
        if (profiles.id === me) {
            console.warn("Cannot friend yourself");
            return;
        }
        const { error } = await supabaseClient
            .from("friendships")
            .insert({ sender_id: me, receiver_id: profiles.id, status: "pending" });
        if (error) {
            console.error("Send request failed", error);
            return;
        }
        addFriendForm?.classList.add("sent");
        setTimeout(() => addFriendForm?.classList.remove("sent"), 800);
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
                    renderPending();
                    updateBadge();
                });
            }
            if (row.status === "accepted") {
                const otherId = row.sender_id === userId ? row.receiver_id : row.sender_id;
                void fetchProfileName(otherId).then((username) => addFriendLocal(otherId, username));
                state.pending = state.pending.filter((p) => p.id !== row.id);
                renderPending();
            }
        };

        channel
                .on("postgres_changes", { event: "INSERT", schema: "public", table: "friendships", filter: `receiver_id=eq.${userId}` }, onChange)
                .on("postgres_changes", { event: "UPDATE", schema: "public", table: "friendships", filter: `sender_id=eq.${userId},receiver_id=eq.${userId}` }, onChange)
            .subscribe();
    };

    const addMessage = (content, self = true) => {
        if (!content.trim()) return;
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const msg = {
            id: Date.now(),
            user: self ? "Aury" : "Screen Bot",
            handle: self ? "auri.ops" : "relay",
            content,
            time,
            self,
        };
        state.messages.push(msg);
        const node = buildMessage(msg);
        messageList?.appendChild(node);
        messageList?.scrollTo({ top: messageList.scrollHeight, behavior: "smooth" });
    };

    const addDmMessage = (content, self = true) => {
        if (!content.trim()) return;
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const msg = {
            id: Date.now(),
            user: self ? "Aury" : state.activeDm,
            handle: self ? "auri.ops" : `${state.activeDm}.dm`,
            content,
            time,
            self,
        };
        if (!state.dmMessages[state.activeDm]) state.dmMessages[state.activeDm] = [];
        state.dmMessages[state.activeDm].push(msg);
        const node = buildMessage(msg, { isDm: true });
        dmThread?.appendChild(node);
        dmThread?.scrollTo({ top: dmThread.scrollHeight, behavior: "smooth" });
    };

    const simulateReply = () => {
        setTimeout(() => {
            addMessage("Echo received. Routing to neon renderer and realtime channel.", false);
        }, 900);
    };

    const simulateDmReply = () => {
        setTimeout(() => {
            addDmMessage("Got it. Pink glow is live.", false);
        }, 900);
    };

    const setMode = (mode) => {
        state.mode = mode;
        views.forEach((view) => {
            const isActive = view.dataset.view === mode;
            view.classList.toggle("is-hidden", !isActive);
        });
        sidebar?.setAttribute("data-mode", mode);
        channelBar?.setAttribute("data-mode", mode);
        dmButton?.classList.toggle("is-dm-active", mode === "dm");
        if (mode === "dm") {
            serverButtons.forEach((b) => b.classList.remove("active"));
        }
    };

    const bindChannels = () => {
        channelButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                channelButtons.forEach((b) => b.classList.remove("is-active"));
                btn.classList.add("is-active");
                state.activeChannel = btn.dataset.channel || "channel";
                if (activeChannelLabel) {
                    activeChannelLabel.textContent = `# ${state.activeChannel}`;
                }
                if (composerInput) {
                    composerInput.placeholder = `Impulse to #${state.activeChannel}`;
                }
            });
        });
    };

    const bindServers = () => {
        serverButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                serverButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                state.activeServer = btn.dataset.server || "core";
                setMode("server");
            });
        });
    };

    const bindDmButton = () => {
        dmButton?.addEventListener("click", () => {
            setMode("dm");
        });
    };

    const bindDmList = () => {
        dmList?.querySelectorAll("[data-dm-id]").forEach((btn) => {
            btn.addEventListener("click", () => {
                dmList.querySelectorAll(".dm").forEach((b) => b.classList.remove("is-active"));
                btn.classList.add("is-active");
                state.activeDm = btn.dataset.dmId || "dm";
                if (activeDmLabel) {
                    activeDmLabel.textContent = `Direct · ${btn.querySelector(".dm-name")?.textContent || state.activeDm}`;
                }
                renderDmThread();
            });
        });
    };

    const bindTabs = () => {
        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((t) => {
                    t.classList.toggle("is-active", t === tab);
                    t.setAttribute("aria-selected", t === tab ? "true" : "false");
                });
            });
        });
    };

    const bindAddFriend = () => {
        addFriendForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = addFriendForm.querySelector("input[name='friend-username']");
            const value = input?.value.trim();
            if (!value) return;
            if (supabaseClient && state.currentUser) {
                void sendFriendRequest(value);
            } else {
                // Demo fallback: add as accepted instantly
                addFriendLocal(value.toLowerCase(), value);
            }
            input.value = "";
        });
    };

    const bindComposer = () => {
        composer?.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!composerInput) return;
            const content = composerInput.value.trim();
            if (!content) return;
            addMessage(content, true);
            composerInput.value = "";
            simulateReply();
        });
    };

    const bindDmComposer = () => {
        dmComposer?.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!dmInput) return;
            const content = dmInput.value.trim();
            if (!content) return;
            addDmMessage(content, true);
            dmInput.value = "";
            simulateDmReply();
        });
    };

    setMode(state.mode);
    renderMessages();
    renderDmThread();
    renderDmList();
    renderPending();
    bindChannels();
    bindServers();
    bindDmButton();
    bindDmList();
    bindTabs();
    bindAddFriend();
    bindComposer();
    bindDmComposer();
    void initSupabase();
});
