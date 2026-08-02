"use client";

import React from "react";
import {
  LayoutDashboard,
  MapPin,
  Flame,
  Send,
  ChevronLeft,
  ChevronRight,
  Siren,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "live-map", label: "Live Map", icon: MapPin },
  { id: "hazards", label: "Hazards", icon: Flame, badge: "18" },
  { id: "dispatch", label: "Dispatch", icon: Send },
  { id: "ai-intelligence", label: "AI Intelligence", icon: Cpu, badge: "Phase 3" },
];

export function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out z-30 select-none",
        isCollapsed ? "w-16 sm:w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            <Siren className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm text-zinc-100 tracking-wider font-mono">
                SIRENS<span className="text-blue-400">CLEAR</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                SOC COMMAND
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden sm:flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-semibold"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80 border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-blue-400"
                    : "text-zinc-400 group-hover:text-zinc-200"
                )}
              />

              {!isCollapsed && (
                <span className="truncate flex-1 text-left tracking-wide">
                  {item.label}
                </span>
              )}

              {!isCollapsed && item.badge && (
                <span className="ml-auto rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 px-1.5 py-0.5 text-[10px] font-mono">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 hidden group-hover:flex items-center z-50 rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-100 shadow-xl whitespace-nowrap">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 rounded bg-amber-950 text-amber-400 px-1 text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Readiness Badge at bottom of sidebar */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-lg border border-zinc-800/80 bg-zinc-900/50 flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <p className="text-zinc-200 font-semibold leading-none">
              Routing Grid Active
            </p>
            <p className="text-[10px] text-zinc-500">Latency: 8ms</p>
          </div>
        </div>
      )}
    </aside>
  );
}
