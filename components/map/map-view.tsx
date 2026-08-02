'use client';

import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  DEFAULT_VIEW_STATE,
  MAP_STYLE_URL,
  MAP_SOURCE_IDS,
  MAP_LAYER_IDS,
} from '@/lib/map-config';
import { AmbulanceUnit, HazardItem } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useMapStore } from '@/lib/store/map-store';

export interface MapViewProps {
  ambulances?: AmbulanceUnit[];
  hazards?: HazardItem[];
  className?: string;
}

export default function MapView(props: MapViewProps = {}) {
  const { className } = props;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Zustand State Management
  const activeRoute = useMapStore((state) => state.activeRoute);
  const isRealtimeConnected = useMapStore((state) => state.isRealtimeConnected);
  const initializeRealtime = useMapStore((state) => state.initializeRealtimeSubscriptions);

  // Initialize Realtime Connection once on mount
  useEffect(() => {
    const cleanupRealtime = initializeRealtime();
    return () => {
      cleanupRealtime();
    };
  }, [initializeRealtime]);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL as maplibregl.StyleSpecification,
      center: [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude],
      zoom: DEFAULT_VIEW_STATE.zoom,
      pitch: DEFAULT_VIEW_STATE.pitch,
      bearing: DEFAULT_VIEW_STATE.bearing,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Register Route Source
      map.addSource(MAP_SOURCE_IDS.route, {
        type: 'geojson',
        data: useMapStore.getState().activeRoute,
      });

      // Emergency Line Glow Effect
      map.addLayer({
        id: MAP_LAYER_IDS.routeLineGlow,
        type: 'line',
        source: MAP_SOURCE_IDS.route,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#00e676',
          'line-width': 8,
          'line-opacity': 0.4,
        },
      });

      // Primary Route Line
      map.addLayer({
        id: MAP_LAYER_IDS.routeLine,
        type: 'line',
        source: MAP_SOURCE_IDS.route,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#00c853',
          'line-width': 4,
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Synchronize Active Route GeoJSON when store updates
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    const source = map.getSource(MAP_SOURCE_IDS.route) as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(activeRoute);
    }
  }, [activeRoute]);

  return (
    <div className={cn("relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-800", className)}>
      {/* Realtime Status Indicator Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs text-white">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          }`}
        />
        {isRealtimeConnected ? 'GRID REALTIME ACTIVE' : 'CONNECTING GRID...'}
      </div>

      {/* Map Target */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}