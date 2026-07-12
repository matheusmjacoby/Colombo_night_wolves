// =========================================
// Configuração Supabase
// =========================================

const CONFIG = {
    SUPABASE_URL: "https://dyrqnurbhbcopwnifklz.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cnFudXJiaGJjb3B3bmlma2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTg2MjQsImV4cCI6MjA5OTM3NDYyNH0.HQx-4zX9Jmk1ln7P7Q3hkX9PMg_ft8f8XqO42_rpCow"
};

const supabaseClient = supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);
