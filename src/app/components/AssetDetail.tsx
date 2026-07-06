import { motion } from "motion/react";
import { ArrowLeft, TrendingUp, Minus, TrendingDown, Clock } from "lucide-react";
import {
  tierColor,
  escalationLabel,
  escalationDetail,
  COLORS,
  type Asset,
  type DrivingFactor,
} from "./data";
import { RiskBadge } from "./RiskBadge";
import { RiskGauge } from "./RiskGauge";
import { TrendChart } from "./TrendChart";
import { PFCurve } from "./PFCurve";
import { AdvisoryPanel } from "./AdvisoryPanel";
import { Sparkline } from "./Sparkline";

function TrendIcon({ trend }: { trend: DrivingFactor["trend"] }) {
  if (trend === "rising")  return <TrendingUp  size={15} className="text-muted-foreground" />;
  if (trend === "falling") return <TrendingDown size={15} className="text-muted-foreground" />;
  return <Minus size={15} className="text-muted-foreground" />;
}

export function AssetDetail({ asset, onBack }: { asset: Asset; onBack: () => void }) {
  const c = tierColor[asset.tier];
  const primaryFactor = asset.driving_factors[0];

  return (
    <div className="p-6 md:p-8">
      {/* breadcrumb + "you are here" anchor */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Fleet Overview
        </button>
        <span className="text-muted-foreground">/</span>
        <motion.div
          layoutId={`asset-card-${asset.asset_id}`}
          className="flex items-center gap-2 bg-card rounded-full pl-3 pr-4 py-1.5 border border-border shadow-sm"
        >
          <motion.span layoutId={`asset-name-${asset.asset_id}`} className="text-sm font-semibold">
            {asset.asset_name}
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-5"
      >
        {/* LEFT: headline + gauge + escalation */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)] flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>{asset.asset_name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{asset.plant}</p>
            </div>
            <RiskBadge tier={asset.tier} />
          </div>

          <div className="flex justify-center my-6">
            <RiskGauge score={asset.risk_score} tier={asset.tier} />
          </div>

          {/* RUL — use rul_display directly per contract */}
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="grid place-items-center rounded-lg size-10 bg-muted text-muted-foreground">
                <Clock size={18} />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Remaining useful life</div>
                <div className="text-xs font-medium text-foreground mt-0.5">{asset.rul_display}</div>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="tabular-nums"
                  style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, lineHeight: 1 }}
                >
                  {asset.rul_estimate_days}
                </span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </div>

          {/* escalation state */}
          <div className="mt-4 rounded-xl border border-border p-4">
            <div className="text-xs text-muted-foreground mb-1">Escalation status</div>
            <div className="text-sm font-bold mb-2">
              {escalationLabel[asset.escalation.status]}
            </div>
            <p className="text-xs text-muted-foreground mb-3 pb-3 border-b border-border">{escalationDetail[asset.escalation.status]}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground mb-1">Queue</div>
                <div className="font-medium">{asset.escalation.queue}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Notify</div>
                <div className="font-medium">{asset.escalation.notify.replace(/_/g, " ")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE + RIGHT: trend + P-F curve */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Degradation trend</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Bearing vibration (mm/s) · last {asset.trend_data.length} days</p>
              </div>
              <RiskBadge tier={asset.tier} size="sm" />
            </div>
            <TrendChart data={asset.trend_data} color={COLORS.chart[0]} />
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>P-F curve position</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Where this asset sits between detection and functional failure</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">Zone {asset.pf_zone}</div>
                <div className="text-xs text-muted-foreground">{asset.pf_zone_label}</div>
              </div>
            </div>
            <PFCurve pfZone={asset.pf_zone} pfZoneLabel={asset.pf_zone_label} color={COLORS.chart[0]} />
          </div>
        </div>
      </motion.div>

      {/* Factor breakdown + advisory */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5"
      >
        <div className="xl:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Factor breakdown</h3>
            <span className="text-xs text-muted-foreground">5 weighted inputs · score 0–5</span>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {asset.driving_factors.map((f, i) => {
              const isPrimary = i === 0;
              const fc = COLORS.chart[i % COLORS.chart.length];
              return (
                <div
                  key={f.factor}
                  className="flex items-center gap-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{f.label}</span>
                      {isPrimary && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground">
                          primary driver
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <TrendIcon trend={f.trend} />
                      <span className="capitalize">{f.trend}</span>
                      <span>· {f.detail}</span>
                    </div>
                  </div>

                  <div className="hidden sm:block w-28">
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(f.score / 5) * 100}%`, backgroundColor: fc, transition: "width 0.6s ease" }}
                      />
                    </div>
                  </div>

                  <Sparkline data={f.history} color={fc} width={60} height={24} />

                  <div className="text-right w-12">
                    <span className="tabular-nums text-sm font-bold">{f.score.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AdvisoryPanel
          advisory={asset.advisory}
          primaryFactorLabel={primaryFactor.label}
          tier={asset.tier}
        />
      </motion.div>
    </div>
  );
}
