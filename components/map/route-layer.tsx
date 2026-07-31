"use client";

/**
 * components/map/route-layer.tsx
 *
 * Renders an OSRM-compatible GeoJSON route polyline as a MapLibre GL layer.
 *
 * Data contract:
 *   - Accepts a GeoJSON FeatureCollection (RouteGeoJSON) via the `route` prop.
 *   - When `route.features` is empty (default), the layer renders nothing.
 *
 * Future integration (Phase 3 – OSRM):
 *   1. Call OSRM `/route/v1/driving/{coords}` in the parent or a server action.
 *   2. Parse the response geometry into a GeoJSON LineString feature.
 *   3. Pass it to this component's `route` prop – no changes needed here.
 *
 * Styling:
 *   - Two stacked layers:
 *     a) A wide, low-opacity glow layer for the neon halo effect.
 *     b) A thinner, solid line on top for the actual route path.
 */

import React from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { LayerSpecification } from "maplibre-gl";
import { MAP_SOURCE_IDS, MAP_LAYER_IDS, RouteGeoJSON } from "@/lib/map-config";

interface RouteLayerProps {
  /**
   * GeoJSON FeatureCollection containing the route geometry.
   * Defaults to EMPTY_ROUTE (no features) until OSRM integration is added.
   */
  route: RouteGeoJSON;
  /** Whether this layer is currently visible */
  visible: boolean;
}

// ─── Layer style specifications ───────────────────────────────────────────────

const glowLayerStyle: LayerSpecification = {
  id: MAP_LAYER_IDS.routeLineGlow,
  type: "line",
  source: MAP_SOURCE_IDS.route,
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#3b82f6",
    "line-width": 14,
    "line-opacity": 0.25,
    "line-blur": 6,
  },
};

const mainLineLayerStyle: LayerSpecification = {
  id: MAP_LAYER_IDS.routeLine,
  type: "line",
  source: MAP_SOURCE_IDS.route,
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,   "#3b82f6",   // blue start
      0.5, "#06b6d4",   // cyan midpoint
      1,   "#10b981",   // emerald end
    ] as LayerSpecification extends { paint: infer P } ? P extends { "line-color": infer C } ? C : never : never,
    "line-width": 5,
    "line-opacity": 0.95,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RouteLayer({ route, visible }: RouteLayerProps) {
  if (!visible || route.features.length === 0) return null;

  return (
    <Source
      id={MAP_SOURCE_IDS.route}
      type="geojson"
      data={route}
      lineMetrics={true}
    >
      {/* Glow halo (rendered first, underneath) */}
      <Layer {...glowLayerStyle} />
      {/* Solid route line (rendered on top) */}
      <Layer {...mainLineLayerStyle} />
    </Source>
  );
}
