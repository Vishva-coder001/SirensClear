"use client";

import React from "react";
import { Terminal, Shield, Menu, Radio, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Left Title Section */}
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="sm:hidden p-2 text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-zinc-900 border border-zinc-800"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight font-mono">
              Sirens<span className="text-blue-500">Clear</span>
            </h1>
            <span className="hidden sm:inline-block text-zinc-600">|</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-zinc-300 tracking-wide">
              Smart Emergency Routing Platform
            </span>
            <Badge
              variant="cyan"
              className="hidden lg:inline-flex text-[10px] uppercase font-mono px-2 py-0.5 tracking-wider"
            >
              <Radio className="h-3 w-3 mr-1 text-cyan-400 animate-pulse" />
              Live SOC Grid
            </Badge>
          </div>
        </div>
      </div>

      {/* Right Dispatcher Console Placeholder */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-400">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span>Matrix Status: <strong className="text-emerald-400">Optimal</strong></span>
        </div>

        {/* Simple Dispatcher Console & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-inner">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-400">
              <Terminal className="h-4 w-4" />
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-zinc-950" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-100 font-mono tracking-tight">
                  Dispatcher Console
                </span>
                <Shield className="h-3 w-3 text-blue-400 hidden sm:inline-block" />
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                Station #04 • Admin Command
              </span>
            </div>
          </div>

          <button
            onClick={async () => {
              const { supabase } = await import("@/lib/supabase/client");
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            title="Sign Out of SirensClear"
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors text-xs font-mono"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
