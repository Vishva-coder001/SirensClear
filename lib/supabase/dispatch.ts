import { supabase } from "@/lib/supabase/client";
import { DispatchDbRow, DispatchInsertPayload, DispatchUpdatePayload } from "@/types/database";

export async function fetchDispatchesDb(): Promise<{ data: DispatchDbRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("dispatches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as DispatchDbRow[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to fetch dispatches") };
  }
}

export async function createDispatchDb(payload: DispatchInsertPayload): Promise<{ data: DispatchDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("dispatches")
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as DispatchDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to create dispatch") };
  }
}

export async function updateDispatchDb(id: string, payload: DispatchUpdatePayload): Promise<{ data: DispatchDbRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("dispatches")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as DispatchDbRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error("Failed to update dispatch") };
  }
}

export async function deleteDispatchDb(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from("dispatches").delete().eq("id", id);
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Failed to delete dispatch") };
  }
}

export function subscribeToDispatchesRealtime(
  onInsert?: (dispatch: DispatchDbRow) => void,
  onUpdate?: (dispatch: DispatchDbRow) => void,
  onDelete?: (id: string) => void,
  onStatusChange?: (status: string) => void
) {
  const channel = supabase
    .channel("public:dispatches_realtime_channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "dispatches" },
      (payload) => {
        if (onInsert) onInsert(payload.new as DispatchDbRow);
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "dispatches" },
      (payload) => {
        if (onUpdate) onUpdate(payload.new as DispatchDbRow);
      }
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "dispatches" },
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
