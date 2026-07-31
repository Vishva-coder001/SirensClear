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
    title: 'Multi-Vehicle Collision on Market St.',
    severity: 'critical',
    verificationStatus: 'verified',
    verificationSource: 'Traffic Cam #402 & 911 AI Feed',
    location: 'Market St & 4th Avenue',
    coordinates: [37.785, -122.406],
    timestamp: '2 mins ago',
    affectedRoutes: ['Route A4 (Central)', 'Route B1'],
    description: '3 vehicles blocking eastbound lanes. Emergency services on scene.',
  },
  {
    id: 'hz-102',
    title: 'Water Main Burst - Bay Bridge Approach',
    severity: 'high',
    verificationStatus: 'verified',
    verificationSource: 'Municipal Sensor Grid #12',
    location: 'Interstate 80 Eastbound Exit 2B',
    coordinates: [37.789, -122.389],
    timestamp: '8 mins ago',
    affectedRoutes: ['Express Corridor 3'],
    description: 'High water accumulation causing severe traction loss and lane closures.',
  },
  {
    id: 'hz-103',
    title: 'Grid 7 Signal Infrastructure Failure',
    severity: 'high',
    verificationStatus: 'unverified',
    verificationSource: 'Automated Telemetry Ping',
    location: 'Mission St & 16th Street',
    coordinates: [37.765, -122.419],
    timestamp: '14 mins ago',
    affectedRoutes: ['Mission Bypass South'],
    description: 'Traffic signals flashing red in all directions. Heavy congestion forming.',
  },
  {
    id: 'hz-104',
    title: 'Debris Spill on Highway 101',
    severity: 'moderate',
    verificationStatus: 'verified',
    verificationSource: 'Highway Patrol Broadcast',
    location: 'HWY 101 Mile Marker 14.2',
    coordinates: [37.751, -122.404],
    timestamp: '21 mins ago',
    affectedRoutes: ['HWY 101 Southbound'],
    description: 'Cargo container spill restricted right shoulder. Reduced clearance speed.',
  },
  {
    id: 'hz-105',
    title: 'Power Outage Traffic Signal Blackout',
    severity: 'moderate',
    verificationStatus: 'pending',
    verificationSource: 'Public Safety Dispatch',
    location: 'Geary Blvd & Van Ness Ave',
    coordinates: [37.786, -122.421],
    timestamp: '35 mins ago',
    affectedRoutes: ['Geary Transit Way'],
    description: 'Local power surge rendered 4 key intersections unmonitored.',
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
    hospitalTarget: 'St. Jude Central',
    driver: 'Unit Alpha 1',
    eta: '3.4 min',
    speed: '58 km/h',
    coordinates: [37.781, -122.411],
  },
  {
    id: 'amb-14',
    callsign: 'AMB-14',
    status: 'at_scene',
    hospitalTarget: 'General Health West',
    driver: 'Unit Beta 3',
    eta: 'On Scene',
    speed: '0 km/h',
    coordinates: [37.773, -122.401],
  },
  {
    id: 'amb-22',
    callsign: 'AMB-22',
    status: 'available',
    hospitalTarget: 'Standby Base 2',
    driver: 'Unit Gamma 7',
    eta: 'Standby',
    speed: '0 km/h',
    coordinates: [37.795, -122.418],
  },
  {
    id: 'amb-03',
    callsign: 'AMB-03',
    status: 'returning',
    hospitalTarget: 'St. Jude Central',
    driver: 'Unit Delta 4',
    eta: '7.1 min',
    speed: '42 km/h',
    coordinates: [37.762, -122.428],
  },
];

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
