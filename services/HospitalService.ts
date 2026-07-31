import { fetchHospitalsDb, updateHospitalDb } from "@/lib/supabase/hospitals";
import { HospitalDbRow, ServiceResponse } from "@/types/database";

export const MOCK_HOSPITALS_LIST: HospitalDbRow[] = [
  { id: "HOSP-001", name: "AIG Hospitals Gachibowli", capacity: 500, available_beds: 48, icu_available: 8, latitude: 17.4423, longitude: 78.3582 },
  { id: "HOSP-002", name: "Care Hospitals Narsingi", capacity: 250, available_beds: 19, icu_available: 4, latitude: 17.3892, longitude: 78.3645 },
  { id: "HOSP-003", name: "Medicover Hospitals Hitec City", capacity: 350, available_beds: 32, icu_available: 6, latitude: 17.4485, longitude: 78.3792 },
  { id: "HOSP-004", name: "Yashoda Hospitals Hitec City", capacity: 400, available_beds: 41, icu_available: 10, latitude: 17.4419, longitude: 78.3831 },
  { id: "HOSP-005", name: "Continental Hospitals Nanakramguda", capacity: 450, available_beds: 55, icu_available: 12, latitude: 17.4148, longitude: 78.3438 },
];

export class HospitalService {
  /**
   * Get all hospitals
   */
  static async getAllHospitals(): Promise<ServiceResponse<HospitalDbRow[]>> {
    const { data, error } = await fetchHospitalsDb();

    if (error || !data || data.length === 0) {
      return {
        data: MOCK_HOSPITALS_LIST,
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
   * Reserve an ICU bed or decrease available beds upon dispatch
   */
  static async reserveBed(hospitalId: string): Promise<ServiceResponse<HospitalDbRow>> {
    const { data: currentHospitals } = await this.getAllHospitals();
    const target = currentHospitals?.find((h) => h.id === hospitalId);

    const newAvailable = Math.max(0, (target?.available_beds ?? 10) - 1);
    const newIcu = Math.max(0, (target?.icu_available ?? 2) - 1);

    const { data, error } = await updateHospitalDb(hospitalId, {
      available_beds: newAvailable,
      icu_available: newIcu,
    });

    if (error || !data) {
      const match = target || MOCK_HOSPITALS_LIST[0];
      return {
        data: { ...match, available_beds: newAvailable, icu_available: newIcu },
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
}
