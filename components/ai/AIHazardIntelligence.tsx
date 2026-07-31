"use client";

import React, { useState } from "react";
import { AIHazard, ParsedIncident } from "@/types/ai";
import { MOCK_HAZARDS } from "@/lib/mock-ai-data";
import { AIIncidentAnalyzer } from "@/components/ai/AIIncidentAnalyzer";
import { HazardFeed } from "@/components/ai/HazardFeed";
import { VerificationPanel } from "@/components/ai/VerificationPanel";
import { DispatchRecommendation } from "@/components/ai/DispatchRecommendation";
import { AIInsights } from "@/components/ai/AIInsights";
import { IncidentTimeline } from "@/components/ai/IncidentTimeline";
import { ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export function AIHazardIntelligence() {
  const [selectedHazard, setSelectedHazard] = useState<AIHazard>(MOCK_HAZARDS[0]);

  const handleSelectHazard = (hazard: AIHazard) => {
    setSelectedHazard(hazard);
  };

  const handleIncidentParsed = (parsed: ParsedIncident) => {
    // Dynamically match or create a new hazard focus
    const newHazard: AIHazard = {
      id: `HZ-${Math.floor(800 + Math.random() * 100)}`,
      title: `${parsed.incidentType} parsed via NLP`,
      priority: parsed.priority,
      severity: parsed.severity,
      timestamp: "Just now",
      location: parsed.location,
      description: parsed.rawReport,
      verificationPercentage: parsed.confidenceScore,
      source: "CCTV AI Vision",
      status: "Active",
      coordinates: { lat: 17.4401, lng: 78.3489 },
      vehiclesInvolved: parsed.vehiclesInvolved,
      blockedLanes: parsed.blockedLanes,
      victimsEstimated: parsed.victimsEstimated,
    };
    setSelectedHazard(newHazard);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/80 border border-zinc-800/90 p-4 rounded-2xl glass-card">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Cpu className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
              <span>AI Hazard Intelligence Command Suite</span>
              <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                Phase 3 Active
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Autonomous NLP incident extraction, multi-sensor verification, and dispatch recommendation matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-zinc-900/90 px-3 py-2 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>AI Multi-Sensor Matrix: <strong>Active</strong></span>
        </div>
      </div>

      {/* 1. Animated Stat Cards Row */}
      <AIInsights />

      {/* 2. Responsive 2-Column Desktop / 1-Column Mobile Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {/* AI Incident Analyzer Card */}
          <AIIncidentAnalyzer onIncidentParsed={handleIncidentParsed} />

          {/* Verification Engine Panel */}
          <VerificationPanel selectedHazardId={selectedHazard.id} selectedHazard={selectedHazard} />

          {/* AI Dispatch Recommendation Card */}
          <DispatchRecommendation selectedHazardId={selectedHazard.id} selectedHazard={selectedHazard} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Live Hazard Scrolling Feed */}
          <div className="h-[620px]">
            <HazardFeed onSelectHazard={handleSelectHazard} selectedHazardId={selectedHazard.id} />
          </div>

          {/* Vertical Glowing Incident Timeline */}
          <div className="h-[580px]">
            <IncidentTimeline selectedHazardId={selectedHazard.id} selectedHazard={selectedHazard} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
