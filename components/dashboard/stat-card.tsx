"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatMetric } from "@/lib/constants";
import { Ambulance, Flame, AlertTriangle, Timer, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Ambulance: Ambulance,
  Flame: Flame,
  AlertTriangle: AlertTriangle,
  Timer: Timer,
};

interface StatCardProps {
  stat: StatMetric;
}

export function StatCard({ stat }: StatCardProps) {
  const IconComponent = ICON_MAP[stat.icon] || Ambulance;
  const isPositiveTrend = stat.trendType === "positive";

  return (
    <Card className="glass-card glass-card-hover relative overflow-hidden border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90">
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider">
            {stat.title}
          </span>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm shrink-0",
              stat.id === "active-ambulances" && "bg-blue-950/60 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
              stat.id === "live-hazards" && "bg-amber-950/60 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
              stat.id === "critical-incidents" && "bg-red-950/60 border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
              stat.id === "average-eta" && "bg-emerald-950/60 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>
        </div>

        {/* Main Metric & Trend */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-50 tracking-tight font-mono">
            {stat.value}
          </div>

          {/* Simple Trend Indicator Pill (Replacing Sparkline) */}
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium font-mono border",
              isPositiveTrend
                ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/30"
                : "bg-amber-950/50 text-amber-400 border-amber-500/30"
            )}
          >
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 text-amber-400 shrink-0" />
            )}
            <span>{stat.trend}</span>
          </div>
        </div>

        {/* Subtitle & Badge Footer */}
        <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/60 pt-2.5">
          <span className="truncate text-zinc-400">{stat.subtitle}</span>
          {stat.badge && (
            <Badge
              variant="outline"
              className="text-[10px] bg-zinc-900 border-zinc-800 text-zinc-300 font-mono px-1.5 py-0"
            >
              {stat.badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
