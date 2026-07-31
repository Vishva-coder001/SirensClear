import { supabase } from "@/lib/supabase/client";
import { HazardDbRow, HazardInsertPayload, HazardUpdatePayload } from "@/types/database";

export async function fetchHazardsDb(): Promise<{ data: HazardDbRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("hazards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as HazardDbRow[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to fetch hazards") };
  }
}

export async function createHazardDb(payload: HazardInsertPayload): Promise<{ data: HazardDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("hazards")
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as HazardDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to create hazard") };
  }
}

export async function updateHazardDb(id: string, payload: HazardUpdatePayload): Promise<{ data: HazardDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("hazards")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as HazardDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to update hazard") };
  }
}

export async function deleteHazardDb(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from("hazards").delete().eq("id", id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Failed to delete hazard") };
  }
}

export function subscribeToHazardsRealtime(
  onInsert?: (hazard: HazardDbRow) => void,
  onUpdate?: (hazard: HazardDbRow) => void,
  onDelete?: (id: string) => void,
  onStatusChange?: (status: string) => void
) {
  const channel = supabase
    .channel("public:hazards_realtime_channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "hazards" },
      (payload) => {
        if (onInsert) onInsert(payload.new as HazardDbRow);
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "hazards" },
      (payload) => {
        if (onUpdate) onUpdate(payload.new as HazardDbRow);
      }
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "hazards" },
      (payload) => {
        if (onDelete && payload.old && payload.old.id) onDelete(payload.old.id as string);
      }
    )
    .subscribe((status) => {
      if (onStatusChange) onStatusChange(status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
