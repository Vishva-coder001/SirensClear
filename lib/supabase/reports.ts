import { supabase } from "@/lib/supabase/client";
import { ReportDbRow, ReportInsertPayload } from "@/types/database";

export async function fetchReportsDb(): Promise<{ data: ReportDbRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as ReportDbRow[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to fetch reports") };
  }
}

export async function createReportDb(payload: ReportInsertPayload): Promise<{ data: ReportDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as ReportDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to create report") };
  }
}

export async function deleteReportDb(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Failed to delete report") };
  }
}
