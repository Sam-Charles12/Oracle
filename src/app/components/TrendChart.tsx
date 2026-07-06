import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { COLORS, type TrendPoint } from "./data";

export function TrendChart({
  data,
  color,
}: {
  data: TrendPoint[];
  color: string;
}) {
  // derive a soft failure threshold from the observed peak
  const maxVib = Math.max(...data.map((d) => d.vibration));
  const threshold = Number((Math.max(maxVib * 1.35, 4.5)).toFixed(1));

  const chartData = data.map((d) => ({
    ...d,
    label: `Day ${d.day}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={COLORS.border} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: COLORS.mutedFg }}
          interval={2}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: COLORS.mutedFg }}
          domain={[0, (dataMax: number) => Math.ceil(Math.max(dataMax, threshold) + 0.5)]}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            boxShadow: "0 8px 24px rgba(31,36,33,0.12)",
            fontSize: 12,
          }}
          labelStyle={{ color: COLORS.mutedFg }}
          formatter={(v: number, name: string) => {
            const labels: Record<string, string> = {
              vibration: "Vibration (mm/s)",
              temperature: "Temperature (°C)",
              current_draw: "Current draw (A)",
            };
            return [`${v}`, labels[name] ?? name];
          }}
        />
        <ReferenceLine
          y={threshold}
          stroke={COLORS.red}
          strokeDasharray="5 4"
          label={{ value: "Failure threshold", position: "insideTopRight", fill: COLORS.red, fontSize: 11 }}
        />
        <Area
          type="monotone"
          dataKey="vibration"
          stroke={color}
          strokeWidth={2.5}
          fill="url(#trend-fill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
