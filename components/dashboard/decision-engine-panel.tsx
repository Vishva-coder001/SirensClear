"use client";

/**
 * components/dashboard/decision-engine-panel.tsx
 *
 * Store integration (Phase 3):
 *   - Reads `selectedHazardId` from the Zustand map store.
 *   - When a hazard is selected, derives dynamic data from HAZARDS_LIST.
 *   - Falls back to DECISION_ENGINE_DATA defaults when no hazard is selected.
 */

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu, Flame, Navigation, Timer, Building2,
  Zap, CheckCircle2, ShieldCheck, Percent,
} from "lucide-react";
import { DECISION_ENGINE_DATA, HAZARDS_LIST } from "@/lib/constants";
import { useMapStore } from "@/lib/store/map-store";

// ─── Per-severity confidence scores ──────────────────────────────────────────

const SEVERITY_CONFIDENCE: Record<string, number> = {
  critical: 96.4,
  high:     89.7,
  moderate: 81.2,
  low:      72.0,
};

// ─── Suggested route fragments per hazard (deterministic mock) ────────────────

const SUGGESTED_ROUTES: Record<string, string> = {
  "hz-101": "Reroute AMB-22 via HITEC City → Kondapur → Banjara Hills bypass",
  "hz-102": "Reroute via Lakdi Ka Pul underpass → MJ Road alternate",
  "hz-103": "Use SR Nagar flyover → Punjagutta alternate eastbound",
  "hz-104": "Switch to Nanakramguda Road → ORR inner corridor",
  "hz-105": "Deploy via Madhapur link road, avoid HITEC main intersection",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DecisionEnginePanel() {
  const { selectedHazardId } = useMapStore();
  const [applied, setApplied] = useState(false);

  // Derive display data: live from selected hazard or fall back to defaults
  const selectedHazard = selectedHazardId
    ? HAZARDS_LIST.find((h) => h.id === selectedHazardId) ?? null
    : null;

  const engineData = selectedHazard
    ? {
        detectedHazard:    `${selectedHazard.title}`,
        detectedLocation:  selectedHazard.location,
        suggestedRoute:    SUGGESTED_ROUTES[selectedHazard.id] ?? DECISION_ENGINE_DATA.suggestedRoute,
        estimatedTimeSaved: DECISION_ENGINE_DATA.estimatedTimeSaved,
        confidenceScore:   SEVERITY_CONFIDENCE[selectedHazard.severity] ?? DECISION_ENGINE_DATA.confidenceScore,
        recommendedHospital: DECISION_ENGINE_DATA.recommendedHospital,
        lastUpdated:       "Just now — triggered by hazard selection",
      }
    : {
        detectedHazard:    DECISION_ENGINE_DATA.detectedHazard,
        detectedLocation:  "Banjara Hills Rd No. 12 & Jubilee Hills",
        suggestedRoute:    DECISION_ENGINE_DATA.suggestedRoute,
        estimatedTimeSaved: DECISION_ENGINE_DATA.estimatedTimeSaved,
        confidenceScore:   DECISION_ENGINE_DATA.confidenceScore,
        recommendedHospital: DECISION_ENGINE_DATA.recommendedHospital,
        lastUpdated:       DECISION_ENGINE_DATA.lastUpdated,
      };

  const handleApplyRoute = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  const isLive = Boolean(selectedHazard);

  return (
    <Card className="glass-card border-blue-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 shadow-xl overflow-hidden">
      <CardHeader className="p-4 border-b border-zinc-800/80 bg-zinc-900/70 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 border border-blue-500/40 text-blue-400">
            <Cpu className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-zinc-100 font-mono tracking-tight">
              Decision Engine
            </CardTitle>
            <p className="text-[11px] text-zinc-400 font-mono">
              {isLive
                ? `Analysing hazard: ${selectedHazard?.title.slice(0, 40)}…`
                : "Real-time Neural Hazard & Hospital Routing Model"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLive && (
            <Badge variant="high" className="font-mono text-[10px] uppercase px-2 py-0.5 animate-pulse">
              Live Analysis
            </Badge>
          )}
          <Badge variant="cyan" className="font-mono text-[10px] uppercase px-2 py-0.5">
            <Zap className="h-3 w-3 mr-1 text-cyan-400" />
            Neural v3.1
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* 5-column data grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">

          {/* 1. Detected Hazard */}
          <div className="p-3 rounded-lg border border-red-900/40 bg-red-950/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-red-400 font-semibold">
              <Flame className="h-3.5 w-3.5 shrink-0" />
              <span>Detected Hazard</span>
            </div>
            <p className="text-xs font-medium text-zinc-100 font-mono leading-snug">
              {engineData.detectedHazard}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono truncate">
              {engineData.detectedLocation}
            </span>
          </div>

          {/* 2. Suggested Route */}
          <div className="p-3 rounded-lg border border-cyan-900/40 bg-cyan-950/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-semibold">
              <Navigation className="h-3.5 w-3.5 shrink-0" />
              <span>Suggested Route</span>
            </div>
            <p className="text-xs font-medium text-zinc-100 font-mono leading-snug line-clamp-2">
              {engineData.suggestedRoute}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">Bypass congestion corridor</span>
          </div>

          {/* 3. Estimated Time Saved */}
          <div className="p-3 rounded-lg border border-emerald-900/40 bg-emerald-950/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold">
              <Timer className="h-3.5 w-3.5 shrink-0" />
              <span>Est. Time Saved</span>
            </div>
            <p className="text-xs font-bold text-emerald-300 font-mono">
              {engineData.estimatedTimeSaved}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">Avg ETA cut to 4.2 min</span>
          </div>

          {/* 4. Confidence Score */}
          <div className="p-3 rounded-lg border border-purple-900/40 bg-purple-950/20 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 font-semibold">
                <Percent className="h-3.5 w-3.5 shrink-0" />
                <span>Confidence</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-purple-300">
                {engineData.confidenceScore}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${engineData.confidenceScore}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 block font-mono">
              {engineData.confidenceScore >= 90 ? "High" : engineData.confidenceScore >= 75 ? "Medium" : "Low"} confidence rating
            </span>
          </div>

          {/* 5. Recommended Hospital */}
          <div className="p-3 rounded-lg border border-blue-900/40 bg-blue-950/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-blue-400 font-semibold">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>Rec. Hospital</span>
            </div>
            <p className="text-xs font-medium text-zinc-100 font-mono leading-snug">
              {engineData.recommendedHospital}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">4 Trauma Beds Free</span>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              {isLive
                ? `Vector recalculated · ${engineData.lastUpdated}`
                : `Optimal vector calculated ${engineData.lastUpdated} by OSRM`}
            </span>
          </div>

          <Button
            onClick={handleApplyRoute}
            variant="emerald"
            size="sm"
            className="font-mono text-xs font-bold uppercase tracking-wider shrink-0 ml-3"
          >
            {applied ? (
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Route Applied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Apply Route
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
