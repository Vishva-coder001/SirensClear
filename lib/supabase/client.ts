import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const configuredSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when both public Supabase configuration values are present. */
export const isSupabaseConfigured = Boolean(
  configuredSupabaseUrl && configuredSupabaseAnonKey
);

// Keep a valid inert client for local fallback mode. Service calls can then
// return their existing fallback data without treating missing configuration as
// a live Supabase connection.
const supabaseUrl = configuredSupabaseUrl ?? "https://offline.supabase.co";
const supabaseAnonKey = configuredSupabaseAnonKey ?? "offline-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});
