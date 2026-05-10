/**
 * Mirrors Streamlit `frontend/components/risk_tables.py` —
 * `OperatorRiskArtifacts.build_operator_risk_drivers` thresholds and copy.
 *
 * Backend `records[].explanation` uses only `build_operator_explanation`
 * (rules / emissions / traceability). Drivers below match the **queue drill-down**
 * narrative Streamlit surfaces as “Why this record is in the queue”.
 */

function toNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export function buildOperatorRiskDrivers(row: Record<string, unknown>): string[] {
  const drivers: string[] = [];

  const ruleHits = toNum(row.rule_flag_count);
  const ruleHitsInt = Number.isFinite(ruleHits) ? Math.max(0, Math.floor(ruleHits)) : 0;
  if (ruleHitsInt > 0) {
    drivers.push(`${ruleHitsInt} compliance rule hit(s) detected.`);
  }

  const fraudScore = toNum(row.fraud_score ?? row.fraud_risk_score);
  if (Number.isFinite(fraudScore) && fraudScore >= 0.5) {
    drivers.push("Elevated fraud pattern signal.");
  }

  const batchScore = toNum(row.batch_risk_score);
  if (Number.isFinite(batchScore) && batchScore >= 0.33) {
    drivers.push("Part of a higher-risk batch cluster.");
  }

  const anomalyClass = String(row.anomaly_class ?? "")
    .trim()
    .toLowerCase();
  if (
    anomalyClass &&
    anomalyClass !== "none" &&
    anomalyClass !== "normal" &&
    anomalyClass !== "unknown"
  ) {
    drivers.push(`Anomaly pattern observed (${String(row.anomaly_class).trim()}).`);
  }

  if (drivers.length === 0) {
    drivers.push("No strong risk drivers surfaced; record appears lower-priority.");
  }

  return drivers;
}
