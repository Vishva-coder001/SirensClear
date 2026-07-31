"use client";

/**
 * components/map/route-layer.tsx
 *
 * Renders an OSRM-compatible GeoJSON route polyline as two stacked MapLibre GL layers:
 *   1. A wide, blurred glow halo for the neon halo effect.
 *   2. A thinner solid cyan line on top for the actual route path.
 *
 * Data contract:
 *   - Accepts a RouteGeoJSON FeatureCollection via the `route` prop.
 *   - When `route.features` is empty the layer renders nothing (safe default).
 *
 * Phase 4 – OSRM integration:
 *   Parse the OSRM response geometry into a RouteGeoJSON value and pass it
 *   via the store's `setActiveRoute()` action — no changes needed here.
 */

import React from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { LineLayerSpecification } from "maplibre-gl";
import { MAP_SOURCE_IDS, MAP_LAYER_IDS, RouteGeoJSON } from "@/lib/map-config";

interface RouteLayerProps {
  route: RouteGeoJSON;
  visible: boolean;
}

// ─── Layer specifications ─────────────────────────────────────────────────────

const glowLayer: LineLayerSpecification = {
  id: MAP_LAYER_IDS.routeLineGlow,
  type: "line",
  source: MAP_SOURCE_IDS.route,
  layout: { "line-join": "round", "line-cap": "round" },
  paint: {
    "line-color": "#3b82f6",
    "line-width": 16,
    "line-opacity": 0.22,
    "line-blur": 8,
  },
};

const solidLayer: LineLayerSpecification = {
  id: MAP_LAYER_IDS.routeLine,
  type: "line",
  source: MAP_SOURCE_IDS.route,
  layout: { "line-join": "round", "line-cap": "round" },
  paint: {
    "line-color": "#06b6d4", // cyan-500
    "line-width": 4,
    "line-opacity": 0.92,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RouteLayer({ route, visible }: RouteLayerProps) {
  if (!visible || route.features.length === 0) return null;

  return (
    // Cast to GeoJSON.GeoJSON for the Source data prop — our RouteGeoJSON is
    // structurally identical to GeoJSON.FeatureCollection<LineString>.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Source id={MAP_SOURCE_IDS.route} type="geojson" data={route as any}>
      {/* Glow halo — rendered beneath the solid line */}
      <Layer {...glowLayer} />
      {/* Solid route line — rendered on top */}
      <Layer {...solidLayer} />
    </Source>
  );
}
