"use client";

/**
 * components/map/hazard-markers.tsx
 *
 * Renders MapLibre GL Marker + Popup elements for road hazards.
 *
 * Selection state is owned by the Zustand map store and passed down as props
 * (selectedId, onSelect) — this component never reads the store directly.
 *
 * Phase 4 – Supabase Realtime:
 *   Subscribe to hazard updates in the parent (MapView) and pass the live
 *   array as `hazards` — no changes needed here.
 */

import React from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import { Flame, AlertTriangle } from "lucide-react";
import { HazardItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─── Severity styling ─────────────────────────────────────────────────────────

const SEVERITY_RING: Record<HazardItem["severity"], string> = {
  critical: "bg-red-600  border-red-400  ring-red-500/40",
  high:     "bg-amber-600 border-amber-400 ring-amber-500/40",
  moderate: "bg-yellow-700 border-yellow-500 ring-yellow-500/20",
  low:      "bg-zinc-700  border-zinc-500  ring-zinc-400/10",
};

const SEVERITY_PULSE: Record<HazardItem["severity"], string> = {
  critical: "animate-ping  bg-red-500",
  high:     "animate-pulse bg-amber-500/60",
  moderate: "animate-pulse bg-yellow-600/40",
  low:      "bg-transparent",
};

const SEVERITY_TITLE: Record<HazardItem["severity"], string> = {
  critical: "text-red-400",
  high:     "text-amber-400",
  moderate: "text-yellow-400",
  low:      "text-zinc-300",
};

const VERIFICATION_BADGE: Record<HazardItem["verificationStatus"], string> = {
  verified:   "bg-emerald-950 text-emerald-300",
  unverified: "bg-red-950    text-red-300",
  pending:    "bg-amber-950  text-amber-300",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface HazardMarkersProps {
  /** Hazard items to render — sourced from constants or Supabase in Phase 4 */
  hazards: HazardItem[];
  /** ID of the currently selected hazard from the store (null = none selected) */
  selectedId: string | null;
  /** Called when the user clicks a marker — dispatches to the store in the parent */
  onSelect: (id: string | null) => void;
  /** Whether this layer is visible */
  visible: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HazardMarkers({
  hazards,
  selectedId,
  onSelect,
  visible,
}: HazardMarkersProps) {
  if (!visible) return null;

  return (
    <>
      {hazards.map((hazard) => {
        const [longitude, latitude] = hazard.coordinates;
        const isSelected = selectedId === hazard.id;
        const isCritical = hazard.severity === "critical";

        return (
          <React.Fragment key={hazard.id}>
            {/* ── Pin marker ── */}
            <Marker
              longitude={longitude}
              latitude={latitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelect(isSelected ? null : hazard.id);
              }}
            >
              <div className="relative cursor-pointer group">
                {/* Pulse ring */}
                <span
                  className={cn(
                    "absolute inset-0 -m-1 rounded-full opacity-55",
                    SEVERITY_PULSE[hazard.severity]
                  )}
                />

                {/* Icon badge */}
                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full border-2 ring-2 text-white shadow-xl transition-transform duration-150",
                    SEVERITY_RING[hazard.severity],
                    isSelected ? "scale-125 ring-4" : "hover:scale-110"
                  )}
                >
                  {isCritical
                    ? <Flame className="h-4 w-4 shrink-0" />
                    : <AlertTriangle className="h-4 w-4 shrink-0" />
                  }
                </div>
              </div>
            </Marker>

            {/* ── Popup (visible when selected) ── */}
            {isSelected && (
              <Popup
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
                offset={24}
                closeButton={false}
                onClose={() => onSelect(null)}
              >
                <div className="min-w-[220px] max-w-[260px] rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 text-xs font-mono shadow-2xl">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-1.5 mb-1.5">
                    <p className={cn("font-bold leading-snug", SEVERITY_TITLE[hazard.severity])}>
                      ⚠ {hazard.title}
                    </p>
                    <span className="capitalize px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] shrink-0 font-semibold">
                      {hazard.severity}
                    </span>
                  </div>

                  {/* Data rows */}
                  <div className="space-y-1 text-[11px]">
                    <p className="text-zinc-400">
                      Location: <strong className="text-zinc-100">{hazard.location}</strong>
                    </p>
                    <p className="text-zinc-400">
                      Reported: <strong className="text-zinc-100">{hazard.timestamp}</strong>
                    </p>
                    <p className="text-zinc-400 leading-relaxed">{hazard.description}</p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize", VERIFICATION_BADGE[hazard.verificationStatus])}>
                        {hazard.verificationStatus}
                      </span>
                      <span className="text-zinc-500 truncate">{hazard.verificationSource}</span>
                    </div>
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
