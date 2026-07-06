// Oracle — Data Contract v1 (frozen Jul 3)
// TypeScript types and seed data that match the exact JSON shape from the contract.
// When the real scoring pipeline is ready, swap the seed arrays below — nothing
// else in the frontend needs to change.

// ---- Closed vocabularies (contract rule 2) ----------------------------------

export type Tier = "green" | "amber" | "red";

export type PFZone = 1 | 2 | 3 | 4;

export type FactorKey =
  | "vibration_trend"
  | "maintenance_overdue"
  | "failure_history"
  | "load_vs_capacity"
  | "operator_anomalies";

export type TrendDirection = "rising" | "falling" | "stable";

export type AdvisoryUrgency = "low" | "medium" | "high";

export type EscalationStatus =
  | "logged_only"
  | "flagged_for_inspection"
  | "work_order_generated";

export type EscalationNotify =
  | "none"
  | "maintenance_planner"
  | "maintenance_manager";

// ---- Nested shapes ----------------------------------------------------------

export interface DrivingFactor {
  factor: FactorKey;
  label: string;
  score: number;           // 0–5
  weight: number;          // 0–1, constant per factor across all assets
  trend: TrendDirection;
  detail: string;          // human-readable summary, e.g. "+18% over 14 days"
  history: number[];       // mini-trend for sparkline (not in contract, UI-only)
}

export interface TrendPoint {
  day: number;
  vibration: number;
  temperature: number;
  current_draw: number;
}

export interface Advisory {
  recommendation: string;
  urgency: AdvisoryUrgency;
  suggested_action_by: string; // ISO date string
}

export interface Escalation {
  status: EscalationStatus;
  queue: string;            // e.g. "amber_queue"
  notify: EscalationNotify;
}

// ---- Top-level asset object (matches contract exactly) ----------------------

export interface Asset {
  asset_id: string;
  asset_name: string;
  plant: string;
  tier: Tier;
  risk_score: number;       // 0–100
  rul_estimate_days: number;
  rul_display: string;      // pre-formatted for direct display
  pf_zone: PFZone;          // 1–4
  pf_zone_label: string;
  driving_factors: DrivingFactor[];  // always 5, same order every asset
  trend_data: TrendPoint[];
  advisory: Advisory;
  escalation: Escalation;
  last_updated: string;     // ISO timestamp
}

// ---- Resolved hex constants (needed so SVG attributes get real colors) ------
// SVG presentation attrs don't resolve CSS custom properties, so we keep
// hex values here and reference them from both style={{}} and SVG attrs.

export const COLORS = {
  green: "#3fa45a",
  greenSoft: "#e6f4ea",
  amber: "#e0a72e",
  amberSoft: "#fbf1dd",
  red: "#e5484d",
  redSoft: "#fbe4e5",
  muted: "#f0f0ec",
  border: "rgba(31,36,33,0.10)",
  mutedFg: "#8a908a",
  chart: ["#8b7ec8", "#e29a52", "#4fb0a5", "#5b8def", "#6e9e7e"],
} as const;

export const tierColor: Record<Tier, { fg: string; soft: string; label: string }> = {
  green: { fg: COLORS.green, soft: COLORS.greenSoft, label: "Normal" },
  amber: { fg: COLORS.amber, soft: COLORS.amberSoft, label: "Degrading" },
  red:   { fg: COLORS.red,   soft: COLORS.redSoft,   label: "Critical" },
};

export const tierRank: Record<Tier, number> = { red: 0, amber: 1, green: 2 };

// ---- P-F zone metadata ------------------------------------------------------

export const pfZoneMeta: Record<PFZone, { label: string; position: number }> = {
  1: { label: "Normal",                position: 0.12 },
  2: { label: "Early Degradation",     position: 0.38 },
  3: { label: "Accelerating",          position: 0.64 },
  4: { label: "Imminent Failure",      position: 0.90 },
};

// ---- Escalation policy display labels  --------------------------------------

export const escalationLabel: Record<EscalationStatus, string> = {
  logged_only:             "No action — logged only",
  flagged_for_inspection:  "Flagged for inspection within 5 days",
  work_order_generated:    "Immediate work order — escalated to manager",
};

export const escalationDetail: Record<EscalationStatus, string> = {
  logged_only:             "Routine monitoring. Data retained for trend baselining.",
  flagged_for_inspection:  "Added to the maintenance planner queue for scheduling.",
  work_order_generated:    "Auto-generated work order dispatched to the maintenance manager.",
};

// ---- Plant summary shape (multi-plant view, not in per-asset contract) ------

export interface Plant {
  id: string;
  name: string;
  location: string;
  assetCount: number;
  aggregateTier: Tier;
}

export const plants: Plant[] = [
  { id: "obajana", name: "Obajana", location: "Kogi State",  assetCount: 3, aggregateTier: "red"   },
  { id: "ibese",   name: "Ibese",   location: "Ogun State",  assetCount: 4, aggregateTier: "amber" },
  { id: "gboko",   name: "Gboko",   location: "Benue State", assetCount: 3, aggregateTier: "green" },
  { id: "okpella", name: "Okpella", location: "Edo State",   assetCount: 2, aggregateTier: "green" },
];

// ---- Seed data (hand-written mocks matching the contract exactly) ------------
// One object per flagship asset — kiln_id_fan, raw_mill, cement_mill.

function buildTrendData(
  baseVib: number,
  vibSlope: number,
  baseTemp: number,
  baseCurrent: number,
  days: number,
): TrendPoint[] {
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    vibration:    Number((baseVib + vibSlope * i + (Math.sin(i * 0.9) * 0.15)).toFixed(2)),
    temperature:  Number((baseTemp + i * 0.08 + (Math.random() - 0.5) * 0.4).toFixed(1)),
    current_draw: Number((baseCurrent + i * 0.04 + (Math.random() - 0.5) * 0.3).toFixed(1)),
  }));
}

export const assets: Asset[] = [
  // ---- kiln_id_fan.json — amber, mid-crisis, flagship demo asset ------------
  {
    asset_id: "kiln_id_fan",
    asset_name: "Kiln + ID Fan",
    plant: "Obajana",
    tier: "amber",
    risk_score: 68,
    rul_estimate_days: 9,
    rul_display: "≈9 days at current load",
    pf_zone: 3,
    pf_zone_label: "Accelerating Degradation",
    driving_factors: [
      { factor: "vibration_trend",    label: "Vibration Trend",              score: 4.2, weight: 0.30, trend: "rising",  detail: "+18% over 14 days",                 history: [2.1, 2.3, 2.6, 3.0, 3.4, 3.9, 4.2] },
      { factor: "maintenance_overdue",label: "Maintenance Overdue",          score: 3.0, weight: 0.25, trend: "stable",  detail: "6 days past scheduled interval",    history: [0, 4, 8, 11, 14, 18, 22] },
      { factor: "failure_history",    label: "Historical Failure Frequency", score: 2.5, weight: 0.20, trend: "stable",  detail: "2 failures in last 12 months",      history: [2, 2, 2, 2, 2, 2, 2] },
      { factor: "load_vs_capacity",   label: "Load vs Rated Capacity",       score: 3.5, weight: 0.15, trend: "rising",  detail: "108% of rated load",                history: [82, 84, 85, 87, 88, 90, 91] },
      { factor: "operator_anomalies", label: "Operator-Reported Anomalies",  score: 1.0, weight: 0.10, trend: "stable",  detail: "1 report in last 7 days",           history: [1, 0, 1, 2, 1, 1, 1] },
    ],
    trend_data: buildTrendData(2.1, 0.16, 61.2, 88.0, 14),
    advisory: {
      recommendation: "Kiln ID fan bearing vibration is trending +18% over the last 14 days, with the rate of change itself increasing since Jun 28. This is the dominant driver of the current Amber tier. Recommend scheduling an inspection of the drive-end bearing within 6 days and pre-staging a replacement bearing — restart after an unplanned kiln stop takes 24–48 hrs.",
      urgency: "high",
      suggested_action_by: "2026-07-12",
    },
    escalation: {
      status: "flagged_for_inspection",
      queue: "amber_queue",
      notify: "maintenance_planner",
    },
    last_updated: "2026-07-04T09:00:00Z",
  },

  // ---- raw_mill.json — green, healthy, boring on purpose (shows contrast) ---
  {
    asset_id: "raw_mill",
    asset_name: "Raw Mill",
    plant: "Obajana",
    tier: "green",
    risk_score: 24,
    rul_estimate_days: 70,
    rul_display: "≈10 weeks at current load",
    pf_zone: 1,
    pf_zone_label: "Normal",
    driving_factors: [
      { factor: "vibration_trend",    label: "Vibration Trend",              score: 1.2, weight: 0.30, trend: "stable",  detail: "Within normal band",                history: [1.1, 1.2, 1.1, 1.3, 1.2, 1.2, 1.2] },
      { factor: "maintenance_overdue",label: "Maintenance Overdue",          score: 0.4, weight: 0.25, trend: "stable",  detail: "Next service due Jul 21",           history: [0, 0, 1, 0, 0, 1, 0] },
      { factor: "failure_history",    label: "Historical Failure Frequency", score: 1.0, weight: 0.20, trend: "stable",  detail: "1 minor event in last 12 months",   history: [1, 1, 1, 1, 1, 1, 1] },
      { factor: "load_vs_capacity",   label: "Load vs Rated Capacity",       score: 2.2, weight: 0.15, trend: "stable",  detail: "76% of rated load",                 history: [74, 76, 75, 77, 76, 75, 76] },
      { factor: "operator_anomalies", label: "Operator-Reported Anomalies",  score: 0.6, weight: 0.10, trend: "falling", detail: "0 reports in last 7 days",          history: [2, 1, 1, 0, 1, 0, 0] },
    ],
    trend_data: buildTrendData(1.1, 0.02, 58.4, 74.0, 14),
    advisory: {
      recommendation: "Raw Mill is operating within normal parameters. Grinding load and mill-motor current are stable and well inside the healthy band. No action required beyond routine monitoring; next scheduled lubrication check on Jul 21 is sufficient.",
      urgency: "low",
      suggested_action_by: "2026-07-21",
    },
    escalation: {
      status: "logged_only",
      queue: "green_log",
      notify: "none",
    },
    last_updated: "2026-07-04T09:00:00Z",
  },

  // ---- cement_mill.json — red, worst case, full escalation path -------------
  {
    asset_id: "cement_mill",
    asset_name: "Cement Mill",
    plant: "Obajana",
    tier: "red",
    risk_score: 88,
    rul_estimate_days: 3,
    rul_display: "≈3 days at current load",
    pf_zone: 4,
    pf_zone_label: "Imminent Failure",
    driving_factors: [
      { factor: "vibration_trend",    label: "Vibration Trend",              score: 4.8, weight: 0.30, trend: "rising",  detail: "+92% above baseline",               history: [3.0, 3.6, 4.1, 4.9, 5.6, 6.3, 6.9] },
      { factor: "maintenance_overdue",label: "Maintenance Overdue",          score: 3.6, weight: 0.25, trend: "rising",  detail: "47 days past scheduled interval",   history: [10, 16, 22, 28, 34, 40, 47] },
      { factor: "failure_history",    label: "Historical Failure Frequency", score: 3.5, weight: 0.20, trend: "stable",  detail: "4 failures in last 12 months",      history: [4, 4, 4, 4, 4, 4, 4] },
      { factor: "load_vs_capacity",   label: "Load vs Rated Capacity",       score: 4.0, weight: 0.15, trend: "rising",  detail: "97% of rated load — near limit",    history: [88, 90, 92, 93, 95, 96, 97] },
      { factor: "operator_anomalies", label: "Operator-Reported Anomalies",  score: 3.2, weight: 0.10, trend: "rising",  detail: "6 reports in last 7 days",          history: [1, 2, 3, 3, 4, 5, 6] },
    ],
    trend_data: buildTrendData(3.0, 0.32, 68.0, 94.0, 14),
    advisory: {
      recommendation: "Cement Mill has crossed into the imminent-failure zone. Gearbox vibration is 92% above baseline and the temperature signature confirms accelerating bearing wear. An immediate work order has been generated and escalated to the maintenance manager. Recommend controlled shutdown within 48 hrs to avoid catastrophic gearbox failure that would stall finished-cement output.",
      urgency: "high",
      suggested_action_by: "2026-07-06",
    },
    escalation: {
      status: "work_order_generated",
      queue: "red_queue",
      notify: "maintenance_manager",
    },
    last_updated: "2026-07-04T09:00:00Z",
  },
];
