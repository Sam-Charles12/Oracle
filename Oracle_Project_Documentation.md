# Oracle Predictive Maintenance Dashboard
## Project Documentation & Development Summary

### 1. Executive Summary
The **Oracle Dashboard** is a state-of-the-art predictive maintenance application designed for Dangote Cement Plc (DCP). It provides a closed-loop monitoring and advisory system for critical industrial assets (Cement Mills, Raw Mills, and Kiln ID Fans). This document summarizes the technical integrations, UI/UX enhancements, and AI implementations successfully executed to bring the application to a presentation-ready, award-winning standard.

### 2. Core Dashboard Mechanics & Live Feed Integration
To transition the dashboard from a static mock-up into a dynamic simulation:
- **Seed Data Integration:** Successfully integrated `cement_mill.json`, `kiln_id_fan.json`, and `raw_mill.json` directly into the frontend state management.
- **Dynamic Bounded Drift:** Rewrote the `useOracleData` React hook to simulate realistic live sensor telemetry. 
  - Risk scores now accurately drift by ±5 points.
  - Vibration bounds were corrected to match the physical model output scale (0.01–2.0 mm/s) instead of artificially high bounds.
  - Remaining Useful Life (RUL) estimates drift realistically while adhering to baseline constraints.
- **Tier Locking:** Risk tier classifications (Red, Amber, Green) were locked to the baseline model outputs. This ensures that while the live feed simulates tick-by-tick variance, the asset's overall health classification remains mathematically grounded to the core AI model.
- **Baseline Restoration:** Added functionality so that disabling the live feed instantly snaps the telemetry back to the absolute ground-truth model numbers.

### 3. User Experience (UX) & Personalization
To enhance the enterprise feel and eliminate generic placeholders, a localized onboarding flow was introduced:
- **Glassmorphism Onboarding Modal:** Built a premium, frosted-glass popup that greets first-time users. It collects the user's Full Name, Role, and assigned DCP Plant (Obajana, Ibese, Gboko, or Okpella).
- **Persistent State:** Leveraged `localStorage` via a custom `useUserProfile` hook. The dashboard now retains user sessions across browser reloads.
- **Dynamic Sidebar UI:** Stripped all hardcoded names (e.g., "Adaeze Okafor") and replaced them with dynamic profile data, automatically generating UI avatars and location metadata based on the user's input.
- **Theme & Settings Persistence:** User preferences for Dark Mode, Live Feed toggles, and notification timestamps were wired directly into browser storage to ensure a seamless experience.

### 4. Explainable AI Advisory Layer (Layer 3 Integration)
A significant technical milestone was fully activating the LLM-driven advisory layer (`apicall.py`) using Google's Gemini API.
- **Secure Credentials Management:** Established a secure `.env` pipeline to load the `GEMINI_API_KEY` while correctly handling Windows PowerShell UTF-16 encoding anomalies, ensuring keys are never hardcoded.
- **Automated JSON Processing:** Upgraded the AI script to autonomously iterate through the asset data files, parsing sensor metrics, Risk Scores, and P-F Zones.
- **Deterministic Engineering Output:** The LLM was constrained using a highly structured system prompt. It converts quantitative sensor anomalies into professional, actionable maintenance advisories without "hallucinating" false mechanical failures.
- **Escalation Routing:** The AI successfully injects calculated Urgency markers and Escalation instructions (e.g., notifying the "maintenance_manager" vs "maintenance_planner") directly into the UI state.
- **Null Safety:** Updated the frontend `AdvisoryPanel` component to gracefully handle and display *"Pending — awaiting advisory"* when AI results are still processing, ensuring the UI never breaks.

### 5. Conclusion & Presentation Readiness
The Oracle dashboard is now a highly interactive, full-stack predictive maintenance simulation. It effectively bridges the gap between raw machine-learning outputs (Layer 2) and human-in-the-loop maintenance actions (Layer 3). The application compiles cleanly, runs performantly, and provides a visually striking, personalized experience perfectly tailored for a high-stakes engineering presentation.
