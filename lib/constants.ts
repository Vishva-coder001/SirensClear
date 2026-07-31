import type { RouteGeoJSON } from "@/lib/map-config";

export interface StatMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  icon: string;
  badge?: string;
}

/** Controls which overlay layers are visible on the map */
export interface MapLayerVisibility {
  ambulances: boolean;
  hazards: boolean;
  route: boolean;
}

export const DEFAULT_LAYER_VISIBILITY: MapLayerVisibility = {
  ambulances: true,
  hazards: true,
  route: true,
};

export interface HazardItem {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  verificationStatus: 'verified' | 'unverified' | 'pending';
  verificationSource: string;
  location: string;
  coordinates: [number, number];
  timestamp: string;
  affectedRoutes: string[];
  description: string;
}

export interface DecisionEngineData {
  detectedHazard: string;
  suggestedRoute: string;
  estimatedTimeSaved: string;
  confidenceScore: number;
  recommendedHospital: string;
  trafficReduction: string;
  alternateOptionsCount: number;
  lastUpdated: string;
}

export interface SystemService {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  latency: string;
  detail: string;
}

export interface AmbulanceUnit {
  id: string;
  callsign: string;
  status: 'en_route' | 'available' | 'at_scene' | 'returning';
  hospitalTarget: string;
  driver: string;
  eta: string;
  speed: string;
  coordinates: [number, number];
}

// ----------------------------------------------------
// ISOLATED MOCK CONSTANTS (Prepared for API integration)
// ----------------------------------------------------

export const OVERVIEW_STATS: StatMetric[] = [
  {
    id: 'active-ambulances',
    title: 'Active Ambulances',
    value: '42 / 48',
    subtitle: 'Units in service',
    trend: '▲ 14% Today',
    trendType: 'positive',
    icon: 'Ambulance',
    badge: '87.5% Fleet Active',
  },
  {
    id: 'live-hazards',
    title: 'Live Hazards',
    value: '18',
    subtitle: 'Active grid road hazards',
    trend: '▲ 2 New (Last 15m)',
    trendType: 'negative',
    icon: 'Flame',
    badge: 'High Impact Zone 4',
  },
  {
    id: 'critical-incidents',
    title: 'Critical Incidents',
    value: '04',
    subtitle: 'Code 3 Red Dispatch',
    trend: '▼ 1 Resolved',
    trendType: 'positive',
    icon: 'AlertTriangle',
    badge: 'Priority Response',
  },
  {
    id: 'average-eta',
    title: 'Average ETA',
    value: '4.2 Min',
    subtitle: 'Urban transit time',
    trend: '▼ 1.8 min Saved',
    trendType: 'positive',
    icon: 'Timer',
    badge: 'Optimized',
  },
];

export const HAZARDS_LIST: HazardItem[] = [
  {
    id: 'hz-101',
    title: 'Multi-Vehicle Collision on Banjara Hills Rd.',
    severity: 'critical',
    verificationStatus: 'verified',
    verificationSource: 'Traffic Cam #402 & 911 AI Feed',
    location: 'Banjara Hills Rd No. 12 & Jubilee Hills',
    coordinates: [78.4490, 17.4310],
    timestamp: '2 mins ago',
    affectedRoutes: ['NH 65 (Inner Ring)', 'Jubilee Hills Junction'],
    description: '3 vehicles blocking westbound lanes. Emergency services dispatched.',
  },
  {
    id: 'hz-102',
    title: 'Waterlogging – Tank Bund Road Closure',
    severity: 'high',
    verificationStatus: 'verified',
    verificationSource: 'Municipal Sensor Grid #12',
    location: 'Tank Bund Rd near NTR Garden',
    coordinates: [78.4744, 17.4239],
    timestamp: '8 mins ago',
    affectedRoutes: ['Tank Bund Express', 'Lakdi Ka Pul Bypass'],
    description: 'Heavy inundation causing complete lane closure near Hussain Sagar Lake.',
  },
  {
    id: 'hz-103',
    title: 'Signal Failure – Ameerpet Junction',
    severity: 'high',
    verificationStatus: 'unverified',
    verificationSource: 'Automated Telemetry Ping',
    location: 'Ameerpet Metro Station Junction',
    coordinates: [78.4482, 17.4375],
    timestamp: '14 mins ago',
    affectedRoutes: ['Ameerpet Metro Corridor', 'Punjagutta Ring Rd'],
    description: 'Traffic signals flashing red in all directions. Heavy congestion forming.',
  },
  {
    id: 'hz-104',
    title: 'Road Debris on ORR Stretch',
    severity: 'moderate',
    verificationStatus: 'verified',
    verificationSource: 'Highway Patrol Broadcast',
    location: 'Outer Ring Road near Gachibowli Exit',
    coordinates: [78.3580, 17.4399],
    timestamp: '21 mins ago',
    affectedRoutes: ['ORR Southbound Lane 2'],
    description: 'Cargo debris restricted right shoulder. Speed reduced to 40 km/h.',
  },
  {
    id: 'hz-105',
    title: 'Power Outage – Hitech City Grid Zone',
    severity: 'moderate',
    verificationStatus: 'pending',
    verificationSource: 'Public Safety Dispatch',
    location: 'HITEC City Main Rd & Cyber Towers',
    coordinates: [78.3810, 17.4474],
    timestamp: '35 mins ago',
    affectedRoutes: ['HITEC City Corridor'],
    description: 'Power surge rendered 4 key intersections unmonitored near HITEC City.',
  },
];

export const DECISION_ENGINE_DATA: DecisionEngineData = {
  detectedHazard: 'Multi-Vehicle Collision at Market St & 4th',
  suggestedRoute: 'Reroute Unit AMB-08 via Bypass 4 → Bay Bridge Expressway',
  estimatedTimeSaved: '6.5 mins (34% faster arrival)',
  confidenceScore: 96.4,
  recommendedHospital: 'St. Jude Central Trauma Center (Level 1)',
  trafficReduction: '18% congestion bypass',
  alternateOptionsCount: 3,
  lastUpdated: '12 seconds ago',
};

export const SYSTEM_SERVICES: SystemService[] = [
  {
    name: 'Supabase',
    status: 'operational',
    latency: '12ms',
    detail: 'Database & Auth Connected',
  },
  {
    name: 'OSRM Engine',
    status: 'operational',
    latency: '8ms',
    detail: '2,400 rps routing matrix active',
  },
  {
    name: 'AI Engine',
    status: 'operational',
    latency: '34ms',
    detail: 'Neural Routing v3.1 Online',
  },
  {
    name: 'System Status',
    status: 'operational',
    latency: '99.98% Uptime',
    detail: 'ALL SYSTEMS OPERATIONAL',
  },
];

export const MOCK_AMBULANCE_UNITS: AmbulanceUnit[] = [
  {
    id: 'amb-08',
    callsign: 'AMB-08',
    status: 'en_route',
    hospitalTarget: 'Yashoda Hospitals, Secunderabad',
    driver: 'Unit Alpha 1',
    eta: '3.4 min',
    speed: '58 km/h',
    // [longitude, latitude] – Banjara Hills area
    coordinates: [78.4490, 17.4250],
  },
  {
    id: 'amb-14',
    callsign: 'AMB-14',
    status: 'at_scene',
    hospitalTarget: 'Apollo Hospital, Jubilee Hills',
    driver: 'Unit Beta 3',
    eta: 'On Scene',
    speed: '0 km/h',
    // Necklace Road area
    coordinates: [78.4744, 17.4140],
  },
  {
    id: 'amb-22',
    callsign: 'AMB-22',
    status: 'available',
    hospitalTarget: 'Standby – HITEC City Base',
    driver: 'Unit Gamma 7',
    eta: 'Standby',
    speed: '0 km/h',
    // HITEC City area
    coordinates: [78.3810, 17.4474],
  },
  {
    id: 'amb-03',
    callsign: 'AMB-03',
    status: 'returning',
    hospitalTarget: 'Yashoda Hospitals, Secunderabad',
    driver: 'Unit Delta 4',
    eta: '7.1 min',
    speed: '42 km/h',
    // Ameerpet area
    coordinates: [78.4482, 17.4375],
  },
];

// ─── Mock Route (Hyderabad – replaces EMPTY_ROUTE until OSRM is wired) ─────────
//
// Represents an optimised ambulance path from HITEC City (AMB-22 standby base)
// through Kondapur and Jubilee Hills to the hz-101 incident zone in Banjara Hills.
// Swap features[0].geometry.coordinates with an OSRM route geometry in Phase 4.

export const MOCK_ROUTE: RouteGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { routeId: "mock-route-01", unitId: "amb-22" },
      geometry: {
        type: "LineString",
        coordinates: [
          [78.3810, 17.4474], // HITEC City – AMB-22 standby base
          [78.3950, 17.4450], // Mindspace Junction
          [78.4060, 17.4430], // Raidurg
          [78.4150, 17.4410], // Kondapur
          [78.4280, 17.4380], // Jubilee Hills Check Post
          [78.4332, 17.4401], // Road No. 36, Jubilee Hills
          [78.4400, 17.4350], // Banjara Hills approach
          [78.4490, 17.4310], // hz-101 incident zone – Banjara Hills Rd No. 12
        ],
      },
    },
  ],
};

export const DISPATCH_PRESETS = {
  origins: [
    'St. Jude Central Trauma Center (Base)',
    'Westside Emergency Response Hub',
    'Downtown Dispatch Bay 3',
    'Bayfront Medical Center Station',
  ],
  destinations: [
    '1044 Market Street, Sector 7 (Incident #409)',
    'Interstate 80 Exit 2B Emergency Lane',
    '520 Mission St - Tower 4 Lobby',
    'Civic Center Plaza Escalator Station',
  ],
  priorities: [
    { value: 'code-3', label: 'CODE 3 - Critical Emergency (Lights & Siren)', color: 'text-red-400' },
    { value: 'code-2', label: 'CODE 2 - Urgent Expedited', color: 'text-amber-400' },
    { value: 'code-1', label: 'CODE 1 - Routine Standard', color: 'text-blue-400' },
  ],
};
