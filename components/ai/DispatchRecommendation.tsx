"use client";

import React, { useState, useMemo } from "react";
import { AIDispatchRecommendation, AIHazard } from "@/types/ai";
import { MOCK_DISPATCH_RECOMMENDATIONS, MOCK_HAZARDS } from "@/lib/mock-ai-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Siren,
  Navigation,
  Clock,
  Building2,
  Brain,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DispatchRecommendationProps {
  selectedHazardId?: string;
  selectedHazard?: AIHazard;
}

export function DispatchRecommendation({
  selectedHazardId = "HZ-801",
  selectedHazard,
}: DispatchRecommendationProps) {
  const [dispatchStatus, setDispatchStatus] = useState<"Pending" | "Dispatched" | "Reassigned">("Pending");
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  // Find recommendation corresponding to selected hazard or default
  const baseRecommendation: AIDispatchRecommendation = useMemo(() => {
    const found = MOCK_DISPATCH_RECOMMENDATIONS.find(
      (r) => r.hazardId === selectedHazardId
    );
    return found || MOCK_DISPATCH_RECOMMENDATIONS[0];
  }, [selectedHazardId]);

  const hazard = useMemo(() => {
    if (selectedHazard) return selectedHazard;
    return MOCK_HAZARDS.find((h) => h.id === selectedHazardId) || MOCK_HAZARDS[0];
  }, [selectedHazard, selectedHazardId]);

  // Handle reassigning to alternate ambulance unit
  const handleReassign = () => {
    setDispatchStatus("Reassigned");
    setActiveUnitIndex((prev) => (prev + 1) % 3);
  };

  const handleDispatch = () => {
    setDispatchStatus("Dispatched");
  };

  // Dynamically compute alternate units if reassigned
  const alternateUnits = [
    {
      unit: baseRecommendation.recommendedAmbulance,
      distanceKm: baseRecommendation.distanceKm,
      etaMinutes: baseRecommendation.etaMinutes,
      hospital: baseRecommendation.recommendedHospital,
      reasoning: baseRecommendation.reasoning,
    },
    {
      unit: "ALS Response Unit A08",
      distanceKm: baseRecommendation.distanceKm + 0.9,
      etaMinutes: baseRecommendation.etaMinutes + 1.4,
      hospital: "Continental Hospitals Nanakramguda",
      reasoning: "Alternative Unit A08 routed via Outer Ring Road service link bypassing financial district intersection queue.",
    },
    {
      unit: "Trauma Specialist Unit T04",
      distanceKm: baseRecommendation.distanceKm + 1.3,
      etaMinutes: baseRecommendation.etaMinutes + 2.0,
      hospital: "Medicover Emergency Hub Hitec",
      reasoning: "Trauma Unit T04 selected for heavy extrication gear availability.",
    },
  ];

  const currentUnit = alternateUnits[activeUnitIndex % alternateUnits.length];

  return (
    <Card className="glass-card border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden relative">
      {/* Top Ambient Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

      <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
              <span>AI Dispatch Recommendation</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-blue-950 text-blue-400 border border-blue-500/30">
                {hazard.id}
              </span>
            </CardTitle>
            <p className="text-xs text-zinc-400 font-mono">
              Optimal emergency responder routing engine with traffic & ICU occupancy analysis
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-[11px] bg-blue-950/80 text-blue-300 border-blue-500/40 hidden sm:flex gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Optimal Route Match</span>
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Status Notification banner if dispatched */}
        <AnimatePresence>
          {dispatchStatus === "Dispatched" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-bounce" />
                <span>Unit {currentUnit.unit} DISPATCHED to {hazard.location}! Signal lock established.</span>
              </div>
              <Badge variant="outline" className="bg-emerald-900 border-emerald-600 text-emerald-200">
                Active En Route
              </Badge>
            </motion.div>
          )}

          {dispatchStatus === "Reassigned" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-lg bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-mono text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" />
                <span>Unit Reassigned! Recalculated matrix parameters.</span>
              </div>
              <Badge variant="outline" className="bg-cyan-900 border-cyan-600 text-cyan-200">
                Recalculated
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Dispatch Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          {/* Recommended Unit */}
          <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
              <Siren className="h-3 w-3 text-blue-400" /> Recommended Ambulance
            </span>
            <p className="font-bold text-zinc-100 text-sm truncate">{currentUnit.unit}</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Unit Ready & Staged
            </p>
          </div>

          {/* Distance */}
          <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
              <Navigation className="h-3 w-3 text-cyan-400" /> Distance
            </span>
            <p className="font-bold text-zinc-100 text-sm">{currentUnit.distanceKm} km</p>
            <p className="text-[10px] text-zinc-400">Direct Arterial Route</p>
          </div>

          {/* ETA */}
          <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-400" /> Golden Hour ETA
            </span>
            <p className="font-bold text-emerald-400 text-sm">{currentUnit.etaMinutes} mins</p>
            <p className="text-[10px] text-zinc-400">Traffic Density: Low</p>
          </div>

          {/* Target Hospital */}
          <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
              <Building2 className="h-3 w-3 text-purple-400" /> Destination Hospital
            </span>
            <p className="font-bold text-zinc-100 text-xs truncate" title={currentUnit.hospital}>
              {currentUnit.hospital}
            </p>
            <p className="text-[10px] text-emerald-400">ICU Capacity: Available</p>
          </div>
        </div>

        {/* AI Explanation & Reasoning Box */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-200 uppercase tracking-wider">
                AI Decision Reasoning Engine
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              {baseRecommendation.confidenceScore}% Confidence
            </span>
          </div>

          <p className="text-xs font-mono text-zinc-300 leading-relaxed italic">
            &ldquo;{currentUnit.reasoning}&rdquo;
          </p>
        </div>

        {/* Dispatch Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            onClick={handleDispatch}
            disabled={dispatchStatus === "Dispatched"}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider h-11 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
          >
            <Send className="h-4 w-4 mr-2" />
            <span>{dispatchStatus === "Dispatched" ? "Unit Dispatched & En Route" : "Dispatch Recommended Unit"}</span>
          </Button>

          <Button
            onClick={handleReassign}
            variant="outline"
            className="w-full sm:w-auto bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 font-mono text-xs h-11 px-5"
          >
            <RefreshCw className="h-4 w-4 mr-2 text-cyan-400" />
            <span>Reassign Unit</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
