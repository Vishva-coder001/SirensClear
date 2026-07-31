"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Flame,
  Search,
  CheckCircle2,
  AlertOctagon,
  Clock,
  MapPin,
  Filter,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { HAZARDS_LIST, HazardItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function HazardPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredHazards = HAZARDS_LIST.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterSeverity === "all") return matchesSearch;
    if (filterSeverity === "critical") return matchesSearch && h.severity === "critical";
    if (filterSeverity === "high") return matchesSearch && h.severity === "high";
    if (filterSeverity === "verified") return matchesSearch && h.verificationStatus === "verified";
    return matchesSearch;
  });

  return (
    <Card className="glass-card flex flex-col h-full border-zinc-800/80 bg-zinc-950/95 overflow-hidden">
      {/* Panel Header */}
      <CardHeader className="p-4 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-zinc-100 font-mono tracking-tight">
                Live Hazards
              </CardTitle>
              <p className="text-[11px] text-zinc-400 font-mono">
                {HAZARDS_LIST.length} active road incidents detected
              </p>
            </div>
          </div>

          <Badge variant="high" className="text-[10px] font-mono px-2 py-0.5">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Grid Alert Active
          </Badge>
        </div>

        {/* Filter Controls */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <Input
              placeholder="Filter by location or hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-zinc-900/90 border-zinc-800 text-xs h-8 placeholder:text-zinc-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
            {["all", "critical", "high", "verified"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterSeverity(f)}
                className={cn(
                  "px-2 py-1 rounded-md capitalize transition-all border whitespace-nowrap",
                  filterSeverity === f
                    ? "bg-blue-600 text-white border-blue-400 font-semibold"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      {/* Hazard Cards List */}
      <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredHazards.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500 font-mono">
            No active hazards match the selected filter.
          </div>
        ) : (
          filteredHazards.map((hazard) => {
            const isCritical = hazard.severity === "critical";
            const isHigh = hazard.severity === "high";

            return (
              <div
                key={hazard.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 space-y-2 relative group",
                  isCritical
                    ? "bg-red-950/20 border-red-900/40 hover:border-red-500/50"
                    : isHigh
                    ? "bg-amber-950/20 border-amber-900/40 hover:border-amber-500/50"
                    : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
                )}
              >
                {/* Title and Severity Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-zinc-100 font-mono leading-tight">
                    {hazard.title}
                  </h4>
                  <Badge
                    variant={
                      hazard.severity === "critical"
                        ? "critical"
                        : hazard.severity === "high"
                        ? "high"
                        : "moderate"
                    }
                    className="text-[10px] uppercase font-mono px-1.5 py-0 shrink-0"
                  >
                    {hazard.severity}
                  </Badge>
                </div>

                {/* Location & Time */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1 truncate text-zinc-300">
                    <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                    {hazard.location}
                  </span>
                  <span className="flex items-center gap-1 shrink-0 text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {hazard.timestamp}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans line-clamp-2">
                  {hazard.description}
                </p>

                {/* Verification Source Badge */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] font-mono">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="truncate">{hazard.verificationSource}</span>
                  </div>

                  <button className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
