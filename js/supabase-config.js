/*
 * OUR LITTLE ARCHIVE
 * Supabase Configuration
 */

const SUPABASE_URL = "https://amgesiegbiacapulmqtn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mQRDF_zHCndoqjFeFpiW5w_iEymG2Dl";

/*
 * Create our Supabase client.
 *
 * We call it "supabaseClient" instead of "supabase"
 * so it doesn't conflict with the Supabase library itself.
 */

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);