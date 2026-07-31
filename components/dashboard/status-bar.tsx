"use client";

import React from "react";
import { SYSTEM_SERVICES } from "@/lib/constants";
import { Server, Cpu, Database, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Supabase: Database,
  "OSRM Engine": Server,
  "AI Engine": Cpu,
  "System Status": Activity,
};

export function StatusBar() {
  return (
    <div className="h-10 border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 text-[11px] font-mono text-zinc-400 select-none">
      {/* Services List */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-1 no-scrollbar">
        {SYSTEM_SERVICES.map((service) => {
          const Icon = SERVICE_ICONS[service.name] || Server;
          const isOperational = service.status === "operational";

          return (
            <div key={service.name} className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    isOperational ? "bg-emerald-400" : "bg-amber-400"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    isOperational ? "bg-emerald-500" : "bg-amber-500"
                  )}
                />
              </span>

              <Icon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="font-medium text-zinc-300">{service.name}:</span>
              <span className="text-zinc-400">{service.detail}</span>
              <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded font-mono">
                {service.latency}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right System Health Badge */}
      <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider uppercase shrink-0">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>SirensClear Operational</span>
      </div>
    </div>
  );
}
