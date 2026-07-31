"use client";

/**
 * components/map/ambulance-markers.tsx
 *
 * Renders MapLibre GL Marker elements for ambulance units on the live map.
 *
 * Data contract:
 *   - Receives a typed `ambulances` array from the parent MapView.
 *   - Coordinates are [longitude, latitude] tuples (MapLibre convention).
 *
 * Future integration:
 *   - Replace the static `ambulances` prop with a Supabase Realtime subscription
 *     in the parent component; the marker rendering here requires no changes.
 */

import React, { useState } from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import { Ambulance } from "lucide-react";
import { AmbulanceUnit } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Colour coding per operational status */
const STATUS_STYLES: Record<AmbulanceUnit["status"], string> = {
  en_route: "bg-blue-600 border-blue-300 ring-blue-400/40",
  at_scene: "bg-emerald-600 border-emerald-300 ring-emerald-400/40",
  available: "bg-zinc-700 border-zinc-500 ring-zinc-400/20",
  returning: "bg-indigo-600 border-indigo-300 ring-indigo-400/40",
};

const STATUS_LABEL: Record<AmbulanceUnit["status"], string> = {
  en_route: "En Route",
  at_scene: "At Scene",
  available: "Available",
  returning: "Returning",
};

interface AmbulanceMarkersProps {
  /**
   * Array of ambulance units to render.
   * Sourced from MOCK_AMBULANCE_UNITS in lib/constants.ts.
   * Will be replaced by Supabase Realtime data in Phase 3.
   */
  ambulances: AmbulanceUnit[];
  /** Whether this layer is currently visible */
  visible: boolean;
}

export function AmbulanceMarkers({ ambulances, visible }: AmbulanceMarkersProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!visible) return null;

  return (
    <>
      {ambulances.map((unit) => {
        const [longitude, latitude] = unit.coordinates;
        const isSelected = selectedId === unit.id;

        return (
          <React.Fragment key={unit.id}>
            {/* ── Pin Marker ── */}
            <Marker
              longitude={longitude}
              latitude={latitude}
              anchor="center"
              onClick={(e) => {
                // Prevent map click-through
                e.originalEvent.stopPropagation();
                setSelectedId(isSelected ? null : unit.id);
              }}
            >
              <div className="relative cursor-pointer group">
                {/* Pulse ring */}
                <span
                  className={cn(
                    "absolute inset-0 rounded-full opacity-40 animate-ping",
                    unit.status === "en_route" ? "bg-blue-500" :
                    unit.status === "at_scene" ? "bg-emerald-500" :
                    "bg-zinc-500"
                  )}
                />

                {/* Main chip */}
                <div
                  className={cn(
                    "relative flex items-center gap-1 px-2 py-1 rounded-full border-2 ring-2 text-white text-[11px] font-mono font-bold shadow-xl transition-transform duration-150",
                    STATUS_STYLES[unit.status],
                    isSelected ? "scale-110" : "hover:scale-105"
                  )}
                >
                  <Ambulance className="h-3.5 w-3.5 shrink-0" />
                  <span>{unit.callsign}</span>
                </div>
              </div>
            </Marker>

            {/* ── Popup on selection ── */}
            {isSelected && (
              <Popup
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
                offset={20}
                closeButton={false}
                onClose={() => setSelectedId(null)}
                className="sc-popup"
              >
                <div className="min-w-[180px] rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 text-xs font-mono text-zinc-200 shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
                    <span className="font-bold text-blue-400">{unit.callsign} Telemetry</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                        unit.status === "en_route" ? "bg-blue-950 text-blue-300" :
                        unit.status === "at_scene" ? "bg-emerald-950 text-emerald-300" :
                        unit.status === "returning" ? "bg-indigo-950 text-indigo-300" :
                        "bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {STATUS_LABEL[unit.status]}
                    </span>
                  </div>

                  {/* Data rows */}
                  <div className="space-y-1 text-[11px]">
                    <p className="text-zinc-400">
                      Hospital:{" "}
                      <strong className="text-zinc-100">{unit.hospitalTarget}</strong>
                    </p>
                    <p className="text-zinc-400">
                      ETA:{" "}
                      <strong className="text-emerald-400">{unit.eta}</strong>
                      &ensp;Speed:{" "}
                      <strong className="text-zinc-100">{unit.speed}</strong>
                    </p>
                    <p className="text-zinc-500">Driver: {unit.driver}</p>
                  </div>
                </div>
              </Popup>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
