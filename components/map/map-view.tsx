"use client";

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

import { MapControls } from "./map-controls";
import { RouteLayer } from "./route-layer";

import { Loader2, WifiOff } from "lucide-react";

export interface MapViewProps {
  ambulances?: AmbulanceUnit[];
  hazards?: HazardItem[];
  className?: string;
}

export function MapView({
  ambulances = [],
  hazards = [],
  className = "h-full w-full",
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  const {
    selectedHazardId,
    selectedAmbulanceId,
    activeRoute, // ✅ THIS WAS MISSING
    layerVisibility,
    toggleLayer,
  } = useMapStore();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    console.log("✅ MAP LOADED");
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback((e: unknown) => {
    console.error("❌ MAP ERROR", e);
    setHasError(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedHazardId) return;

    // FlyTo logic will be restored later
  }, [selectedHazardId]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/80">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-xs font-mono text-zinc-400">
              Loading Map...
            </p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950">
          <div className="text-center">
            <WifiOff className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <p className="font-semibold text-red-400">
              Failed to load map
            </p>
          </div>
        </div>
      )}

      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE_URL}
        initialViewState={DEFAULT_VIEW_STATE}
        minZoom={MAP_CONSTRAINTS.minZoom}
        maxZoom={MAP_CONSTRAINTS.maxZoom}
        minPitch={MAP_CONSTRAINTS.minPitch}
        maxPitch={MAP_CONSTRAINTS.maxPitch}
        attributionControl={false}
        style={{
          width: "100%",
          height: "100%",
        }}
        onLoad={handleLoad}
        onError={handleError}
      >
        <NavigationControl position="bottom-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl
          position="bottom-left"
          unit="metric"
        />

        <RouteLayer
          route={activeRoute}
          visible={layerVisibility.route}
        />
      </Map>

      <MapControls
        visibility={layerVisibility}
        onToggle={toggleLayer}
        ambulanceCount={ambulances.length}
        hazardCount={hazards.length}
      />
    </div>
  );
}