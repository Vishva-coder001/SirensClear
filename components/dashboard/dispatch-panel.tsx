"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, MapPin, Navigation, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { DISPATCH_PRESETS } from "@/lib/constants";

export function DispatchPanel() {
  const [origin, setOrigin] = useState(DISPATCH_PRESETS.origins[0]);
  const [destination, setDestination] = useState(DISPATCH_PRESETS.destinations[0]);
  const [priority, setPriority] = useState("code-3");
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "dispatching" | "dispatched">("idle");

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatchStatus("dispatching");

    setTimeout(() => {
      setDispatchStatus("dispatched");
      setTimeout(() => setDispatchStatus("idle"), 4000);
    }, 800);
  };

  return (
    <Card className="glass-card border-blue-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl relative overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <form onSubmit={handleDispatch} className="space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 border border-blue-500/40 text-blue-400">
                <Send className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100 font-mono tracking-tight">
                  Emergency Dispatch Console
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Configure origin, destination, and code priority for rapid routing
                </p>
              </div>
            </div>

            {dispatchStatus === "dispatched" ? (
              <Badge variant="success" className="font-mono text-xs animate-bounce">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Unit Dispatched Successfully
              </Badge>
            ) : (
              <Badge variant="cyan" className="font-mono text-[10px] uppercase">
                <ShieldAlert className="h-3 w-3 mr-1" />
                Ready to Dispatch
              </Badge>
            )}
          </div>

          {/* Form Input Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Origin Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 font-mono flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                Dispatch Origin (Base / Station)
              </label>
              <Select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-xs font-mono"
              >
                {DISPATCH_PRESETS.origins.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </div>

            {/* Destination Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 font-mono flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-amber-400" />
                Incident Destination
              </label>
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter incident address or sector..."
                className="bg-zinc-950 border-zinc-800 text-xs font-mono"
              />
            </div>

            {/* Priority Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 font-mono flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                Priority Code
              </label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-xs font-mono font-semibold text-zinc-100"
              >
                {DISPATCH_PRESETS.priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end border-t border-zinc-800/80 pt-3">
            <Button
              type="submit"
              variant="glow"
              disabled={dispatchStatus === "dispatching"}
              className="w-full sm:w-auto px-8 font-mono text-xs font-bold uppercase tracking-wider"
            >
              {dispatchStatus === "dispatching" ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Transmitting Routing Vector...
                </span>
              ) : dispatchStatus === "dispatched" ? (
                <span className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Dispatch Order Confirmed!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Dispatch Ambulance
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
