// Korbo Supabase Konfiguration
// Supabase -> Project Settings -> API

const SUPABASE_URL = "HIER_DEINE_SUPABASE_URL_EINFUEGEN";
const SUPABASE_ANON_KEY = "HIER_DEINEN_SUPABASE_ANON_KEY_EINFUEGEN";

const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20;
