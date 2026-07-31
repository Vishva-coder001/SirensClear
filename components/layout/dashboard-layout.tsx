"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { StatusBar } from "@/components/dashboard/status-bar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080a0e] text-zinc-100 antialiased font-sans">
      {/* Sidebar for Desktop */}
      <div className="hidden sm:flex shrink-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-zinc-950">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileOpen(false);
              }}
              isCollapsed={false}
              setIsCollapsed={() => {}}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {/* Dynamic Main Body Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-16">
          {children}
        </main>

        {/* Bottom System Status Bar */}
        <StatusBar />
      </div>
    </div>
  );
}
