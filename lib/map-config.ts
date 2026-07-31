/**
 * lib/map-config.ts
 *
 * Central configuration for the MapLibre GL map.
 * Modify this file to change the default map center, zoom, pitch, bearing,
 * and tile style URL without touching any component code.
 *
 * All types here are compatible with react-map-gl/maplibre and maplibre-gl.
 */

// ─── Default View State ──────────────────────────────────────────────────────

export interface MapViewState {
  /** Longitude of the initial map center */
  longitude: number;
  /** Latitude of the initial map center */
  latitude: number;
  /** Initial zoom level (0–22) */
  zoom: number;
  /** Camera pitch in degrees (0 = flat, up to 85) */
  pitch: number;
  /** Camera bearing / rotation in degrees (0 = north) */
  bearing: number;
}

export const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: 78.4867,
  latitude: 17.385,
  zoom: 12,
  pitch: 30,
  bearing: 0,
};

// ─── Map Style ───────────────────────────────────────────────────────────────

/**
 * OpenStreetMap-compatible dark tile style hosted by CARTO.
 * No API key required. Uses MapLibre GL style spec format.
 */
export const MAP_STYLE_URL =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// ─── Map Constraints ─────────────────────────────────────────────────────────

export const MAP_CONSTRAINTS = {
  minZoom: 3,
  maxZoom: 20,
  minPitch: 0,
  maxPitch: 85,
} as const;

// ─── Tile Attribution ─────────────────────────────────────────────────────────

export const MAP_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>';

// ─── Layer & Source IDs (stable keys for future OSRM / Supabase integration) ─

export const MAP_SOURCE_IDS = {
  route: "sc-route-source",
  hazardRadius: "sc-hazard-radius-source",
} as const;

export const MAP_LAYER_IDS = {
  routeLine: "sc-route-line-layer",
  routeLineGlow: "sc-route-line-glow-layer",
  hazardRadius: "sc-hazard-radius-layer",
} as const;

// ─── GeoJSON placeholder types (ready for OSRM response hydration) ────────────

export interface RouteGeoJSON {
  type: "FeatureCollection";
  features: GeoJSON.Feature<GeoJSON.LineString>[];
}

/** Empty route — replace with OSRM response in Phase 3 */
export const EMPTY_ROUTE: RouteGeoJSON = {
  type: "FeatureCollection",
  features: [],
};
