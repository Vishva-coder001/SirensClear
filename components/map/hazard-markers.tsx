"use client";

/**
 * components/map/hazard-markers.tsx
 *
 * Renders MapLibre GL Marker elements for road hazards on the live map.
 *
 * Data contract:
 *   - Receives a typed `hazards` array from the parent MapView.
 *   - Coordinates are [longitude, latitude] tuples (MapLibre convention).
 *
 * Future integration:
 *   - Replace the static `hazards` prop with a Supabase Realtime subscription
 *     in the parent component; the marker rendering here requires no changes.
 */

import React, { useState } from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import { Flame, AlertTriangle } from "lucide-react";
import { HazardItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Visual mapping per severity level */
const SEVERITY_STYLES: Record<HazardItem["severity"], string> = {
  critical: "bg-red-600 border-red-400 ring-red-500/40",
  high: "bg-amber-600 border-amber-400 ring-amber-500/40",
  moderate: "bg-yellow-700 border-yellow-500 ring-yellow-500/20",
  low: "bg-zinc-700 border-zinc-500 ring-zinc-400/10",
};

const SEVERITY_POPUP_HEADER: Record<HazardItem["severity"], string> = {
  critical: "text-red-400",
  high: "text-amber-400",
  moderate: "text-yellow-400",
  low: "text-zinc-300",
};

const VERIFICATION_BADGE: Record<HazardItem["verificationStatus"], string> = {
  verified: "bg-emerald-950 text-emerald-300",
  unverified: "bg-red-950 text-red-300",
  pending: "bg-amber-950 text-amber-300",
};

interface HazardMarkersProps {
  /**
   * Array of hazard items to render.
   * Sourced from HAZARDS_LIST in lib/constants.ts.
   * Will be replaced by Supabase Realtime data in Phase 3.
   */
  hazards: HazardItem[];
  /** Whether this layer is currently visible */
  visible: boolean;
}

export function HazardMarkers({ hazards, visible }: HazardMarkersProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!visible) return null;

  return (
    <>
      {hazards.map((hazard) => {
        const [longitude, latitude] = hazard.coordinates;
        const isSelected = selectedId === hazard.id;
        const isCritical = hazard.severity === "critical";

        return (
          <React.Fragment key={hazard.id}>
            {/* ── Pin Marker ── */}
            <Marker
              longitude={longitude}
              latitude={latitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedId(isSelected ? null : hazard.id);
              }}
            >
              <div className="relative cursor-pointer group">
                {/* Pulse ring – critical hazards pulse faster */}
                <span
                  className={cn(
                    "absolute inset-0 rounded-full opacity-50",
                    isCritical ? "animate-ping bg-red-500" : "animate-pulse bg-amber-500/50"
                  )}
                />

                {/* Icon badge */}
                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full border-2 ring-2 text-white shadow-xl transition-transform duration-150",
                    SEVERITY_STYLES[hazard.severity],
                    isSelected ? "scale-125" : "hover:scale-110"
                  )}
                >
                  {isCritical ? (
                    <Flame className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                  )}
                </div>
              </div>
            </Marker>

            {/* ── Popup on selection ── */}
            {isSelected && (
              <Popup
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
                offset={24}
                closeButton={false}
                onClose={() => setSelectedId(null)}
                className="sc-popup"
              >
                <div className="min-w-[220px] max-w-[260px] rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 text-xs font-mono text-zinc-200 shadow-2xl">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-1.5 mb-1.5">
                    <p
                      className={cn(
                        "font-bold leading-snug",
                        SEVERITY_POPUP_HEADER[hazard.severity]
                      )}
                    >
                      ⚠ {hazard.title}
                    </p>
                    <span className="capitalize px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] shrink-0 font-semibold">
                      {hazard.severity}
                    </span>
                  </div>

                  {/* Data rows */}
                  <div className="space-y-1 text-[11px]">
                    <p className="text-zinc-400">
                      Location:{" "}
                      <strong className="text-zinc-100">{hazard.location}</strong>
                    </p>
                    <p className="text-zinc-400">
                      Reported: <strong className="text-zinc-100">{hazard.timestamp}</strong>
                    </p>
                    <p className="text-zinc-400 leading-relaxed">{hazard.description}</p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize",
                          VERIFICATION_BADGE[hazard.verificationStatus]
                        )}
                      >
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
