/**
 * lib/store/map-store.ts
 *
 * Zustand store for global map interaction state.
 *
 * Design principles:
 *   - This store owns UI state only (selection, visibility).
 *   - Data (ambulances, hazards, route geometry) is still passed as props
 *     from parent components so the data source can be swapped later
 *     (constants → Supabase Realtime, EMPTY_ROUTE → OSRM) without touching
 *     any component that reads from this store.
 *
 * Phase 4 integration points:
 *   - selectHazard / selectAmbulance: call from Supabase onUpdate handler.
 *   - setActiveRoute: call after resolving OSRM route geometry.
 */

import { create } from "zustand";
import { MapLayerVisibility, DEFAULT_LAYER_VISIBILITY, MOCK_ROUTE } from "@/lib/constants";
import { RouteGeoJSON, EMPTY_ROUTE } from "@/lib/map-config";

// ─── State shape ──────────────────────────────────────────────────────────────

export interface MapStoreState {
  /** ID of the currently selected hazard, or null if none */
  selectedHazardId: string | null;

  /** ID of the currently selected ambulance unit, or null if none */
  selectedAmbulanceId: string | null;

  /**
   * Active route GeoJSON FeatureCollection.
   * Initialised to MOCK_ROUTE so the route is visible on first load.
   * Replace with OSRM response in Phase 4.
   */
  activeRoute: RouteGeoJSON;

  /** Which overlay layers are currently visible on the map */
  layerVisibility: MapLayerVisibility;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export interface MapStoreActions {
  /**
   * Select a hazard by ID. Pass null to deselect.
   * Side-effects (map flyTo) are handled in MapView via useEffect.
   */
  selectHazard: (id: string | null) => void;

  /**
   * Select an ambulance by ID. Pass null to deselect.
   */
  selectAmbulance: (id: string | null) => void;

  /**
   * Replace the active route geometry.
   * Call this after receiving an OSRM route response in Phase 4.
   */
  setActiveRoute: (route: RouteGeoJSON) => void;

  /** Toggle a single map layer's visibility on/off */
  toggleLayer: (layer: keyof MapLayerVisibility) => void;

  /** Reset all interactive state to defaults */
  resetMapState: () => void;
}

export type MapStore = MapStoreState & MapStoreActions;

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE: MapStoreState = {
  selectedHazardId: null,
  selectedAmbulanceId: null,
  activeRoute: MOCK_ROUTE, // Show the mock route on first load
  layerVisibility: DEFAULT_LAYER_VISIBILITY,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMapStore = create<MapStore>((set) => ({
  ...INITIAL_STATE,

  selectHazard: (id) =>
    set((state) => ({
      // Toggle off if clicking the already-selected hazard
      selectedHazardId: state.selectedHazardId === id ? null : id,
      // Clear ambulance selection when a hazard is selected
      selectedAmbulanceId: null,
    })),

  selectAmbulance: (id) =>
    set((state) => ({
      selectedAmbulanceId: state.selectedAmbulanceId === id ? null : id,
      selectedHazardId: null,
    })),

  setActiveRoute: (route) => set({ activeRoute: route }),

  toggleLayer: (layer) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layer]: !state.layerVisibility[layer],
      },
    })),

  resetMapState: () => set(INITIAL_STATE),
}));
