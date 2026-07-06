import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { COLORS, type Tier } from "./data";

/** Fleet composition donut with center total. */
export function FleetDonut({ counts }: { counts: Record<Tier, number> }) {
  const total = counts.red + counts.amber + counts.green;
  const data = [
    { name: "red",   value: counts.red,   color: COLORS.red   },
    { name: "amber", value: counts.amber, color: COLORS.amber },
    { name: "green", value: counts.green, color: COLORS.green },
  ].filter((d) => d.value > 0);

  return (
    <div className="relative" style={{ width: 132, height: 132 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={46}
            outerRadius={64}
            paddingAngle={3}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="tabular-nums"
          style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, lineHeight: 1 }}
        >
          {total}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">assets</span>
      </div>
    </div>
  );
}
