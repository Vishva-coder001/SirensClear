import {
  fetchDispatchesDb,
  updateDispatchDb,
  subscribeToDispatchesRealtime,
} from "@/lib/supabase/dispatch";
import { AIDispatchRecommendation } from "@/types/ai";
import { DispatchDbRow, ServiceResponse } from "@/types/database";
import { MOCK_DISPATCH_RECOMMENDATIONS } from "@/lib/mock-ai-data";

export function mapDbDispatchToRecommendation(row: DispatchDbRow): AIDispatchRecommendation {
  return {
    id: row.id,
    hazardId: row.hazard_id,
    recommendedAmbulance: row.ambulance_id || "ALS Response Unit A04",
    unitId: row.ambulance_id || "AMB-A04",
    distanceKm: row.distance,
    etaMinutes: row.eta,
    recommendedHospital: row.hospital_id || "AIG Hospitals Gachibowli",
    hospitalOccupancy: "Low",
    reasoning: row.reasoning,
    confidenceScore: row.confidence,
    status: (row.status === "Completed" || row.status === "Cancelled" ? "Pending" : row.status) as AIDispatchRecommendation["status"],
  };
}

export class DispatchService {
  /**
   * Get all dispatch recommendations
   */
  static async getAllDispatches(): Promise<ServiceResponse<AIDispatchRecommendation[]>> {
    const { data, error } = await fetchDispatchesDb();

    if (error || !data || data.length === 0) {
      return {
        data: MOCK_DISPATCH_RECOMMENDATIONS,
        error: error ? error.message : null,
        loading: false,
        status: error ? "error" : "success",
        isFallback: true,
      };
    }

    return {
      data: data.map(mapDbDispatchToRecommendation),
      error: null,
      loading: false,
      status: "success",
      isFallback: false,
    };
  }

  /**
   * Get recommendation by Hazard ID
   */
  static async getDispatchByHazardId(
    hazardId: string
  ): Promise<ServiceResponse<AIDispatchRecommendation>> {
    const { data, error } = await fetchDispatchesDb();

    if (!error && data && data.length > 0) {
      const match = data.find((d) => d.hazard_id === hazardId);
      if (match) {
        return {
          data: mapDbDispatchToRecommendation(match),
          error: null,
          loading: false,
          status: "success",
        };
      }
    }

    const mockMatch =
      MOCK_DISPATCH_RECOMMENDATIONS.find((d) => d.hazardId === hazardId) ||
      MOCK_DISPATCH_RECOMMENDATIONS[0];

    return {
      data: mockMatch,
      error: null,
      loading: false,
      status: "success",
      isFallback: true,
    };
  }

  /**
   * Update dispatch status to "Dispatched"
   */
  static async dispatchUnit(dispatchId: string): Promise<ServiceResponse<AIDispatchRecommendation>> {
    const { data, error } = await updateDispatchDb(dispatchId, { status: "Dispatched" });

    if (error || !data) {
      const mockMatch =
        MOCK_DISPATCH_RECOMMENDATIONS.find((d) => d.id === dispatchId) ||
        MOCK_DISPATCH_RECOMMENDATIONS[0];

      return {
        data: { ...mockMatch, status: "Dispatched" },
        error: error ? error.message : null,
        loading: false,
        status: "success",
        isFallback: true,
      };
    }

    return {
      data: mapDbDispatchToRecommendation(data),
      error: null,
      loading: false,
      status: "success",
      isFallback: false,
    };
  }

  /**
   * Reassign unit to alternative ambulance
   */
  static async reassignUnit(
    dispatchId: string,
    newUnitId: string,
    newReasoning: string
  ): Promise<ServiceResponse<AIDispatchRecommendation>> {
    const { data, error } = await updateDispatchDb(dispatchId, {
      ambulance_id: newUnitId,
      reasoning: newReasoning,
      status: "Reassigned",
    });

    if (error || !data) {
      const mockMatch =
        MOCK_DISPATCH_RECOMMENDATIONS.find((d) => d.id === dispatchId) ||
        MOCK_DISPATCH_RECOMMENDATIONS[0];

      return {
        data: {
          ...mockMatch,
          unitId: newUnitId,
          recommendedAmbulance: newUnitId,
          reasoning: newReasoning,
          status: "Reassigned",
        },
        error: error ? error.message : null,
        loading: false,
        status: "success",
        isFallback: true,
      };
    }

    return {
      data: mapDbDispatchToRecommendation(data),
      error: null,
      loading: false,
      status: "success",
      isFallback: false,
    };
  }

  /**
   * Subscribe to real-time dispatches
   */
  static subscribeToDispatches(
    onInsert?: (dispatch: AIDispatchRecommendation) => void,
    onUpdate?: (dispatch: AIDispatchRecommendation) => void,
    onDelete?: (id: string) => void,
    onStatusChange?: (status: string) => void
  ): () => void {
    return subscribeToDispatchesRealtime(
      (row) => onInsert && onInsert(mapDbDispatchToRecommendation(row)),
      (row) => onUpdate && onUpdate(mapDbDispatchToRecommendation(row)),
      onDelete,
      onStatusChange
    );
  }
}
