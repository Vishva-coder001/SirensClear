import { fetchProfileDb } from "@/lib/supabase/profiles";
import { ProfileDbRow, ServiceResponse } from "@/types/database";

export class ProfileService {
  /**
   * Fetch authenticated user's profile role from Supabase PostgreSQL
   */
  static async getProfile(userId: string): Promise<ServiceResponse<ProfileDbRow>> {
    const { data, error } = await fetchProfileDb(userId);

    if (error || !data) {
      return {
        data: null,
        error: error ? error.message : "Profile not found",
        loading: false,
        status: "error",
      };
    }

    return {
      data,
      error: null,
      loading: false,
      status: "success",
    };
  }
}
