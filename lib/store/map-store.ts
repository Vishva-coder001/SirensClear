import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { RouteGeoJSON, EMPTY_ROUTE } from '@/lib/map-config';

export interface Hazard {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  priority: string;
  latitude: number;
  longitude: number;
  status: string;
  verification_pct: number;
  created_at: string;
}

export interface Ambulance {
  id: string;
  callsign: string;
  driver_name: string;
  status: 'available' | 'en_route' | 'at_scene' | 'returning';
  latitude: number;
  longitude: number;
  eta_minutes: number;
  hospital_destination?: string;
}

interface MapState {
  hazards: Hazard[];
  ambulances: Ambulance[];
  activeRoute: RouteGeoJSON;
  selectedHazardId: string | null;
  selectedAmbulanceId: string | null;
  isRealtimeConnected: boolean;

  // Actions
  setHazards: (hazards: Hazard[]) => void;
  setAmbulances: (ambulances: Ambulance[]) => void;
  setSelectedHazard: (id: string | null) => void;
  setSelectedAmbulance: (id: string | null) => void;
  setActiveRoute: (route: RouteGeoJSON) => void;
  
  // Realtime Lifecycle Subscriptions
  initializeRealtimeSubscriptions: () => () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  hazards: [],
  ambulances: [],
  activeRoute: EMPTY_ROUTE,
  selectedHazardId: null,
  selectedAmbulanceId: null,
  isRealtimeConnected: false,

  setHazards: (hazards) => set({ hazards }),
  setAmbulances: (ambulances) => set({ ambulances }),
  setSelectedHazard: (id) => set({ selectedHazardId: id }),
  setSelectedAmbulance: (id) => set({ selectedAmbulanceId: id }),
  setActiveRoute: (route) => set({ activeRoute: route }),

  initializeRealtimeSubscriptions: () => {
    // 1. Realtime Hazards Channel
    const hazardChannel = supabase
      .channel('public:hazards')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hazards' },
        (payload) => {
          const currentHazards = get().hazards;
          if (payload.eventType === 'INSERT') {
            set({ hazards: [payload.new as Hazard, ...currentHazards] });
          } else if (payload.eventType === 'UPDATE') {
            set({
              hazards: currentHazards.map((h) =>
                h.id === payload.new.id ? (payload.new as Hazard) : h
              ),
            });
          } else if (payload.eventType === 'DELETE') {
            set({
              hazards: currentHazards.filter((h) => h.id === payload.old.id),
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          set({ isRealtimeConnected: true });
        }
      });

    // 2. Realtime Telemetry Channel
    const ambulanceChannel = supabase
      .channel('public:ambulances')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ambulances' },
        (payload) => {
          const currentAmbulances = get().ambulances;
          if (payload.eventType === 'INSERT') {
            set({ ambulances: [...currentAmbulances, payload.new as Ambulance] });
          } else if (payload.eventType === 'UPDATE') {
            set({
              ambulances: currentAmbulances.map((a) =>
                a.id === payload.new.id ? (payload.new as Ambulance) : a
              ),
            });
          }
        }
      )
      .subscribe();

    // Clean up channel subscriptions on component unmount
    return () => {
      supabase.removeChannel(hazardChannel);
      supabase.removeChannel(ambulanceChannel);
      set({ isRealtimeConnected: false });
    };
  },
}));