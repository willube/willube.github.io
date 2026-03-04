/**
 * Sanitize username input.
 * @param {string} value
 * @returns {string}
 */
export const sanitizeUsername = (value) => {
    if (!value) return "";
    return value
        .toString()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .slice(0, 24);
};

/**
 * Build a username from preferred or email.
 * @param {string} preferred
 * @param {string} emailValue
 * @returns {string}
 */
export const buildUsername = (preferred, emailValue) => {
    const fromPreferred = sanitizeUsername(preferred);
    if (fromPreferred) return fromPreferred;
    const emailHandle = sanitizeUsername(emailValue?.split("@")[0] || "");
    const base = emailHandle || "user";
    const suffix = Math.random().toString(36).slice(2, 6);
    return `${base}-${suffix}`;
};

/**
 * Factory to ensure profile username exists.
 * @param {object} deps
 * @param {object} deps.state
 * @param {object} deps.supabaseClient
 * @param {object} deps.ui
 */
export const ensureProfileUsernameFactory = ({ state, supabaseClient, ui }) => {
    const fetchOwnProfile = async () => {
        if (!supabaseClient || !state.currentUser) return null;
        const { data, error } = await supabaseClient.from("profiles").select("id, username").eq("id", state.currentUser.id).maybeSingle();
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

    return async (delayMs = 0) => {
        if (!supabaseClient || !state.currentUser) return null;
        if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
        const profile = await fetchOwnProfile();
        if (profile?.username) {
            state.profile = profile;
            ui.updateProfileUi(profile.username);
            return profile;
        }
        const generated = buildUsername(state.currentUser.user_metadata?.username, state.currentUser.email);
        const saved = (await upsertDefaultUsername(generated)) || profile || { id: state.currentUser.id, username: generated };
        state.profile = saved;
        ui.updateProfileUi(saved.username);
        return saved;
    };
};
