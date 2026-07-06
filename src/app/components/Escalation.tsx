import { motion } from "motion/react";
import {
  FileText,
  Search,
  ClipboardCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  escalationLabel,
  tierColor,
  tierRank,
  type Asset,
  type EscalationStatus,
  type Tier,
} from "./data";
import { RiskBadge } from "./RiskBadge";

const statusMeta: Record<
  EscalationStatus,
  { icon: typeof FileText; blurb: string }
> = {
  work_order_generated: {
    icon: FileText,
    blurb: "Immediate work order generated",
  },
  flagged_for_inspection: {
    icon: Search,
    blurb: "Queued for planner inspection",
  },
  logged_only: {
    icon: ClipboardCheck,
    blurb: "Logged for baseline monitoring",
  },
};

const tierToStatus: Record<Tier, EscalationStatus> = {
  red: "work_order_generated",
  amber: "flagged_for_inspection",
  green: "logged_only",
};

function ZoneColumn({
  tier,
  assets,
  onOpen,
}: {
  tier: Tier;
  assets: Asset[];
  onOpen: (id: string) => void;
}) {
  const c = tierColor[tier];
  const status = tierToStatus[tier];
  const meta = statusMeta[status];
  const Icon = meta.icon;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)] flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center rounded-lg size-9 bg-muted text-muted-foreground">
              <Icon size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold capitalize text-foreground">
                  {tier} zone
                </span>
                <span className="tabular-nums text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                  {assets.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {meta.blurb}
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {escalationLabel[status]}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2.5 min-h-[120px]">
        {assets.length === 0 && (
          <div className="flex-1 grid place-items-center py-8 text-sm text-muted-foreground">
            No assets in this zone
          </div>
        )}
        {assets.map((a) => (
          <button
            key={a.asset_id}
            onClick={() => onOpen(a.asset_id)}
            className="text-left rounded-xl border border-border p-4 hover:shadow-[0_6px_18px_rgba(31,36,33,0.08)] transition-shadow group bg-card cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold block truncate">
                  {a.asset_name}
                </span>
                <span className="text-xs text-muted-foreground">{a.plant}</span>
              </div>
              <RiskBadge tier={a.tier} />
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-border">
              <div>
                <div className="text-xs text-muted-foreground mb-1">RUL</div>
                <div className="text-sm font-bold">
                  {a.rul_estimate_days} days
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Risk score
                </div>
                <div className="text-sm font-bold">{a.risk_score} / 100</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {a.pf_zone_label}
              </span>
              <ArrowRight
                size={14}
                className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
              />
            </div>

            {tier === "red" && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <FileText size={12} className="text-muted-foreground" />
                  <span>
                    WO-{a.asset_id.slice(0, 3).toUpperCase()}-{a.risk_score}
                  </span>
                  <span className="text-muted-foreground">· Dispatched</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Escalation({
  assets,
  onOpen,
}: {
  assets: Asset[];
  onOpen: (id: string) => void;
}) {
  const byTier = (t: Tier) =>
    assets
      .filter((a) => a.tier === t)
      .sort((a, b) => a.rul_estimate_days - b.rul_estimate_days);

  const counts: Record<Tier, number> = {
    red: byTier("red").length,
    amber: byTier("amber").length,
    green: byTier("green").length,
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div
        layout
        className="rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 border border-border bg-card shadow-[0_1px_2px_rgba(31,36,33,0.04)]"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full size-2.5 bg-primary" />
          </span>
          <span className="text-sm font-semibold">Live escalation state</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          {(
            [
              ["red", "Critical"],
              ["amber", "Warning"],
              ["green", "Healthy"],
            ] as [Tier, string][]
          ).map(([t, label]) => (
            <div key={t} className="flex items-center gap-2">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {counts[t]}
                </span>
                <span className="text-muted-foreground">{label}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground ml-auto">
          {counts.red > 0
            ? `${counts.red} asset${counts.red > 1 ? "s" : ""} require immediate escalation to the maintenance manager.`
            : counts.amber > 0
              ? `${counts.amber} asset${counts.amber > 1 ? "s" : ""} flagged for inspection within 5 days.`
              : "All assets nominal — routine monitoring only."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ZoneColumn tier="red" assets={byTier("red")} onOpen={onOpen} />
        <ZoneColumn tier="amber" assets={byTier("amber")} onOpen={onOpen} />
        <ZoneColumn tier="green" assets={byTier("green")} onOpen={onOpen} />
      </div>
    </div>
  );
}
