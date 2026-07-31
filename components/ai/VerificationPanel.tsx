"use client";

import React, { useMemo } from "react";
import { VerificationReport, AIHazard } from "@/types/ai";
import { MOCK_VERIFICATION_REPORTS, MOCK_HAZARDS } from "@/lib/mock-ai-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  CheckCircle2,
  Radio,
  FileCheck,
  Sparkles,
  Layers,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";

interface VerificationPanelProps {
  selectedHazardId?: string;
  selectedHazard?: AIHazard;
}

export function VerificationPanel({
  selectedHazardId = "HZ-801",
  selectedHazard,
}: VerificationPanelProps) {
  // Find report corresponding to selected hazard or default to first
  const report: VerificationReport = useMemo(() => {
    const found = MOCK_VERIFICATION_REPORTS.find(
      (r) => r.hazardId === selectedHazardId
    );
    return found || MOCK_VERIFICATION_REPORTS[0];
  }, [selectedHazardId]);

  const hazard = useMemo(() => {
    if (selectedHazard) return selectedHazard;
    return MOCK_HAZARDS.find((h) => h.id === selectedHazardId) || MOCK_HAZARDS[0];
  }, [selectedHazard, selectedHazardId]);

  const getRiskBadgeClass = (score: number) => {
    if (score < 5) return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
    if (score < 15) return "bg-amber-950/80 text-amber-400 border-amber-500/30";
    return "bg-red-950/80 text-red-400 border-red-500/30";
  };

  return (
    <Card className="glass-card border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden relative">
      {/* Top Cyber Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-600" />

      <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
              <span>AI Verification Engine</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                {hazard.id}
              </span>
            </CardTitle>
            <p className="text-xs text-zinc-400 font-mono">
              Multi-source sensor consensus & anti-spoofing verification engine
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-[11px] bg-emerald-950/70 text-emerald-300 border-emerald-500/40 hidden sm:flex gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Multi-Sensor Verified</span>
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {/* Duplicate Detection */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase">
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3 text-cyan-400" /> Deduplication
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-zinc-100">{report.duplicateDetectionScore}%</span>
              <span className="text-[10px] text-cyan-400">Unique Signal</span>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.duplicateDetectionScore}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-cyan-400"
              />
            </div>
          </div>

          {/* AI Confidence */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-400" /> Confidence
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-zinc-100">{report.confidenceScore}%</span>
              <span className="text-[10px] text-emerald-400">High Index</span>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.confidenceScore}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-400"
              />
            </div>
          </div>

          {/* Source Reliability */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase">
              <span className="flex items-center gap-1">
                <Radio className="h-3 w-3 text-blue-400" /> Sensor Trust
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-zinc-100">{report.sourceReliabilityScore}%</span>
              <span className="text-[10px] text-blue-400">Validated</span>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.sourceReliabilityScore}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-blue-400"
              />
            </div>
          </div>

          {/* Fake Report Risk */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase">
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-3 w-3 text-rose-400" /> Spoof Risk
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-zinc-100">{report.fakeReportRiskScore}%</span>
              <Badge variant="outline" className={`text-[9px] py-0 px-1 ${getRiskBadgeClass(report.fakeReportRiskScore)}`}>
                Low Risk
              </Badge>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.fakeReportRiskScore}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Cross Verification Sources Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-cyan-400" />
              <span>Cross-Verification Signal Matrix</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-500">
              {report.crossVerificationSources.length} Active Feeds
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            {report.crossVerificationSources.map((source, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <p className="font-semibold text-zinc-200 text-xs">{source.name}</p>
                    <p className="text-[10px] text-zinc-500">Timestamp: {source.timestamp}</p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={
                    source.status === "Verified"
                      ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40 text-[10px]"
                      : "bg-amber-950/80 text-amber-400 border-amber-500/40 text-[10px]"
                  }
                >
                  {source.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Stage Progression */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <h4 className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5 mb-3">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Verification Sequence Pipeline</span>
          </h4>

          <div className="space-y-2">
            {report.verificationTimeline.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-800/60 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200 text-xs">{step.stage}</p>
                    <p className="text-[10px] text-zinc-400">{step.details}</p>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                  {step.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
