import { isSupabaseConfigured, supabase } from "./client";

export async function testConnection() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured; running in fallback/offline mode.");
    return;
  }

  const { data, error } = await supabase
    .from("hospitals")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Supabase Connected ✅", data);
  }
}
