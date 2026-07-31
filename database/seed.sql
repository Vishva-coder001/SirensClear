-- SirensClear Phase 4 Seed Data Script
-- Insert initial seed records matching the Phase 3 mock datasets

-- 1. Insert Hospitals
INSERT INTO public.hospitals (id, name, capacity, available_beds, icu_available, latitude, longitude) VALUES
('HOSP-001', 'AIG Hospitals Gachibowli', 500, 48, 8, 17.4423, 78.3582),
('HOSP-002', 'Care Hospitals Narsingi', 250, 19, 4, 17.3892, 78.3645),
('HOSP-003', 'Medicover Hospitals Hitec City', 350, 32, 6, 17.4485, 78.3792),
('HOSP-004', 'Yashoda Hospitals Hitec City', 400, 41, 10, 17.4419, 78.3831),
('HOSP-005', 'Continental Hospitals Nanakramguda', 450, 55, 12, 17.4148, 78.3438)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Ambulances
INSERT INTO public.ambulances (id, unit_number, driver, status, latitude, longitude, destination, eta) VALUES
('AMB-A04', 'ALS Response Unit A04', 'Rajesh Kumar', 'Available', 17.4405, 78.3492, 'Gachibowli Flyover', 3.2),
('AMB-T02', 'Trauma Unit T02', 'Vikram Singh', 'En Route', 17.3871, 78.3620, 'ORR Exit 3', 4.5),
('AMB-R08', 'Rapid Bike Unit R08', 'Srinivas Rao', 'Available', 17.4510, 78.3812, 'Cyber Towers Underpass', 2.1),
('AMB-A12', 'Cardiac ALS Unit A12', 'Mohammed Ali', 'En Route', 17.4420, 78.3830, 'Mindspace Junction', 2.8),
('AMB-H01', 'Hazmat Paramedic H01', 'Anand Verma', 'Available', 17.4150, 78.3450, 'Financial District', 4.0)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Hazards
INSERT INTO public.hazards (
    id, title, description, incident_type, severity, priority, location, latitude, longitude,
    vehicles_involved, blocked_lanes, victims_estimated, weather_impact, confidence, verification_percentage, source, status
) VALUES
(
    'HZ-801', 'Multi-Vehicle Collision near Gachibowli Flyover',
    'Two heavy commercial buses and a sedan collided blocking main arterial lanes. Fuel leak detected on asphalt.',
    'Multi-Bus Crash', 'Critical', 'P1 - Immediate', 'Gachibowli Flyover North Ramp, Hyderabad',
    17.4401, 78.3489, '2 Buses, 1 Sedan', '2 of 3 Lanes Blocked', 5, 'Clear visibility, dry pavement surface',
    97.4, 96.0, 'CCTV AI Vision', 'Active'
),
(
    'HZ-802', 'Rollover Crash on Outer Ring Road Exit 3',
    'SUV lost control at high speed and rolled over into embankment. Passengers trapped inside cabin.',
    'Rollover Accident', 'Critical', 'P1 - Immediate', 'ORR Exit 3 Narsingi Interchange',
    17.3850, 78.3611, '1 SUV', 'Right Shoulder Blocked', 3, 'High speed corridor, dry surface',
    98.1, 98.0, 'Citizen Mobile App', 'Dispatched'
),
(
    'HZ-803', 'Oil Spill & Multi-Bike Skids on Cyber Towers Underpass',
    'Diesel leakage from a freight delivery vehicle created hazardous slick road surface resulting in minor skids.',
    'Hazardous Material Spill', 'High', 'P2 - High', 'Hitec City Cyber Towers Underpass',
    17.4504, 78.3808, '1 Freight Truck, 2 Motorcycles', 'Underpass Westbound Closed', 2, 'Slick pavement, high skid risk',
    92.5, 91.0, 'Traffic Sensor IoT', 'Investigating'
),
(
    'HZ-804', 'Pedestrian Knockdown at Mindspace Junction',
    'High speed cab struck pedestrian near crossing zone. Emergency medical intervention requested by bystanders.',
    'Pedestrian Injury', 'Critical', 'P1 - Immediate', 'Mindspace IT Park Signal 2',
    17.4416, 78.3826, '1 Hatchback', 'Left Lane Blocked', 1, 'Clear light conditions',
    99.0, 99.0, '911 Emergency Call', 'Dispatched'
),
(
    'HZ-805', 'Cargo Truck Mechanical Breakdown & Hazard Signal',
    'Axle failure on heavy transport truck blocking center lane causing progressive back-up toward Kothaguda.',
    'Vehicle Breakdown', 'Moderate', 'P3 - Standard', 'Kondapur Main Road near Botanical Garden',
    17.4568, 78.3672, '1 Container Truck', 'Center Lane Blocked', 0, 'Clear visibility',
    89.2, 88.0, 'Police Radio Dispatch', 'Active'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Dispatches
INSERT INTO public.dispatches (id, hazard_id, ambulance_id, hospital_id, eta, distance, reasoning, confidence, status) VALUES
(
    'REC-101', 'HZ-801', 'AMB-A04', 'HOSP-001', 3.2, 1.8,
    'Ambulance A04 selected because it is closest (1.8km), traffic density on Financial District road is moderate, and AIG Emergency Department has 8 available ICU beds.',
    97.4, 'Pending'
),
(
    'REC-102', 'HZ-802', 'AMB-T02', 'HOSP-002', 4.5, 2.9,
    'Trauma Unit T02 is equipped with heavy hydraulic extrication kit needed for rollover rescue; direct expressway access provides green-corridor ETA of 4.5 mins.',
    98.1, 'Dispatched'
),
(
    'REC-103', 'HZ-803', 'AMB-R08', 'HOSP-003', 2.1, 0.9,
    'Rapid bike unit selected to bypass stuck underpass queue with first-responder burn/trauma medical kits while heavy ambulance stands by on peripheral road.',
    92.5, 'Pending'
),
(
    'REC-104', 'HZ-804', 'AMB-A12', 'HOSP-004', 2.8, 1.4,
    'ALS Unit A12 is positioned 1.4km away with direct line-of-sight signal preemption capabilities along Mindspace main avenue.',
    99.0, 'Dispatched'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Initial Reports
INSERT INTO public.reports (hazard_id, raw_text, parsed_json, source) VALUES
(
    'HZ-801',
    'Multi vehicle accident near Gachibowli flyover. Two buses involved. Ambulance required immediately.',
    '{"incidentType": "Multi-Bus Crash", "severity": "Critical", "priority": "P1 - Immediate", "location": "Gachibowli Flyover North Ramp", "vehiclesInvolved": "2 Buses, 1 Sedan", "blockedLanes": "2 of 3 Lanes Blocked", "victimsEstimated": 5}'::jsonb,
    'CCTV AI Vision'
);
