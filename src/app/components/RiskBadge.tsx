import { tierColor, type Tier } from "./data";

export function RiskBadge({
  tier,
  size = "md",
  showLabel = true,
}: {
  tier: Tier;
  size?: "sm" | "md";
  showLabel?: boolean;
}) {
  const c = tierColor[tier];
  const pad = size === "sm" ? "px-2 py-0.5 gap-1.5" : "px-2.5 py-1 gap-2";
  return (
    <span
      className={`inline-flex items-center ${pad} rounded-full`}
      style={{ backgroundColor: c.soft, color: c.fg }}
    >
      <span
        className="rounded-full"
        style={{
          width: size === "sm" ? 6 : 8,
          height: size === "sm" ? 6 : 8,
          backgroundColor: c.fg,
        }}
      />
      {showLabel && (
        <span className={size === "sm" ? "text-xs" : "text-sm"} style={{ fontWeight: 600 }}>
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </span>
      )}
    </span>
  );
}
