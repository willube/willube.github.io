const qs = (selector, scope = document) => scope.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    const dmBadge = qs("[data-dm-badge]");
    const dmList = qs("[data-dm-list]");
    const views = Array.from(document.querySelectorAll(".view"));
    const channelBar = qs(".channel-bar");
    const activeDmLabel = qs("[data-active-dm]");
    const dmThread = qs("[data-dm-thread]");
    const dmComposer = qs("[data-dm-composer]");
    const dmInput = dmComposer?.querySelector("input[name='dm-message']");
    const addFriendNav = qs("[data-open-friend-page]");
    const backToDmBtn = qs("[data-back-to-dm]");
    const friendForm = qs("[data-friend-form]");
    const friendInput = friendForm?.querySelector("input[name='friend-handle']");
    const friendError = qs("[data-friend-error]");
    const friendSuccess = qs("[data-friend-success]");
    const pendingList = qs("[data-pending-list]");
    const appContainer = qs("[data-app]");
    const authLayer = qs("[data-auth-layer]");
    const authForms = Array.from(document.querySelectorAll("[data-auth-form]"));
    const authSwitches = Array.from(document.querySelectorAll("[data-auth-switch]"));
    const loginForm = authForms.find((f) => f.dataset.authForm === "login");
    const registerForm = authForms.find((f) => f.dataset.authForm === "register");
    const registerUsernameInput = registerForm?.querySelector("input[name='username']");
    const registerSubmitButton = registerForm?.querySelector("button[type='submit']");
    const authHeading = qs("#auth-title");
    const profileChipButton = qs(".profile-chip-main");
    const profileAvatar = qs("[data-profile-avatar]");
    const profileUsername = qs("[data-current-username]");
    const settingsToggle = qs("[data-settings-toggle]");
    const settingsOverlay = qs("[data-settings-overlay]");
    const settingsModal = qs("[data-settings-modal]");
    const settingsClose = qs("[data-settings-close]");
    const settingsTabs = Array.from(document.querySelectorAll("[data-settings-tab]"));
    const settingsPanels = Array.from(document.querySelectorAll("[data-settings-panel]"));
    const settingsUsername = qs("[data-settings-username]");
    const neonToggle = qs("[data-neon-toggle]");
    const accentChips = Array.from(document.querySelectorAll("[data-accent-chip]"));
    const accentPicker = qs("[data-accent-picker]");
    const themeCards = Array.from(document.querySelectorAll("[data-theme-choice]"));
    const logoutBtn = qs("[data-logout]");
    const passwordInput = qs("[data-password-input]");
    const passwordSave = qs("[data-password-save]");
    const passwordMsg = qs("[data-password-msg]");
    const callButton = qs("[data-call-button]");
    const callOverlay = qs("[data-call-overlay]");
    const callStatus = qs("[data-call-status]");
    const callSub = qs("[data-call-sub]");
    const callAvatar = qs("[data-call-avatar]");
    const callAcceptBtn = qs("[data-call-accept]");
    const callEndBtn = qs("[data-call-end]");
    const remoteAudioEl = qs("[data-remote-audio]");
    const audioInputSelect = qs("[data-audio-input-select]");
    const ringtoneVolumeInput = qs("[data-ringtone-volume]");
    const ringtoneVolumeLabel = qs("[data-ringtone-volume-label]");
    const notificationVolumeInput = qs("[data-notification-volume]");
    const notificationVolumeLabel = qs("[data-notification-volume-label]");
    const callVolumeInput = qs("[data-call-volume]");
    const callVolumeLabel = qs("[data-call-volume-label]");
    const noiseToggle = qs("[data-noise-toggle]");
    const reducedMotionToggle = qs("[data-reduced-motion-toggle]");
    const contrastToggle = qs("[data-contrast-toggle]");
    const presenceToggle = qs("[data-presence-toggle]");
    const audioEchoToggle = qs("[data-audio-echo]");
    const audioNoiseToggle = qs("[data-audio-noise]");
    const audioGainToggle = qs("[data-audio-gain]");
    const introScreen = qs("#intro-screen");
    const introTextEl = qs("[data-intro-text]");
    const introCursorEl = qs("[data-intro-cursor]");
    const profileDisplayInput = qs("[data-profile-display]");
    const profileBioInput = qs("[data-profile-bio]");
    const profileAvatarInput = qs("[data-profile-avatar-input]");
    const profileSaveBtn = qs("[data-profile-save]");
    const profileSaveMsg = qs("[data-profile-save-msg]");
    const profilePreviewAvatar = qs("[data-profile-preview-avatar]");
    const profilePreviewName = qs("[data-profile-preview-name]");
    const profilePreviewBio = qs("[data-profile-preview-bio]");
    const profileOverlay = qs("[data-profile-overlay]");
    const profileOverlayClose = qs("[data-profile-close]");
    const profileViewAvatar = qs("[data-profile-view-avatar]");
    const profileViewDisplay = qs("[data-profile-view-display]");
    const profileViewUsername = qs("[data-profile-view-username]");
    const profileViewBio = qs("[data-profile-view-bio]");

    const supabaseUrl = document.querySelector("meta[name='supabase-url']")?.content;
    const supabaseKey = document.querySelector("meta[name='supabase-key']")?.content;
    let supabaseClient = null;
    let friendshipChannel = null;
    let messageChannel = null;
    let presenceChannel = null;
    let profileFetchDelayMs = 0;

    const getStoredVolume = (key, fallback = 0.5) => {
        try {
            const stored = Number(localStorage.getItem(key));
            if (Number.isFinite(stored)) return Math.min(Math.max(stored, 0), 1);
        } catch (err) {
            console.warn(`${key} volume read failed`, err);
        }
        return fallback;
    };

    const callState = {
        peer: null,
        channel: null,
        activeCall: null,
        pendingCall: null,
        localStream: null,
        remoteStream: null,
        remoteId: null,
        remotePeerId: null,
        levelMonitors: {},
        micDeviceId: "",
        acceptOnArrival: false,
        connectTimeoutId: null,
        myPeerId: null,
        currentCallId: null,
        callsChannel: null,
        isRingtonePlaying: false,
        ringtoneVolume: getStoredVolume("ringtoneVolume"),
        notificationVolume: getStoredVolume("notificationVolume", 0.6),
        callVolume: getStoredVolume("callVolume", 0.8),
    };

    if (remoteAudioEl) remoteAudioEl.volume = callState.callVolume;

    const ringtoneSrc = "assets/ringtone.mp3";
    const ringtoneAudio = new Audio(ringtoneSrc);
    ringtoneAudio.loop = true;
    ringtoneAudio.preload = "auto";
    ringtoneAudio.volume = callState.ringtoneVolume;
    ringtoneAudio.onerror = () => console.error("Klingelton konnte nicht geladen werden unter", ringtoneSrc);

    const notificationSrc = "assets/notify.wav";
    const notificationSound = new Audio(notificationSrc);
    notificationSound.preload = "auto";
    notificationSound.volume = callState.notificationVolume;
    notificationSound.onerror = () => console.error("Benachrichtigungston konnte nicht geladen werden unter", notificationSrc);

    let soundsUnlocked = false;
    const unlockAudio = async (audio) => {
        if (!audio) return false;
        try {
            const prevVolume = audio.volume;
            audio.muted = true;
            audio.volume = 0;
            await audio.play();
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
            audio.volume = prevVolume;
            return true;
        } catch (err) {
            console.warn("Audio unlock blocked", err);
            return false;
        }
    };

    const unlockSounds = async () => {
        if (soundsUnlocked) return;
        const ringOk = await unlockAudio(ringtoneAudio);
        const notifyOk = await unlockAudio(notificationSound);
        soundsUnlocked = ringOk || notifyOk;
    };

    const typeWriter = async (text = "", delay = 70) => {
        if (!introTextEl) return;
        introTextEl.textContent = "";
        for (let i = 0; i < text.length; i += 1) {
            introTextEl.textContent += text[i];
            await new Promise((res) => setTimeout(res, delay));
        }
    };

    const runIntroScreen = async () => {
        if (!introScreen || !introTextEl || !introCursorEl) return;
        const phrase = "Welcome to Sync";
        await typeWriter(phrase, 70);
        setTimeout(() => {
            introCursorEl.classList.add("is-hidden");
            introScreen.classList.add("is-fading");
            setTimeout(() => introScreen.remove?.(), 520);
        }, 900);
    };

    const startRingtone = async () => {
        if (callState.isRingtonePlaying) return;
        try {
            if (!soundsUnlocked) await unlockSounds();
            ringtoneAudio.currentTime = 0;
            ringtoneAudio.volume = callState.ringtoneVolume;
            ringtoneAudio.muted = false;
            await ringtoneAudio.play();
            callState.isRingtonePlaying = true;
            callAvatar?.classList.add("is-ringing");
        } catch (err) {
            console.warn("Ringtone play blocked", err);
            soundsUnlocked = false;
        }
    };

    const stopRingtone = () => {
        if (!callState.isRingtonePlaying) return;
        ringtoneAudio.pause();
        ringtoneAudio.currentTime = 0;
        callState.isRingtonePlaying = false;
        callAvatar?.classList.remove("is-ringing");
    };

    const wireRingtoneUnlock = () => {
        const tryUnlock = async () => {
            await unlockSounds();
            if (soundsUnlocked) {
                document.removeEventListener("pointerdown", tryUnlock, true);
                document.removeEventListener("keydown", tryUnlock, true);
                document.removeEventListener("click", tryUnlock, true);
            }
        };
        document.addEventListener("pointerdown", tryUnlock, true);
        document.addEventListener("keydown", tryUnlock, true);
        document.addEventListener("click", tryUnlock, true);
    };

    const playNotificationSound = async () => {
        try {
            if (!soundsUnlocked) await unlockSounds();
            notificationSound.currentTime = 0;
            notificationSound.volume = callState.notificationVolume;
            notificationSound.muted = false;
            await notificationSound.play();
        } catch (err) {
            console.warn("Notification sound blocked", err);
            soundsUnlocked = false;
        }
    };

    const shouldPlayNotification = (message, friendId) => {
        if (!message) return false;
        if (message.self) return false;
        const currentId = state.currentUser?.id;
        if (currentId && message.userId && message.userId === currentId) return false;
        const currentHandle = state.profile?.username?.toLowerCase();
        if (currentHandle && message.handle?.toLowerCase() === currentHandle) return false;
        const tabHidden = document.hidden;
        const windowUnfocused = typeof document.hasFocus === "function" ? !document.hasFocus() : false;
        const inactiveThread = friendId && friendId !== state.activeDm;
        return tabHidden || windowUnfocused || inactiveThread;
    };

    const state = {
        mode: "dm",
        activeDm: null,
        currentUser: null,
        dmMessages: {},
        unreadById: {},
        friends: [],
        pending: [],
        profile: null,
        onlineUsers: new Set(),
    };

    const initials = (text) => (text || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const bumpUnread = (friendId) => {
        if (!friendId) return;
        const current = state.unreadById[friendId] || 0;
        state.unreadById[friendId] = current + 1;
    };

    const clearUnread = (friendId) => {
        if (!friendId) return;
        if (state.unreadById[friendId]) delete state.unreadById[friendId];
    };

    const sanitizeUsername = (value) => {
        if (!value) return "";
        return value
            .toString()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9_-]/g, "")
            .slice(0, 24);
    };

    const buildUsername = (preferred, emailValue) => {
        const fromPreferred = sanitizeUsername(preferred);
        if (fromPreferred) return fromPreferred;
        const emailHandle = sanitizeUsername(emailValue?.split("@")[0] || "");
        const base = emailHandle || "user";
        const suffix = Math.random().toString(36).slice(2, 6);
        return `${base}-${suffix}`;
    };

    const sanitizeText = (value, max = 180) => {
        if (!value) return "";
        return value
            .toString()
            .replace(/[<>]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, max);
    };

    const sanitizeUrl = (value) => {
        if (!value) return "";
        const trimmed = value.trim();
        if (!/^https?:\/\//i.test(trimmed)) return "";
        return trimmed.slice(0, 300);
    };

    const setAvatarVisual = (node, avatarUrl, fallbackText) => {
        if (!node) return;
        const clean = sanitizeUrl(avatarUrl);
        const existingImg = node.querySelector("img[data-avatar-image='true']");

        Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) child.remove();
        });

        if (clean) {
            node.style.backgroundImage = "";
            let img = existingImg;
            if (!img) {
                img = document.createElement("img");
                img.dataset.avatarImage = "true";
                img.loading = "lazy";
                img.decoding = "async";
                node.insertBefore(img, node.firstChild);
            }
            img.src = clean;
            img.alt = fallbackText || "Avatar";
            node.classList.add("has-image");
        } else {
            node.style.backgroundImage = "";
            existingImg?.remove();
            if (fallbackText) {
                node.insertBefore(document.createTextNode(fallbackText), node.firstChild);
            }
            node.classList.remove("has-image");
        }
    };

    const updateProfileUi = (profileData) => {
        const profile = typeof profileData === "string" ? { username: profileData } : profileData || {};
        const label = profile.display_name || profile.username || "Guest";
        if (profileUsername) profileUsername.textContent = label;
        if (profileChipButton) profileChipButton.setAttribute("aria-label", `Profile · ${label}`);
        if (settingsUsername) settingsUsername.textContent = profile.username || label;
        if (profilePreviewAvatar) setAvatarVisual(profilePreviewAvatar, profile.avatar_url, initials(label));
        if (profilePreviewName) profilePreviewName.textContent = label;
        if (profilePreviewBio) profilePreviewBio.textContent = profile.bio || "—";
    };

    const refreshOwnAvatar = (profile) => {
        if (!profileAvatar) return;
        const label = profile?.display_name || profile?.username || "Guest";
        const url = sanitizeUrl(profile?.avatar_url);
        profileAvatar.dataset.profileId = profile?.id || "";
        profileAvatar.classList.remove("has-image");
        profileAvatar.style.backgroundImage = "";
        profileAvatar.textContent = "";
        if (url) {
            const img = document.createElement("img");
            img.src = url;
            img.alt = label;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.borderRadius = "inherit";
            img.style.display = "block";
            profileAvatar.appendChild(img);
            profileAvatar.classList.add("has-image");
        } else {
            profileAvatar.textContent = initials(label);
        }
    };

    const updateLocalUI = (profile) => {
        const label = profile?.display_name || profile?.username || "Guest";
        refreshOwnAvatar(profile);
        if (profileChipButton) profileChipButton.dataset.profileId = profile?.id || "";
    };

    const fillProfileForm = (profile) => {
        if (!profile) return;
        if (profileDisplayInput) profileDisplayInput.value = profile.display_name || "";
        if (profileBioInput) profileBioInput.value = profile.bio || "";
        if (profileAvatarInput) profileAvatarInput.value = profile.avatar_url || "";
    };

    const loadSelfProfile = async () => {
        if (!supabaseClient || !state.currentUser) return;
        const profile = await fetchOwnProfile();
        if (!profile) return;
        state.profile = { ...state.profile, ...profile };
        updateProfileUi(state.profile);
        fillProfileForm(state.profile);
        updateLocalUI(state.profile);
        attachProfileClick(profileAvatar, state.currentUser.id);
    };

    const saveProfile = async () => {
        if (!profileSaveMsg) return;
        profileSaveMsg.textContent = "";
        if (!supabaseClient || !state.currentUser) {
            profileSaveMsg.textContent = "Bitte zuerst anmelden.";
            return;
        }
        const displayName = sanitizeText(profileDisplayInput?.value, 40);
        const bio = sanitizeText(profileBioInput?.value, 180);
        const avatarUrl = sanitizeUrl(profileAvatarInput?.value);
        const payload = { id: state.currentUser.id, display_name: displayName, bio, avatar_url: avatarUrl };
        const { data, error } = await supabaseClient
            .from("profiles")
            .upsert(payload, { onConflict: "id" })
            .select("id, username, display_name, bio, avatar_url, updated_at")
            .maybeSingle();
        if (error) {
            profileSaveMsg.textContent = error.message;
            return;
        }
        state.profile = { ...state.profile, ...data };
        updateProfileUi(state.profile);
        fillProfileForm(state.profile);
        updateLocalUI(state.profile);
        profileSaveMsg.textContent = "Profil aktualisiert.";
        setTimeout(() => {
            if (profileSaveMsg) profileSaveMsg.textContent = "";
        }, 1600);
    };

    const setProfileOverlayVisible = (show) => {
        if (!profileOverlay) return;
        if (show) {
            profileOverlay.classList.remove("is-hidden");
            requestAnimationFrame(() => profileOverlay.classList.add("is-visible"));
        } else {
            profileOverlay.classList.remove("is-visible");
            setTimeout(() => profileOverlay.classList.add("is-hidden"), 200);
        }
    };

    async function openProfileCard(userId) {
        if (!userId) return;
        setProfileOverlayVisible(true);
        if (profileViewDisplay) profileViewDisplay.textContent = "Loading…";
        if (profileViewUsername) profileViewUsername.textContent = "";
        if (profileViewBio) profileViewBio.textContent = "";
        setAvatarVisual(profileViewAvatar, "", "--");
        const isSelf = userId === state.currentUser?.id;
        const friendFallback = state.friends.find((f) => f.id === userId);
        const profile = isSelf ? state.profile : (await fetchProfile(userId)) || friendFallback;
        const display = profile?.display_name || profile?.username || "User";
        const username = profile?.username || "";
        if (profileViewDisplay) profileViewDisplay.textContent = display;
        if (profileViewUsername) profileViewUsername.textContent = username ? `@${username}` : "";
        if (profileViewBio) profileViewBio.textContent = profile?.bio || "No bio yet.";
        setAvatarVisual(profileViewAvatar, profile?.avatar_url, initials(display));
    }

    const closeProfileOverlay = () => setProfileOverlayVisible(false);

    let profileFlyout = null;
    let profileFlyoutEls = {};

    const ensureProfileFlyout = () => {
        if (profileFlyout) return profileFlyout;
        const wrapper = document.createElement("div");
        wrapper.className = "profile-flyout";
        wrapper.style.cssText =
            "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(5,6,8,0.65);backdrop-filter:blur(8px);z-index:60;opacity:0;pointer-events:none;transition:opacity 160ms ease";
        wrapper.innerHTML = `
            <div class="profile-flyout-card" role="dialog" aria-modal="true" style="width:min(440px,92vw);background:rgba(12,14,20,0.94);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:18px;box-shadow:0 18px 48px rgba(0,0,0,0.35);position:relative;">
                <button data-flyout-close aria-label="Close profile" style="position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.05);color:#fff;cursor:pointer;font-size:16px;">×</button>
                <div style="display:flex;gap:14px;align-items:center;">
                    <div style="width:88px;height:88px;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);flex-shrink:0;">
                        <img data-flyout-avatar alt="Profile" style="width:100%;height:100%;object-fit:cover;display:block;" />
                    </div>
                    <div>
                        <p data-flyout-name style="margin:0;font-weight:700;font-size:1.1rem;letter-spacing:0.01em;">Loading…</p>
                        <p data-flyout-username style="margin:4px 0 0;color:#9da7b8;font-size:0.95rem;"></p>
                    </div>
                </div>
                <p data-flyout-bio style="margin:14px 0 0;color:#9da7b8;line-height:1.5;white-space:pre-wrap;">Bio wird geladen…</p>
            </div>
        `;
        document.body.appendChild(wrapper);
        profileFlyout = wrapper;
        profileFlyoutEls = {
            avatar: wrapper.querySelector("[data-flyout-avatar]"),
            name: wrapper.querySelector("[data-flyout-name]"),
            username: wrapper.querySelector("[data-flyout-username]"),
            bio: wrapper.querySelector("[data-flyout-bio]"),
            close: wrapper.querySelector("[data-flyout-close]"),
        };
        const hide = () => hideProfileFlyout();
        profileFlyoutEls.close?.addEventListener("click", hide);
        wrapper.addEventListener("click", (event) => {
            if (event.target === wrapper) hide();
        });
        return profileFlyout;
    };

    const hideProfileFlyout = () => {
        if (!profileFlyout) return;
        profileFlyout.style.opacity = "0";
        profileFlyout.style.pointerEvents = "none";
    };

    const renderProfileFlyout = (profile) => {
        const overlay = ensureProfileFlyout();
        const display = profile?.display_name || profile?.username || "User";
        const handle = profile?.username ? `@${profile.username}` : "";
        const bio = profile?.bio || "No bio yet.";
        const url = sanitizeUrl(profile?.avatar_url);
        if (profileFlyoutEls.name) profileFlyoutEls.name.textContent = display;
        if (profileFlyoutEls.username) profileFlyoutEls.username.textContent = handle;
        if (profileFlyoutEls.bio) profileFlyoutEls.bio.textContent = bio;
        if (profileFlyoutEls.avatar) {
            if (url) {
                profileFlyoutEls.avatar.src = url;
                profileFlyoutEls.avatar.style.visibility = "visible";
            } else {
                profileFlyoutEls.avatar.removeAttribute("src");
                profileFlyoutEls.avatar.style.visibility = "hidden";
            }
            profileFlyoutEls.avatar.alt = display;
        }
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
    };

    const fetchAndShowProfile = async (userId) => {
        if (!userId) return;
        const isSelf = userId === state.currentUser?.id;
        let profile = isSelf ? state.profile : state.friends.find((f) => f.id === userId);
        try {
            const fetched = await fetchProfile(userId);
            if (fetched) profile = { ...profile, ...fetched };
        } catch (err) {
            console.error("Profile fetch failed", err);
        }
        if (!profile) profile = { id: userId, username: userId };
        renderProfileFlyout(profile);
    };

    function attachProfileClick(node, userId) {
        if (!node || !userId) return;
        node.classList.add("profile-trigger");
        node.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            void fetchAndShowProfile(userId);
        });
    }

    const normalizeUserId = (value) => {
        if (!value) return "";
        const raw = String(value).trim();
        if (!raw.includes("_")) return raw;
        const [firstPart] = raw.split("_");
        const looksLikeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(firstPart);
        return looksLikeUuid ? firstPart : raw;
    };

    const getFriendDisplayName = (id) => {
        const normalizedId = normalizeUserId(id);
        if (!normalizedId) return "Friend";
        if (state.profile?.id === normalizedId) return state.profile?.display_name || state.profile?.username || "You";
        const friend = state.friends.find((f) => f.id === normalizedId);
        return friend?.displayName || friend?.username || normalizedId;
    };

    const setCallAvatarLabel = (name) => {
        if (callAvatar) callAvatar.textContent = initials(name || "--");
    };

    const setCallOverlayState = ({ visible, status, sub, showAccept }) => {
        if (!callOverlay) return;
        callOverlay.classList.toggle("is-hidden", !visible);
        if (callStatus && status) callStatus.textContent = status;
        if (callSub && sub !== undefined) callSub.textContent = sub;
        if (callAcceptBtn) callAcceptBtn.style.display = showAccept ? "inline-flex" : "none";
    };

    const stopStream = (stream) => {
        if (!stream) return;
        stream.getTracks().forEach((track) => track.stop());
    };

    const stopLevelMonitor = (key) => {
        const monitor = callState.levelMonitors[key];
        if (!monitor) return;
        if (monitor.rafId) cancelAnimationFrame(monitor.rafId);
        monitor.ctx?.close?.();
        monitor.target?.classList.remove("is-speaking");
        delete callState.levelMonitors[key];
    };

    const startLevelMonitor = (key, stream, target) => {
        stopLevelMonitor(key);
        if (!stream || !target) return;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const monitor = { ctx, target, rafId: 0 };
        const tick = () => {
            analyser.getByteTimeDomainData(data);
            const deviation = data.reduce((max, value) => Math.max(max, Math.abs(value - 128)), 0);
            target.classList.toggle("is-speaking", deviation > 16);
            monitor.rafId = requestAnimationFrame(tick);
        };
        tick();
        callState.levelMonitors[key] = monitor;
    };

    const stopAllLevelMonitors = () => {
        Object.keys(callState.levelMonitors).forEach((key) => stopLevelMonitor(key));
    };

    const syncOnlineUsers = (channel = presenceChannel) => {
        const presences = channel?.presenceState?.() || {};
        const onlineIds = new Set();
        Object.entries(presences).forEach(([key, entries]) => {
            const normalizedKey = normalizeUserId(key).toLowerCase();
            if (normalizedKey) onlineIds.add(normalizedKey);
            (entries || []).forEach((entry) => {
                const candidate = normalizeUserId(entry?.user_id || entry?.id || entry?.key || "").toLowerCase();
                if (candidate) onlineIds.add(candidate);
            });
        });
        state.onlineUsers = onlineIds;
        renderDmList();
    };

    const fetchOwnProfile = async () => {
        if (!supabaseClient || !state.currentUser) return null;
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("id, username, display_name, bio, avatar_url, updated_at")
            .eq("id", state.currentUser.id)
            .maybeSingle();
        if (error) {
            console.error("Fetch profile failed", error);
            return null;
        }
        return data;
    };

    const upsertDefaultUsername = async (username) => {
        if (!supabaseClient || !state.currentUser) return null;
        const { data, error } = await supabaseClient
            .from("profiles")
            .upsert({ id: state.currentUser.id, username }, { onConflict: "id" })
            .select("id, username")
            .maybeSingle();
        if (error) {
            console.error("Set default username failed", error);
            return null;
        }
        return data;
    };

    const fetchProfile = async (userId) => {
        if (!supabaseClient || !userId) return null;
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("id, username, display_name, bio, avatar_url, updated_at")
            .eq("id", userId)
            .maybeSingle();
        if (error) {
            console.error("Fetch profile failed", error);
            return null;
        }
        return data;
    };

    const ensureProfileUsername = async (delayMs = 0) => {
        if (!supabaseClient || !state.currentUser) return null;
        if (delayMs > 0) await sleep(delayMs);
        const profile = await fetchOwnProfile();
        if (profile?.username) {
            state.profile = profile;
            updateProfileUi(profile);
            return profile;
        }
        const generated = buildUsername(state.currentUser.user_metadata?.username, state.currentUser.email);
        const saved = (await upsertDefaultUsername(generated)) || profile || { id: state.currentUser.id, username: generated };
        state.profile = saved;
        updateProfileUi(saved);
        return saved;
    };

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

    const toggleAuth = (isAuthenticated) => {
        if (!appContainer || !authLayer) return;
        if (isAuthenticated) {
            authLayer.classList.add("is-hidden");
            appContainer.classList.remove("is-locked");
            appContainer.classList.add("is-live");
        } else {
            authLayer.classList.remove("is-hidden");
            appContainer.classList.add("is-locked");
            appContainer.classList.remove("is-live");
        }
    };

    const setAuthError = (form, message) => {
        const el = form?.querySelector("[data-auth-error]");
        if (el) el.textContent = message || "";
    };

    const clearAuthErrors = () => {
        authForms.forEach((form) => setAuthError(form, ""));
    };

    const validateAuthFields = (emailValue, passwordValue) => {
        if (!emailValue || !passwordValue) return "Please fill email and password.";
        if (passwordValue.length < 6) return "Password must be at least 6 characters.";
        return null;
    };

    const setSettingsVisible = (show) => {
        if (!settingsOverlay || !settingsModal) return;
        if (show) {
            settingsOverlay.classList.remove("is-hidden");
            requestAnimationFrame(() => settingsOverlay.classList.add("is-visible"));
        } else {
            settingsOverlay.classList.remove("is-visible");
            setTimeout(() => settingsOverlay.classList.add("is-hidden"), 220);
        }
    };

    const setSettingsTab = (tabId) => {
        settingsTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.settingsTab === tabId));
        settingsPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.settingsPanel === tabId));
    };

    const applyNeonState = (isHigh) => {
        document.body.classList.toggle("neon-soft", !isHigh);
        if (neonToggle) neonToggle.checked = isHigh;
        localStorage.setItem("neonGlow", isHigh ? "high" : "low");
    };

    const loadNeonState = () => {
        const stored = localStorage.getItem("neonGlow");
        const isHigh = stored ? stored === "high" : true;
        applyNeonState(isHigh);
    };

    const designDefaults = {
        accent: "#6bc1b6",
        accent2: "#9eddd3",
        theme: "stealth",
        customAccent: false,
    };

    const themeAccentDefaults = {
        minimalist: "#7e8cff",
        stealth: "#6bc1b6",
        neon: "#c058ff",
    };

    const parseDesignPrefs = () => {
        try {
            const raw = localStorage.getItem("designPrefs");
            const parsed = raw ? JSON.parse(raw) : { ...designDefaults };
            return { ...designDefaults, ...parsed, customAccent: parsed?.customAccent ?? false };
        } catch (e) {
            return { ...designDefaults };
        }
    };

    const saveDesignPrefs = (prefs) => {
        localStorage.setItem("designPrefs", JSON.stringify(prefs));
    };

    const hexToRgb = (hex) => {
        const cleaned = hex.replace("#", "");
        if (cleaned.length !== 6) return { r: 192, g: 88, b: 255 };
        const num = parseInt(cleaned, 16);
        return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    };

    const lighten = (hex, amount = 0.25) => {
        const { r, g, b } = hexToRgb(hex);
        const mix = (c) => Math.min(255, Math.round(c + (255 - c) * amount));
        const toHex = (c) => c.toString(16).padStart(2, "0");
        return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
    };

    const applyAccent = (accentHex, { markCustom = true } = {}) => {
        const accent = accentHex || designDefaults.accent;
        const accent2 = lighten(accent, 0.32);
        document.documentElement.style.setProperty("--accent", accent);
        document.documentElement.style.setProperty("--accent-2", accent2);
        if (accentPicker) accentPicker.value = accent;
        accentChips.forEach((chip) => {
            const target = chip.dataset.accentChip?.split(",")[0];
            chip.classList.toggle("is-active", target?.toLowerCase() === accent.toLowerCase());
        });
        const prefs = parseDesignPrefs();
        const customAccent = markCustom ? true : prefs.customAccent;
        saveDesignPrefs({ ...prefs, accent, accent2, customAccent });
    };

    const applyThemePreset = (theme, { applyThemeAccent = true } = {}) => {
        const themes = ["minimalist", "stealth", "neon"];
        themes.forEach((t) => document.body.classList.toggle(`theme-${t}`, t === theme));
        themeCards.forEach((card) => {
            card.classList.toggle("is-active", card.dataset.themeChoice === theme);
            const input = card.querySelector("input[type='radio']");
            if (input) input.checked = card.dataset.themeChoice === theme;
        });
        const prefs = parseDesignPrefs();
        saveDesignPrefs({ ...prefs, theme });

        const themeAccent = themeAccentDefaults[theme] || designDefaults.accent;
        const shouldApplyThemeAccent = applyThemeAccent && (!prefs.customAccent || prefs.theme !== theme);
        if (shouldApplyThemeAccent) {
            applyAccent(themeAccent, { markCustom: false });
        }
    };

    const loadDesignPrefs = () => {
        const prefs = parseDesignPrefs();
        const theme = prefs.theme || "stealth";
        applyThemePreset(theme, { applyThemeAccent: false });
        const themeAccent = themeAccentDefaults[theme] || designDefaults.accent;
        const accent = prefs.customAccent ? prefs.accent || themeAccent : themeAccent;
        applyAccent(accent, { markCustom: prefs.customAccent });
    };

    const uiPrefDefaults = {
        reducedMotion: false,
        showNoise: true,
        highContrast: false,
        showPresence: true,
    };

    const parseUiPrefs = () => {
        try {
            const raw = localStorage.getItem("uiPrefs");
            const parsed = raw ? JSON.parse(raw) : {};
            return { ...uiPrefDefaults, ...parsed };
        } catch (err) {
            return { ...uiPrefDefaults };
        }
    };

    const saveUiPrefs = (prefs) => {
        try {
            localStorage.setItem("uiPrefs", JSON.stringify(prefs));
        } catch (err) {
            console.warn("ui prefs persist failed", err);
        }
    };

    const applyUiPrefs = (prefs) => {
        document.body.classList.toggle("reduced-motion", prefs.reducedMotion);
        document.body.classList.toggle("no-noise", !prefs.showNoise);
        document.body.classList.toggle("high-contrast", prefs.highContrast);
        document.body.classList.toggle("hide-presence", !prefs.showPresence);
        if (reducedMotionToggle) reducedMotionToggle.checked = prefs.reducedMotion;
        if (noiseToggle) noiseToggle.checked = prefs.showNoise;
        if (contrastToggle) contrastToggle.checked = prefs.highContrast;
        if (presenceToggle) presenceToggle.checked = prefs.showPresence;
    };

    const loadUiPrefs = () => {
        applyUiPrefs(parseUiPrefs());
    };

    const audioPrefDefaults = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
    };

    const parseAudioPrefs = () => {
        try {
            const raw = localStorage.getItem("audioPrefs");
            const parsed = raw ? JSON.parse(raw) : {};
            return { ...audioPrefDefaults, ...parsed };
        } catch (err) {
            return { ...audioPrefDefaults };
        }
    };

    const saveAudioPrefs = (prefs) => {
        try {
            localStorage.setItem("audioPrefs", JSON.stringify(prefs));
        } catch (err) {
            console.warn("audio prefs persist failed", err);
        }
    };

    const applyAudioPrefs = (prefs) => {
        if (audioEchoToggle) audioEchoToggle.checked = prefs.echoCancellation;
        if (audioNoiseToggle) audioNoiseToggle.checked = prefs.noiseSuppression;
        if (audioGainToggle) audioGainToggle.checked = prefs.autoGainControl;
    };

    const loadAudioPrefs = () => {
        applyAudioPrefs(parseAudioPrefs());
    };

    const refreshAudioInputs = async () => {
        if (!audioInputSelect || !navigator.mediaDevices?.enumerateDevices) return;
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter((d) => d.kind === "audioinput");
            audioInputSelect.innerHTML = "";
            const defaultOpt = document.createElement("option");
            defaultOpt.value = "";
            defaultOpt.textContent = "Standard Mikrofon";
            audioInputSelect.appendChild(defaultOpt);
            audioInputs.forEach((device, idx) => {
                const opt = document.createElement("option");
                opt.value = device.deviceId;
                opt.textContent = device.label || `Mic ${idx + 1}`;
                audioInputSelect.appendChild(opt);
            });
            const hasMatch = audioInputs.some((d) => d.deviceId === callState.micDeviceId);
            audioInputSelect.value = hasMatch ? callState.micDeviceId : "";
            callState.micDeviceId = audioInputSelect.value;
        } catch (error) {
            console.error("Could not list audio devices", error);
        }
    };

    const stopLocalStream = () => {
        if (callState.localStream) stopStream(callState.localStream);
        callState.localStream = null;
        stopLevelMonitor("local");
    };

    const stopRemoteStream = () => {
        if (callState.remoteStream) stopStream(callState.remoteStream);
        callState.remoteStream = null;
        stopLevelMonitor("remote");
        if (remoteAudioEl) remoteAudioEl.srcObject = null;
    };

    const createLocalStream = async () => {
        const audioPrefs = parseAudioPrefs();
        const constraints = {
            audio: {
                deviceId: callState.micDeviceId ? { exact: callState.micDeviceId } : undefined,
                echoCancellation: audioPrefs.echoCancellation,
                noiseSuppression: audioPrefs.noiseSuppression,
                autoGainControl: audioPrefs.autoGainControl,
            },
        };
        try {
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            stopLocalStream();
            callState.localStream = newStream;
            startLevelMonitor("local", newStream, profileAvatar);
            return newStream;
        } catch (error) {
            console.error("Mic access failed", error);
            setCallOverlayState({ visible: true, status: "Mikrofon blockiert", sub: error.message || "", showAccept: false });
            return null;
        }
    };

    const attachRemoteStream = (stream) => {
        if (!stream) return;
        callState.remoteStream = stream;
        if (remoteAudioEl) {
            remoteAudioEl.srcObject = stream;
            remoteAudioEl.autoplay = true;
            remoteAudioEl.volume = callState.callVolume;
            remoteAudioEl.play?.().catch((err) => console.warn("remote audio play blocked", err));
        }
        startLevelMonitor("remote", stream, callAvatar || null);
    };

    const sendCallSignal = async (type) => {
        if (!supabaseClient) return;
        if (type === "hangup" && callState.currentCallId) {
            await updateCallStatus(callState.currentCallId, "ended");
        }
    };

    const endCall = (reason = "ended", notifyPeer = true) => {
        const remoteId = callState.remoteId;
        if (notifyPeer && remoteId) {
            void sendCallSignal("hangup", remoteId);
        }
        if (callState.connectTimeoutId) clearTimeout(callState.connectTimeoutId);
        callState.connectTimeoutId = null;
        callState.activeCall?.close?.();
        callState.pendingCall?.close?.();
        callState.activeCall = null;
        callState.pendingCall = null;
        callState.acceptOnArrival = false;
        if (callState.currentCallId) void updateCallStatus(callState.currentCallId, "ended");
        stopRingtone();
        stopRemoteStream();
        stopLocalStream();
        callState.remoteId = null;
        callState.remotePeerId = null;
        callState.currentCallId = null;
        setCallOverlayState({ visible: false, status: reason ? `Call · ${reason}` : "", sub: "", showAccept: false });
    };

    const bindActiveCall = (call, { incoming } = {}) => {
        if (!call) return;
        stopRingtone();
        callState.activeCall = call;
        callState.pendingCall = null;
        callState.remotePeerId = call.peer;
        callState.remoteId = normalizeUserId(call.peer);
        const name = getFriendDisplayName(call.peer);
        setCallAvatarLabel(name);
        setCallOverlayState({ visible: true, status: incoming ? `Verbunden mit ${name}` : `Rufe ${name} an`, sub: incoming ? "Verbunden" : "Verbindet…", showAccept: false });
        const timeoutId = setTimeout(() => {
            console.warn("Call connection timeout");
            endCall("Timeout");
            setCallOverlayState({ visible: true, status: "Verbindung fehlgeschlagen - Firewall-Problem?", sub: "Timeout", showAccept: false });
        }, 10000);
        callState.connectTimeoutId = timeoutId;
        call.on("stream", (remoteStream) => {
            console.log("call.on(stream)", { from: call.peer });
            clearTimeout(timeoutId);
            attachRemoteStream(remoteStream);
        });
        call.on("close", () => endCall("beendet", false));
        call.on("error", (err) => {
            console.error("Call error", err);
            endCall("Fehler", false);
        });
    };

    const handleIncomingPeerCall = (incomingCall) => {
        callState.pendingCall = incomingCall;
        const name = getFriendDisplayName(callState.remoteId || incomingCall.peer);
        setCallAvatarLabel(name);
        setCallOverlayState({ visible: true, status: `${name} ruft an`, sub: "Eingehender Call", showAccept: true });
        console.log("Ringtone volume on incoming call (peer)", ringtoneAudio.volume);
        void startRingtone();
        if (callState.acceptOnArrival) {
            callState.acceptOnArrival = false;
            void acceptIncomingCall();
        }
    };

    const ensurePeer = (userId) => {
        if (!window.Peer) {
            console.warn("PeerJS not loaded");
            return null;
        }
        if (!callState.myPeerId) {
            callState.myPeerId = `${userId}_${Math.floor(Math.random() * 1000)}`;
        }
        if (callState.peer && callState.peer.id === callState.myPeerId) return callState.peer;
        if (callState.peer) {
            callState.peer.destroy();
        }
        const peer = new Peer(callState.myPeerId, {
            config: {
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                ],
            },
        });
        peer.on("call", (call) => {
            console.log("peer.on(call)", { from: call.peer });
            handleIncomingPeerCall(call);
        });
        peer.on("error", (err) => console.error("Peer error", err));
        peer.on("open", (id) => console.log("peer open", id));
        callState.peer = peer;
        return peer;
    };

    const waitForPeerOpen = async (peer, timeoutMs = 8000) => {
        if (!peer) return null;
        if (peer.open) return peer.id;
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Peer timeout")), timeoutMs);
            peer.once("open", (id) => {
                clearTimeout(timer);
                resolve(id);
            });
            peer.once("error", (err) => {
                clearTimeout(timer);
                reject(err);
            });
        });
    };

    const createCallRow = async (receiverId) => {
        if (!supabaseClient || !state.currentUser) return null;
        const payload = {
            caller_id: state.currentUser.id,
            receiver_id: receiverId,
            status: "ringing",
            peer_id: callState.myPeerId,
        };
        const { data, error } = await supabaseClient
            .from("calls")
            .insert(payload)
            .select("id, caller_id, receiver_id, status, peer_id")
            .maybeSingle();
        if (error) {
            console.error("Create call row failed", error);
            return null;
        }
        return data;
    };

    const updateCallStatus = async (callId, status) => {
        if (!callId || !supabaseClient) return;
        const { error } = await supabaseClient.from("calls").update({ status }).eq("id", callId);
        if (error) console.error("Update call status failed", error);
    };

    const subscribeCalls = async () => {
        if (!supabaseClient || !state.currentUser) return;
        if (callState.callsChannel) {
            await supabaseClient.removeChannel(callState.callsChannel);
            callState.callsChannel = null;
        }
        const channel = supabaseClient.channel("calls-feed");
        const handleInsert = (payload) => {
            const row = payload?.new;
            if (!row || row.receiver_id !== state.currentUser?.id) return;
            if (row.status !== "ringing") return;
            callState.currentCallId = row.id;
            callState.remotePeerId = row.peer_id;
            callState.remoteId = row.caller_id;
            const name = getFriendDisplayName(row.caller_id);
            setCallAvatarLabel(name);
            setCallOverlayState({ visible: true, status: `${name} ruft an`, sub: "Eingehender Call", showAccept: true });
            console.log("Ringtone volume on incoming call (signal)", ringtoneAudio.volume);
            void startRingtone();
        };
        const handleUpdate = (payload) => {
            const row = payload?.new;
            if (!row) return;
            const isMine = row.caller_id === state.currentUser?.id || row.receiver_id === state.currentUser?.id;
            if (!isMine) return;
            if (callState.currentCallId && row.id !== callState.currentCallId) return;
            if (row.status === "ended") {
                endCall("beendet", false);
            }
        };
        channel
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "calls" }, handleInsert)
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "calls" }, handleUpdate)
            .subscribe((status) => {
                if (status === "CHANNEL_ERROR") console.error("Call channel error");
            });
        callState.callsChannel = channel;
    };

    const startCall = async (receiverId) => {
        if (!receiverId || !state.currentUser) return;
        const peer = ensurePeer(state.currentUser.id);
        await subscribeCalls();
        try {
            await waitForPeerOpen(peer);
        } catch (err) {
            console.error("Peer not ready", err);
            setCallOverlayState({ visible: true, status: "Verbindung fehlgeschlagen", sub: "Peer nicht bereit", showAccept: false });
            return;
        }
        const friendName = getFriendDisplayName(receiverId);
        setCallAvatarLabel(friendName);
        setCallOverlayState({ visible: true, status: `Calling ${friendName}…`, sub: "Verbindet…", showAccept: false });
        const row = await createCallRow(receiverId);
        if (!row) {
            setCallOverlayState({ visible: true, status: "Signal fehlgeschlagen", sub: "Konnte Call nicht anlegen", showAccept: false });
            return;
        }
        callState.currentCallId = row.id;
        callState.remoteId = receiverId;
        callState.remotePeerId = null;
        callState.acceptOnArrival = true;
    };

    const acceptIncomingCall = async () => {
        stopRingtone();
        // If we have a pending incoming PeerJS call (e.g., we are the caller and callee dialed us back)
        if (callState.pendingCall) {
            const stream = await createLocalStream();
            if (!stream) return;
            callState.acceptOnArrival = false;
            callState.pendingCall.answer(stream);
            bindActiveCall(callState.pendingCall, { incoming: true });
            if (callState.currentCallId) void updateCallStatus(callState.currentCallId, "answered");
            return;
        }

        // If we only have signaling data (remotePeerId) we initiate the call to that specific peer
        if (callState.remotePeerId) {
            const stream = await createLocalStream();
            if (!stream) return;
            const peer = ensurePeer(state.currentUser.id);
            try {
                await waitForPeerOpen(peer);
            } catch (err) {
                console.error("Peer not ready on accept", err);
                setCallOverlayState({ visible: true, status: "Peer nicht bereit", sub: "", showAccept: true });
                return;
            }
            const outbound = callState.peer.call(callState.remotePeerId, stream);
            bindActiveCall(outbound, { incoming: true });
            if (callState.currentCallId) void updateCallStatus(callState.currentCallId, "answered");
            return;
        }

        // No signaling yet: mark auto-accept and prewarm mic
        callState.acceptOnArrival = true;
        setCallOverlayState({ visible: true, status: "Verbinde…", sub: "Warte auf Call", showAccept: false });
        void createLocalStream();
    };

    const teardownCallEngine = async () => {
        endCall("", false);
        if (callState.peer) {
            callState.peer.destroy();
            callState.peer = null;
        }
        if (callState.channel && supabaseClient) {
            await supabaseClient.removeChannel(callState.channel);
        }
        if (callState.callsChannel && supabaseClient) {
            await supabaseClient.removeChannel(callState.callsChannel);
        }
        callState.channel = null;
        callState.callsChannel = null;
        stopAllLevelMonitors();
        stopRemoteStream();
    };

    const setupCallEngine = async (userId) => {
        ensurePeer(userId);
        await subscribeCalls();
        await refreshAudioInputs();
    };

    const updateRegisterButtonState = () => {
        if (!registerSubmitButton || !registerForm) return;
        const emailValue = registerForm.querySelector("input[name='email']")?.value.trim();
        const passwordValue = registerForm.querySelector("input[name='password']")?.value.trim();
        const usernameValue = registerUsernameInput?.value.trim();
        const allFilled = Boolean(emailValue && passwordValue && usernameValue);
        registerSubmitButton.disabled = !allFilled;
    };

    const showAuthForm = (target) => {
        authForms.forEach((form) => {
            const isTarget = form.dataset.authForm === target;
            form.classList.toggle("is-hidden", !isTarget);
        });
        if (authHeading) authHeading.textContent = target === "register" ? "Register" : "Login";
    };

    const handleSession = async (session, { profileDelay } = {}) => {
        state.currentUser = session?.user ?? null;
        const delay = profileDelay ?? profileFetchDelayMs;
        profileFetchDelayMs = 0;

        if (!state.currentUser) {
            await teardownCallEngine();
            await teardownPresence();
            state.friends = [];
            state.pending = [];
            state.profile = null;
            updateProfileUi("Guest");
            renderDmList();
            renderPending();
            toggleAuth(false);
            return;
        }

        toggleAuth(true);
        state.friends = [];
        state.pending = [];
        renderDmList();
        renderPending();

        const metadataName = sanitizeUsername(state.currentUser.user_metadata?.username) || sanitizeUsername(state.currentUser.email?.split("@")[0]);
        updateProfileUi(metadataName || "User");

        await ensureProfileUsername(delay);
        await loadSelfProfile();
        await subscribePresence();
        await setupCallEngine(state.currentUser.id);
        await Promise.all([loadFriends(), loadPending()]);
        await subscribeFriendships();
        await subscribeMessages();
        updateBadge();
        renderDmList();
        renderPending();
        if (state.activeDm) {
            await loadMessagesForFriend(state.activeDm);
        }
    };

    const initSupabase = async () => {
        supabaseClient = createSupabaseClient();
        if (!supabaseClient) return;
        supabaseClient.auth.onAuthStateChange((_event, session) => {
            void handleSession(session);
        });
        const { data: sessionData, error } = await supabaseClient.auth.getSession();
        if (error) {
            console.error("Supabase auth session error", error);
            return;
        }
        await handleSession(sessionData.session);
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
        if (message.self) {
            wrapper.classList.add("self");
        }

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        const fallbackInitials = initials(message.user);
        setAvatarVisual(avatar, message.avatarUrl, fallbackInitials);
            if (message.userId) {
                avatar.dataset.profileId = message.userId;
            }

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
        if (message.userId) {
            author.dataset.profileId = message.userId;
        }

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
            empty.textContent = "No friends yet · send a request";
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
                clearUnread(friend.id);
                if (activeDmLabel) activeDmLabel.textContent = `Direct · ${friend.displayName || friend.username}`;
            }
            if (slideInId && slideInId === friend.id) {
                btn.classList.add("slide-in");
                setTimeout(() => btn.classList.remove("slide-in"), 600);
            }

            const avatar = document.createElement("span");
            avatar.className = "dm-avatar profile-trigger";
            avatar.dataset.profileId = friend.id;
            setAvatarVisual(avatar, friend.avatarUrl, initials(friend.displayName || friend.username));

            const meta = document.createElement("span");
            meta.className = "dm-meta";
            const name = document.createElement("span");
            name.className = "dm-name";
            name.textContent = friend.displayName || friend.username;
            name.dataset.profileId = friend.id;
            const sub = document.createElement("span");
            sub.className = "dm-sub";
            const friendId = normalizeUserId(friend.id).toLowerCase();
            const isOnline = state.onlineUsers.has(friendId);
            sub.textContent = isOnline ? "online" : "offline";
            meta.append(name, sub);

            const status = document.createElement("span");
            status.className = `dm-status${isOnline ? " glow" : ""}`;
            status.style.opacity = isOnline ? "0.8" : "0.32";

            const indicators = document.createElement("span");
            indicators.className = "dm-indicators";
            const unreadCount = state.unreadById[friend.id] || 0;
            if (unreadCount > 0) {
                const badge = document.createElement("span");
                badge.className = "dm-unread";
                badge.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
                indicators.appendChild(badge);
            }
            indicators.appendChild(status);

            btn.append(avatar, meta, indicators);
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
            li.textContent = "No pending requests";
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
            name.textContent = req.displayName || req.username || req.user_id || "Unknown";
            const sub = document.createElement("p");
            sub.className = "pending-sub";
            sub.textContent = "Friend request";
            meta.append(name, sub);

            const accept = document.createElement("button");
            accept.className = "btn-accept";
            accept.textContent = "Accept";
            accept.addEventListener("click", () => handleRequest(req, "accepted"));

            const decline = document.createElement("button");
            decline.className = "btn-decline";
            decline.textContent = "Decline";
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
                .select("id, username, display_name, avatar_url")
                .in("id", otherIds);
            profiles = profileData || [];
        }
        state.friends = (data || []).map((row) => {
            const otherId = row.sender_id === userId ? row.receiver_id : row.sender_id;
            const profile = profiles.find((p) => p.id === otherId);
            return {
                id: otherId,
                username: profile?.username || otherId,
                displayName: profile?.display_name || profile?.username || otherId,
                avatarUrl: profile?.avatar_url || "",
                status: row.status,
            };
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
                .select("id, username, display_name, avatar_url")
                .in("id", senderIds);
            profiles = profileData || [];
        }
        state.pending = (data || []).map((row) => {
            const profile = profiles.find((p) => p.id === row.sender_id);
            return {
                ...row,
                username: profile?.username || row.sender_id,
                displayName: profile?.display_name || profile?.username || row.sender_id,
                avatarUrl: profile?.avatar_url || "",
            };
        });
    };

    const addFriendLocal = (id, username, displayName = "", avatarUrl = "") => {
        const exists = state.friends.some((f) => f.id === id);
        if (!exists) {
            state.friends.push({ id, username: username || id, displayName: displayName || username || id, avatarUrl, status: "accepted" });
        }
        if (!state.dmMessages[id]) state.dmMessages[id] = [];
        renderDmList(id);
    };

    const fetchProfileName = async (userId) => {
        if (!supabaseClient) return userId;
        const { data } = await supabaseClient.from("profiles").select("username").eq("id", userId).maybeSingle();
        return data?.username || userId;
    };

    const mapMessageRow = (row, friend) => {
        const myId = state.currentUser?.id;
        const isSelf = row.sender_id === myId;
        const profileDisplay = state.profile?.display_name || state.profile?.username || "You";
        const authorName = isSelf ? profileDisplay : friend?.displayName || friend?.username || row.sender_id;
        const handle = isSelf ? state.profile?.username || "you" : friend?.username || "friend";
        const time = row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
        const avatarUrl = isSelf ? state.profile?.avatar_url : friend?.avatarUrl;
        return {
            id: row.id,
            user: authorName,
            handle,
            content: row.content,
            time,
            self: isSelf,
            userId: row.sender_id,
            avatarUrl,
        };
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
        if (state.activeDm === friendId) {
            renderDmThread();
        }
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
            addFriendLocal(request.sender_id, request.username, request.displayName, request.avatarUrl);
        } else {
            renderPending();
        }
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
        if (profiles.id === me) {
            return { error: "You cannot add yourself." };
        }
        const { error } = await supabaseClient
            .from("friendships")
            .insert({ sender_id: me, receiver_id: profiles.id, status: "pending" });
        if (error) {
            console.error("Send request failed", error);
            return { error: error.message };
        }
        return { success: true };
    };

    const subscribeFriendships = async () => {
        if (!supabaseClient || !state.currentUser) return;
        const userId = state.currentUser.id;
        if (friendshipChannel) {
            await supabaseClient.removeChannel(friendshipChannel);
            friendshipChannel = null;
        }
        const channel = supabaseClient.channel("friendships-feed");

        const onChange = (payload) => {
            const row = payload.new;
            if (!row || (row.sender_id !== userId && row.receiver_id !== userId)) return;
            if (row.status === "pending" && row.receiver_id === userId) {
                void fetchProfile(row.sender_id).then((profile) => {
                    const username = profile?.username || row.sender_id;
                    state.pending = [
                        ...state.pending,
                        {
                            ...row,
                            username,
                            displayName: profile?.display_name || username,
                            avatarUrl: profile?.avatar_url || "",
                        },
                    ];
                    renderPending();
                    updateBadge();
                });
            }
            if (row.status === "accepted") {
                const otherId = row.sender_id === userId ? row.receiver_id : row.sender_id;
                void fetchProfile(otherId).then((profile) => {
                    const username = profile?.username || otherId;
                    addFriendLocal(otherId, username, profile?.display_name, profile?.avatar_url || "");
                });
                state.pending = state.pending.filter((p) => p.id !== row.id);
                renderPending();
            }
        };

        channel
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "friendships", filter: `receiver_id=eq.${userId}` }, onChange)
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "friendships", filter: `sender_id=eq.${userId},receiver_id=eq.${userId}` }, onChange)
            .subscribe();
        friendshipChannel = channel;
    };

    const subscribeMessages = async () => {
        if (!supabaseClient || !state.currentUser) return;
        const userId = state.currentUser.id;
        if (messageChannel) {
            await supabaseClient.removeChannel(messageChannel);
            messageChannel = null;
        }
        const channel = supabaseClient.channel("messages-feed");
        const handler = (payload) => {
            const row = payload.new;
            if (!row) return;
            const isMine = row.sender_id === userId;
            const involvesMe = isMine || row.receiver_id === userId;
            if (!involvesMe) return;
            if (isMine) return; // skip self inserts; already added after send
            const friendId = row.sender_id === userId ? row.receiver_id : row.sender_id;
            const friend = state.friends.find((f) => f.id === friendId);
            const mapped = mapMessageRow(row, friend);
            addDmMessage(mapped, friendId);
        };

        channel
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${userId}` }, handler)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `sender_id=eq.${userId}` }, handler)
            .subscribe();
        messageChannel = channel;
    };

    const teardownPresence = async () => {
        state.onlineUsers = new Set();
        if (presenceChannel && supabaseClient) {
            await supabaseClient.removeChannel(presenceChannel);
        }
        presenceChannel = null;
    };

    const subscribePresence = async () => {
        if (!supabaseClient || !state.currentUser) return;
        await teardownPresence();
        const userId = state.currentUser.id;
        const channel = supabaseClient.channel("online-status", {
            config: {
                presence: { key: userId },
            },
        });

        const sync = () => syncOnlineUsers(channel);
        channel
            .on("presence", { event: "sync" }, sync)
            .on("presence", { event: "join" }, sync)
            .on("presence", { event: "leave" }, sync)
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    const { error } = await channel.track({
                        user_id: userId,
                        username: state.profile?.username || "",
                        online_at: new Date().toISOString(),
                    });
                    if (error) console.error("Presence track failed", error);
                    syncOnlineUsers(channel);
                }
                if (status === "CHANNEL_ERROR") {
                    console.error("Presence channel error");
                }
            });

        presenceChannel = channel;
    };

    const addDmMessage = (message, friendId = state.activeDm) => {
        if (!message || !message.content?.trim() || !friendId) return;
        if (!state.dmMessages[friendId]) state.dmMessages[friendId] = [];
        const exists = state.dmMessages[friendId].some((m) => m.id === message.id && message.id !== undefined);
        if (exists) return;
        state.dmMessages[friendId].push(message);
        const isActive = friendId === state.activeDm;
        if (!isActive && !message.self) {
            bumpUnread(friendId);
            renderDmList();
        }
        if (shouldPlayNotification(message, friendId)) void playNotificationSound();
        if (!isActive) return;
        const node = buildMessage(message, { isDm: true });
        dmThread?.appendChild(node);
        if (dmThread) dmThread.scrollTop = dmThread.scrollHeight;
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
                userId: state.currentUser?.id,
                avatarUrl: state.profile?.avatar_url,
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

    const setMode = (mode) => {
        state.mode = mode;
        views.forEach((view) => {
            const isActive = view.dataset.view === mode;
            view.classList.toggle("is-hidden", !isActive);
        });
        channelBar?.setAttribute("data-mode", mode);
    };

    const bindDmList = () => {
        dmList?.querySelectorAll("[data-dm-id]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                state.activeDm = btn.dataset.dmId || "dm";
                clearUnread(state.activeDm);
                renderDmList();
                if (activeDmLabel) {
                    activeDmLabel.textContent = `Direct · ${btn.querySelector(".dm-name")?.textContent || state.activeDm}`;
                }
                if (supabaseClient && state.currentUser) {
                    await loadMessagesForFriend(state.activeDm);
                }
                renderDmThread();
            });
        });
    };

    const setFriendFeedback = ({ error, success }) => {
        if (friendError) friendError.textContent = error || "";
        if (friendSuccess) friendSuccess.textContent = success || "";
    };

    const bindFriendNavigation = () => {
        addFriendNav?.addEventListener("click", () => {
            setFriendFeedback({ error: "", success: "" });
            setMode("friend-add");
        });
        backToDmBtn?.addEventListener("click", () => {
            setFriendFeedback({ error: "", success: "" });
            setMode("dm");
        });
    };

    const bindCallUi = () => {
        callButton?.addEventListener("click", () => {
            if (!state.activeDm) return;
            void startCall(state.activeDm);
        });
        callAcceptBtn?.addEventListener("click", () => {
            void acceptIncomingCall();
        });
        callEndBtn?.addEventListener("click", () => endCall("Aufgelegt"));
    };

    const bindAudioSelect = () => {
        audioInputSelect?.addEventListener("change", async (event) => {
            callState.micDeviceId = event.target.value || "";
            if (callState.activeCall) {
                const newStream = await createLocalStream();
                const newTrack = newStream?.getAudioTracks?.()[0];
                const sender = callState.activeCall.peerConnection?.getSenders?.().find((s) => s.track?.kind === "audio");
                if (sender && newTrack) sender.replaceTrack(newTrack);
            }
        });
    };

    const bindRingtoneVolume = () => {
        if (!ringtoneVolumeInput) return;
        const setLabel = (value) => {
            if (ringtoneVolumeLabel) ringtoneVolumeLabel.textContent = `Klingelton: ${Math.round(value * 100)}%`;
        };
        ringtoneVolumeInput.value = callState.ringtoneVolume;
        setLabel(callState.ringtoneVolume);
        ringtoneAudio.volume = callState.ringtoneVolume;
        ringtoneVolumeInput.addEventListener("input", (event) => {
            const value = Number(event.target.value);
            const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0.5;
            callState.ringtoneVolume = clamped;
            ringtoneAudio.volume = clamped;
            setLabel(clamped);
            try {
                localStorage.setItem("ringtoneVolume", String(clamped));
            } catch (err) {
                console.warn("ringtone volume persist failed", err);
            }
        });
    };

    const bindNotificationVolume = () => {
        if (!notificationVolumeInput) return;
        const setLabel = (value) => {
            if (notificationVolumeLabel) notificationVolumeLabel.textContent = `Benachrichtigungen: ${Math.round(value * 100)}%`;
        };
        notificationVolumeInput.value = callState.notificationVolume;
        setLabel(callState.notificationVolume);
        notificationSound.volume = callState.notificationVolume;
        notificationVolumeInput.addEventListener("input", (event) => {
            const value = Number(event.target.value);
            const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0.6;
            callState.notificationVolume = clamped;
            notificationSound.volume = clamped;
            setLabel(clamped);
            try {
                localStorage.setItem("notificationVolume", String(clamped));
            } catch (err) {
                console.warn("notification volume persist failed", err);
            }
        });
    };

    const bindCallVolume = () => {
        if (!callVolumeInput) return;
        const setLabel = (value) => {
            if (callVolumeLabel) callVolumeLabel.textContent = `Call: ${Math.round(value * 100)}%`;
        };
        callVolumeInput.value = callState.callVolume;
        setLabel(callState.callVolume);
        if (remoteAudioEl) remoteAudioEl.volume = callState.callVolume;
        callVolumeInput.addEventListener("input", (event) => {
            const value = Number(event.target.value);
            const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0.8;
            callState.callVolume = clamped;
            if (remoteAudioEl) remoteAudioEl.volume = clamped;
            setLabel(clamped);
            try {
                localStorage.setItem("callVolume", String(clamped));
            } catch (err) {
                console.warn("call volume persist failed", err);
            }
        });
    };

    const bindSettings = () => {
        settingsToggle?.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            await refreshAudioInputs();
            setSettingsVisible(true);
        });
        settingsClose?.addEventListener("click", () => setSettingsVisible(false));
        settingsOverlay?.addEventListener("click", (event) => {
            if (event.target === settingsOverlay) setSettingsVisible(false);
        });

        settingsTabs.forEach((tab) => {
            tab.addEventListener("click", () => setSettingsTab(tab.dataset.settingsTab));
        });

        const updateUiPrefs = (next) => {
            const prefs = { ...parseUiPrefs(), ...next };
            saveUiPrefs(prefs);
            applyUiPrefs(prefs);
        };

        const updateAudioPrefs = (next) => {
            const prefs = { ...parseAudioPrefs(), ...next };
            saveAudioPrefs(prefs);
            applyAudioPrefs(prefs);
        };

        accentChips.forEach((chip) => {
            chip.addEventListener("click", () => {
                const [accent] = chip.dataset.accentChip?.split(",") || [];
                if (!accent) return;
                applyAccent(accent.trim());
            });
        });

        accentPicker?.addEventListener("input", (event) => {
            const value = event.target.value;
            applyAccent(value);
        });

        themeCards.forEach((card) => {
            card.addEventListener("click", () => {
                const theme = card.dataset.themeChoice;
                applyThemePreset(theme);
            });
        });

        neonToggle?.addEventListener("change", (event) => {
            applyNeonState(event.target.checked);
        });

        reducedMotionToggle?.addEventListener("change", (event) => {
            updateUiPrefs({ reducedMotion: event.target.checked });
        });

        noiseToggle?.addEventListener("change", (event) => {
            updateUiPrefs({ showNoise: event.target.checked });
        });

        contrastToggle?.addEventListener("change", (event) => {
            updateUiPrefs({ highContrast: event.target.checked });
        });

        presenceToggle?.addEventListener("change", (event) => {
            updateUiPrefs({ showPresence: event.target.checked });
        });

        audioEchoToggle?.addEventListener("change", (event) => {
            updateAudioPrefs({ echoCancellation: event.target.checked });
        });

        audioNoiseToggle?.addEventListener("change", (event) => {
            updateAudioPrefs({ noiseSuppression: event.target.checked });
        });

        audioGainToggle?.addEventListener("change", (event) => {
            updateAudioPrefs({ autoGainControl: event.target.checked });
        });

        logoutBtn?.addEventListener("click", async () => {
            if (!supabaseClient) return;
            await supabaseClient.auth.signOut();
            setSettingsVisible(false);
            await handleSession(null);
        });

        passwordSave?.addEventListener("click", async () => {
            if (!passwordInput) return;
            const newPassword = passwordInput.value.trim();
            if (newPassword.length < 6) {
                if (passwordMsg) passwordMsg.textContent = "Passwort zu kurz (min. 6).";
                return;
            }
            if (!supabaseClient || !state.currentUser) {
                if (passwordMsg) passwordMsg.textContent = "Bitte zuerst anmelden.";
                return;
            }
            const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
            if (error) {
                if (passwordMsg) passwordMsg.textContent = error.message;
                return;
            }
            if (passwordMsg) passwordMsg.textContent = "Passwort aktualisiert.";
            passwordInput.value = "";
        });

        setSettingsTab("profile");
        loadNeonState();
        loadDesignPrefs();
        loadUiPrefs();
        loadAudioPrefs();
    };

    const bindProfileEditor = () => {
        profileSaveBtn?.addEventListener("click", () => {
            void saveProfile();
        });
        [profileDisplayInput, profileBioInput, profileAvatarInput].forEach((input) => {
            input?.addEventListener("input", () => {
                const preview = {
                    ...state.profile,
                    display_name: sanitizeText(profileDisplayInput?.value, 40) || state.profile?.display_name,
                    bio: sanitizeText(profileBioInput?.value, 180) || state.profile?.bio,
                    avatar_url: sanitizeUrl(profileAvatarInput?.value) || state.profile?.avatar_url,
                };
                updateProfileUi(preview);
                if (profileSaveMsg) profileSaveMsg.textContent = "";
            });
        });
    };

    const bindProfileOverlay = () => {
        profileOverlayClose?.addEventListener("click", closeProfileOverlay);
        profileOverlay?.addEventListener("click", (event) => {
            if (event.target === profileOverlay) closeProfileOverlay();
        });
    };

    const bindFriendForm = () => {
        friendForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const value = friendInput?.value.trim();
            if (!value) {
                setFriendFeedback({ error: "Enter a username.", success: "" });
                return;
            }
            setFriendFeedback({ error: "", success: "" });
            if (supabaseClient && state.currentUser) {
                const result = await sendFriendRequest(value);
                if (result?.error) {
                    setFriendFeedback({ error: result.error, success: "" });
                } else {
                    setFriendFeedback({ error: "", success: "Request sent." });
                    if (friendInput) friendInput.value = "";
                }
            } else {
                addFriendLocal(value.toLowerCase(), value);
                setFriendFeedback({ error: "", success: "Added locally." });
                if (friendInput) friendInput.value = "";
                setMode("dm");
            }
        });
    };

    const bindAuthForms = () => {
        if (authSwitches.length > 0) {
            authSwitches.forEach((toggle) => {
                toggle.addEventListener("click", () => {
                    clearAuthErrors();
                    const target = toggle.dataset.target === "register" ? "register" : "login";
                    showAuthForm(target);
                    updateRegisterButtonState();
                });
            });
        }

        loginForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearAuthErrors();
            const emailValue = loginForm.querySelector("input[name='email']")?.value.trim();
            const passwordValue = loginForm.querySelector("input[name='password']")?.value.trim();
            const validationError = validateAuthFields(emailValue, passwordValue);
            if (validationError) {
                setAuthError(loginForm, validationError);
                return;
            }
            if (!supabaseClient) {
                setAuthError(loginForm, "Supabase not configured.");
                return;
            }
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email: emailValue, password: passwordValue });
            if (error) {
                setAuthError(loginForm, error.message);
                return;
            }
        });

        registerForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearAuthErrors();
            const emailValue = registerForm.querySelector("input[name='email']")?.value.trim();
            const passwordValue = registerForm.querySelector("input[name='password']")?.value.trim();
            const usernameRaw = registerUsernameInput?.value.trim();
            const usernameValue = sanitizeUsername(usernameRaw);
            if (!usernameValue) {
                setAuthError(registerForm, "Please choose a username.");
                return;
            }
            const validationError = validateAuthFields(emailValue, passwordValue);
            if (validationError) {
                setAuthError(registerForm, validationError);
                return;
            }
            if (!supabaseClient) {
                setAuthError(registerForm, "Supabase not configured.");
                return;
            }
            profileFetchDelayMs = 500;
            const { data, error } = await supabaseClient.auth.signUp({
                email: emailValue,
                password: passwordValue,
                options: { data: { username: usernameValue } },
            });
            if (error) {
                profileFetchDelayMs = 0;
                const lower = error.message?.toLowerCase?.() || "";
                if (lower.includes("duplicate") || lower.includes("unique")) {
                    setAuthError(registerForm, "Username bereits vergeben!");
                } else {
                    setAuthError(registerForm, error.message);
                }
                return;
            }
            if (!data?.session) {
                setAuthError(registerForm, "Check your inbox to confirm.");
            }
        });

        registerForm?.querySelectorAll("input").forEach((input) => {
            input.addEventListener("input", updateRegisterButtonState);
        });
        updateRegisterButtonState();
    };

    const bindDmComposer = () => {
        dmComposer?.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!dmInput) return;
            const content = dmInput.value.trim();
            if (!content) return;
            void sendDmMessage(content);
            dmInput.value = "";
        });
    };

    const bindProfileDelegation = () => {
        if (!appContainer) return;
        appContainer.addEventListener("click", (event) => {
            if (event.target.closest("[data-settings-toggle]")) return;
            const target = event.target.closest("[data-profile-id]");
            if (!target) return;
            const userId = target.dataset.profileId;
            if (!userId) return;
            event.preventDefault();
            event.stopPropagation();
            void fetchAndShowProfile(userId);
        });
    };

    setMode(state.mode);
    renderDmThread();
    renderDmList();
    renderPending();
    bindDmList();
    bindFriendNavigation();
    bindFriendForm();
    bindDmComposer();
    bindAuthForms();
    bindSettings();
    bindProfileEditor();
    bindProfileOverlay();
    bindProfileDelegation();
    loadDesignPrefs();
    bindCallUi();
    bindAudioSelect();
    bindRingtoneVolume();
    bindNotificationVolume();
    bindCallVolume();
    wireRingtoneUnlock();
    void runIntroScreen();
    window.startCall = startCall;
    window.addEventListener("beforeunload", () => {
        if (callState.currentCallId) void updateCallStatus(callState.currentCallId, "ended");
    });
    void initSupabase();
});
