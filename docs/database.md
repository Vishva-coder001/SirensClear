# SirensClear Phase 4 Technical Documentation

## 1. Overview & Architecture

SirensClear Phase 4 establishes a robust, decoupled repository pattern connecting the Next.js 16 App Router UI with a Supabase PostgreSQL backend and Realtime broadcast layer.

```
[ UI Components ]
      │
      ▼
[ Repository Services ] (HazardService, DispatchService, AmbulanceService, HospitalService)
      │
      ▼
[ Low-Level Supabase API ] (lib/supabase/*)
      │
      ▼
[ Supabase PostgreSQL + Realtime Channels ]
```

---

## 2. Folder Architecture

- `database/`: SQL DDL scripts (`create_tables.sql`) and initial seed data (`seed.sql`).
- `types/database.ts`: Strict TypeScript interfaces for every database table (`HazardDbRow`, `DispatchDbRow`, `AmbulanceDbRow`, `HospitalDbRow`, `ReportDbRow`) and standardized service response wrappers (`ServiceResponse<T>`).
- `lib/supabase/`: Low-level Supabase client operations and raw realtime channel listeners (`hazards.ts`, `dispatch.ts`, `ambulances.ts`, `hospitals.ts`, `reports.ts`).
- `services/`: Clean repository service abstractions wrapping database CRUD operations and transparent fallback logic (`HazardService`, `DispatchService`, `AmbulanceService`, `HospitalService`).
- `components/ai/`: UI components rendered in the Live Dashboard command grid.

---

## 3. Database Schema & ER Diagram

```mermaid
erDiagram
    HAZARDS ||--o{ DISPATCHES : "triggers"
    HAZARDS ||--o{ REPORTS : "originates from"
    AMBULANCES ||--o{ DISPATCHES : "assigned to"
    HOSPITALS ||--o{ DISPATCHES : "receives patient via"

    HAZARDS {
        string id PK
        string title
        string description
        string incident_type
        string severity
        string priority
        string location
        double latitude
        double longitude
        string vehicles_involved
        string blocked_lanes
        int victims_estimated
        double confidence
        double verification_percentage
        string source
        string status
        timestamp created_at
        timestamp updated_at
    }

    DISPATCHES {
        string id PK
        string hazard_id FK
        string ambulance_id FK
        string hospital_id FK
        double eta
        double distance
        string reasoning
        double confidence
        string status
        timestamp created_at
    }

    AMBULANCES {
        string id PK
        string unit_number
        string driver
        string status
        double latitude
        double longitude
        string destination
        double eta
        timestamp updated_at
    }

    HOSPITALS {
        string id PK
        string name
        int capacity
        int available_beds
        int icu_available
        double latitude
        double longitude
    }

    REPORTS {
        uuid id PK
        string hazard_id FK
        string raw_text
        jsonb parsed_json
        string source
        timestamp created_at
    }
```

---

## 4. End-to-End Data & Realtime Flow

### Step-by-Step Data Flow: Incident Creation

1. **User Action**: Dispatcher inputs unformatted emergency text in `AIIncidentAnalyzer`.
2. **Deterministic NLP Parsing**: Text is evaluated locally via `parseEmergencyReportMock()`, extracting parameters (incident type, severity, priority, location, vehicles, victims).
3. **Database Insertion**:
   - `HazardService.createHazardFromParsedIncident()` creates a record in `reports` table storing `raw_text` and `parsed_json`.
   - Simultaneously creates a record in `hazards` table with status `Active`.
4. **Realtime Broadcast & UI Reaction**:
   - Supabase PostgreSQL trigger fires an `INSERT` payload over the WebSocket channel `public:hazards_realtime_channel`.
   - `HazardFeed` receives the realtime payload, deduplicates by ID, prepends the new hazard card with Framer Motion entry, and triggers a Sonner toast notification.
   - `AIInsights` recalculates live critical incident count and confidence averages dynamically.

---

## 5. Service Layer Responsibilities

- **Zero Direct UI Queries**: UI components call service methods exclusively (e.g., `HazardService.getAllHazards()`).
- **Standardized Service Responses**: Every service call returns:
  ```typescript
  interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
    status: "loading" | "success" | "empty" | "error";
    isFallback?: boolean;
  }
  ```
- **Transparent Fallback Protection**: If Supabase is unreachable or unpopulated, services automatically fall back to the pre-seeded mock dataset so the UI remains 100% operational.
- **Subscription Lifecycle**: `useEffect` hooks cleanly invoke returned cleanup functions on component unmount, preventing memory leaks or duplicate subscription listeners.
