"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ProfileService } from "@/services/ProfileService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShieldCheck, Siren, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialCheck, setInitialCheck] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profileRes = await ProfileService.getProfile(session.user.id);
          const role = profileRes.data?.role || "admin";
          if (role === "ambulance") {
            router.replace("/ambulance");
          } else {
            router.replace("/dashboard");
          }
          return;
        }
      } catch {
        // Safe fail
      } finally {
        setInitialCheck(false);
      }
    };

    void checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setErrorMessage(error?.message || "Invalid credentials. Please check your email and password.");
        toast.error("Authentication Failed", {
          description: error?.message || "Invalid email or password",
        });
        setLoading(false);
        return;
      }

      // Fetch persistent profile role from Supabase PostgreSQL
      const profileRes = await ProfileService.getProfile(data.user.id);
      const role = profileRes.data?.role || "admin";

      toast.success("Authentication Successful", {
        description: `Logged in as ${profileRes.data?.full_name || data.user.email} (${role.toUpperCase()})`,
      });

      if (role === "ambulance") {
        router.replace("/ambulance");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during login.";
      setErrorMessage(msg);
      toast.error("Login Error", { description: msg });
      setLoading(false);
    }
  };

  if (initialCheck) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 font-mono text-xs">
        <Loader2 className="h-6 w-6 animate-spin text-red-500 mb-2" />
        <span className="text-zinc-400">Verifying session token...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-red-500/30">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold font-mono">
            <div className="h-9 w-9 rounded-lg bg-red-950 border border-red-500/40 text-red-500 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              <Siren className="h-5 w-5 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              SirensClear
            </span>
          </Link>
          <p className="text-xs text-zinc-400 font-mono">
            Secure Emergency Command & Response Authentication
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="glass-card border-zinc-800 bg-zinc-950/90 shadow-2xl p-6 space-y-4">
          <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between border-b border-zinc-800/80 pb-3">
            <CardTitle className="text-base font-mono font-bold text-zinc-200 flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400" />
              <span>Operational Access Sign In</span>
            </CardTitle>
            <Badge variant="outline" className="font-mono text-[10px] bg-red-950/60 text-red-400 border-red-500/30">
              Supabase Auth
            </Badge>
          </CardHeader>

          <CardContent className="p-0 pt-2 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-300 font-medium">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dispatcher@sirensclear.gov.in"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-300 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-2 pr-9 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider h-11 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <span>Sign In to SirensClear</span>
                )}
              </Button>
            </form>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Role-Based Access System</span>
              </div>
              <p className="text-zinc-500">
                Roles are dynamically resolved from user profile records in Supabase PostgreSQL (Admin &rarr; /dashboard, Ambulance &rarr; /ambulance).
              </p>
            </div>

            <div className="text-center pt-1">
              <Link href="/" className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
                &larr; Return to Public Landing Page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
