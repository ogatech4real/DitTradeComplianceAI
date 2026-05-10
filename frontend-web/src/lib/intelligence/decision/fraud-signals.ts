import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

export interface FraudSignalBrief {
  label: string;
  value: string;
  interpretation: string;
}

function toNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Extracts **decision-grade** fraud posture from aggregates + cohort rollups.
 */
export function deriveFraudSignals(
  payload: ScreeningSuccessResponse,
): FraudSignalBrief[] {
  const { fraud_analysis, operational_metrics, records } = payload;
  const briefs: FraudSignalBrief[] = [];

  const highFraud = operational_metrics.fraud_alerts ?? 0;
  const total = records.length || 1;
  const rate = Math.round((highFraud / total) * 1000) / 10;

  briefs.push({
    label: "High fraud-pressure population",
    value: `${highFraud} · ${rate}%`,
    interpretation:
      "Records at or above internal fraud score threshold — queue for documentary corroboration.",
  });

  if (fraud_analysis && typeof fraud_analysis === "object") {
    for (const [k, v] of Object.entries(fraud_analysis)) {
      if (k === "high_fraud_risk_records") continue;
      if (typeof v === "number" && v > 0) {
        const human = k.replace(/_/g, " ");
        briefs.push({
          label: human,
          value: String(v),
          interpretation:
            "Pattern hits across the cohort — surface in batch intelligence review.",
        });
      }
    }
  }

  const meanFraud =
    records.length > 0
      ? records.reduce((s, r) => s + toNum(r.fraud_score), 0) / records.length
      : 0;

  briefs.push({
    label: "Mean fraud score (cohort)",
    value: meanFraud.toFixed(3),
    interpretation:
      "Composite of emissions / traceability / document / origin pattern detectors.",
  });

  return briefs.slice(0, 6);
}
