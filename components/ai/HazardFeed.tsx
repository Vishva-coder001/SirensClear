"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { AIHazard } from "@/types/ai";
import { HazardService } from "@/services/HazardService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Flame,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Radio,
  Activity,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HazardFeedProps {
  onSelectHazard?: (hazard: AIHazard) => void;
  selectedHazardId?: string;
  externalNewHazard?: AIHazard | null;
}

type FilterTab = "All" | "Critical" | "Moderate" | "Resolved";

export function HazardFeed({
  onSelectHazard,
  selectedHazardId,
  externalNewHazard,
}: HazardFeedProps) {
  const [filterTab, setFilterTab] = useState<FilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hazards, setHazards] = useState<AIHazard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [activeHazardId, setActiveHazardId] = useState<string>("");

  const loadHazards = useCallback(async () => {
    setIsLoading(true);
    const res = await HazardService.getAllHazards();
    if (res.data) {
      setHazards(res.data);
      if (res.data.length > 0 && !activeHazardId) {
        setActiveHazardId(res.data[0].id);
      }
    }
    setIsLoading(false);
  }, [activeHazardId]);

  useEffect(() => {
    loadHazards();
  }, [loadHazards]);

  // Sync external newly registered hazard
  useEffect(() => {
    if (externalNewHazard) {
      setHazards((prev) => {
        if (prev.some((h) => h.id === externalNewHazard.id)) return prev;
        return [externalNewHazard, ...prev];
      });
      setActiveHazardId(externalNewHazard.id);
    }
  }, [externalNewHazard]);

  // Subscribe to Supabase Realtime
  useEffect(() => {
    const unsubscribe = HazardService.subscribeToHazards(
      (newHazard) => {
        setHazards((prev) => {
          if (prev.some((h) => h.id === newHazard.id)) return prev;
          return [newHazard, ...prev];
        });
        toast.info(`Realtime Update: New Hazard ${newHazard.id}`, {
          description: newHazard.title,
        });
      },
      (updatedHazard) => {
        setHazards((prev) =>
          prev.map((h) => (h.id === updatedHazard.id ? updatedHazard : h))
        );
      },
      (deletedId) => {
        setHazards((prev) => prev.filter((h) => h.id !== deletedId));
      },
      (status) => {
        setIsRealtimeConnected(status === "SUBSCRIBED");
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredHazards = useMemo(() => {
    return hazards.filter((hazard) => {
      // Tab filter
      if (filterTab === "Critical" && hazard.severity !== "Critical") return false;
      if (filterTab === "Moderate" && hazard.severity !== "Moderate" && hazard.severity !== "Low")
        return false;
      if (filterTab === "Resolved" && hazard.status !== "Resolved") return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = hazard.title.toLowerCase().includes(query);
        const matchesLocation = hazard.location.toLowerCase().includes(query);
        const matchesDesc = hazard.description.toLowerCase().includes(query);
        const matchesId = hazard.id.toLowerCase().includes(query);
        return matchesTitle || matchesLocation || matchesDesc || matchesId;
      }
      return true;
    });
  }, [hazards, filterTab, searchQuery]);

  const handleHazardClick = (hazard: AIHazard) => {
    setActiveHazardId(hazard.id);
    if (onSelectHazard) {
      onSelectHazard(hazard);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-950/90 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
      case "High":
        return "bg-orange-950/90 text-orange-400 border-orange-500/50";
      case "Moderate":
        return "bg-amber-950/90 text-amber-400 border-amber-500/50";
      default:
        return "bg-emerald-950/90 text-emerald-400 border-emerald-500/50";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-950/70 text-red-300 border-red-800";
      case "Dispatched":
        return "bg-blue-950/70 text-blue-300 border-blue-800";
      case "Investigating":
        return "bg-amber-950/70 text-amber-300 border-amber-800";
      case "Resolved":
        return "bg-emerald-950/70 text-emerald-300 border-emerald-800";
      default:
        return "bg-zinc-900 text-zinc-400 border-zinc-800";
    }
  };

  return (
    <Card className="glass-card border-zinc-800 bg-zinc-950/90 shadow-2xl flex flex-col h-full overflow-hidden">
      {/* Card Header */}
      <CardHeader className="pb-3 pt-4 px-5 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
              <Flame className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
                <span>Hazard Feed</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-red-950 text-red-400 border border-red-500/30">
                  {filteredHazards.length} Incidents
                </span>
              </CardTitle>
              <p className="text-xs text-zinc-400 font-mono">
                Real-time incident stream aggregated via Supabase Engine
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
            {isRealtimeConnected ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>Realtime Active</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-400" />
                <span>Sync Staged</span>
              </>
            )}
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Filter by location, title, or hazard ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs font-mono bg-zinc-900/90 border-zinc-800 focus:border-cyan-500/60 text-zinc-100 placeholder:text-zinc-500 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1">
              {(["All", "Critical", "Moderate", "Resolved"] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[11px] font-mono transition-all whitespace-nowrap border",
                    filterTab === tab
                      ? "bg-cyan-950 text-cyan-300 border-cyan-500/40 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                      : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-800"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-zinc-500 shrink-0 hidden sm:inline">
              Sorted by Priority
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Feed Scroll Area */}
      <CardContent className="p-3 flex-1 overflow-y-auto space-y-2.5 min-h-0 scrollbar-thin">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            <span>Loading hazards from database...</span>
          </div>
        ) : filteredHazards.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-mono text-xs">
            No hazards found matching current filters.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredHazards.map((hazard) => {
              const isSelected = (selectedHazardId || activeHazardId) === hazard.id;
              return (
                <motion.div
                  key={hazard.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleHazardClick(hazard)}
                  className={cn(
                    "p-3.5 rounded-xl border text-xs font-mono cursor-pointer transition-all duration-200 relative group",
                    isSelected
                      ? "bg-zinc-900/95 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                      : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700"
                  )}
                >
                  {/* Selected Indicator Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full" />
                  )}

                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                        {hazard.id}
                      </span>
                      <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${getSeverityBadgeClass(hazard.severity)}`}>
                        {hazard.severity}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-zinc-950 text-cyan-300 border-cyan-500/30">
                        {hazard.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 shrink-0">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span>{hazard.timestamp}</span>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h4 className="font-semibold text-zinc-100 text-xs mb-1 group-hover:text-cyan-300 transition-colors">
                    {hazard.title}
                  </h4>

                  <p className="text-zinc-400 text-[11px] flex items-center gap-1.5 mb-2 truncate">
                    <MapPin className="h-3 w-3 text-red-400 shrink-0" />
                    <span>{hazard.location}</span>
                  </p>

                  <p className="text-zinc-300 text-[11px] leading-relaxed mb-3 line-clamp-2">
                    {hazard.description}
                  </p>

                  {/* Card Footer Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{hazard.verificationPercentage}% Verified</span>
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="flex items-center gap-1 text-zinc-400">
                        <Radio className="h-3 w-3 text-cyan-400" />
                        <span>{hazard.source}</span>
                      </span>
                    </div>

                    <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${getStatusBadgeClass(hazard.status)}`}>
                      {hazard.status}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
