import { COLORS, pfZoneMeta, type PFZone } from "./data";

const zones: { zone: PFZone; label: string }[] = [
  { zone: 1, label: "Normal" },
  { zone: 2, label: "Early" },
  { zone: 3, label: "Accelerating" },
  { zone: 4, label: "Imminent" },
];

export function PFCurve({
  pfZone,
  pfZoneLabel,
  color,
}: {
  pfZone: PFZone;
  pfZoneLabel: string;
  color: string;
}) {
  const position = pfZoneMeta[pfZone].position;
  const w = 560;
  const h = 180;
  const pad = 8;

  const curveY = (x: number) => pad + (h - pad * 2) * Math.pow(x, 2.4);

  const path = Array.from({ length: 60 }, (_, i) => {
    const t = i / 59;
    const x = pad + t * (w - pad * 2);
    const y = curveY(t);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const markerX = pad + position * (w - pad * 2);
  const markerY = curveY(position);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: "auto" }}>
        <defs>
          <linearGradient id="pf-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.14} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((x) => (
          <line
            key={x}
            x1={pad + x * (w - pad * 2)}
            x2={pad + x * (w - pad * 2)}
            y1={pad}
            y2={h - pad}
            stroke={COLORS.border}
            strokeDasharray="3 4"
          />
        ))}
        <path d={`${path} L${w - pad},${h - pad} L${pad},${h - pad} Z`} fill="url(#pf-fill)" />
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={markerX} y1={markerY} x2={markerX} y2={h - pad} stroke={color} strokeWidth={1.5} strokeDasharray="2 3" opacity={0.6} />
        <circle cx={markerX} cy={markerY} r={9} fill={color} opacity={0.18} />
        <circle cx={markerX} cy={markerY} r={5} fill={color} stroke="#fff" strokeWidth={2} />
      </svg>

      <div className="flex justify-between mt-1 px-1">
        {zones.map((z) => (
          <div
            key={z.zone}
            className="text-center flex-1"
            style={{
              color: z.zone === pfZone ? color : COLORS.mutedFg,
              fontWeight: z.zone === pfZone ? 700 : 500,
            }}
          >
            <span className="text-xs">{z.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
