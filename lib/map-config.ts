/**
 * lib/map-config.ts
 *
 * Central configuration for the MapLibre GL map.
 * Modify this file to change the default map center, zoom, pitch, bearing,
 * and tile style URL without touching any component code.
 */

// ─── Default View State ──────────────────────────────────────────────────────

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
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
 * CartoDB Dark Matter – OpenStreetMap-compatible dark vector tiles.
 * No API key required.
 */
export const MAP_STYLE_URL =
"https://demotiles.maplibre.org/style.json";

// ─── Map Constraints ─────────────────────────────────────────────────────────

export const MAP_CONSTRAINTS = {
  minZoom: 3,
  maxZoom: 20,
  minPitch: 0,
  maxPitch: 85,
} as const;

// ─── Stable Source & Layer IDs ────────────────────────────────────────────────
// Keep these constant so OSRM/Supabase integrations can reference them safely.

export const MAP_SOURCE_IDS = {
  route: "sc-route-source",
} as const;

export const MAP_LAYER_IDS = {
  routeLineGlow: "sc-route-line-glow-layer",
  routeLine: "sc-route-line-layer",
} as const;

// ─── GeoJSON types (self-contained, no @types/geojson dependency) ─────────────

/** A single coordinate as [longitude, latitude] */
export type LngLat = [number, number];

/** A GeoJSON LineString feature ready for MapLibre GL consumption */
export interface RouteFeature {
  type: "Feature";
  properties: Record<string, unknown> | null;
  geometry: {
    type: "LineString";
    coordinates: LngLat[];
  };
}

/**
 * GeoJSON FeatureCollection for a route.
 * Structured to accept OSRM route geometry directly in Phase 4.
 *
 * OSRM integration note:
 *   const geom = osrmResponse.routes[0].geometry; // {type:"LineString", coordinates:[...]}
 *   const route: RouteGeoJSON = {
 *     type: "FeatureCollection",
 *     features: [{ type: "Feature", properties: {}, geometry: geom }],
 *   };
 */
export interface RouteGeoJSON {
  type: "FeatureCollection";
  features: RouteFeature[];
}

/** Empty route — used as the default/reset value */
export const EMPTY_ROUTE: RouteGeoJSON = {
  type: "FeatureCollection",
  features: [],
};
