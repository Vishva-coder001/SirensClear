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
  longitude: 78.4867, // Hyderabad coordinates
  latitude: 17.385,
  zoom: 12,
  pitch: 30,
  bearing: 0,
};

// ─── Map Style ───────────────────────────────────────────────────────────────

/**
 * Google Maps Standard Raster Tiles
 * Note: Excellent for local hackathon development to bypass CORS.
 */
export const MAP_STYLE_URL = {
  version: 8,
  sources: {
    "google-maps": {
      type: "raster",
      tiles: [
        "https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
        "https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
        "https://mt2.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
        "https://mt3.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
      ],
      tileSize: 256,
      attribution: 'Map data &copy; Google'
    }
  },
  layers: [
    {
      id: "google-maps-layer",
      type: "raster",
      source: "google-maps",
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

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