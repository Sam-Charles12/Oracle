import { useEffect, useRef, useState } from "react";
import { assets as seedAssets, type Asset, type Tier } from "./data";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function useOracleData(intervalMs = 3500, enabled = true) {
  const [assets, setAssets] = useState<Asset[]>(() =>
    seedAssets.map((a) => ({ ...a })),
  );

  // When toggled off → reset to baseline so values snap back to real model output
  const prevEnabled = useRef(enabled);
  useEffect(() => {
    if (prevEnabled.current && !enabled) {
      // Transitioning from enabled → disabled: reset to baseline
      setAssets(seedAssets.map((a) => ({ ...a })));
    }
    prevEnabled.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => {
          const baseline = seedAssets.find((sa) => sa.asset_id === a.asset_id)!;
          const baseRisk = baseline.risk_score;
          const baseRul = baseline.rul_estimate_days;

          // --- Risk score: drift ±5 with a mild directional bias ---
          const riskBias = a.tier === "red" ? 0.3 : a.tier === "amber" ? 0.15 : -0.1;
          const riskDelta = (Math.random() - 0.45) * 3 + riskBias;
          const risk_score = Math.round(
            clamp(a.risk_score + riskDelta, Math.max(0, baseRisk - 5), Math.min(100, baseRisk + 5)),
          );

          // --- RUL: drift ±20% (minimum ±1 day, minimum floor 0.1) ---
          const rulMargin = Math.max(1, baseRul * 0.2);
          const rulDelta = (Math.random() - 0.5) * rulMargin * 0.4;
          const rul_estimate_days = Number(
            clamp(a.rul_estimate_days + rulDelta, Math.max(0.1, baseRul - rulMargin), baseRul + rulMargin).toFixed(1),
          );

          // Lock tier to baseline so classifications never change
          const tier = baseline.tier;

          // --- Trend data: append a new point, drop oldest ---
          const last = a.trend_data[a.trend_data.length - 1];
          // health_signal values are in 0.01–1.0 range, so use matching scale
          const vibRange = Math.max(0.02, last.vibration * 0.15);
          const newVib = clamp(
            last.vibration + (Math.random() - 0.45) * vibRange,
            0.01,
            2,
          );
          const trend_data = [
            ...a.trend_data.slice(1),
            {
              day: last.day + 1,
              vibration: Number(newVib.toFixed(4)),
              temperature: Number((last.temperature + (Math.random() - 0.45) * 0.3).toFixed(1)),
              current_draw: Number((last.current_draw + (Math.random() - 0.45) * 0.2).toFixed(1)),
            },
          ];

          // --- Recompute display string ---
          const days = Math.round(rul_estimate_days);
          const rul_display =
            days < 2
              ? `≈${Math.round(rul_estimate_days * 24)} hours at current load`
              : days < 21
                ? `≈${days} days at current load`
                : `≈${Math.round(days / 7)} weeks at current load`;

          return {
            ...a,
            risk_score,
            rul_estimate_days,
            rul_display,
            tier,
            trend_data,
            last_updated: new Date().toISOString(),
          };
        }),
      );
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, enabled]);

  return { assets };
}
