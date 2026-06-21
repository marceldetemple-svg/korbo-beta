// Korbo Supabase Konfiguration
// Supabase -> Settings -> API Keys

const SUPABASE_URL = "https://crcxnehpaysaktmluyck.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyY3huZWhwYXlzYWt0bWx1eWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NTU4NTIsImV4cCI6MjA5NzUzMTg1Mn0.6FA-KWC3vz3_hqJK8DBVRgP73ki6U_c5TpUMBeLj6TU";

const isSupabaseConfigured =
  typeof SUPABASE_URL === "string" &&
  SUPABASE_URL.startsWith("https://") &&
  typeof SUPABASE_ANON_KEY === "string" &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("HIER_DEN_ANON");
