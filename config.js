// Korbo Supabase Konfiguration
// Supabase -> Settings -> API Keys

const SUPABASE_URL = "https://crcxnehpaysaktmluyck.supabase.co/rest/v1/";

// HIER MUSS NUR NOCH DER ANON PUBLIC KEY AUS SUPABASE REIN.
// Wichtig: NICHT den secret key nehmen.
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyY3huZWhwYXlzYWt0bWx1eWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NTU4NTIsImV4cCI6MjA5NzUzMTg1Mn0.6FA-KWC3vz3_hqJK8DBVRgP73ki6U_c5TpUMBeLj6TU";

const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("HIER_DEN_ANON");
