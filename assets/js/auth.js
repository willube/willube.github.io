import { ensureProfileUsernameFactory, buildUsername, sanitizeUsername } from "./profile-utils.js";

/**
 * Auth and session handling.
 * @param {object} deps
 * @param {object} deps.state - Shared mutable state.
 * @param {object} deps.dom - DOM references.
 * @param {object} deps.ui - UI helpers.
 * @param {object} deps.supabaseClient - Supabase client instance.
 * @param {function} deps.onAuthed - Callback after session is ready.
 */
export const initAuth = ({ state, dom, ui, supabaseClient, onAuthed }) => {
    const toggleAuth = (isAuthenticated) => {
        if (!dom.appContainer || !dom.authLayer) return;
        if (isAuthenticated) {
            dom.authLayer.classList.add("is-hidden");
            dom.appContainer.classList.remove("is-locked");
            dom.appContainer.classList.add("is-live");
        } else {
            dom.authLayer.classList.remove("is-hidden");
            dom.appContainer.classList.add("is-locked");
            dom.appContainer.classList.remove("is-live");
        }
    };

    const setAuthError = (form, message) => {
        const el = form?.querySelector("[data-auth-error]");
        if (el) el.textContent = message || "";
    };

    const clearAuthErrors = () => {
        dom.authForms.forEach((form) => setAuthError(form, ""));
    };

    const validateAuthFields = (emailValue, passwordValue) => {
        if (!emailValue || !passwordValue) return "Please fill email and password.";
        if (passwordValue.length < 6) return "Password must be at least 6 characters.";
        return null;
    };

    const ensureProfileUsername = ensureProfileUsernameFactory({ state, supabaseClient, ui });

    const handleSession = async (session, { profileDelay } = {}) => {
        state.currentUser = session?.user ?? null;
        if (!state.currentUser) {
            state.friends = [];
            state.pending = [];
            state.profile = null;
            ui.updateProfileUi("Guest");
            toggleAuth(false);
            return;
        }
        toggleAuth(true);
        const metadataName = sanitizeUsername(state.currentUser.user_metadata?.username) || sanitizeUsername(state.currentUser.email?.split("@")[0]);
        ui.updateProfileUi(metadataName || "User");
        await ensureProfileUsername(profileDelay ?? 0);
        await onAuthed?.();
    };

    const bindAuthForms = () => {
        if (dom.authSwitches.length > 0) {
            dom.authSwitches.forEach((toggle) => {
                toggle.addEventListener("click", () => {
                    clearAuthErrors();
                    const target = toggle.dataset.target === "register" ? "register" : "login";
                    dom.authForms.forEach((form) => {
                        const isTarget = form.dataset.authForm === target;
                        form.classList.toggle("is-hidden", !isTarget);
                    });
                    if (dom.authHeading) dom.authHeading.textContent = target === "register" ? "Register" : "Login";
                    updateRegisterButtonState();
                });
            });
        }

        dom.loginForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearAuthErrors();
            const emailValue = dom.loginForm.querySelector("input[name='email']")?.value.trim();
            const passwordValue = dom.loginForm.querySelector("input[name='password']")?.value.trim();
            const validationError = validateAuthFields(emailValue, passwordValue);
            if (validationError) {
                setAuthError(dom.loginForm, validationError);
                return;
            }
            if (!supabaseClient) {
                setAuthError(dom.loginForm, "Supabase not configured.");
                return;
            }
            const { error } = await supabaseClient.auth.signInWithPassword({ email: emailValue, password: passwordValue });
            if (error) setAuthError(dom.loginForm, error.message);
        });

        dom.registerForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearAuthErrors();
            const emailValue = dom.registerForm.querySelector("input[name='email']")?.value.trim();
            const passwordValue = dom.registerForm.querySelector("input[name='password']")?.value.trim();
            const usernameRaw = dom.registerUsernameInput?.value.trim();
            const usernameValue = sanitizeUsername(usernameRaw);
            if (!usernameValue) {
                setAuthError(dom.registerForm, "Please choose a username.");
                return;
            }
            const validationError = validateAuthFields(emailValue, passwordValue);
            if (validationError) {
                setAuthError(dom.registerForm, validationError);
                return;
            }
            if (!supabaseClient) {
                setAuthError(dom.registerForm, "Supabase not configured.");
                return;
            }
            const { error, data } = await supabaseClient.auth.signUp({
                email: emailValue,
                password: passwordValue,
                options: { data: { username: usernameValue } },
            });
            if (error) {
                const lower = error.message?.toLowerCase?.() || "";
                if (lower.includes("duplicate") || lower.includes("unique")) {
                    setAuthError(dom.registerForm, "Username bereits vergeben!");
                } else {
                    setAuthError(dom.registerForm, error.message);
                }
                return;
            }
            if (!data?.session) setAuthError(dom.registerForm, "Check your inbox to confirm.");
        });

        dom.registerForm?.querySelectorAll("input").forEach((input) => input.addEventListener("input", updateRegisterButtonState));
        updateRegisterButtonState();
    };

    const updateRegisterButtonState = () => {
        if (!dom.registerSubmitButton || !dom.registerForm) return;
        const emailValue = dom.registerForm.querySelector("input[name='email']")?.value.trim();
        const passwordValue = dom.registerForm.querySelector("input[name='password']")?.value.trim();
        const usernameValue = dom.registerUsernameInput?.value.trim();
        const allFilled = Boolean(emailValue && passwordValue && usernameValue);
        dom.registerSubmitButton.disabled = !allFilled;
    };

    const bootstrap = async () => {
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

    bindAuthForms();

    return { bootstrap, handleSession };
};
