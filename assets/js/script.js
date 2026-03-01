const SUPABASE_URL = "https://gknoagucgiiieovujwxy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrbm9hZ3VjZ2lpaWVvdnVqd3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzOTMxMjIsImV4cCI6MjA4Nzk2OTEyMn0.qJYS6cVIi6BJP02O_EPmVQb27IHMRJrxpvXrRfxejj8";

document.addEventListener("DOMContentLoaded", () => {
    const channels = Array.from(document.querySelectorAll("[data-channel]"));
    const activeChannelLabel = document.querySelector("[data-active-channel]");
    const composerInput = document.querySelector(".composer input[type='text']");
    const messageList = document.querySelector(".message-list");
    const modal = document.querySelector("[data-modal]");
    const modalCard = modal?.querySelector(".modal-card");
    const openModalButtons = document.querySelectorAll("[data-open-settings]");
    const closeModalButtons = document.querySelectorAll("[data-close-settings]");

    const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const usernameFallback = "web-user";

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
        const username = usernameFallback;
        const { error } = await supabaseClient.from("messages").insert({ content, username });
        if (error) {
            console.error("Supabase insert error", error);
            return;
        }
        composerInput.value = "";
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
        void loadMessages();
        subscribeToMessages();
    } else {
        console.warn("Supabase client not available; check CDN load order.");
    }
});
