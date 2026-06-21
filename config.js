// Korbo Supabase Konfiguration
// Supabase -> Settings -> API Keys

const SUPABASE_URL = "https://crcxnehpaysaktmluyck.supabase.co";

// HIER MUSS NUR NOCH DER ANON PUBLIC KEY AUS SUPABASE REIN.
// Wichtig: NICHT den secret key nehmen.
const SUPABASE_ANON_KEY = "HIER_DEN_ANON_PUBLIC_KEY_EINFUEGEN";

const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("HIER_DEN_ANON");
