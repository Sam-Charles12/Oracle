import kilnIdFanJson from "../data/kiln_id_fan.json";
import rawMillJson from "../data/raw_mill.json";
import cementMillJson from "../data/cement_mill.json";

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
  suggested_action_by: string | null; // ISO date string or null if pending
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

function transformJsonAsset(json: any): Asset {
  const driving_factors = json.driving_factors.map((f: any) => {
    const score = f.score;
    const trend = f.trend;
    let history: number[] = [];
    if (trend === "rising") {
      history = [
        Number((score * 0.7).toFixed(2)),
        Number((score * 0.75).toFixed(2)),
        Number((score * 0.8).toFixed(2)),
        Number((score * 0.85).toFixed(2)),
        Number((score * 0.9).toFixed(2)),
        Number((score * 0.95).toFixed(2)),
        score,
      ];
    } else if (trend === "falling") {
      history = [
        Number((score * 1.3).toFixed(2)),
        Number((score * 1.25).toFixed(2)),
        Number((score * 1.2).toFixed(2)),
        Number((score * 1.15).toFixed(2)),
        Number((score * 1.1).toFixed(2)),
        Number((score * 1.05).toFixed(2)),
        score,
      ];
    } else {
      history = [score, score, score, score, score, score, score];
    }
    return {
      ...f,
      history,
    };
  });

  const trend_data = json.trend_data.map((pt: any) => ({
    day: pt.day,
    vibration: pt.health_signal,
    temperature: Number((60 + pt.day * 0.1 + (Math.sin(pt.day * 0.5) * 0.5)).toFixed(1)),
    current_draw: Number((80 + pt.day * 0.05 + (Math.sin(pt.day * 0.3) * 0.4)).toFixed(1)),
  }));

  return {
    asset_id: json.asset_id,
    asset_name: json.asset_name,
    plant: json.plant,
    tier: json.tier,
    risk_score: Math.round(json.risk_score),
    rul_estimate_days: Number(json.rul_estimate_days.toFixed(1)),
    rul_display: json.rul_display,
    pf_zone: json.pf_zone,
    pf_zone_label: json.pf_zone_label,
    driving_factors,
    trend_data,
    advisory: {
      recommendation: json.advisory.recommendation,
      urgency: json.advisory.urgency,
      suggested_action_by: json.advisory.suggested_action_by,
    },
    escalation: {
      status: json.escalation.status,
      queue: json.escalation.queue,
      notify: json.escalation.notify,
    },
    last_updated: json.last_updated,
  };
}

export const assets: Asset[] = [
  transformJsonAsset(kilnIdFanJson),
  transformJsonAsset(rawMillJson),
  transformJsonAsset(cementMillJson),
];
