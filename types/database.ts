export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type HazardDbRow = {

  id: string;
  title: string;
  description: string;
  incident_type: string;
  severity: "Critical" | "High" | "Moderate" | "Low";
  priority: "P1 - Immediate" | "P2 - High" | "P3 - Standard" | "P4 - Low";
  location: string;
  latitude: number;
  longitude: number;
  vehicles_involved: string;
  blocked_lanes: string;
  victims_estimated: number;
  weather_impact: string;
  confidence: number;
  verification_percentage: number;
  source: string;
  status: "Active" | "Investigating" | "Dispatched" | "Resolved";
  created_at: string;
  updated_at: string;
};

export type HazardInsertPayload = Omit<HazardDbRow, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};

export type HazardUpdatePayload = Partial<HazardInsertPayload>;

export type DispatchDbRow = {

  id: string;
  hazard_id: string;
  ambulance_id: string | null;
  hospital_id: string | null;
  eta: number;
  distance: number;
  reasoning: string;
  confidence: number;
  status: "Pending" | "Dispatched" | "Reassigned" | "Completed" | "Cancelled";
  created_at: string;
};

export type DispatchInsertPayload = Omit<DispatchDbRow, "created_at"> & {
  created_at?: string;
};

export type DispatchUpdatePayload = Partial<DispatchInsertPayload>;

export type AmbulanceDbRow = {

  id: string;
  unit_number: string;
  driver: string;
  status: "Available" | "En Route" | "On Scene" | "Transporting" | "Maintenance";
  latitude: number;
  longitude: number;
  destination: string | null;
  eta: number | null;
  updated_at: string;
};

export type AmbulanceInsertPayload = Omit<AmbulanceDbRow, "updated_at"> & {
  updated_at?: string;
};

export type AmbulanceUpdatePayload = Partial<AmbulanceInsertPayload>;

export type HospitalDbRow = {

  id: string;
  name: string;
  capacity: number;
  available_beds: number;
  icu_available: number;
  latitude: number;
  longitude: number;
  created_at?: string;
};

// Insert payload for hospitals (created_at optional)
export type HospitalInsertPayload = Omit<HospitalDbRow, "created_at"> & {
  created_at?: string;
};
export type HospitalUpdatePayload = Partial<HospitalInsertPayload>;
export type ReportDbRow = {

  id: string;
  hazard_id: string | null;
  raw_text: string;
  parsed_json: Json;
  source: string;
  created_at: string;
};

export type ReportInsertPayload = Omit<ReportDbRow, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  status: "loading" | "success" | "empty" | "error";
  isFallback?: boolean;
}

export type Database = {
  public: {
    Tables: {
      hazards: {
        Row: HazardDbRow;
        Insert: HazardInsertPayload;
        Update: HazardUpdatePayload;
        Relationships: [];
      };
      dispatches: {
        Row: DispatchDbRow;
        Insert: DispatchInsertPayload;
        Update: DispatchUpdatePayload;
        Relationships: [
          {
            foreignKeyName: "dispatches_hazard_id_fkey";
            columns: ["hazard_id"];
            referencedRelation: "hazards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dispatches_ambulance_id_fkey";
            columns: ["ambulance_id"];
            referencedRelation: "ambulances";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dispatches_hospital_id_fkey";
            columns: ["hospital_id"];
            referencedRelation: "hospitals";
            referencedColumns: ["id"];
          },
        ];
      };
      ambulances: {
        Row: AmbulanceDbRow;
        Insert: AmbulanceInsertPayload;
        Update: AmbulanceUpdatePayload;
        Relationships: [];
      };
      hospitals: {
        Row: HospitalDbRow;
        Insert: HospitalInsertPayload;
        Update: HospitalUpdatePayload;
        Relationships: [];
      };
      reports: {
        Row: ReportDbRow;
        Insert: ReportInsertPayload;
        Update: Partial<ReportInsertPayload>;
        Relationships: [
          {
            foreignKeyName: "reports_hazard_id_fkey";
            columns: ["hazard_id"];
            referencedRelation: "hazards";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
