import { useEffect, useState } from "react";
import { assets as seedAssets, type Asset, type Tier } from "./data";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function tierFromScore(score: number): Tier {
  if (score >= 75) return "red";
  if (score >= 45) return "amber";
  return "green";
}

export function useOracleData(intervalMs = 3500) {
  const [assets, setAssets] = useState<Asset[]>(() =>
    seedAssets.map((a) => ({ ...a })),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => {
          const bias = a.tier === "red" ? 0.9 : a.tier === "amber" ? 0.4 : -0.1;
          const delta = (Math.random() - 0.5) * 2.4 + bias;
          const risk_score = clamp(a.risk_score + delta, 6, 97);
          const rul_estimate_days = clamp(
            a.rul_estimate_days - delta * 0.12 + (Math.random() - 0.5) * 0.2,
            0.5,
            120,
          );
          const tier = tierFromScore(risk_score);

          // append a new trend point, drop the oldest
          const last = a.trend_data[a.trend_data.length - 1];
          const newVib = clamp(
            last.vibration + (Math.random() - 0.4) * 0.12 + (bias > 0 ? 0.03 : 0),
            0.5,
            8,
          );
          const trend_data = [
            ...a.trend_data.slice(1),
            {
              day: last.day + 1,
              vibration: Number(newVib.toFixed(2)),
              temperature: Number((last.temperature + (Math.random() - 0.4) * 0.1).toFixed(1)),
              current_draw: Number((last.current_draw + (Math.random() - 0.4) * 0.1).toFixed(1)),
            },
          ];

          const days = Math.round(rul_estimate_days);
          const rul_display =
            days < 2
              ? `≈${Math.round(rul_estimate_days * 24)} hours at current load`
              : days < 21
              ? `≈${days} days at current load`
              : `≈${Math.round(days / 7)} weeks at current load`;

          return {
            ...a,
            risk_score: Math.round(risk_score),
            rul_estimate_days: Number(rul_estimate_days.toFixed(1)),
            rul_display,
            tier,
            trend_data,
            last_updated: new Date().toISOString(),
          };
        }),
      );
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { assets };
}
