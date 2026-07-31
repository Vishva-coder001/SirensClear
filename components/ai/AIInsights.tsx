"use client";

import React, { useEffect, useState } from "react";
import { AIInsightsData } from "@/types/ai";
import { MOCK_AI_INSIGHTS } from "@/lib/mock-ai-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { useSpring, useTransform } from "framer-motion";

interface AIInsightsProps {
  insights?: AIInsightsData;
}

function AnimatedNumber({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => current.toFixed(decimals));
  const [currentText, setCurrentText] = useState("0");

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    return display.on("change", (latest) => {
      setCurrentText(latest);
    });
  }, [display]);

  return (
    <span>
      {currentText}
      {suffix}
    </span>
  );
}

export function AIInsights({ insights = MOCK_AI_INSIGHTS }: AIInsightsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
      {/* 1. Critical Incidents */}
      <Card className="glass-card p-4 border-zinc-800 bg-zinc-950/90 relative overflow-hidden group hover:border-red-500/40 transition-all shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-red-400" /> Critical Incidents
          </span>
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-zinc-100 font-mono tracking-tight">
            <AnimatedNumber value={insights.criticalIncidents} />
          </span>
          <Badge variant="outline" className="bg-red-950/80 text-red-400 border-red-500/30 text-[10px]">
            Priority P1
          </Badge>
        </div>
        <p className="text-[10px] text-zinc-500 mt-1">Requires immediate unit allocation</p>
      </Card>

      {/* 2. Average ETA */}
      <Card className="glass-card p-4 border-zinc-800 bg-zinc-950/90 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-emerald-400" /> Average ETA
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">-1.2m vs avg</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">
            <AnimatedNumber value={insights.averageEtaMinutes} decimals={1} suffix="m" />
          </span>
          <Badge variant="outline" className="bg-emerald-950/80 text-emerald-400 border-emerald-500/30 text-[10px]">
            Golden Hour Safe
          </Badge>
        </div>
        <p className="text-[10px] text-zinc-500 mt-1">Green wave preemption active</p>
      </Card>

      {/* 3. Average AI Confidence */}
      <Card className="glass-card p-4 border-zinc-800 bg-zinc-950/90 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-cyan-400" /> Avg AI Confidence
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">NLP + Vision</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-cyan-300 font-mono tracking-tight">
            <AnimatedNumber value={insights.averageConfidencePercentage} decimals={1} suffix="%" />
          </span>
          <Badge variant="outline" className="bg-cyan-950/80 text-cyan-400 border-cyan-500/30 text-[10px]">
            High Accuracy
          </Badge>
        </div>
        <p className="text-[10px] text-zinc-500 mt-1">Derived across 20 active hazard nodes</p>
      </Card>

      {/* 4. Verification Success Rate */}
      <Card className="glass-card p-4 border-zinc-800 bg-zinc-950/90 relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-blue-400" /> Verification Success
          </span>
          <ShieldCheck className="h-4 w-4 text-blue-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-blue-300 font-mono tracking-tight">
            <AnimatedNumber value={insights.verificationSuccessPercentage} decimals={1} suffix="%" />
          </span>
          <Badge variant="outline" className="bg-blue-950/80 text-blue-400 border-blue-500/30 text-[10px]">
            Zero Spoofs
          </Badge>
        </div>
        <p className="text-[10px] text-zinc-500 mt-1">Multi-sensor agreement score</p>
      </Card>

      {/* 5. Predicted Congestion */}
      <Card className="glass-card p-4 border-zinc-800 bg-zinc-950/90 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-amber-400" /> Traffic Congestion
          </span>
          <Activity className="h-4 w-4 text-amber-400 animate-pulse" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-extrabold text-amber-300 font-mono tracking-tight">
            {insights.predictedCongestionLevel}
          </span>
          <Badge variant="outline" className="bg-amber-950/80 text-amber-400 border-amber-500/30 text-[10px]">
            Rerouted
          </Badge>
        </div>
        <p className="text-[10px] text-zinc-500 mt-1">OSRM travel time adjustment active</p>
      </Card>
    </div>
  );
}
