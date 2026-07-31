import { supabase } from "@/lib/supabase/client";
import { AmbulanceDbRow, AmbulanceInsertPayload, AmbulanceUpdatePayload } from "@/types/database";

export async function fetchAmbulancesDb(): Promise<{ data: AmbulanceDbRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("ambulances")
      .select("*")
      .order("unit_number", { ascending: true });

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as AmbulanceDbRow[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to fetch ambulances") };
  }
}

export async function createAmbulanceDb(payload: AmbulanceInsertPayload): Promise<{ data: AmbulanceDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("ambulances")
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as AmbulanceDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to create ambulance") };
  }
}

export async function updateAmbulanceDb(id: string, payload: AmbulanceUpdatePayload): Promise<{ data: AmbulanceDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("ambulances")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as AmbulanceDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to update ambulance") };
  }
}

export async function deleteAmbulanceDb(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from("ambulances").delete().eq("id", id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Failed to delete ambulance") };
  }
}

export function subscribeToAmbulancesRealtime(
  onUpdate?: (ambulance: AmbulanceDbRow) => void,
  onStatusChange?: (status: string) => void
) {
  const channel = supabase
    .channel("public:ambulances_realtime_channel")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "ambulances" },
      (payload) => {
        if (onUpdate) onUpdate(payload.new as AmbulanceDbRow);
      }
    )
    .subscribe((status) => {
      if (onStatusChange) onStatusChange(status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
