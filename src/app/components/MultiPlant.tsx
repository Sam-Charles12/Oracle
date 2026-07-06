import { motion } from "motion/react";
import { ChevronRight, MapPin, Factory } from "lucide-react";
import { plants, tierColor, type Tier } from "./data";
import { RiskBadge } from "./RiskBadge";

export function MultiPlant({
  onSelectObajana,
}: {
  onSelectObajana: () => void;
}) {
  return (
    <div className="p-6 md:p-8">
      <div className="rounded-3xl p-5 mb-6 bg-card border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Fleet overview
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              Multi-plant status at a glance
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Each tile rolls up the highest-severity asset in that plant. The
              live Obajana card opens into asset-level detail.
            </p>
          </div>
          <div className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            12 monitored assets
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {plants.map((p) => {
          const c = tierColor[p.aggregateTier as Tier];
          const active = p.id === "obajana";
          return (
            <motion.button
              key={p.id}
              onClick={active ? onSelectObajana : undefined}
              disabled={!active}
              whileHover={active ? { y: -4 } : undefined}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-5 text-left shadow-[0_1px_2px_rgba(31,36,33,0.04)] ${
                active
                  ? "cursor-pointer hover:shadow-[0_16px_40px_rgba(31,36,33,0.12)]"
                  : "cursor-default opacity-80"
              }`}
            >
              <div
                className="absolute inset-x-0 top-0 h-24 opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${c.soft} 0%, rgba(255,255,255,0) 78%)`,
                }}
              />

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-xl border border-border bg-background/80 text-muted-foreground shadow-sm backdrop-blur">
                      <Factory size={15} />
                    </span>
                    <span className="truncate text-[17px] font-semibold">
                      {p.name}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={13} />
                    {p.location}
                  </p>
                </div>
                <RiskBadge tier={p.aggregateTier as Tier} size="sm" />
              </div>

              <div className="relative mt-7 flex items-end justify-between gap-4 rounded-2xl border border-border bg-background/70 px-4 py-4 backdrop-blur-sm">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Monitored assets
                  </div>
                  <div className="mt-1 flex items-end gap-2">
                    <span
                      className="tabular-nums leading-none"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 34,
                        fontWeight: 800,
                        color: c.fg,
                      }}
                    >
                      {p.assetCount}
                    </span>
                    <span className="pb-0.5 text-xs text-muted-foreground">
                      units
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Aggregate state
                  </div>
                  <div
                    className="mt-1 text-sm font-semibold"
                    style={{ color: c.fg }}
                  >
                    {c.label}
                  </div>
                </div>
              </div>

              <div className="relative mt-4 flex items-center justify-between gap-3">
                <div className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                  {active ? "Live plant feed" : "Rolling out soon"}
                </div>
                {active ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                    View fleet <ChevronRight size={14} />
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No interaction yet
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
