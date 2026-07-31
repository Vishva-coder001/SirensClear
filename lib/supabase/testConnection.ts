import { supabase } from "./client";

export async function testConnection() {
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