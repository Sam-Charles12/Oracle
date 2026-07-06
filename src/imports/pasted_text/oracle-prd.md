Oracle — Predictive Maintenance Dashboard

Product Requirements Document

DCP University Engineering Challenge — Track 2 | Team Cerebral


1. Overview

Oracle is a condition-based risk-scoring and Remaining Useful Life (RUL) estimation platform for DCP's critical rotating and thermal equipment. This PRD covers the web dashboard — the interface layer where plant staff view asset risk, drill into degradation trends, and act on escalations.

The dashboard surfaces two fused outputs per asset:


A static risk score (how compromised is this equipment right now)
A trajectory-based RUL estimate (how much operating time is left before functional failure)


A Red-tier asset with 3 days of remaining life and a Red-tier asset with 3 weeks of remaining life demand different responses — the dashboard's job is to make that distinction immediately visible, not buried in a table.


2. Goals


Give a plant manager an "at a glance" read on fleet health in under 5 seconds
Let a maintenance planner drill from fleet view → single asset → root signal in two clicks
Make the escalation logic (Green/Amber/Red → action) visible as a live operational state, not a static policy page
Run entirely on simulated data today, on the same data contract a live sensor feed would use — so no rebuild is needed later



3. Flagship Equipment Coverage

Three assets, chosen to represent the full production chain (feed → burn → grind-to-product):

AssetRoleWhy includedRaw MillGrinds raw materials into "raw meal" before the kilnConstant abrasive wear; if it stops, kiln runs out of feed within hoursKiln + ID FanHeart of the plant; ID fan supplies the draft the kiln needs to runCostliest failure mode; ID fan bearing/blade failure is a leading cause of unplanned kiln stops; restart takes 24–48 hrsCement MillGrinds clinker into finished cementEven with a perfect kiln run, a cement mill failure stalls output — ties to the "conversion gap" theme

All three are modeled at the scoring level; Kiln + ID Fan is the full worked example used throughout demo and appendix.


4. Core Screens

A — Plant / Asset Overview (landing screen)


Grid layout of monitored assets (Raw Mill, Kiln + ID Fan, Cement Mill — expandable)
Each card shows: asset name, current risk tier, RUL estimate at a glance
This is the view a plant manager checks before drilling into anything


B — Asset Detail View (signature interaction)

On click, the selected card animates — shrinks to a persistent "you are here" anchor (top-left), while the rest of the screen transitions into the full detail view (shared-element/layout transition, not a hard cut).

Detail view contains:


Current risk tier + RUL estimate, large and prominent
Degradation trend chart — the driving signal(s) plotted over time
P-F curve position indicator — visually shows where the asset sits: Normal → Early Degradation → Accelerating → Imminent Failure
Factor breakdown — the five weighted inputs (vibration, maintenance overdue, failure history, load, operator anomalies), each with its own mini-trend
Advisory panel — the LLM-generated recommendation, styled as a distinct chat/notes-style card, not another data tile
Clear path back to the grid (reverse transition)


C — Escalation Workflow View

Required deliverable. Shown as a live operational state, not just a table:

ZoneActionGreenNo action, logged onlyAmberFlagged for inspection within X days, added to planner queueRedImmediate work order generated, escalated to maintenance manager

Display current counts live — e.g. "2 assets currently in Amber queue, 0 in Red."

D — Multi-Plant View (stretch, time-permitting)

Top-level status per DCP plant (Obajana, Ibese, Gboko, Okpella), each showing an aggregate risk color. Do not let this delay screens A–C.


5. Data Model (Output Contract from Scoring Engine)

The dashboard consumes a single clean interface from the risk-scoring/RUL engine:

json{
  "asset": "Kiln ID Fan",
  "tier": "Amber",
  "rul_estimate": "9 days",
  "driving_factors": [
    { "factor": "vibration_trend", "score": 4, "trend": "rising" },
    { "factor": "maintenance_overdue", "score": 2, "trend": "stable" }
  ],
  "trend_data": [ { "t": "2026-06-20", "value": 2.1 }, ... ],
  "advisory": "Kiln ID fan bearing vibration trending +18% over 14 days..."
}

Data refreshes on a simulated interval (small randomized drift every few seconds) so the dashboard feels "live" during the pitch demo.


6. Design System

(Derived from the two reference dashboards provided — light, card-based, data-forward SaaS aesthetic. This replaces the "dark control room" direction.)

6.1 Overall Direction

Both references share a common visual language worth carrying into Oracle: a light, airy background, white/off-white cards with soft shadows and generously rounded corners, a left sidebar for navigation, and restrained use of color — one primary accent plus a small supporting palette for data visualization, rather than color everywhere. The feel is calm, professional SaaS — not a dense industrial control panel. This actually suits Oracle well: it should read as trustworthy and legible to a plant manager glancing at it between other tasks, not as an alarm wall.

6.2 Color Palette

Background & surface


App background: warm off-white / very light gray (#F7F7F5 – #FAFAF8 range)
Card surface: white or near-white, sitting slightly lighter than the background, separated by soft drop shadow rather than hard borders
Sidebar: white or a very light neutral, visually distinct from the main canvas


Primary accent — pick one, both references lean this direction:


Sage/forest green (#3F6E52–#4A7A5C range) as the primary action color (buttons, active nav state, positive trend indicators) — reads as calm and operational rather than alarming, which reserves visual urgency for the risk-tier system itself


Semantic risk-tier colors (Oracle-specific, non-negotiable per the concept doc)


Green #4CAF50–#3F6E52: Normal / routine monitoring
Amber #F5A623–#E0A72E: Early/Accelerating degradation
Red #E5484D–#D64545: Imminent failure / escalation


These three must stay visually distinct from the sage primary accent so a risk tier is never mistaken for a neutral UI element — use the sage accent only for navigation/actions, never for status.

Data visualization palette (for trend charts, factor breakdowns)


A soft multi-color set in the spirit of Image 1's donut chart: muted purple, orange, teal, blue — desaturated enough to sit calmly alongside the risk-tier reds/ambers/greens without competing


Text


Primary text: near-black charcoal (#1A1A1A–#2A2A2A), not pure black
Secondary/muted text: mid-gray (#8A8A8A–#9CA3AF) for labels, timestamps, helper text


6.3 Typography


Clean geometric sans-serif throughout (e.g. Inter, Satoshi, or similar) — matches both references' crisp, modern numeral-forward style
Large, bold figures for key metrics (RUL estimate, risk score) — both references make their headline numbers the visual anchor of each card
Medium-weight labels above metrics, small and muted (e.g. "Total revenue," "Earnings") — mirror this pattern for "RUL Estimate," "Risk Tier," "Last Updated"


6.4 Components

Cards


Rounded corners (12–16px radius)
Soft, low-opacity drop shadow instead of visible borders
Generous internal padding — avoid dense/cramped data, one clear focal metric per card on the overview grid


Sidebar navigation


Icon + label rows, collapsible
Active state highlighted with a soft tinted background block (not just a color change on the icon) — both references use this pattern
User/profile anchored at the bottom


Status indicators


Small colored dot or pill badge for risk tier (Green/Amber/Red), placed consistently top-right or inline with the asset name — never rely on card background color alone for status, to stay accessible


Charts


Line charts for degradation trends with soft gradient fill beneath the line (as in Image 1's bar/line combo and Image 2's balance chart)
Circular/gauge element for a single composite score (Image 2's "80%" gauge is a strong direct reference for how to show the composite risk score on the asset detail view)


Buttons


Solid sage-green primary buttons with white text, rounded, no harsh corners — matches Image 2's "Add New Card" / "Update Your Security" button style


6.5 Motion


Keep the click-to-detail shared-element transition fast (250–400ms) — deliberate and functional, telling the user where they are, not decorative
Card hover states: subtle lift (shadow increase), no color inversion



7. Suggested Stack


React front-end
Framer Motion for the shared-element/layout transition (grid card → full detail view)
Node/Express backend serving simulated data on the real sensor-feed schema
Recharts or Chart.js for trend and P-F curve visualizations



8. Out of Scope (for this submission)


Live sensor integration (architecture supports it later; not built now)
Trained ML model (deliberately rule-based/transparent per the concept doc's design principle — see Section 4, Layer 2 of the Oracle concept document)
Full multi-plant view unless screens A–C are solid with time to spare



9. Success Criteria (for the demo)


A judge can look at the overview grid and correctly identify the highest-priority asset within 5 seconds, without explanation
The asset detail transition runs smoothly and reads as "drilling into an explanation," not just a page change
The advisory panel's recommendation is traceable back to a specific driving factor shown on the same screen