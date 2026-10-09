// ---------------------------------------------------------------
//  Supabase connection settings
//  1) In Supabase: Project Settings -> API
//  2) Paste the "Project URL" and the "anon public" key below.
//  The anon key is meant to be public (safe in this file) because
//  the database rules (RLS) only let visitors READ active products.
//  NEVER paste the "service_role" key here.
// ---------------------------------------------------------------
window.SOL_CONFIG = {
  SUPABASE_URL: "https://erkupowfxoptsomrxrmb.supabase.co",       // e.g. "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVya3Vwb3dmeG9wdHNvbXJ4cm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NDUwMDAsImV4cCI6MjEwNzAyMTAwMH0.n_Yt8OEihcVzZi2l0bCf-E66tGToxIbyBUNfcJ4_eXk"   // e.g. "eyJhbGciOi..."
};
