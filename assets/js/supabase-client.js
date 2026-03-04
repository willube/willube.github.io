export const createSupabaseClient = (supabaseUrl, supabaseKey) => {
    if (!window.supabase || !supabaseUrl || !supabaseKey || supabaseUrl.startsWith("YOUR_")) {
        console.warn("Supabase keys missing; running in demo mode.");
        return null;
    }
    return window.supabase.createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: true },
        realtime: { params: { eventsPerSecond: 3 } },
    });
};
