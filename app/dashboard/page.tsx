"use client";

import React, { useEffect, useState } from "react";
import { testConnection } from "@/lib/supabase/testConnection";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { MapPlaceholder } from "@/components/dashboard/map-placeholder";
import { HazardPanel } from "@/components/dashboard/hazard-panel";
import { DecisionEnginePanel } from "@/components/dashboard/decision-engine-panel";
import { DispatchPanel } from "@/components/dashboard/dispatch-panel";
import { OVERVIEW_STATS } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

import { AIHazardIntelligence } from "@/components/ai/AIHazardIntelligence";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ProfileService } from "@/services/ProfileService";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    testConnection();

    const verifyAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.replace("/login");
          return;
        }

        const profileRes = await ProfileService.getProfile(session.user.id);
        const role = profileRes.data?.role || "admin";

        if (role === "ambulance") {
          router.replace("/ambulance");
          return;
        }
      } catch {
        // Secure fail
      } finally {
        setAuthLoading(false);
      }
    };

    void verifyAuth();
  }, [router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-mono text-xs">
        <span>Verifying command authorization...</span>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* 1. MAIN DASHBOARD VIEW */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 font-mono tracking-tight flex items-center gap-2">
                <span>Emergency Overview</span>
                <span className="text-xs font-normal text-zinc-500 font-mono">
                  (Live Response Metrics)
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Real-time situational intelligence and automated route optimization grid
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Grid Matrix: <strong>Active</strong></span>
            </div>
          </div>

          {/* Four Statistic Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OVERVIEW_STATS.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>

          {/* Central Dominant Map & Right Hazard Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Dominant Central Map Card (8 Columns on Desktop) */}
            <div className="lg:col-span-8">
              <MapPlaceholder />
            </div>

            {/* Right Hazard Panel (4 Columns on Desktop) */}
            <div className="lg:col-span-4 h-[520px] lg:h-[620px]">
              <HazardPanel />
            </div>
          </div>

          {/* Phase 3 AI Hazard Intelligence Section */}
          <div className="pt-4 border-t border-zinc-800/80">
            <AIHazardIntelligence />
          </div>

          {/* Decision Engine Panel (Full Width Row) */}
          <DecisionEnginePanel />

          {/* Bottom Emergency Dispatch Control Panel (Full Width Row) */}
          <DispatchPanel />
        </div>
      )}

      {/* Dedicated AI Intelligence Tab View */}
      {activeTab === "ai-intelligence" && (
        <div className="space-y-4">
          <AIHazardIntelligence />
        </div>
      )}

      {/* 2. LIVE MAP ISOLATED VIEW */}
      {activeTab === "live-map" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-100 font-mono">
              Live Map Operations Grid
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Full-Screen Telemetry Monitor
            </span>
          </div>
          <MapPlaceholder />
        </div>
      )}

      {/* 3. HAZARDS ISOLATED VIEW */}
      {activeTab === "hazards" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-100 font-mono">
              Active Road Hazards Matrix
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Live Incidents Feed
            </span>
          </div>
          <div className="h-[650px]">
            <HazardPanel />
          </div>
        </div>
      )}

      {/* 4. DISPATCH ISOLATED VIEW */}
      {activeTab === "dispatch" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-100 font-mono">
              Ambulance Dispatch Station
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Priority Command Unit
            </span>
          </div>
          <DispatchPanel />
          <DecisionEnginePanel />
        </div>
      )}
    </DashboardLayout>
  );
}
