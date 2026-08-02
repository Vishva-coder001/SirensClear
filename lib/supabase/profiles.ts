import { supabase } from "@/lib/supabase/client";
import { ProfileDbRow } from "@/types/database";

export async function fetchProfileDb(userId: string): Promise<{ data: ProfileDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as ProfileDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to fetch profile") };
  }
}
