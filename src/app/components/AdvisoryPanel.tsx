import { Sparkles, ArrowDownRight, Clock } from "lucide-react";
import type { Advisory, Tier } from "./data";
import { RiskBadge } from "./RiskBadge";

const urgencyLabel: Record<Advisory["urgency"], string> = {
  low:    "Low urgency",
  medium: "Medium urgency",
  high:   "High urgency",
};

export function AdvisoryPanel({
  advisory,
  primaryFactorLabel,
  tier,
}: {
  advisory: Advisory;
  primaryFactorLabel: string;
  tier: Tier;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-[0_1px_2px_rgba(31,36,33,0.04)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border" style={{ backgroundColor: "var(--accent)" }}>
        <span className="grid place-items-center rounded-lg size-8 text-primary-foreground" style={{ backgroundColor: "var(--primary)" }}>
          <Sparkles size={16} />
        </span>
        <div>
          <div className="text-sm font-bold">Oracle Advisory</div>
          <div className="text-xs text-muted-foreground">AI recommendation · generated just now</div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="rounded-xl px-4 py-3.5 text-sm leading-relaxed bg-muted">
          {advisory.recommendation}
        </div>

        <div className="pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Primary driver</div>
          <div className="text-sm font-semibold">{primaryFactorLabel}</div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
          <div>
            <div className="text-muted-foreground mb-1">Act by</div>
            <div className="font-semibold">{advisory.suggested_action_by}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1 text-right">Urgency</div>
            <div className="font-semibold capitalize">{advisory.urgency}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
