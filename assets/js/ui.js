/**
 * Lightweight DOM helper.
 * @param {string} selector
 * @param {ParentNode} [scope]
 * @returns {HTMLElement|null}
 */
export const qs = (selector, scope = document) => scope.querySelector(selector);

/**
 * Initialize UI helpers bound to shared state and DOM refs.
 * @param {object} state - Shared app state (mutable reference).
 * @param {object} dom - Collected DOM references used across modules.
 */
export const initUi = (state, dom) => {
    const updateProfileUi = (username) => {
        const label = username || "Guest";
        dom.profileUsername && (dom.profileUsername.textContent = label);
        dom.profileAvatar && (dom.profileAvatar.textContent = initials(label));
        if (dom.profileChip) dom.profileChip.setAttribute("aria-label", `Profile · ${label}`);
        dom.settingsUsername && (dom.settingsUsername.textContent = label);
    };

    const setMode = (mode) => {
        state.mode = mode;
        dom.views.forEach((view) => {
            const isActive = view.dataset.view === mode;
            view.classList.toggle("is-hidden", !isActive);
        });
        dom.sidebar?.setAttribute("data-mode", mode);
        dom.channelBar?.setAttribute("data-mode", mode);
        dom.dmButton?.classList.toggle("is-dm-active", mode === "dm");
    };

    const setSettingsVisible = (show) => {
        if (!dom.settingsOverlay || !dom.settingsModal) return;
        if (show) {
            dom.settingsOverlay.classList.remove("is-hidden");
            requestAnimationFrame(() => dom.settingsOverlay.classList.add("is-visible"));
        } else {
            dom.settingsOverlay.classList.remove("is-visible");
            setTimeout(() => dom.settingsOverlay.classList.add("is-hidden"), 220);
        }
    };

    const setSettingsTab = (tabId) => {
        dom.settingsTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.settingsTab === tabId));
        dom.settingsPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.settingsPanel === tabId));
    };

    const applyNeonState = (isHigh) => {
        document.body.classList.toggle("neon-soft", !isHigh);
        if (dom.neonToggle) dom.neonToggle.checked = isHigh;
        localStorage.setItem("neonGlow", isHigh ? "high" : "low");
    };

    const loadNeonState = () => {
        const stored = localStorage.getItem("neonGlow");
        const isHigh = stored ? stored === "high" : true;
        applyNeonState(isHigh);
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
        if (message.self) wrapper.classList.add("self");

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
        const primaryName = message.user || message.handle || "User";
        const secondary = message.handle && message.handle !== primaryName ? ` · ${message.handle}` : "";
        author.textContent = `${primaryName}${secondary}`;
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
        if (!dom.messageList) return;
        dom.messageList.innerHTML = "";
        state.messages.forEach((msg, index) => {
            const node = buildMessage(msg);
            node.style.animationDelay = `${index * 40}ms`;
            dom.messageList.appendChild(node);
        });
        dom.messageList.scrollTop = dom.messageList.scrollHeight;
    };

    const renderDmThread = () => {
        if (!dom.dmThread) return;
        dom.dmThread.innerHTML = "";
        const thread = state.dmMessages[state.activeDm] || [];
        thread.forEach((msg, idx) => {
            const node = buildMessage(msg, { isDm: true });
            node.style.animationDelay = `${idx * 40}ms`;
            dom.dmThread.appendChild(node);
        });
        dom.dmThread.scrollTop = dom.dmThread.scrollHeight;
    };

    const renderDmList = (slideInId = null) => {
        if (!dom.dmList) return;
        dom.dmList.innerHTML = "";
        const accepted = state.friends.filter((f) => f.status === "accepted");
        if (accepted.length === 0) {
            const empty = document.createElement("li");
            empty.textContent = "No friends yet · send a request";
            empty.className = "dm-empty";
            dom.dmList.appendChild(empty);
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
                if (dom.activeDmLabel) dom.activeDmLabel.textContent = `Direct · ${friend.username}`;
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
            dom.dmList.appendChild(li);
        });
    };

    const renderPending = () => {
        if (!dom.pendingList) return;
        dom.pendingList.innerHTML = "";
        if (state.pending.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No pending requests";
            li.className = "pending-empty";
            dom.pendingList.appendChild(li);
            return;
        }
        state.pending.forEach((req) => {
            const li = document.createElement("li");
            li.className = "pending-card";
            const meta = document.createElement("div");
            meta.className = "pending-meta";
            const name = document.createElement("p");
            name.className = "pending-name";
            name.textContent = req.username || req.user_id || "Unknown";
            const sub = document.createElement("p");
            sub.className = "pending-sub";
            sub.textContent = "Friend request";
            meta.append(name, sub);
            li.append(meta);
            dom.pendingList.appendChild(li);
        });
    };

    const setFriendFeedback = ({ error, success }) => {
        if (dom.friendError) dom.friendError.textContent = error || "";
        if (dom.friendSuccess) dom.friendSuccess.textContent = success || "";
    };

    const updateBadge = () => {
        if (!dom.dmBadge) return;
        const hasPending = state.pending.length > 0;
        dom.dmBadge.classList.toggle("is-visible", hasPending);
        dom.dmBadge.setAttribute("aria-hidden", hasPending ? "false" : "true");
    };

    return {
        updateProfileUi,
        setMode,
        setSettingsVisible,
        setSettingsTab,
        applyNeonState,
        loadNeonState,
        renderMessages,
        renderDmThread,
        renderDmList,
        renderPending,
        setFriendFeedback,
        updateBadge,
        animateMessage,
        buildMessage,
    };
};

const initials = (text) => (text || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
