import {
  fetchAmbulancesDb,
  updateAmbulanceDb,
  subscribeToAmbulancesRealtime,
} from "@/lib/supabase/ambulances";
import { AmbulanceDbRow, ServiceResponse } from "@/types/database";

export const MOCK_AMBULANCE_UNITS: AmbulanceDbRow[] = [
  { id: "AMB-A04", unit_number: "ALS Response Unit A04", driver: "Rajesh Kumar", status: "Available", latitude: 17.4405, longitude: 78.3492, destination: "Gachibowli Flyover", eta: 3.2, updated_at: new Date().toISOString() },
  { id: "AMB-T02", unit_number: "Trauma Unit T02", driver: "Vikram Singh", status: "En Route", latitude: 17.3871, longitude: 78.3620, destination: "ORR Exit 3", eta: 4.5, updated_at: new Date().toISOString() },
  { id: "AMB-R08", unit_number: "Rapid Bike Unit R08", driver: "Srinivas Rao", status: "Available", latitude: 17.4510, longitude: 78.3812, destination: "Cyber Towers", eta: 2.1, updated_at: new Date().toISOString() },
  { id: "AMB-A12", unit_number: "Cardiac ALS Unit A12", driver: "Mohammed Ali", status: "En Route", latitude: 17.4420, longitude: 78.3830, destination: "Mindspace Junction", eta: 2.8, updated_at: new Date().toISOString() },
  { id: "AMB-H01", unit_number: "Hazmat Paramedic H01", driver: "Anand Verma", status: "Available", latitude: 17.4150, longitude: 78.3450, destination: "Financial District", eta: 4.0, updated_at: new Date().toISOString() },
];

export class AmbulanceService {
  /**
   * Get all ambulances
   */
  static async getAllAmbulances(): Promise<ServiceResponse<AmbulanceDbRow[]>> {
    const { data, error } = await fetchAmbulancesDb();

    if (error || !data || data.length === 0) {
      return {
        data: MOCK_AMBULANCE_UNITS,
        error: error ? error.message : null,
        loading: false,
        status: error ? "error" : "success",
        isFallback: true,
      };
    }

    return {
      data,
      error: null,
      loading: false,
      status: "success",
      isFallback: false,
    };
  }

  /**
   * Update ambulance status or location
   */
  static async updateAmbulanceStatus(
    id: string,
    status: AmbulanceDbRow["status"],
    destination?: string
  ): Promise<ServiceResponse<AmbulanceDbRow>> {
    const payload: Partial<AmbulanceDbRow> = { status };
    if (destination !== undefined) payload.destination = destination;

    const { data, error } = await updateAmbulanceDb(id, payload);

    if (error || !data) {
      const match = MOCK_AMBULANCE_UNITS.find((a) => a.id === id) || MOCK_AMBULANCE_UNITS[0];
      return {
        data: { ...match, status, destination: destination ?? match.destination },
        error: error ? error.message : null,
        loading: false,
        status: "success",
        isFallback: true,
      };
    }

    return {
      data,
      error: null,
      loading: false,
      status: "success",
      isFallback: false,
    };
  }

  /**
   * Subscribe to realtime ambulance updates
   */
  static subscribeToAmbulances(
    onUpdate?: (ambulance: AmbulanceDbRow) => void,
    onStatusChange?: (status: string) => void
  ): () => void {
    return subscribeToAmbulancesRealtime(onUpdate, onStatusChange);
  }
}
