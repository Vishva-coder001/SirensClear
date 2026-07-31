"use client";

import React, { useMemo } from "react";
import { TimelineMilestone, AIHazard } from "@/types/ai";
import { MOCK_HAZARDS } from "@/lib/mock-ai-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  Radio,
  Sparkles,
  ShieldCheck,
  Siren,
  Building2,
  Navigation,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

interface IncidentTimelineProps {
  selectedHazardId?: string;
  selectedHazard?: AIHazard;
}

export function IncidentTimeline({
  selectedHazardId = "HZ-801",
  selectedHazard,
}: IncidentTimelineProps) {
  const hazard = useMemo(() => {
    if (selectedHazard) return selectedHazard;
    return MOCK_HAZARDS.find((h) => h.id === selectedHazardId) || MOCK_HAZARDS[0];
  }, [selectedHazard, selectedHazardId]);

  const milestones: TimelineMilestone[] = [
    {
      id: "t1",
      stage: "Report Received",
      label: "Emergency Signal Ingested",
      timestamp: "17:34:02",
      status: "completed",
      details: "Raw multi-source emergency report logged from CCTV vision and 911 feed.",
    },
    {
      id: "t2",
      stage: "AI Parsed",
      label: "NLP Entity & Severity Extracted",
      timestamp: "17:34:15",
      status: "completed",
      details: `Parsed ${hazard.vehiclesInvolved}, ${hazard.blockedLanes}, estimated ${hazard.victimsEstimated} victims.`,
    },
    {
      id: "t3",
      stage: "Verified",
      label: "Multi-Sensor Consensus Achieved",
      timestamp: "17:34:40",
      status: "completed",
      details: `Verification engine score ${hazard.verificationPercentage}% via ${hazard.source}. Zero duplicate anomaly detected.`,
    },
    {
      id: "t4",
      stage: "Dispatcher Alerted",
      label: "Command Grid Alert Broadcast",
      timestamp: "17:35:05",
      status: "completed",
      details: `Priority ${hazard.priority} payload rendered to emergency dispatcher consoles.`,
    },
    {
      id: "t5",
      stage: "Ambulance Assigned",
      label: "Optimal Responder Unit Dispatched",
      timestamp: "17:35:22",
      status: hazard.status === "Dispatched" || hazard.status === "Resolved" ? "completed" : "active",
      details: "ALS Unit A04 assigned via OSRM minimum ETA matrix.",
    },
    {
      id: "t6",
      stage: "Hospital Notified",
      label: "Trauma ICU Bed Reservation",
      timestamp: "17:35:40",
      status: hazard.status === "Dispatched" || hazard.status === "Resolved" ? "completed" : "pending",
      details: "AIG Hospitals Emergency Department notified with patient telemetry.",
    },
    {
      id: "t7",
      stage: "Arrival",
      label: "On-Scene Intervention",
      timestamp: hazard.status === "Resolved" ? "17:39:10" : "EST 17:39:30",
      status: hazard.status === "Resolved" ? "completed" : "pending",
      details: "Target scene arrival and paramedic deployment.",
    },
  ];

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0: return Radio;
      case 1: return Sparkles;
      case 2: return ShieldCheck;
      case 3: return Activity;
      case 4: return Siren;
      case 5: return Building2;
      case 6: return Navigation;
      default: return CheckCircle2;
    }
  };

  return (
    <Card className="glass-card border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden relative flex flex-col h-full">
      {/* Top Cyber Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-500" />

      <CardHeader className="pb-3 pt-4 px-5 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
                <span>AI Incident Lifecycle</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-blue-950 text-blue-400 border border-blue-500/30">
                  {hazard.id}
                </span>
              </CardTitle>
              <p className="text-xs text-zinc-400 font-mono">
                Real-time situational progression log & event telemetry
              </p>
            </div>
          </div>

          <Badge variant="outline" className="font-mono text-[10px] bg-zinc-900 border-zinc-800 text-zinc-300 hidden sm:flex">
            Live Milestone Tracking
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 flex-1 overflow-y-auto space-y-6 scrollbar-thin">
        <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-zinc-800">
          {milestones.map((m, idx) => {
            const Icon = getStepIcon(idx);
            const isCompleted = m.status === "completed";
            const isActive = m.status === "active";

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative group"
              >
                {/* Glowing Node Dot */}
                <div
                  className={`absolute -left-[30px] top-0.5 h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      : isActive
                      ? "bg-blue-950 border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse"
                      : "bg-zinc-950 border-zinc-800 text-zinc-600"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                </div>

                {/* Milestone Details Container */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all font-mono">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-100 text-xs">{m.stage}</span>
                      <span className="text-[10px] text-zinc-400 hidden sm:inline">• {m.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">{m.timestamp}</span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] py-0 px-1.5 ${
                          isCompleted
                            ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                            : isActive
                            ? "bg-blue-950 text-blue-300 border-blue-500/40 animate-pulse"
                            : "bg-zinc-950 text-zinc-500 border-zinc-800"
                        }`}
                      >
                        {isCompleted ? "Completed" : isActive ? "Active" : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {m.details}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
