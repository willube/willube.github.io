const SUPABASE_URL = "https://gknoagucgiiieovujwxy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrbm9hZ3VjZ2lpaWVvdnVqd3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzOTMxMjIsImV4cCI6MjA4Nzk2OTEyMn0.qJYS6cVIi6BJP02O_EPmVQb27IHMRJrxpvXrRfxejj8";

document.addEventListener("DOMContentLoaded", () => {
    const channels = Array.from(document.querySelectorAll("[data-channel]"));
    const activeChannelLabel = document.querySelector("[data-active-channel]");
    const composerInput = document.querySelector(".composer input[type='text']");
    const messageList = document.querySelector(".message-list");
    const appShell = document.getElementById("app-shell");
    const modal = document.querySelector("[data-modal]");
    const modalCard = modal?.querySelector(".modal-card");
    const openModalButtons = document.querySelectorAll("[data-open-settings]");
    const closeModalButtons = document.querySelectorAll("[data-close-settings]");
    const authModal = document.querySelector("[data-auth-modal]");
    const authTabs = Array.from(document.querySelectorAll("[data-auth-tab]"));
    const authPanels = Array.from(document.querySelectorAll("[data-auth-panel]"));
    const loginForm = document.querySelector("[data-auth-panel='login']");
    const registerForm = document.querySelector("[data-auth-panel='register']");

    const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    let currentUserName = "web-user";

    const showAuthModal = () => {
        authModal?.classList.add("is-visible");
        authModal?.setAttribute("aria-hidden", "false");
        appShell?.classList.add("blurred");
    };

    const hideAuthModal = () => {
        authModal?.classList.remove("is-visible");
        authModal?.setAttribute("aria-hidden", "true");
        appShell?.classList.remove("blurred");
    };

    const setUserFromSession = (session) => {
        const user = session?.user;
        if (!user) {
            showAuthModal();
            return;
        }
        const metaName = user.user_metadata?.username;
        const emailName = user.email ? user.email.split("@")[0] : null;
        currentUserName = metaName || emailName || "sync-user";
        hideAuthModal();
    };

    const handleAuthTabs = () => {
        authTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.dataset.authTab;
                authTabs.forEach((t) => {
                    const isActive = t === tab;
                    t.classList.toggle("active", isActive);
                    t.setAttribute("aria-selected", isActive ? "true" : "false");
                });
                authPanels.forEach((panel) => {
                    panel.classList.toggle("hidden", panel.dataset.authPanel !== target);
                });
            });
        });
    };

    const getErrorField = (form) => form?.querySelector("[data-auth-error]");

    const renderMessage = ({ content, username, created_at }) => {
        if (!messageList) return;
        const article = document.createElement("article");
        article.className = "message";

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = (username || "?").slice(0, 2).toUpperCase();

        const body = document.createElement("div");
        body.className = "message-body";

        const meta = document.createElement("div");
        meta.className = "meta";

        const author = document.createElement("span");
        author.className = "author";
        author.textContent = username || "Unknown";

        const time = document.createElement("time");
        const date = created_at ? new Date(created_at) : new Date();
        time.dateTime = date.toISOString();
        time.textContent = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        meta.append(author, time);

        const paragraph = document.createElement("p");
        paragraph.textContent = content || "";

        body.append(meta, paragraph);
        article.append(avatar, body);
        messageList.appendChild(article);
        messageList.scrollTo({ top: messageList.scrollHeight, behavior: "smooth" });
    };

    const loadMessages = async () => {
        if (!supabaseClient) return;
        const { data, error } = await supabaseClient
            .from("messages")
            .select("content, username, created_at")
            .order("created_at", { ascending: true });
        if (error) {
            console.error("Supabase load error", error);
            return;
        }
        data?.forEach(renderMessage);
    };

    const subscribeToMessages = () => {
        if (!supabaseClient) return;
        supabaseClient
            .channel("public:messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    renderMessage(payload.new);
                },
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    console.info("Realtime subscribed to messages");
                }
            });
    };

    const sendMessage = async () => {
        if (!composerInput || !supabaseClient) return;
        const content = composerInput.value.trim();
        if (!content) return;
        const username = currentUserName || "sync-user";
        const { error } = await supabaseClient.from("messages").insert({ content, username });
        if (error) {
            console.error("Supabase insert error", error);
            return;
        }
        composerInput.value = "";
    };

    const handleLogin = () => {
        loginForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!supabaseClient || !(event.target instanceof HTMLFormElement)) return;
            const formData = new FormData(event.target);
            const email = (formData.get("email") || "").toString();
            const password = (formData.get("password") || "").toString();
            const errorField = getErrorField(event.target);
            errorField && (errorField.textContent = "");

            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) {
                errorField && (errorField.textContent = error.message);
                return;
            }
            setUserFromSession(data.session);
        });
    };

    const handleRegister = () => {
        registerForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!supabaseClient || !(event.target instanceof HTMLFormElement)) return;
            const formData = new FormData(event.target);
            const username = (formData.get("username") || "").toString();
            const email = (formData.get("email") || "").toString();
            const password = (formData.get("password") || "").toString();
            const errorField = getErrorField(event.target);
            errorField && (errorField.textContent = "");

            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { username } },
            });

            if (error) {
                errorField && (errorField.textContent = error.message);
                return;
            }

            setUserFromSession(data.session);
            if (!data.session) {
                errorField && (errorField.textContent = "Bestätige bitte Deine E-Mail, um dich einzuloggen.");
            }
        });
    };

    const setActiveChannel = (button) => {
        channels.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const name = button.dataset.channelName || button.textContent?.trim() || "channel";
        if (activeChannelLabel) {
            activeChannelLabel.textContent = `# ${name}`;
        }
        if (composerInput) {
            composerInput.placeholder = `Nachricht an #${name}`;
        }
    };

    channels.forEach((button) => {
        button.addEventListener("click", () => setActiveChannel(button));
    });

    if (channels.length > 0) {
        setActiveChannel(channels[0]);
    }

    const toggleModal = (shouldOpen) => {
        if (!modal) return;
        modal.classList.toggle("is-visible", shouldOpen);
        modal.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
        if (shouldOpen) {
            modalCard?.focus?.();
        }
    };

    openModalButtons.forEach((button) => {
        button.addEventListener("click", () => toggleModal(true));
    });

    closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => toggleModal(false));
    });

    modal?.addEventListener("click", (event) => {
        if (event.target === modal || event.target?.hasAttribute("data-close-settings")) {
            toggleModal(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal?.classList.contains("is-visible")) {
            toggleModal(false);
        }
    });

    const composerForm = document.querySelector(".composer");

    composerForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        void sendMessage();
    });

    if (supabaseClient) {
        handleAuthTabs();
        handleLogin();
        handleRegister();
        supabaseClient.auth.getSession().then(({ data }) => {
            setUserFromSession(data.session);
        });
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
                setUserFromSession(session);
            }
            if (event === "SIGNED_OUT") {
                currentUserName = "sync-user";
                showAuthModal();
            }
        });
        void loadMessages();
        subscribeToMessages();
    } else {
        console.warn("Supabase client not available; check CDN load order.");
    }
});
