"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ProfileService } from "@/services/ProfileService";
import { AmbulanceService } from "@/services/AmbulanceService";
import { DispatchService } from "@/services/DispatchService";
import { AIDispatchRecommendation } from "@/types/ai";
import { AmbulanceDbRow } from "@/types/database";
import { MapPlaceholder } from "@/components/dashboard/map-placeholder";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Siren,
  Navigation,
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
  Activity,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function AmbulanceDashboardPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [unitInfo, setUnitInfo] = useState<AmbulanceDbRow | null>(null);
  const [activeDispatch, setActiveDispatch] = useState<AIDispatchRecommendation | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.replace("/login");
          return;
        }

        setUserEmail(session.user.email || null);
        const profileRes = await ProfileService.getProfile(session.user.id);
        const unitId = profileRes.data?.ambulance_unit_id || "AMB-A04";

        // Fetch unit details
        const ambulancesRes = await AmbulanceService.getAllAmbulances();
        const found = ambulancesRes.data?.find((a) => a.id === unitId) || ambulancesRes.data?.[0];
        if (found) {
          setUnitInfo(found);
        }

        // Fetch active dispatches
        const dispatchesRes = await DispatchService.getAllDispatches();
        const active = dispatchesRes.data?.find(
          (d) => d.unitId === unitId || d.recommendedAmbulance.includes(found?.unit_number || "A04")
        );
        if (active) {
          setActiveDispatch(active);
        }
      } catch {
        // Secure fail
      } finally {
        setAuthLoading(false);
      }
    };

    void verifyAuth();
  }, [router]);

  const handleStatusUpdate = async (newStatus: "Available" | "En Route" | "On Scene" | "Transporting") => {
    if (!unitInfo) return;
    setActionLoading(true);

    try {
      await AmbulanceService.updateAmbulanceStatus(unitInfo.id, newStatus, activeDispatch?.recommendedHospital || "AIG Hospitals");
      setUnitInfo((prev: AmbulanceDbRow | null) => (prev ? { ...prev, status: newStatus } : null));

      toast.success(`Unit Status Updated: ${newStatus}`, {
        description: `Telemetry broadcast sent to Command SOC.`,
      });
    } catch (err) {
      toast.error("Status Update Failed", {
        description: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-mono text-xs">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400 mb-2" />
        <span>Verifying ambulance terminal telemetry...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30">
      {/* Top Mobile-Friendly Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 font-mono">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Siren className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>SirensClear Responder Terminal</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                {unitInfo?.unit_number || "AMB-A04"}
              </span>
            </h1>
            <span className="text-[10px] text-zinc-400">{userEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-emerald-950 text-emerald-300 border-emerald-500/40 text-[10px] hidden sm:flex gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>Unit Telemetry Locked</span>
          </Badge>

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="font-mono text-xs border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Terminal Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status Banner */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-950 border border-blue-500/30 text-blue-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 block uppercase">Current Unit Operational Status</span>
              <p className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <span>{unitInfo?.status || "En Route"}</span>
                <span className="text-xs font-normal text-zinc-400">({unitInfo?.driver || "Paramedic Alpha"})</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <Button
              onClick={() => handleStatusUpdate("En Route")}
              disabled={actionLoading}
              className="flex-1 sm:flex-none font-mono text-xs bg-blue-600 hover:bg-blue-500 text-zinc-950 font-bold"
            >
              En Route
            </Button>
            <Button
              onClick={() => handleStatusUpdate("On Scene")}
              disabled={actionLoading}
              className="flex-1 sm:flex-none font-mono text-xs bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold"
            >
              On Scene
            </Button>
            <Button
              onClick={() => handleStatusUpdate("Transporting")}
              disabled={actionLoading}
              className="flex-1 sm:flex-none font-mono text-xs bg-purple-600 hover:bg-purple-500 text-zinc-950 font-bold"
            >
              Transporting
            </Button>
            <Button
              onClick={() => handleStatusUpdate("Available")}
              disabled={actionLoading}
              className="flex-1 sm:flex-none font-mono text-xs bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold"
            >
              Mission Complete
            </Button>
          </div>
        </div>

        {/* Two-Column Grid: Active Mission Details & Navigation Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Mission Details (5 Columns) */}
          <div className="lg:col-span-5 space-y-4 font-mono">
            <Card className="glass-card border-zinc-800 bg-zinc-950/90 shadow-2xl">
              <CardHeader className="pb-3 border-b border-zinc-800/80">
                <CardTitle className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <span>Assigned Emergency Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                {activeDispatch ? (
                  <>
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 space-y-1">
                      <span className="text-[10px] text-red-400 uppercase font-semibold">Incident Code</span>
                      <p className="font-bold text-sm">{activeDispatch.hazardId} &bull; Critical Response</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-red-400" /> Location
                        </span>
                        <span className="font-bold text-zinc-200">Gachibowli Flyover</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Navigation className="h-3.5 w-3.5 text-cyan-400" /> Vector Distance
                        </span>
                        <span className="font-bold text-zinc-200">{activeDispatch.distanceKm} km</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-amber-400" /> Target ETA
                        </span>
                        <span className="font-bold text-emerald-400">{activeDispatch.etaMinutes} mins</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-purple-400" /> Destination Hospital
                        </span>
                        <span className="font-bold text-zinc-200">{activeDispatch.recommendedHospital}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-500/20 space-y-1">
                      <span className="text-[10px] text-blue-400 uppercase font-semibold">SOC Dispatch Reasoning</span>
                      <p className="text-zinc-300 italic">&ldquo;{activeDispatch.reasoning}&rdquo;</p>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-zinc-400 space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                    <p className="font-bold text-zinc-200">No Active Emergency Dispatches</p>
                    <p className="text-[11px] text-zinc-500">Unit is currently staged and available for primary SOC dispatch.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tactical Map Display (7 Columns) */}
          <div className="lg:col-span-7 h-[550px]">
            <MapPlaceholder />
          </div>
        </div>
      </main>
    </div>
  );
}
