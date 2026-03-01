document.addEventListener("DOMContentLoaded", () => {
    const channels = Array.from(document.querySelectorAll("[data-channel]"));
    const activeChannelLabel = document.querySelector("[data-active-channel]");
    const composerInput = document.querySelector(".composer input[type='text']");
    const messageList = document.querySelector(".message-list");
    const modal = document.querySelector("[data-modal]");
    const modalCard = modal?.querySelector(".modal-card");
    const openModalButtons = document.querySelectorAll("[data-open-settings]");
    const closeModalButtons = document.querySelectorAll("[data-close-settings]");

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
        if (!composerInput || !messageList) return;
        const value = composerInput.value.trim();
        if (!value) return;

        const article = document.createElement("article");
        article.className = "message";
        article.innerHTML = `
            <div class="avatar">You</div>
            <div class="message-body">
                <div class="meta">
                    <span class="author">Du</span>
                    <time datetime="${new Date().toISOString()}">Jetzt</time>
                </div>
                <p>${value}</p>
            </div>
        `;

        messageList.appendChild(article);
        messageList.scrollTo({ top: messageList.scrollHeight, behavior: "smooth" });
        composerInput.value = "";
    });
});
