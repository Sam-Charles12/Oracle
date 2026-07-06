import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { tierColor, tierRank, type Asset } from "./data";
import { RiskBadge } from "./RiskBadge";
import { Sparkline } from "./Sparkline";

export function AssetCard({
  asset,
  onOpen,
}: {
  asset: Asset;
  onOpen: (id: string) => void;
}) {
  const c = tierColor[asset.tier];
  const vib = asset.trend_data.map((d) => d.vibration);
  const primaryFactor = asset.driving_factors[0];

  return (
    <motion.button
      layoutId={`asset-card-${asset.asset_id}`}
      onClick={() => onOpen(asset.asset_id)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group text-left bg-card rounded-2xl p-5 border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)] hover:shadow-[0_12px_32px_rgba(31,36,33,0.10)] transition-shadow relative"
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0 flex-1">
          <motion.h3
            layoutId={`asset-name-${asset.asset_id}`}
            style={{ fontSize: 17, fontWeight: 700 }}
            className="truncate"
          >
            {asset.asset_name}
          </motion.h3>
          <p className="text-xs text-muted-foreground mt-0.5">{asset.plant}</p>
        </div>
        <RiskBadge tier={asset.tier} />
      </div>

      {/* Primary metrics grid */}
      <div className="grid grid-cols-2 gap-6 py-5 border-y border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Remaining useful life</div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="tabular-nums"
              style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, lineHeight: 1 }}
            >
              {asset.rul_estimate_days}
            </span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{asset.rul_display}</p>
        </div>
        
        <div className="border-l border-border pl-6">
          <div className="text-xs text-muted-foreground mb-1.5">Risk score</div>
          <div className="flex items-center gap-1.5">
            <span className="tabular-nums" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
              {asset.risk_score}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {asset.tier === "red" || asset.tier === "amber" ? (
              <>
                <TrendingUp size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Rising</span>
              </>
            ) : primaryFactor.trend === "falling" ? (
              <>
                <TrendingDown size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Falling</span>
              </>
            ) : (
              <>
                <Minus size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Stable</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status indicator section */}
      <div className="py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium mb-0.5">{asset.pf_zone_label}</div>
            <div className="text-xs text-muted-foreground">P-F curve position</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-16">
              <Sparkline data={vib} color={c.fg} />
            </div>
          </div>
        </div>
      </div>

      {/* Driving factor section */}
      <div className="flex items-center justify-between text-xs pt-4">
        <span className="text-muted-foreground">Primary factor</span>
        <span className="font-medium">{primaryFactor.factor_name}</span>
      </div>
    </motion.button>
  );
}