# 🚨 SirensClear

<div align="center">

### AI-Assisted Emergency Response & Smart Dispatch Platform

**Smarter Routing. Faster Response. Saved Lives.**

[🌐 Live Demo](https://sirens-clear.vercel.app) • [🚀 Launch Dashboard](https://sirens-clear.vercel.app/login)

</div>

---

## 📌 Overview

**SirensClear** is an AI-assisted emergency response decision-support platform designed to help emergency command centers process incidents faster and make better dispatch decisions.

The system transforms unstructured emergency reports into structured incident intelligence, verifies hazards, determines incident priority, recommends suitable ambulances and hospitals, and allows a human dispatcher to approve or reassign emergency resources.

SirensClear combines:

- 🧠 AI-assisted incident analysis
- ⚠️ Hazard intelligence
- ✅ Multi-source verification
- 🚑 Intelligent ambulance recommendation
- 🏥 Capacity-aware hospital selection
- 🧑‍✈️ Human-in-the-loop dispatch
- 🗺️ Interactive emergency mapping
- 📡 Supabase Realtime synchronization
- 🔐 Role-based authentication
- 🚑 Dedicated ambulance responder portal

---

## 🌐 Live Application

### 🚀 Production

**SirensClear:**  
https://sirens-clear.vercel.app


---

## 🔑 Demo Access

SirensClear uses **Supabase Authentication** and database-backed role-based access control.

### Admin / Dispatcher

| Field | Demo Credential |
|---|---|
| Email | `admin@sirensclear.com` |
| Password | `Provided privately to evaluators` |

> **Security Notice:** The production admin password is intentionally not stored in this public repository. Evaluators can obtain the demo password from the project team.

### Ambulance Responder

A separate ambulance account is supported through the same authentication system.

Ambulance users are automatically redirected to:

`/ambulance`

---

# 🎯 Problem Statement

Emergency response systems often operate with fragmented information.

Incoming emergency information may originate from:

- Citizen reports
- Emergency calls
- Traffic incidents
- CCTV systems
- IoT sensors
- Field responders
- Other emergency infrastructure

Dispatchers may need to manually determine:

- What happened?
- How serious is the incident?
- Is the information reliable?
- Which ambulance should respond?
- Which hospital has appropriate capacity?
- How quickly can the unit reach the incident?

During critical emergencies, these delays can consume valuable time within the **Golden Hour**.

SirensClear introduces an intelligent decision-support layer between incoming emergency information and emergency response operations.

---

# 💡 Solution

SirensClear converts raw emergency information into an actionable response workflow.

```text
Emergency Report
        │
        ▼
AI Incident Analysis
        │
        ▼
Structured Hazard Creation
        │
        ▼
Multi-Source Verification
        │
        ▼
Severity & Priority Assessment
        │
        ▼
Ambulance Recommendation
        │
        ▼
Hospital Selection
        │
        ▼
Human Dispatcher Decision
        │
        ├──── Reassign Unit
        │
        ▼
Emergency Dispatch
        │
        ▼
Ambulance Responder Portal
        │
        ▼
Mission Status Updates
        │
        ▼
Realtime Operational Monitoring
