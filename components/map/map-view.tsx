"use client";

/**
 * components/map/map-view.tsx
 *
 * Primary MapLibre GL map component.
 *
 * This component is the orchestration layer:
 *   - Initialises the map canvas from lib/map-config.ts defaults.
 *   - Reads UI state (selection, visibility, active route) from the Zustand store.
 *   - Passes data (ambulances, hazards) down to sub-components as props.
 *   - Implements flyTo when the selected hazard changes.
 *   - Does NOT own any business state — that lives in the store.
 *
 * Phase 4 – Supabase integration:
 *   Replace `ambulances` / `hazards` props with live arrays from a Supabase
 *   Realtime hook — this file requires no structural changes.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
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
} from "@/lib/map-config";
import { AmbulanceUnit, HazardItem } from "@/lib/constants";
import { useMapStore } from "@/lib/store/map-store";
import { AmbulanceMarkers } from "./ambulance-markers";
import { HazardMarkers } from "./hazard-markers";
import { RouteLayer } from "./route-layer";
import { MapControls } from "./map-controls";
import { Loader2, WifiOff } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MapViewProps {
  /** Ambulance units — sourced from constants, or Supabase in Phase 4 */
  ambulances?: AmbulanceUnit[];
  /** Road hazard items — sourced from constants, or Supabase in Phase 4 */
  hazards?: HazardItem[];
  /** Additional class names for the root container */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MapView({
  ambulances = [],
  hazards = [],
  className = "h-full w-full",
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  // ── Store ─────────────────────────────────────────────────────────────────
  const {
    selectedHazardId,
    selectedAmbulanceId,
    activeRoute,
    layerVisibility,
    selectHazard,
    selectAmbulance,
    toggleLayer,
  } = useMapStore();

  // ── Map lifecycle ─────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError]   = useState(false);

  const handleLoad  = useCallback(() => { setIsLoading(false); setHasError(false); }, []);
  const handleError = useCallback(() => { setIsLoading(false); setHasError(true);  }, []);

  // ── Fly-to on hazard selection ─────────────────────────────────────────────
  useEffect(() => {
    if (!selectedHazardId) return;
    const hazard = hazards.find((h) => h.id === selectedHazardId);
    if (!hazard) return;

    const map = mapRef.current;
    if (!map) return;

    const [longitude, latitude] = hazard.coordinates;
    map.flyTo({
      center: [longitude, latitude],
      zoom: 15,
      duration: 1000,
      essential: true,
    });
  }, [selectedHazardId, hazards]);

  return (
    <div className={`relative overflow-hidden rounded-b-xl ${className}`}>

      {/* ── Loading overlay ── */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-zinc-950/95 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          <p className="text-xs font-mono text-zinc-400">Loading MapLibre GL tiles…</p>
        </div>
      )}

      {/* ── Error overlay ── */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-zinc-950/95 backdrop-blur-sm">
          <WifiOff className="h-8 w-8 text-red-400" />
          <p className="text-sm font-mono text-zinc-300 font-semibold">Map tiles unavailable</p>
          <p className="text-xs font-mono text-zinc-500 max-w-xs text-center">
            Could not load the CartoDB dark-matter style. Check your network connection.
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
        {/* Native GL controls */}
        <NavigationControl position="bottom-right" visualizePitch />
        <FullscreenControl  position="top-right" />
        <ScaleControl      position="bottom-left" unit="metric" />

        {/* Route polyline (beneath markers so markers sit on top) */}
        <RouteLayer
          route={activeRoute}
          visible={layerVisibility.route}
        />

        {/* Hazard markers — drive selection via store */}
        <HazardMarkers
          hazards={hazards}
          selectedId={selectedHazardId}
          onSelect={selectHazard}
          visible={layerVisibility.hazards}
        />

        {/* Ambulance markers — drive selection via store */}
        <AmbulanceMarkers
          ambulances={ambulances}
          selectedId={selectedAmbulanceId}
          onSelect={selectAmbulance}
          visible={layerVisibility.ambulances}
        />
      </Map>

      {/* React overlay controls — reads / writes store through callbacks */}
      <MapControls
        visibility={layerVisibility}
        onToggle={toggleLayer}
        ambulanceCount={ambulances.length}
        hazardCount={hazards.length}
      />
    </div>
  );
}
