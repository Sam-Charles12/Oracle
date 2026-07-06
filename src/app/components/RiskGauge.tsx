import { tierColor, COLORS, type Tier } from "./data";

/**
 * Circular composite risk-score gauge (Image 2's "80%" gauge reference).
 * Animated stroke driven by SVG dash offset.
 */
export function RiskGauge({
  score,
  tier,
  size = 200,
}: {
  score: number;
  tier: Tier;
  size?: number;
}) {
  const stroke = 16;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  // 270-degree arc (gap at the bottom)
  const arc = 0.75;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * arc;
  const progress = (score / 100) * dash;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Composite risk score ${score} of 100, ${tier} tier`}
    >
      <svg width={size} height={size} className="-rotate-[135deg]">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={COLORS.chart[0]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.7s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="tabular-nums"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: size * 0.28,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span className="text-xs text-muted-foreground mt-1">Risk score</span>
      </div>
    </div>
  );
}
