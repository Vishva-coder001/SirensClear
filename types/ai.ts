export type IncidentSeverity = "Critical" | "High" | "Moderate" | "Low";
export type IncidentPriority = "P1 - Immediate" | "P2 - High" | "P3 - Standard" | "P4 - Low";
export type HazardStatus = "Active" | "Investigating" | "Dispatched" | "Resolved";
export type VerificationSourceType = "CCTV AI Vision" | "Citizen Mobile App" | "Traffic Sensor IoT" | "Police Radio Dispatch" | "911 Emergency Call";

export interface ParsedIncident {
  incidentType: string;
  severity: IncidentSeverity;
  location: string;
  vehiclesInvolved: string;
  blockedLanes: string;
  victimsEstimated: number;
  weatherImpact: string;
  confidenceScore: number; // 0 - 100
  priority: IncidentPriority;
  rawReport: string;
  parsedAt: string;
}

export interface AIHazard {
  id: string;
  title: string;
  priority: IncidentPriority;
  severity: IncidentSeverity;
  timestamp: string;
  location: string;
  description: string;
  verificationPercentage: number;
  source: VerificationSourceType;
  status: HazardStatus;
  coordinates: {
    lat: number;
    lng: number;
  };
  vehiclesInvolved: string;
  blockedLanes: string;
  victimsEstimated: number;
}

export interface VerificationReport {
  id: string;
  hazardId: string;
  duplicateDetectionScore: number; // 0-100 (e.g. 94% confidence not duplicate or 12% duplicate risk)
  confidenceScore: number; // 0-100
  sourceReliabilityScore: number; // 0-100
  fakeReportRiskScore: number; // 0-100 (lower is better)
  crossVerificationSources: {
    name: VerificationSourceType;
    status: "Verified" | "Pending" | "Unverified";
    timestamp: string;
  }[];
  verificationTimeline: {
    stage: string;
    status: "completed" | "in_progress" | "pending";
    timestamp: string;
    details: string;
  }[];
}

export interface AIDispatchRecommendation {
  id: string;
  hazardId: string;
  recommendedAmbulance: string;
  unitId: string;
  distanceKm: number;
  etaMinutes: number;
  recommendedHospital: string;
  hospitalOccupancy: "Low" | "Moderate" | "High" | "Critical";
  reasoning: string;
  confidenceScore: number;
  status: "Pending" | "Dispatched" | "Reassigned";
}

export interface AIInsightsData {
  criticalIncidents: number;
  averageEtaMinutes: number;
  averageConfidencePercentage: number;
  verificationSuccessPercentage: number;
  predictedCongestionLevel: "Low" | "Moderate" | "Severe" | "Gridlock";
  activeUnitsDeployed: number;
}

export interface TimelineMilestone {
  id: string;
  stage: string;
  label: string;
  timestamp: string;
  status: "completed" | "active" | "pending";
  details: string;
}
