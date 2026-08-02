"use client";

/**
 * components/dashboard/map-placeholder.tsx
 *
 * Dark card shell that hosts the real MapLibre GL <MapView> component.
 * The card frame, header, and badge row are preserved from Phase 1.
 *
 * Data flow:
 *   - Ambulances & hazards come from lib/constants.ts (swap for Supabase in Phase 4).
 *   - Active route, layer visibility, and selection state live in the Zustand store
 *     (lib/store/map-store.ts) — MapView reads them directly.
 */

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Radio } from "lucide-react";
import MapView from "@/components/map/map-view";
import { MOCK_AMBULANCE_UNITS, HAZARDS_LIST } from "@/lib/constants";

export function MapPlaceholder() {
  return (
    <Card className="glass-card relative overflow-hidden border-blue-500/30 bg-zinc-950 flex flex-col h-[520px] lg:h-[620px] shadow-[0_0_35px_rgba(0,0,0,0.8)]">

      {/* ── Card header (unchanged layout) ── */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 py-3 px-4 sm:px-5 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-400">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-zinc-100 font-mono tracking-tight">
              Live City Map – MapLibre GL JS
            </CardTitle>
            <p className="text-[11px] text-zinc-400 font-mono">
              Hyderabad Urban Grid · OSM Tiles · Interactive Routing Matrix
            </p>
          </div>
        </div>

        <Badge variant="cyan" className="hidden sm:inline-flex text-[10px] font-mono uppercase px-2 py-0.5">
          <Radio className="h-3 w-3 mr-1 animate-pulse text-cyan-400" />
          GL Telemetry Active
        </Badge>
      </CardHeader>

      {/* ── Map canvas ── */}
      <CardContent className="relative flex-1 p-0 overflow-hidden">
        <MapView
          ambulances={MOCK_AMBULANCE_UNITS}
          hazards={HAZARDS_LIST}
          className="h-full w-full"
        />
      </CardContent>
    </Card>
  );
}
