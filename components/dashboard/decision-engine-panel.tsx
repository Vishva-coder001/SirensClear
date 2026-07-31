"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  Flame,
  Navigation,
  Timer,
  Building2,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { DECISION_ENGINE_DATA } from "@/lib/constants";

export function DecisionEnginePanel() {
  const [applied, setApplied] = useState(false);

  const handleApplyRoute = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

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
              Real-time Neural Hazard & Hospital Routing Model
            </p>
          </div>
        </div>

        <Badge variant="cyan" className="font-mono text-[10px] uppercase px-2 py-0.5">
          <Zap className="h-3 w-3 mr-1 text-cyan-400" />
          Neural v3.1
        </Badge>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Main Grid displaying the 5 required parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Detected Hazard */}
          <div className="p-3 rounded-lg border border-red-900/40 bg-red-950/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-red-400 font-semibold">
              <Flame className="h-3.5 w-3.5 shrink-0" />
              <span>Detected Hazard</span>
            </div>
            <p className="text-xs font-medium text-zinc-100 font-mono truncate">
              {DECISION_ENGINE_DATA.detectedHazard}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">
              Market St & 4th Ave • Critical
            </span>
          </div>

          {/* 2. Suggested Route */}
          <div className="p-3 rounded-lg border border-cyan-900/40 bg-cyan-950/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-semibold">
              <Navigation className="h-3.5 w-3.5 shrink-0" />
              <span>Suggested Route</span>
            </div>
            <p className="text-xs font-medium text-zinc-100 font-mono truncate">
              {DECISION_ENGINE_DATA.suggestedRoute}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">
              Bypasses 18% heavy traffic
            </span>
          </div>

          {/* 3. Estimated Time Saved */}
          <div className="p-3 rounded-lg border border-emerald-900/40 bg-emerald-950/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold">
              <Timer className="h-3.5 w-3.5 shrink-0" />
              <span>Estimated Time Saved</span>
            </div>
            <p className="text-xs font-medium text-emerald-300 font-mono font-bold truncate">
              {DECISION_ENGINE_DATA.estimatedTimeSaved}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">
              Avg ETA cut to 4.2 min
            </span>
          </div>

          {/* 4. Confidence Score */}
          <div className="p-3 rounded-lg border border-purple-900/40 bg-purple-950/20 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 font-semibold">
                <Percent className="h-3.5 w-3.5 shrink-0" />
                <span>Confidence Score</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-purple-300">
                {DECISION_ENGINE_DATA.confidenceScore}%
              </span>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                style={{ width: `${DECISION_ENGINE_DATA.confidenceScore}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 block font-mono">
              High Confidence Rating
            </span>
          </div>

          {/* 5. Recommended Hospital */}
          <div className="p-3 rounded-lg border border-blue-900/40 bg-blue-950/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-blue-400 font-semibold">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>Recommended Hospital</span>
            </div>
            <p className="text-xs font-medium text-zinc-100 font-mono truncate">
              {DECISION_ENGINE_DATA.recommendedHospital}
            </p>
            <span className="text-[10px] text-zinc-400 block font-mono">
              Capacity: 4 Trauma Beds Free
            </span>
          </div>
        </div>

        {/* Action Row with Apply Route Button */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Optimal vector calculated 12s ago by OSRM matrix</span>
          </div>

          <Button
            onClick={handleApplyRoute}
            variant="emerald"
            size="sm"
            className="font-mono text-xs font-bold uppercase tracking-wider"
          >
            {applied ? (
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Route Applied to Active Units!
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
