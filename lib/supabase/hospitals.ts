import { supabase } from "@/lib/supabase/client";
import { HospitalDbRow } from "@/types/database";

export async function fetchHospitalsDb(): Promise<{ data: HospitalDbRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("name", { ascending: true });

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as HospitalDbRow[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to fetch hospitals") };
  }
}

export async function createHospitalDb(payload: HospitalDbRow): Promise<{ data: HospitalDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("hospitals")
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as HospitalDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to create hospital") };
  }
}

export async function updateHospitalDb(id: string, payload: Partial<HospitalDbRow>): Promise<{ data: HospitalDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("hospitals")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as HospitalDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to update hospital") };
  }
}

export async function deleteHospitalDb(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from("hospitals").delete().eq("id", id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Failed to delete hospital") };
  }
}
