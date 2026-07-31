"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { AIDispatchRecommendation, AIHazard } from "@/types/ai";
import { DispatchService } from "@/services/DispatchService";
import { HospitalService } from "@/services/HospitalService";
import { MOCK_HAZARDS } from "@/lib/mock-ai-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
  Loader2,
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
  const [recommendation, setRecommendation] = useState<AIDispatchRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  const hazard = useMemo(() => {
    if (selectedHazard) return selectedHazard;
    return MOCK_HAZARDS.find((h) => h.id === selectedHazardId) || MOCK_HAZARDS[0];
  }, [selectedHazard, selectedHazardId]);

  const loadDispatch = useCallback(async () => {
    setIsLoading(true);
    const res = await DispatchService.getDispatchByHazardId(hazard.id);
    if (res.data) {
      setRecommendation(res.data);
    }
    setIsLoading(false);
  }, [hazard.id]);

  useEffect(() => {
    loadDispatch();
  }, [loadDispatch]);

  // Subscribe to Realtime Dispatches
  useEffect(() => {
    const unsubscribe = DispatchService.subscribeToDispatches(
      (newDispatch) => {
        if (newDispatch.hazardId === hazard.id) {
          setRecommendation(newDispatch);
        }
      },
      (updatedDispatch) => {
        if (updatedDispatch.hazardId === hazard.id) {
          setRecommendation(updatedDispatch);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [hazard.id]);

  // Dynamic alternate units for reassigning
  const alternateUnits = useMemo(() => {
    const baseUnit = recommendation?.recommendedAmbulance || "ALS Response Unit A04";
    const baseDist = recommendation?.distanceKm || 1.8;
    const baseEta = recommendation?.etaMinutes || 3.2;

    return [
      {
        unitId: "AMB-A04",
        unitName: baseUnit,
        distanceKm: baseDist,
        etaMinutes: baseEta,
        hospital: recommendation?.recommendedHospital || "AIG Hospitals Gachibowli",
        reasoning: recommendation?.reasoning || "Closest available ALS unit with green corridor clearance.",
      },
      {
        unitId: "AMB-A08",
        unitName: "ALS Response Unit A08",
        distanceKm: Number((baseDist + 0.9).toFixed(1)),
        etaMinutes: Number((baseEta + 1.4).toFixed(1)),
        hospital: "Continental Hospitals Nanakramguda",
        reasoning: "Alternative Unit A08 routed via Outer Ring Road service link bypassing financial district queue.",
      },
      {
        unitId: "AMB-T04",
        unitName: "Trauma Specialist Unit T04",
        distanceKm: Number((baseDist + 1.3).toFixed(1)),
        etaMinutes: Number((baseEta + 2.0).toFixed(1)),
        hospital: "Medicover Emergency Hub Hitec",
        reasoning: "Trauma Unit T04 selected for heavy hydraulic extrication gear availability.",
      },
    ];
  }, [recommendation]);

  const currentUnit = alternateUnits[activeUnitIndex % alternateUnits.length];

  const handleDispatch = async () => {
    if (!recommendation) return;
    setIsActionLoading(true);

    try {
      const dispatchRes = await DispatchService.dispatchUnit(recommendation.id);
      await HospitalService.reserveBed("HOSP-001");

      if (dispatchRes.data) {
        setRecommendation(dispatchRes.data);
        toast.success(`Unit ${currentUnit.unitName} Dispatched!`, {
          description: `Assigned to ${hazard.location} (ETA ${currentUnit.etaMinutes}m)`,
        });
      }
    } catch (err) {
      toast.error("Dispatch Failed", {
        description: err instanceof Error ? err.message : "Database request error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReassign = async () => {
    if (!recommendation) return;
    setIsActionLoading(true);

    try {
      const nextIndex = (activeUnitIndex + 1) % alternateUnits.length;
      setActiveUnitIndex(nextIndex);
      const nextUnit = alternateUnits[nextIndex];

      const reassignRes = await DispatchService.reassignUnit(
        recommendation.id,
        nextUnit.unitId,
        nextUnit.reasoning
      );

      if (reassignRes.data) {
        setRecommendation(reassignRes.data);
        toast.info(`Unit Reassigned to ${nextUnit.unitName}`, {
          description: "Recalculated OSRM route & hospital beds.",
        });
      }
    } catch (err) {
      toast.error("Reassign Failed", {
        description: err instanceof Error ? err.message : "Database request error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

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
        {isLoading ? (
          <div className="p-12 text-center text-zinc-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            <span>Loading dispatch recommendation...</span>
          </div>
        ) : (
          <>
            {/* Status Notification banner if dispatched */}
            <AnimatePresence>
              {recommendation?.status === "Dispatched" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-bounce" />
                    <span>Unit {currentUnit.unitName} DISPATCHED to {hazard.location}! Signal lock established.</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-900 border-emerald-600 text-emerald-200">
                    Active En Route
                  </Badge>
                </motion.div>
              )}

              {recommendation?.status === "Reassigned" && (
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
                <p className="font-bold text-zinc-100 text-sm truncate">{currentUnit.unitName}</p>
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
                  {recommendation?.confidenceScore || 97.4}% Confidence
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
                disabled={isActionLoading || recommendation?.status === "Dispatched"}
                className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider h-11 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-950 mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                <span>{recommendation?.status === "Dispatched" ? "Unit Dispatched & En Route" : "Dispatch Recommended Unit"}</span>
              </Button>

              <Button
                onClick={handleReassign}
                disabled={isActionLoading}
                variant="outline"
                className="w-full sm:w-auto bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 font-mono text-xs h-11 px-5"
              >
                <RefreshCw className="h-4 w-4 mr-2 text-cyan-400" />
                <span>Reassign Unit</span>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
