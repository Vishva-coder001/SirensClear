import {
  fetchHazardsDb,
  createHazardDb,
  updateHazardDb,
  deleteHazardDb,
  subscribeToHazardsRealtime,
} from "@/lib/supabase/hazards";
import { createReportDb } from "@/lib/supabase/reports";
import { AIHazard, ParsedIncident } from "@/types/ai";
import { HazardDbRow, HazardInsertPayload, ServiceResponse } from "@/types/database";
import { MOCK_HAZARDS } from "@/lib/mock-ai-data";

// Utility mapper function converting DB Row to UI Interface
export function mapDbHazardToAIHazard(row: HazardDbRow): AIHazard {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    severity: row.severity,
    timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    location: row.location,
    description: row.description,
    verificationPercentage: row.verification_percentage,
    source: row.source as AIHazard["source"],
    status: row.status,
    coordinates: {
      lat: row.latitude,
      lng: row.longitude,
    },
    vehiclesInvolved: row.vehicles_involved,
    blockedLanes: row.blocked_lanes,
    victimsEstimated: row.victims_estimated,
  };
}

export class HazardService {
  /**
   * Get all hazards from database or fallback dataset
   */
  static async getAllHazards(): Promise<ServiceResponse<AIHazard[]>> {
    const { data, error } = await fetchHazardsDb();

    if (error || !data || data.length === 0) {
      return {
        data: MOCK_HAZARDS,
        error: error ? error.message : null,
        loading: false,
        status: error ? "error" : "success",
        isFallback: true,
      };
    }

    const mapped = data.map(mapDbHazardToAIHazard);
    return {
      data: mapped,
      error: null,
      loading: false,
      status: "success",
      isFallback: false,
    };
  }

  /**
   * Create a new hazard record from a parsed emergency report
   */
  static async createHazardFromParsedIncident(
    parsed: ParsedIncident,
    rawText: string
  ): Promise<ServiceResponse<AIHazard>> {
    const newId = `HZ-${Math.floor(800 + Math.random() * 100)}`;
    const payload: HazardInsertPayload = {
      id: newId,
      title: `${parsed.incidentType} - ${parsed.location}`,
      description: rawText,
      incident_type: parsed.incidentType,
      severity: parsed.severity,
      priority: parsed.priority,
      location: parsed.location,
      latitude: 17.4401 + (Math.random() - 0.5) * 0.02,
      longitude: 78.3489 + (Math.random() - 0.5) * 0.02,
      vehicles_involved: parsed.vehiclesInvolved,
      blocked_lanes: parsed.blockedLanes,
      victims_estimated: parsed.victimsEstimated,
      weather_impact: parsed.weatherImpact,
      confidence: parsed.confidenceScore,
      verification_percentage: parsed.confidenceScore,
      source: "CCTV AI Vision",
      status: "Active",
    };

    // Save report payload in reports table
    await createReportDb({
      hazard_id: newId,
      raw_text: rawText,
      parsed_json: JSON.parse(JSON.stringify(parsed)),
      source: "CCTV AI Vision",
    });

    const { data, error } = await createHazardDb(payload);

    if (error || !data) {
      // Fallback local UI hazard
      const fallbackHazard: AIHazard = {
        id: newId,
        title: payload.title,
        priority: payload.priority,
        severity: payload.severity,
        timestamp: "Just now",
        location: payload.location,
        description: payload.description,
        verificationPercentage: payload.verification_percentage,
        source: "CCTV AI Vision",
        status: "Active",
        coordinates: { lat: payload.latitude, lng: payload.longitude },
        vehiclesInvolved: payload.vehicles_involved,
        blockedLanes: payload.blocked_lanes,
        victimsEstimated: payload.victims_estimated,
      };

      return {
        data: fallbackHazard,
        error: error ? error.message : null,
        loading: false,
        status: "success",
        isFallback: true,
      };
    }

    return {
      data: mapDbHazardToAIHazard(data),
      error: null,
      loading: false,
      status: "success",
      isFallback: false,
    };
  }

  /**
   * Update hazard status (Active, Investigating, Dispatched, Resolved)
   */
  static async updateHazardStatus(
    id: string,
    status: AIHazard["status"]
  ): Promise<ServiceResponse<AIHazard>> {
    const { data, error } = await updateHazardDb(id, { status });

    if (error || !data) {
      const existing = MOCK_HAZARDS.find((h) => h.id === id) || MOCK_HAZARDS[0];
      return {
        data: { ...existing, status },
        error: error ? error.message : null,
        loading: false,
        status: "success",
        isFallback: true,
      };
    }

    return {
      data: mapDbHazardToAIHazard(data),
      error: null,
      loading: false,
      status: "success",
      isFallback: false,
    };
  }

  /**
   * Realtime hazards subscription wrapper
   */
  static subscribeToHazards(
    onInsert?: (hazard: AIHazard) => void,
    onUpdate?: (hazard: AIHazard) => void,
    onDelete?: (id: string) => void,
    onStatusChange?: (status: string) => void
  ): () => void {
    return subscribeToHazardsRealtime(
      (row) => onInsert && onInsert(mapDbHazardToAIHazard(row)),
      (row) => onUpdate && onUpdate(mapDbHazardToAIHazard(row)),
      onDelete,
      onStatusChange
    );
  }
}
