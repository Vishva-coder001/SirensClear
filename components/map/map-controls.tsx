"use client";

/**
 * components/map/map-controls.tsx
 *
 * Overlay control panel rendered on top of the MapLibre canvas.
 * Handles layer visibility toggles and the map legend.
 *
 * Props are intentionally separated from rendering so each layer
 * component can remain independent and data-agnostic.
 */

import React from "react";
import { Ambulance, Flame, Navigation, MapPin } from "lucide-react";
import { MapLayerVisibility } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  /** Current visibility state for each overlay layer */
  visibility: MapLayerVisibility;
  /** Callback to toggle a single layer on/off */
  onToggle: (layer: keyof MapLayerVisibility) => void;
  /** Total ambulance unit count for badge display */
  ambulanceCount: number;
  /** Total hazard count for badge display */
  hazardCount: number;
}

export function MapControls({
  visibility,
  onToggle,
  ambulanceCount,
  hazardCount,
}: MapControlsProps) {
  const controls: {
    key: keyof MapLayerVisibility;
    label: string;
    icon: React.ElementType;
    count?: number;
    activeClass: string;
  }[] = [
    {
      key: "ambulances",
      label: "Ambulances",
      icon: Ambulance,
      count: ambulanceCount,
      activeClass: "bg-blue-950/90 border-blue-500/50 text-blue-300",
    },
    {
      key: "hazards",
      label: "Hazards",
      icon: Flame,
      count: hazardCount,
      activeClass: "bg-amber-950/90 border-amber-500/50 text-amber-300",
    },
    {
      key: "route",
      label: "Optimised Route",
      icon: Navigation,
      activeClass: "bg-cyan-950/90 border-cyan-500/50 text-cyan-300",
    },
  ];

  return (
    <>
      {/* ── Layer Toggle Bar (top-left) ── */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-sm pointer-events-none">
        {controls.map(({ key, label, icon: Icon, count, activeClass }) => (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={cn(
              "pointer-events-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 shadow-lg backdrop-blur-md",
              visibility[key]
                ? activeClass
                : "bg-zinc-900/80 border-zinc-800 text-zinc-500 line-through opacity-60"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>
              {label}
              {count !== undefined && ` (${count})`}
            </span>
          </button>
        ))}
      </div>

      {/* ── Legend (bottom-left) ── */}
      <div className="absolute bottom-8 left-3 z-10 hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-950/90 border border-zinc-800/90 text-[11px] font-mono text-zinc-400 backdrop-blur-md pointer-events-none">
        <span className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
          Active Unit
        </span>
        <span className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
          Critical Hazard
        </span>
        <span className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" />
          Neural Route
        </span>
      </div>

      {/* ── GL Badge (bottom-right) ── */}
      <div className="absolute bottom-8 right-3 z-10 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-[11px] font-mono text-blue-300 shadow-xl backdrop-blur-md pointer-events-none">
        <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
        <span>MapLibre GL JS · OSM Tiles</span>
      </div>
    </>
  );
}
