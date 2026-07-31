"use client";

/**
 * components/map/ambulance-markers.tsx
 *
 * Renders MapLibre GL Marker + Popup elements for ambulance units.
 *
 * Selection state is owned by the Zustand map store and passed down as props
 * so the component remains a pure renderer — it never reads the store directly.
 * This keeps unit testing and Storybook isolation simple.
 *
 * Phase 4 – Supabase Realtime:
 *   Subscribe to ambulance position updates in the parent (MapView).
 *   Pass the live array as `ambulances` — no changes needed here.
 */

import React from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import { Ambulance } from "lucide-react";
import { AmbulanceUnit } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─── Status styling ───────────────────────────────────────────────────────────

const STATUS_CHIP: Record<AmbulanceUnit["status"], string> = {
  en_route: "bg-blue-600  border-blue-300  ring-blue-400/40",
  at_scene: "bg-emerald-600 border-emerald-300 ring-emerald-400/40",
  available: "bg-zinc-700  border-zinc-500  ring-zinc-400/20",
  returning: "bg-indigo-600 border-indigo-300 ring-indigo-400/40",
};

const STATUS_PULSE: Record<AmbulanceUnit["status"], string> = {
  en_route: "bg-blue-500",
  at_scene: "bg-emerald-500",
  available: "bg-zinc-500",
  returning: "bg-indigo-500",
};

const STATUS_BADGE: Record<AmbulanceUnit["status"], string> = {
  en_route: "bg-blue-950 text-blue-300",
  at_scene: "bg-emerald-950 text-emerald-300",
  available: "bg-zinc-800 text-zinc-400",
  returning: "bg-indigo-950 text-indigo-300",
};

const STATUS_LABEL: Record<AmbulanceUnit["status"], string> = {
  en_route: "En Route",
  at_scene: "At Scene",
  available: "Available",
  returning: "Returning",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AmbulanceMarkersProps {
  /** Ambulance units to render — sourced from constants or Supabase in Phase 4 */
  ambulances: AmbulanceUnit[];
  /** ID of the currently selected unit from the store (null = none selected) */
  selectedId: string | null;
  /** Called when the user clicks a marker — dispatches to the store in the parent */
  onSelect: (id: string | null) => void;
  /** Whether this layer is visible */
  visible: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AmbulanceMarkers({
  ambulances,
  selectedId,
  onSelect,
  visible,
}: AmbulanceMarkersProps) {
  if (!visible) return null;

  return (
    <>
      {ambulances.map((unit) => {
        const [longitude, latitude] = unit.coordinates;
        const isSelected = selectedId === unit.id;

        return (
          <React.Fragment key={unit.id}>
            {/* ── Pin marker ── */}
            <Marker
              longitude={longitude}
              latitude={latitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelect(isSelected ? null : unit.id);
              }}
            >
              <div className="relative cursor-pointer group">
                {/* Pulse ring */}
                <span
                  className={cn(
                    "absolute inset-0 -m-1 rounded-full opacity-40 animate-ping",
                    STATUS_PULSE[unit.status]
                  )}
                />

                {/* Chip */}
                <div
                  className={cn(
                    "relative flex items-center gap-1 px-2 py-1 rounded-full border-2 ring-2 text-white text-[11px] font-mono font-bold shadow-xl transition-transform duration-150",
                    STATUS_CHIP[unit.status],
                    isSelected ? "scale-115 ring-4" : "hover:scale-105"
                  )}
                >
                  <Ambulance className="h-3.5 w-3.5 shrink-0" />
                  <span>{unit.callsign}</span>
                </div>
              </div>
            </Marker>

            {/* ── Popup (visible when selected) ── */}
            {isSelected && (
              <Popup
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
                offset={20}
                closeButton={false}
                onClose={() => onSelect(null)}
              >
                <div className="min-w-[180px] rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 text-xs font-mono text-zinc-200 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
                    <span className="font-bold text-blue-400">{unit.callsign} Telemetry</span>
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold", STATUS_BADGE[unit.status])}>
                      {STATUS_LABEL[unit.status]}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <p className="text-zinc-400">
                      Hospital: <strong className="text-zinc-100">{unit.hospitalTarget}</strong>
                    </p>
                    <p className="text-zinc-400">
                      ETA: <strong className="text-emerald-400">{unit.eta}</strong>
                      &ensp;Speed: <strong className="text-zinc-100">{unit.speed}</strong>
                    </p>
                    <p className="text-zinc-500 truncate">Driver: {unit.driver}</p>
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
