import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qdxondojktchkjbbrtaq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeG9uZG9qa3RjaGtqYmJydGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTQ5MjMsImV4cCI6MjA3NTAzMDkyM30.2ZArRE1OTDdS6VMyclNgvr5y5G6x2PwbfC-1T8K5U-0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
