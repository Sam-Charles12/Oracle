import { MapPin, ChevronRight } from "lucide-react";
import { plants, tierColor, type Tier } from "./data";
import { RiskBadge } from "./RiskBadge";

export function MultiPlant({ onSelectObajana }: { onSelectObajana: () => void }) {
  return (
    <div className="p-6 md:p-8">
      <div className="rounded-2xl p-5 mb-6 bg-card border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)]">
        <p className="text-sm text-muted-foreground">
          Aggregate risk per DCP plant — rolls up to the highest-severity asset in that plant.
          Drill into Obajana for live asset-level detail.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {plants.map((p) => {
          const c = tierColor[p.aggregateTier as Tier];
          const active = p.id === "obajana";
          return (
            <button
              key={p.id}
              onClick={active ? onSelectObajana : undefined}
              disabled={!active}
              className={`text-left bg-card rounded-2xl p-5 border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)] relative overflow-hidden ${
                active ? "hover:shadow-[0_12px_32px_rgba(31,36,33,0.10)] cursor-pointer" : "opacity-70 cursor-default"
              } transition-shadow`}
            >
              <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: c.fg }} />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{p.name}</span>
                </div>
                <RiskBadge tier={p.aggregateTier as Tier} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{p.location}</p>

              <div className="flex items-end justify-between mt-6">
                <div>
                  <div className="text-xs text-muted-foreground">Monitored assets</div>
                  <span className="tabular-nums" style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: c.fg }}>
                    {p.assetCount}
                  </span>
                </div>
                {active && (
                  <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                    View fleet <ChevronRight size={14} />
                  </span>
                )}
              </div>
              {!active && <p className="text-xs text-muted-foreground mt-2">Live feed pending rollout</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
