// Korbo Supabase Konfiguration
// Supabase -> Settings -> API Keys

const SUPABASE_URL = "https://crcxnehpaysaktmluyck.supabase.co";

// HIER MUSS NUR NOCH DER ANON PUBLIC KEY AUS SUPABASE REIN.
// Wichtig: NICHT den secret key nehmen.
const SUPABASE_ANON_KEY = "sb_publishable_yHFORpA7EqEK0zpsq9jqsQ_YKPcP8ha";

const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("HIER_DEN_ANON");
