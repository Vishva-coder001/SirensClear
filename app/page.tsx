"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Siren,
  ShieldCheck,
  Radio,
  Zap,
  Activity,
  Cpu,
  Navigation,
  Clock,
  Eye,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  BarChart3,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
      {/* 1. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-red-950 border border-red-500/40 text-red-500 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              <Siren className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-wider font-mono bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                SirensClear
              </span>
              <span className="text-[10px] text-zinc-500 font-mono font-semibold tracking-tight uppercase">
                AI Emergency Routing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-zinc-400">
            <a href="#home" className="hover:text-zinc-100 transition-colors">Home</a>
            <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
            <a href="#about" className="hover:text-zinc-100 transition-colors">About Us</a>
            <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">How It Works</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="font-mono text-xs border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300">
                <Lock className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                <span>Login</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button className="font-mono text-xs font-bold bg-red-600 hover:bg-red-500 text-zinc-950 uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <span>Launch Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-800 p-4 space-y-3 font-mono text-sm">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-zinc-100 py-1"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-zinc-100 py-1"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-zinc-100 py-1"
            >
              About Us
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-zinc-100 py-1"
            >
              How It Works
            </a>
            <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full font-mono text-xs border-zinc-800 bg-zinc-900 text-zinc-300">
                  Login
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full font-mono text-xs font-bold bg-red-600 hover:bg-red-500 text-zinc-950 uppercase tracking-wider">
                  Launch Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <Badge variant="outline" className="font-mono text-xs bg-red-950/60 text-red-400 border-red-500/30 px-3.5 py-1 inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Next-Gen Emergency Situational Intelligence</span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-mono tracking-tight leading-tight">
              Smarter Routing. Faster Response.{" "}
              <span className="bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                Saved Lives.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              SirensClear combines AI incident extraction, multi-source hazard verification, dynamic traffic preemption, and ICU bed availability matrices to optimize emergency response during the critical Golden Hour.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto font-mono text-sm font-bold bg-red-600 hover:bg-red-500 text-zinc-950 uppercase tracking-wider px-8 h-12 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
                  <span>Launch Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto font-mono text-sm border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 px-8 h-12">
                  <span>See How It Works</span>
                </Button>
              </a>
            </div>
          </div>

          {/* FEATURE SUMMARY CARDS (5 Highlights) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-16 max-w-5xl mx-auto font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-1.5">
              <Activity className="h-5 w-5 text-red-400 mx-auto" />
              <span className="font-bold text-zinc-200 block">24/7 Monitoring</span>
              <span className="text-[10px] text-zinc-500 block">Real-time Feed</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-1.5">
              <Cpu className="h-5 w-5 text-amber-400 mx-auto" />
              <span className="font-bold text-zinc-200 block">AI Powered</span>
              <span className="text-[10px] text-zinc-500 block">NLP Extraction</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-1.5">
              <Radio className="h-5 w-5 text-emerald-400 mx-auto" />
              <span className="font-bold text-zinc-200 block">Hazard Grid</span>
              <span className="text-[10px] text-zinc-500 block">Multi-Source Sync</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-1.5">
              <Navigation className="h-5 w-5 text-cyan-400 mx-auto" />
              <span className="font-bold text-zinc-200 block">Smart Routing</span>
              <span className="text-[10px] text-zinc-500 block">OSRM Preemption</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-1.5 col-span-2 md:col-span-1">
              <Clock className="h-5 w-5 text-purple-400 mx-auto" />
              <span className="font-bold text-zinc-200 block">Golden Hour</span>
              <span className="text-[10px] text-zinc-500 block">Time Reduction</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 bg-zinc-950/60 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="outline" className="font-mono text-[11px] bg-blue-950/60 text-blue-400 border-blue-500/30">
              Core Capabilities
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-mono text-zinc-100 tracking-tight">
              Engineered for Emergency Dispatchers
            </h2>
            <p className="text-xs sm:text-sm font-mono text-zinc-400">
              Automated intelligence layers operating alongside human command staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all">
              <div className="h-10 w-10 rounded-xl bg-red-950 border border-red-500/30 text-red-400 flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-mono text-zinc-100">AI Hazard Extraction</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Extracts location, severity, vehicle count, and hazard types from raw multi-source emergency calls instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all">
              <div className="h-10 w-10 rounded-xl bg-blue-950 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Radio className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-mono text-zinc-100">Real-time Dashboard</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Live interactive telemetry displaying active hazard coordinates, ambulance positions, and active dispatches.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all">
              <div className="h-10 w-10 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Navigation className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-mono text-zinc-100">Smart Routing</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Calculates Haversine arterial vectors and dynamic ETAs to recommend optimal responder units and ICU destinations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-mono text-zinc-100">Human-in-the-Loop</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Dispatchers retain full authority to override, reassign, or confirm AI recommendations with one click.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all">
              <div className="h-10 w-10 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-mono text-zinc-100">Golden Hour Impact</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Minimizes arrival delay through intelligent unit staging and hospital bed availability matching.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all">
              <div className="h-10 w-10 rounded-xl bg-amber-950 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-mono text-zinc-100">Resilient Architecture</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Supabase Realtime database sync with automatic local seed fallback for uninterrupted offline operations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all">
              <div className="h-10 w-10 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-mono text-zinc-100">Analytics & Reports</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Comprehensive incident timelines and post-dispatch analytics tracking response performance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all">
              <div className="h-10 w-10 rounded-xl bg-pink-950 border border-pink-500/30 text-pink-400 flex items-center justify-center">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-mono text-zinc-100">24/7 Monitoring</h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                Continuous background sync monitoring active incidents, unit statuses, and hazard severity changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="about" className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="font-mono text-[11px] bg-red-950/60 text-red-400 border-red-500/30">
                About SirensClear
              </Badge>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-mono text-zinc-100 tracking-tight">
                Our Mission & Vision
              </h2>

              <p className="text-xs sm:text-sm font-mono text-zinc-400 leading-relaxed">
                SirensClear was built to solve critical emergency dispatch bottlenecks. Traditional dispatch systems often suffer from manual phone relay delays, unverified hazard reports, and sub-optimal hospital routing.
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <span className="font-bold text-red-400 uppercase tracking-wider block">Our Mission</span>
                  <p className="text-zinc-300">To shave critical minutes off emergency arrival times by providing dispatchers with automated AI incident parsing and intelligent unit routing.</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <span className="font-bold text-amber-400 uppercase tracking-wider block">Who We Serve</span>
                  <p className="text-zinc-300">Emergency medical services, city traffic control authorities, ambulance fleet managers, and hospital triage centers.</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block">Our Promise</span>
                  <p className="text-zinc-300">Human-in-the-loop control, maximum data transparency, and seamless offline resiliency during network outages.</p>
                </div>
              </div>
            </div>

            {/* Metrics display card */}
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-6 relative overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 absolute top-0 left-0" />

              <h3 className="text-lg font-bold font-mono text-zinc-200">System Performance Metrics</h3>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-2xl font-extrabold text-emerald-400 block">&lt; 3.2m</span>
                  <span className="text-[10px] text-zinc-500 block uppercase">Average ETA</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-2xl font-extrabold text-amber-400 block">94.8%</span>
                  <span className="text-[10px] text-zinc-500 block uppercase">AI Verification</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-2xl font-extrabold text-cyan-400 block">100%</span>
                  <span className="text-[10px] text-zinc-500 block uppercase">Dispatcher Override</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-2xl font-extrabold text-purple-400 block">Realtime</span>
                  <span className="text-[10px] text-zinc-500 block uppercase">Supabase Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-zinc-950/60 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="outline" className="font-mono text-[11px] bg-emerald-950/60 text-emerald-400 border-emerald-500/30">
              Workflow Architecture
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-mono text-zinc-100 tracking-tight">
              5 Steps to Emergency Resolution
            </h2>
            <p className="text-xs sm:text-sm font-mono text-zinc-400">
              From raw emergency signal ingestion to confirmed ambulance dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-center relative">
              <span className="h-8 w-8 rounded-full bg-red-950 text-red-400 border border-red-500/40 flex items-center justify-center font-bold mx-auto">1</span>
              <h3 className="font-bold text-zinc-200">Report Received</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Raw multi-source emergency calls or text signals ingested.</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-center relative">
              <span className="h-8 w-8 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold mx-auto">2</span>
              <h3 className="font-bold text-zinc-200">AI Analyzes</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">NLP extracts location, severity, vehicle count, and hazard type.</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-center relative">
              <span className="h-8 w-8 rounded-full bg-blue-950 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold mx-auto">3</span>
              <h3 className="font-bold text-zinc-200">Hazard Verified</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Multi-source cross-checking generates a confidence score.</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-center relative">
              <span className="h-8 w-8 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold mx-auto">4</span>
              <h3 className="font-bold text-zinc-200">Smart Routing</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Optimal ambulance unit and target hospital selected.</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-center relative">
              <span className="h-8 w-8 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold mx-auto">5</span>
              <h3 className="font-bold text-zinc-200">Response Dispatched</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Dispatcher approves or reassigns with live timeline updates.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/login">
              <Button className="font-mono text-sm font-bold bg-red-600 hover:bg-red-500 text-zinc-950 uppercase tracking-wider px-8 h-12 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <span>Access Dispatch Console</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 bg-zinc-950 border-t border-zinc-900 font-mono text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Siren className="h-4 w-4 text-red-500" />
            <span className="text-zinc-300 font-bold">SirensClear</span>
            <span>&copy; {new Date().getFullYear()} AI Emergency Command System</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-zinc-300">Dashboard</Link>
            <Link href="/login" className="hover:text-zinc-300">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
