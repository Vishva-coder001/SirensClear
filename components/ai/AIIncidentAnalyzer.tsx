"use client";

import React, { useState } from "react";
import { ParsedIncident } from "@/types/ai";
import { parseEmergencyReportMock } from "@/lib/mock-ai-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  MapPin,
  Car,
  ShieldAlert,
  Users,
  CloudRain,
  CheckCircle2,
  Code,
  Loader2,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIIncidentAnalyzerProps {
  onIncidentParsed?: (incident: ParsedIncident) => void;
}

const PRESET_EXAMPLES = [
  "Multi vehicle accident near Gachibowli flyover. Two buses involved. Ambulance required immediately.",
  "Rollover SUV crash on Outer Ring Road Exit 3. 3 passengers trapped in cabin, fuel leakage visible.",
  "Electric auto-rickshaw battery fire near Financial District. Single driver with minor burn trauma.",
];

export function AIIncidentAnalyzer({ onIncidentParsed }: AIIncidentAnalyzerProps) {
  const [reportText, setReportText] = useState(
    "Multi vehicle accident near Gachibowli flyover. Two buses involved. Ambulance required immediately."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedIncident, setParsedIncident] = useState<ParsedIncident | null>(() =>
    parseEmergencyReportMock("Multi vehicle accident near Gachibowli flyover. Two buses involved. Ambulance required immediately.")
  );
  const [showJson, setShowJson] = useState(false);

  const handleAnalyze = () => {
    if (!reportText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = parseEmergencyReportMock(reportText);
      setParsedIncident(result);
      setIsAnalyzing(false);
      if (onIncidentParsed) {
        onIncidentParsed(result);
      }
    }, 750);
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-950/80 text-red-400 border-red-500/40 animate-pulse";
      case "High":
        return "bg-orange-950/80 text-orange-400 border-orange-500/40";
      case "Moderate":
        return "bg-amber-950/80 text-amber-400 border-amber-500/40";
      default:
        return "bg-blue-950/80 text-blue-400 border-blue-500/40";
    }
  };

  return (
    <Card className="glass-card border-zinc-800 bg-zinc-950/90 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Glow Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

      <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
              <span>AI Incident Analyzer</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                NLP Heuristics
              </span>
            </CardTitle>
            <p className="text-xs text-zinc-400 font-mono">
              Extract incident parameters from unformatted emergency dispatch notes
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-[11px] bg-zinc-900 border-zinc-700 text-zinc-300 hidden sm:flex gap-1.5">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          <span>Automated Parsing</span>
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Text Area Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
              <span>Emergency Dispatch Report</span>
            </label>
            <span className="text-[10px] font-mono text-zinc-500">Paste text / transcript</span>
          </div>

          <Textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Multi vehicle accident near Gachibowli flyover. Two buses involved. Ambulance required immediately."
            className="min-h-[90px] font-mono text-xs bg-zinc-900/90 border-zinc-800 focus:border-cyan-500/60 text-zinc-100 placeholder:text-zinc-600 resize-none rounded-lg"
          />

          {/* Quick Examples Selection */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-400" /> Preset Samples:
            </span>
            {PRESET_EXAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReportText(sample)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-zinc-400 hover:text-cyan-300 transition-colors truncate max-w-[200px]"
                title={sample}
              >
                Sample {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !reportText.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider h-10 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
              <span>Analyzing Incident Stream...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Analyze Incident Report</span>
            </span>
          )}
        </Button>

        {/* Parsing Output Card */}
        <AnimatePresence mode="wait">
          {parsedIncident && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3 relative"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`font-mono text-xs ${getSeverityBadgeClass(parsedIncident.severity)}`}>
                    {parsedIncident.severity} Severity
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs bg-cyan-950/80 text-cyan-300 border-cyan-500/40">
                    {parsedIncident.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{parsedIncident.confidenceScore}% Confidence</span>
                  </span>
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700"
                  >
                    <Code className="h-3 w-3" />
                    <span>{showJson ? "Hide JSON" : "JSON Preview"}</span>
                  </button>
                </div>
              </div>

              {/* Grid of Parsed Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-400" /> Incident Type
                  </span>
                  <p className="font-semibold text-zinc-200 truncate">{parsedIncident.incidentType}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-cyan-400" /> Location
                  </span>
                  <p className="font-semibold text-zinc-200 truncate" title={parsedIncident.location}>
                    {parsedIncident.location}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                    <Car className="h-3 w-3 text-blue-400" /> Vehicles Involved
                  </span>
                  <p className="font-semibold text-zinc-200 truncate">{parsedIncident.vehiclesInvolved}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3 text-rose-400" /> Blocked Lanes
                  </span>
                  <p className="font-semibold text-zinc-200 truncate">{parsedIncident.blockedLanes}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                    <Users className="h-3 w-3 text-purple-400" /> Estimated Victims
                  </span>
                  <p className="font-semibold text-zinc-200">{parsedIncident.victimsEstimated} Persons</p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-sky-400" /> Weather Impact
                  </span>
                  <p className="font-semibold text-zinc-200 truncate">{parsedIncident.weatherImpact}</p>
                </div>
              </div>

              {/* Collapsible JSON Preview */}
              {showJson && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 border-t border-zinc-800/80"
                >
                  <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-cyan-300 overflow-x-auto">
                    {JSON.stringify(parsedIncident, null, 2)}
                  </pre>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
