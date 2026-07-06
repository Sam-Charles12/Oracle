import { motion } from "motion/react";
import { AlertTriangle, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { tierColor, tierRank, type Asset, type Tier } from "./data";
import { AssetCard } from "./AssetCard";
import { FleetDonut } from "./FleetDonut";
import type { View } from "./Sidebar";

function KpiCard({
  label,
  value,
  unit,
  icon,
  accent,
  hint,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  accent: string;
  hint: string;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="grid place-items-center rounded-lg size-8" style={{ backgroundColor: `${accent}1a`, color: accent }}>
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 mt-3">
        <span className="tabular-nums" style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 800, lineHeight: 1 }}>
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{hint}</p>
    </div>
  );
}

export function Overview({
  assets,
  totalAssets,
  searchTerm,
  onClearSearch,
  onOpen,
  onNavigate,
}: {
  assets: Asset[];
  totalAssets: number;
  searchTerm: string;
  onClearSearch: () => void;
  onOpen: (id: string) => void;
  onNavigate: (v: View) => void;
}) {
  const counts: Record<Tier, number> = {
    green: assets.filter((a) => a.tier === "green").length,
    amber: assets.filter((a) => a.tier === "amber").length,
    red:   assets.filter((a) => a.tier === "red").length,
  };

  const sorted = [...assets].sort((a, b) => tierRank[a.tier] - tierRank[b.tier]);
  const soonest = [...assets].sort((a, b) => a.rul_estimate_days - b.rul_estimate_days)[0];

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <KpiCard
            label="Assets needing action"
            value={String(counts.red + counts.amber)}
            unit={`of ${assets.length}`}
            icon={<AlertTriangle size={17} />}
            accent={tierColor.amber.fg}
            hint={`${counts.red} critical · ${counts.amber} degrading`}
          />
          <KpiCard
            label="Soonest predicted failure"
            value={String(soonest.rul_estimate_days)}
            unit="days"
            icon={<Clock size={17} />}
            accent={tierColor.red.fg}
            hint={`${soonest.asset_name} — ${soonest.pf_zone_label}`}
          />
          <KpiCard
            label="Healthy assets"
            value={String(counts.green)}
            unit="normal"
            icon={<ShieldCheck size={17} />}
            accent={tierColor.green.fg}
            hint="Operating within expected bands"
          />
          <button
            onClick={() => onNavigate("escalation")}
            className="text-left bg-primary text-primary-foreground rounded-2xl p-5 shadow-[0_8px_24px_rgba(63,110,82,0.28)] hover:brightness-105 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Escalation queue</span>
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="tabular-nums" style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 800, lineHeight: 1 }}>
                {counts.red + counts.amber}
              </span>
              <span className="text-sm opacity-90">open items</span>
            </div>
            <p className="text-xs opacity-80 mt-2">Review actions & work orders</p>
          </button>
        </div>

        {/* Fleet health donut */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)] flex items-center gap-4">
          <FleetDonut counts={counts} />
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-3">Fleet health</div>
            {(["red", "amber", "green"] as Tier[]).map((t) => (
              <div key={t} className="flex items-center gap-2 mb-2">
                <span className="rounded-full size-2.5" style={{ backgroundColor: tierColor[t].fg }} />
                <span className="text-sm capitalize">{t}</span>
                <span className="ml-auto tabular-nums text-sm font-semibold">{counts[t]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Monitored assets</h2>
        <span className="text-sm text-muted-foreground">
          {searchTerm.trim()
            ? `Showing ${assets.length} of ${totalAssets} assets matching "${searchTerm.trim()}"`
            : "Sorted by urgency · Obajana plant"}
        </span>
      </div>
      {sorted.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sorted.map((a) => (
            <AssetCard key={a.asset_id} asset={a} onOpen={onOpen} />
          ))}
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <div className="text-base font-semibold">No assets match this search</div>
          <p className="text-sm text-muted-foreground mt-2">
            Try a different asset name, plant, tier, or risk label.
          </p>
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
