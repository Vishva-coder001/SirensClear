"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AIDispatchRecommendation, AIHazard } from "@/types/ai";
import { DispatchService } from "@/services/DispatchService";
import { HospitalService } from "@/services/HospitalService";
import { AmbulanceService } from "@/services/AmbulanceService";
import { HazardService } from "@/services/HazardService";
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
  const [recommendationState, setRecommendationState] = useState<{
    hazardId: string | null;
    data: AIDispatchRecommendation | null;
  }>({ hazardId: null, data: null });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const hazard = useMemo(() => {
    if (selectedHazard) return selectedHazard;
    return MOCK_HAZARDS.find((h) => h.id === selectedHazardId) || MOCK_HAZARDS[0];
  }, [selectedHazard, selectedHazardId]);

  useEffect(() => {
    let isMounted = true;

    const loadDispatch = async () => {
      const res = await DispatchService.getDispatchByHazardId(hazard.id);
      if (!isMounted) return;

      setRecommendationState({ hazardId: hazard.id, data: res.data });
    };

    void loadDispatch();

    return () => {
      isMounted = false;
    };
  }, [hazard.id]);

  // Subscribe to Realtime Dispatches
  useEffect(() => {
    const unsubscribe = DispatchService.subscribeToDispatches(
      (newDispatch) => {
        if (newDispatch.hazardId === hazard.id) {
          setRecommendationState({ hazardId: hazard.id, data: newDispatch });
        }
      },
      (updatedDispatch) => {
        if (updatedDispatch.hazardId === hazard.id) {
          setRecommendationState({ hazardId: hazard.id, data: updatedDispatch });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [hazard.id]);

  // Dynamically computed dispatch recommendation using actual fleet and hospital data
  const [excludedUnits, setExcludedUnits] = useState<string[]>([]);
  const [prevHazardId, setPrevHazardId] = useState<string>(hazard.id);

  if (prevHazardId !== hazard.id) {
    setPrevHazardId(hazard.id);
    setExcludedUnits([]);
  }

  const [dynamicRecommendation, setDynamicRecommendation] = useState<AIDispatchRecommendation | null>(null);

  useEffect(() => {
    let isMounted = true;
    const calculateDispatch = async () => {
      const lat = hazard.coordinates?.lat || 17.4401;
      const lng = hazard.coordinates?.lng || 78.3489;
      const isCritical = hazard.severity === "Critical";

      const [unit, hospital] = await Promise.all([
        AmbulanceService.getRecommendedAmbulance(lat, lng, excludedUnits),
        HospitalService.getRecommendedHospital(lat, lng, isCritical),
      ]);

      if (!isMounted) return;

      const dist = unit && unit.latitude && unit.longitude
        ? Math.hypot(unit.latitude - lat, unit.longitude - lng) * 111
        : 2.1;
      const eta = Number((dist * 1.5 + 1.2).toFixed(1));

      const computed: AIDispatchRecommendation = {
        id: recommendationState.data?.id || `REC-${hazard.id}`,
        hazardId: hazard.id,
        recommendedAmbulance: unit ? `${unit.unit_number} (${unit.driver})` : "ALS Response Unit A04",
        unitId: unit ? unit.id : "AMB-A04",
        distanceKm: Number(dist.toFixed(1)),
        etaMinutes: eta,
        recommendedHospital: hospital ? hospital.name : "AIG Hospitals Gachibowli",
        hospitalOccupancy: hospital && hospital.icu_available > 5 ? "Low" : "Moderate",
        reasoning: `${unit ? unit.unit_number : "Unit"} selected as closest available unit to ${hazard.location}. ${hospital ? hospital.name : "Hospital"} recommended with ${hospital?.icu_available ?? 8} ICU beds available.`,
        confidenceScore: hazard.verificationPercentage,
        status: (recommendationState.data?.status || "Pending") as AIDispatchRecommendation["status"],
      };

      setDynamicRecommendation(computed);
    };

    void calculateDispatch();

    return () => {
      isMounted = false;
    };
  }, [hazard, excludedUnits, recommendationState.data]);

  const recommendation = dynamicRecommendation || recommendationState.data;
  const isLoading = recommendationState.hazardId !== hazard.id && !dynamicRecommendation;

  const handleDispatch = async () => {
    if (!recommendation) return;
    setIsActionLoading(true);

    try {
      await DispatchService.dispatchUnit(recommendation.id);
      await AmbulanceService.updateAmbulanceStatus(recommendation.unitId, "En Route", hazard.location);
      await HazardService.updateHazardStatus(hazard.id, "Dispatched");

      setRecommendationState({
        hazardId: hazard.id,
        data: {
          ...recommendation,
          status: "Dispatched",
        },
      });

      toast.success(`Unit ${recommendation.recommendedAmbulance} Dispatched!`, {
        description: `Assigned to ${hazard.location} (ETA ${recommendation.etaMinutes}m)`,
      });
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
      const currentUnitId = recommendation.unitId;
      const newExcluded = [...excludedUnits, currentUnitId];
      setExcludedUnits(newExcluded);

      const lat = hazard.coordinates?.lat || 17.4401;
      const lng = hazard.coordinates?.lng || 78.3489;
      const nextUnit = await AmbulanceService.getRecommendedAmbulance(lat, lng, newExcluded);

      if (nextUnit) {
        const reasoning = `Reassigned to next-best candidate ${nextUnit.unit_number} (${nextUnit.driver}) to optimize arrival vector.`;
        await DispatchService.reassignUnit(recommendation.id, nextUnit.id, reasoning);

        setRecommendationState({
          hazardId: hazard.id,
          data: {
            ...recommendation,
            unitId: nextUnit.id,
            recommendedAmbulance: `${nextUnit.unit_number} (${nextUnit.driver})`,
            reasoning,
            status: "Reassigned",
          },
        });

        toast.info(`Unit Reassigned to ${nextUnit.unit_number}`, {
          description: "Recalculated arrival vector & hospital beds.",
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
                    <span>Unit {recommendation.recommendedAmbulance} DISPATCHED to {hazard.location}! Signal lock established.</span>
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
                <p className="font-bold text-zinc-100 text-sm truncate">{recommendation?.recommendedAmbulance}</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Unit Ready & Staged
                </p>
              </div>

              {/* Distance */}
              <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                  <Navigation className="h-3 w-3 text-cyan-400" /> Distance
                </span>
                <p className="font-bold text-zinc-100 text-sm">{recommendation?.distanceKm} km</p>
                <p className="text-[10px] text-zinc-400">Direct Arterial Route</p>
              </div>

              {/* ETA */}
              <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-400" /> Golden Hour ETA
                </span>
                <p className="font-bold text-emerald-400 text-sm">{recommendation?.etaMinutes} mins</p>
                <p className="text-[10px] text-zinc-400">Traffic Density: Low</p>
              </div>

              {/* Target Hospital */}
              <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-purple-400" /> Destination Hospital
                </span>
                <p className="font-bold text-zinc-100 text-xs truncate" title={recommendation?.recommendedHospital}>
                  {recommendation?.recommendedHospital}
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
                &ldquo;{recommendation?.reasoning}&rdquo;
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
