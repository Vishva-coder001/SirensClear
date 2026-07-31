"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Radio,
  Flame,
  Ambulance,
  Maximize2,
  Navigation,
  CheckCircle2,
  Eye,
  Radar,
} from "lucide-react";
import { MOCK_AMBULANCE_UNITS, HAZARDS_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MapPlaceholder() {
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [selectedPin, setSelectedPin] = useState<string | null>("amb-08");
  const [zoomLevel, setZoomLevel] = useState(100);

  return (
    <Card className="glass-card relative overflow-hidden border-blue-500/30 bg-zinc-950 flex flex-col h-[520px] lg:h-[620px] shadow-[0_0_35px_rgba(0,0,0,0.8)]">
      {/* Header Bar */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 py-3 px-4 sm:px-5 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-400">
            <MapPin className="h-4 w-4 animate-bounce" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-zinc-100 font-mono tracking-tight">
              Live City Map – MapLibre integration coming in next phase
            </CardTitle>
            <p className="text-[11px] text-zinc-400 font-mono">
              San Francisco Urban Sector • Real-time GPS & Routing Matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="cyan"
            className="hidden sm:inline-flex text-[10px] font-mono uppercase px-2 py-0.5"
          >
            <Radio className="h-3 w-3 mr-1 animate-pulse text-cyan-400" />
            Telemetry Stream Active
          </Badge>
          <Badge
            variant="outline"
            className="bg-zinc-900 border-zinc-700 text-zinc-300 font-mono text-[10px]"
          >
            {zoomLevel}% Zoom
          </Badge>
        </div>
      </CardHeader>

      {/* Main Map Visual Body */}
      <CardContent className="relative flex-1 p-0 overflow-hidden bg-[#06080d] select-none grid-bg-pattern">
        {/* Synthetic Map SVG Canvas Overlay */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <svg className="w-full h-full opacity-60 pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="hazardArea" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* City Grid Road Vectors */}
            {/* Horizontal Arterials */}
            <line x1="0%" y1="20%" x2="100%" y2="20%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4,4" />
            <line x1="0%" y1="40%" x2="100%" y2="40%" stroke="#334155" strokeWidth="3" />
            <line x1="0%" y1="65%" x2="100%" y2="65%" stroke="#1e293b" strokeWidth="2" />
            <line x1="0%" y1="85%" x2="100%" y2="85%" stroke="#334155" strokeWidth="3" />

            {/* Vertical Arterials */}
            <line x1="25%" y1="0%" x2="25%" y2="100%" stroke="#334155" strokeWidth="3" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4,4" />
            <line x1="75%" y1="0%" x2="75%" y2="100%" stroke="#334155" strokeWidth="3" />

            {/* Diagonal Expressway */}
            <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="#1e293b" strokeWidth="4" />

            {/* Optimized Dispatch Route Polyline */}
            {showRoutes && (
              <>
                <polyline
                  points="250,400 320,320 480,320 540,240 680,240"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse"
                />
                <polyline
                  points="250,400 320,320 480,320 540,240 680,240"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="8,8"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* Hazard Zone Heatmap Radii */}
            {showHazards && (
              <>
                <circle cx="540" cy="240" r="45" fill="url(#hazardArea)" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="280" cy="480" r="35" fill="url(#hazardArea)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
              </>
            )}
          </svg>

          {/* Radar Sweep Effect */}
          {showRadar && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-blue-500/10 pointer-events-none flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-blue-500/20 radar-sweep bg-gradient-to-r from-blue-500/10 via-transparent to-transparent" />
            </div>
          )}

          {/* Ambulance Telemetry Pins */}
          {showAmbulances &&
            MOCK_AMBULANCE_UNITS.map((amb, index) => {
              // Synthetic map positioning
              const positions = [
                { top: "38%", left: "48%" },
                { top: "62%", left: "28%" },
                { top: "25%", left: "72%" },
                { top: "78%", left: "68%" },
              ];
              const pos = positions[index] || positions[0];
              const isSelected = selectedPin === amb.id;

              return (
                <div
                  key={amb.id}
                  onClick={() => setSelectedPin(amb.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-8 w-8 rounded-full bg-blue-500/30 pulse-glow-blue" />
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-mono font-bold transition-all shadow-lg",
                        isSelected
                          ? "bg-blue-600 text-white border-blue-300 ring-2 ring-blue-400/50 scale-110"
                          : "bg-zinc-900/90 text-blue-400 border-blue-500/40 hover:bg-blue-950"
                      )}
                    >
                      <Ambulance className="h-3.5 w-3.5 text-cyan-300 animate-pulse" />
                      <span>{amb.callsign}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Tooltip Popup on Select or Hover */}
                  {(isSelected || selectedPin === amb.id) && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-zinc-900/95 border border-zinc-700 p-2.5 shadow-2xl text-xs text-zinc-200 z-30 font-mono">
                      <div className="flex items-center justify-between font-bold border-b border-zinc-800 pb-1 mb-1 text-blue-400">
                        <span>{amb.callsign} Telemetry</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1 rounded">
                          {amb.status}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-[10px] text-zinc-300">
                        <p>Target: <strong className="text-zinc-100">{amb.hospitalTarget}</strong></p>
                        <p>ETA: <strong className="text-emerald-400">{amb.eta}</strong> | Speed: <strong>{amb.speed}</strong></p>
                        <p className="text-zinc-500">Driver: {amb.driver}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Hazard Pins */}
          {showHazards &&
            HAZARDS_LIST.slice(0, 3).map((hz, index) => {
              const pos = [
                { top: "35%", left: "54%" },
                { top: "72%", left: "32%" },
                { top: "60%", left: "62%" },
              ][index];

              return (
                <div
                  key={hz.id}
                  style={{ top: pos?.top, left: pos?.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  onClick={() => setSelectedPin(hz.id)}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-7 w-7 rounded-full bg-red-500/30 pulse-glow-red" />
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-950 border border-red-500 text-red-400 shadow-lg">
                      <Flame className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Hazard Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:flex flex-col w-52 rounded-lg bg-zinc-900 border border-red-900/60 p-2 text-xs shadow-2xl z-30 font-mono">
                    <span className="font-bold text-red-400 border-b border-zinc-800 pb-1 mb-1 truncate">
                      ⚠️ {hz.title}
                    </span>
                    <span className="text-[10px] text-zinc-300">{hz.location}</span>
                    <span className="text-[9px] text-amber-400 mt-1">
                      {hz.verificationSource}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Floating Layer Controls (Top Left) */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-md">
          <button
            onClick={() => setShowAmbulances(!showAmbulances)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-md backdrop-blur-md",
              showAmbulances
                ? "bg-blue-950/80 border-blue-500/40 text-blue-300"
                : "bg-zinc-900/80 border-zinc-800 text-zinc-500 line-through"
            )}
          >
            <Ambulance className="h-3.5 w-3.5" />
            Ambulances ({MOCK_AMBULANCE_UNITS.length})
          </button>

          <button
            onClick={() => setShowHazards(!showHazards)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-md backdrop-blur-md",
              showHazards
                ? "bg-amber-950/80 border-amber-500/40 text-amber-300"
                : "bg-zinc-900/80 border-zinc-800 text-zinc-500 line-through"
            )}
          >
            <Flame className="h-3.5 w-3.5" />
            Hazards ({HAZARDS_LIST.length})
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-md backdrop-blur-md",
              showRoutes
                ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-300"
                : "bg-zinc-900/80 border-zinc-800 text-zinc-500 line-through"
            )}
          >
            <Navigation className="h-3.5 w-3.5" />
            Optimized Routes
          </button>

          <button
            onClick={() => setShowRadar(!showRadar)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-md backdrop-blur-md",
              showRadar
                ? "bg-purple-950/80 border-purple-500/40 text-purple-300"
                : "bg-zinc-900/80 border-zinc-800 text-zinc-500"
            )}
            title="Toggle Radar Sweep"
          >
            <Radar className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Floating Zoom & Compass Controls (Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setZoomLevel((z) => Math.min(z + 15, 160))}
            className="h-8 w-8 bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
            className="h-8 w-8 bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => setZoomLevel(100)}
            className="h-8 w-8 bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
            title="Reset View"
          >
            <Compass className="h-4 w-4" />
          </Button>
        </div>

        {/* Bottom Left Legend Banner */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-950/90 border border-zinc-800/90 text-[11px] font-mono text-zinc-400 backdrop-blur-md">
          <span className="flex items-center gap-1 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" /> Active Unit
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> Critical Hazard
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" /> Neural Path
          </span>
        </div>

        {/* Bottom Right Integration Banner Notice */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-[11px] font-mono text-blue-300 shadow-xl backdrop-blur-md">
          <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          <span>MapLibre GL Vector Ready</span>
        </div>
      </CardContent>
    </Card>
  );
}
