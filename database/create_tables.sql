-- SirensClear Phase 4 Database Schema Definition
-- Run this script in the Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Hazards Table
CREATE TABLE IF NOT EXISTS public.hazards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    incident_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Critical', 'High', 'Moderate', 'Low')),
    priority TEXT NOT NULL CHECK (priority IN ('P1 - Immediate', 'P2 - High', 'P3 - Standard', 'P4 - Low')),
    location TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    vehicles_involved TEXT NOT NULL,
    blocked_lanes TEXT NOT NULL,
    victims_estimated INT NOT NULL DEFAULT 0,
    weather_impact TEXT DEFAULT 'Clear visibility',
    confidence DOUBLE PRECISION NOT NULL DEFAULT 95.0,
    verification_percentage DOUBLE PRECISION NOT NULL DEFAULT 90.0,
    source TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Investigating', 'Dispatched', 'Resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hazards_status ON public.hazards(status);
CREATE INDEX IF NOT EXISTS idx_hazards_severity ON public.hazards(severity);
CREATE INDEX IF NOT EXISTS idx_hazards_created_at ON public.hazards(created_at DESC);

-- 3. Create Hospitals Table
CREATE TABLE IF NOT EXISTS public.hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 100,
    available_beds INT NOT NULL DEFAULT 20,
    icu_available INT NOT NULL DEFAULT 5,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Ambulances Table
CREATE TABLE IF NOT EXISTS public.ambulances (
    id TEXT PRIMARY KEY,
    unit_number TEXT NOT NULL,
    driver TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Available', 'En Route', 'On Scene', 'Transporting', 'Maintenance')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    destination TEXT,
    eta DOUBLE PRECISION,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ambulances_status ON public.ambulances(status);

-- 5. Create Dispatches Table
CREATE TABLE IF NOT EXISTS public.dispatches (
    id TEXT PRIMARY KEY,
    hazard_id TEXT NOT NULL REFERENCES public.hazards(id) ON DELETE CASCADE,
    ambulance_id TEXT REFERENCES public.ambulances(id) ON DELETE SET NULL,
    hospital_id TEXT REFERENCES public.hospitals(id) ON DELETE SET NULL,
    eta DOUBLE PRECISION NOT NULL,
    distance DOUBLE PRECISION NOT NULL,
    reasoning TEXT NOT NULL,
    confidence DOUBLE PRECISION NOT NULL DEFAULT 95.0,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Dispatched', 'Reassigned', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dispatches_hazard_id ON public.dispatches(hazard_id);

-- 6. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hazard_id TEXT REFERENCES public.hazards(id) ON DELETE SET NULL,
    raw_text TEXT NOT NULL,
    parsed_json JSONB NOT NULL,
    source TEXT NOT NULL DEFAULT 'CCTV AI Vision',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- 7. Enable Row Level Security (RLS) & Public Access Policies for Development
ALTER TABLE public.hazards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Permissive Development RLS Policies
CREATE POLICY "Allow public read access on hazards" ON public.hazards FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on hazards" ON public.hazards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on hazards" ON public.hazards FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on hazards" ON public.hazards FOR DELETE USING (true);

CREATE POLICY "Allow public read access on hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on hospitals" ON public.hospitals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on hospitals" ON public.hospitals FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on ambulances" ON public.ambulances FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on ambulances" ON public.ambulances FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on ambulances" ON public.ambulances FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on dispatches" ON public.dispatches FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on dispatches" ON public.dispatches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on dispatches" ON public.dispatches FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on reports" ON public.reports FOR INSERT WITH CHECK (true);

-- 8. Enable Realtime Replication Publication
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE hazards, dispatches, ambulances, reports;
COMMIT;
