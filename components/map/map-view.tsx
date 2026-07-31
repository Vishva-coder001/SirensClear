"use client";

/**
 * components/map/map-view.tsx
 *
 * Primary reusable MapLibre GL map component.
 *
 * Responsibilities:
 *   - Initialises a MapLibre GL map via react-map-gl/maplibre.
 *   - Reads all defaults (center, zoom, pitch, bearing, tile style) from lib/map-config.ts.
 *   - Composes independent layer components: AmbulanceMarkers, HazardMarkers, RouteLayer.
 *   - Exposes typed props so the parent can pass data without this component knowing
 *     where the data comes from (constants, Supabase, OSRM, etc.).
 *   - Handles loading and error states internally.
 *
 * Future integration:
 *   - Phase 3 (Supabase Realtime): Subscribe in the parent; pass live arrays here.
 *   - Phase 3 (OSRM):              Pass parsed GeoJSON into the `route` prop.
 *
 * NOTE: Must be "use client" – MapLibre requires browser APIs (WebGL, DOM).
 */

import React, { useCallback, useRef, useState } from "react";
import Map, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  MapRef,
} from "react-map-gl/maplibre";
import {
  DEFAULT_VIEW_STATE,
  MAP_STYLE_URL,
  MAP_CONSTRAINTS,
  EMPTY_ROUTE,
  RouteGeoJSON,
} from "@/lib/map-config";
import {
  AmbulanceUnit,
  HazardItem,
  MapLayerVisibility,
  DEFAULT_LAYER_VISIBILITY,
} from "@/lib/constants";
import { AmbulanceMarkers } from "./ambulance-markers";
import { HazardMarkers } from "./hazard-markers";
import { RouteLayer } from "./route-layer";
import { MapControls } from "./map-controls";
import { Loader2, WifiOff } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MapViewProps {
  /**
   * Ambulance units to render as interactive map markers.
   * Defaults to an empty array; hydrated by parent from constants or Supabase.
   */
  ambulances?: AmbulanceUnit[];

  /**
   * Road hazard items to render as interactive map markers.
   * Defaults to an empty array; hydrated by parent from constants or Supabase.
   */
  hazards?: HazardItem[];

  /**
   * Optimised route GeoJSON to render as a glowing polyline.
   * Defaults to EMPTY_ROUTE; hydrated by parent from OSRM response in Phase 3.
   */
  route?: RouteGeoJSON;

  /** CSS height class applied to the map container. Defaults to h-full. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MapView({
  ambulances = [],
  hazards = [],
  route = EMPTY_ROUTE,
  className = "h-full w-full",
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  // Layer visibility — controlled locally; can be lifted to parent if needed
  const [visibility, setVisibility] =
    useState<MapLayerVisibility>(DEFAULT_LAYER_VISIBILITY);

  // Loading / error states driven by MapLibre map events
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const toggleLayer = useCallback((layer: keyof MapLayerVisibility) => {
    setVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-b-xl ${className}`}>
      {/* ── Loading overlay ── */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-zinc-950/95 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          <p className="text-xs font-mono text-zinc-400">
            Loading MapLibre GL tiles…
          </p>
        </div>
      )}

      {/* ── Error overlay ── */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-zinc-950/95 backdrop-blur-sm">
          <WifiOff className="h-8 w-8 text-red-400" />
          <p className="text-sm font-mono text-zinc-300 font-semibold">
            Map tiles unavailable
          </p>
          <p className="text-xs font-mono text-zinc-500 max-w-xs text-center">
            Could not load the CartoDB dark-matter style. Check your network
            connection — the map will retry automatically on next render.
          </p>
        </div>
      )}

      {/* ── MapLibre GL canvas ── */}
      <Map
        ref={mapRef}
        id="sirensclear-map"
        mapStyle={MAP_STYLE_URL}
        initialViewState={DEFAULT_VIEW_STATE}
        minZoom={MAP_CONSTRAINTS.minZoom}
        maxZoom={MAP_CONSTRAINTS.maxZoom}
        minPitch={MAP_CONSTRAINTS.minPitch}
        maxPitch={MAP_CONSTRAINTS.maxPitch}
        style={{ width: "100%", height: "100%" }}
        onLoad={handleLoad}
        onError={handleError}
        attributionControl={false}
      >
        {/* ── Native GL controls (bottom-right by default) ── */}
        <NavigationControl position="bottom-right" visualizePitch />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-left" unit="metric" />

        {/* ── Overlay layers ── */}
        <RouteLayer route={route} visible={visibility.route} />
        <HazardMarkers hazards={hazards} visible={visibility.hazards} />
        <AmbulanceMarkers ambulances={ambulances} visible={visibility.ambulances} />
      </Map>

      {/* ── React overlay UI (layer toggles, legend, badge) ── */}
      <MapControls
        visibility={visibility}
        onToggle={toggleLayer}
        ambulanceCount={ambulances.length}
        hazardCount={hazards.length}
      />
    </div>
  );
}
