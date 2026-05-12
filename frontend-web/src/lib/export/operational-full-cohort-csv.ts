/**
 * Full-cohort operational CSV: every screened row, priority-ranked for desk work.
 * Replaces the narrow “requires_review only” slice with a single ranked manifest.
 */

import { buildOperatorRiskDrivers } from "@/lib/intelligence/decision/operator-risk-drivers";
import { PRIORITY_QUEUE_EXTENSION_COLUMNS, riskIndicatorFromHybridLabel } from "@/lib/export/priority-queue-csv";

function toBoolish(v: unknown): boolean | null {
  if (v === true || v === false) return v;
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "true") return true;
  if (s === "false") return false;
  return null;
}

function hybridScore(row: Record<string, unknown>): number {
  const n = Number(row.hybrid_score);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Aligns with WorkflowEngine `requires_review` (critical | high | medium).
 */
export function recordRequiresOperationalReview(row: Record<string, unknown>): boolean {
  const rb = toBoolish(row.requires_review);
  if (rb !== null) return rb;

  const sev = String(row.severity_level ?? "")
    .trim()
    .toLowerCase();
  if (sev === "critical" || sev === "high" || sev === "medium") return true;

  const hp = Number(row.hybrid_pred);
  if (Number.isFinite(hp) && hp === 1) return true;

  return false;
}

function operatorTriageStatus(row: Record<string, unknown>, needsReview: boolean): string {
  if (needsReview) return "Requires review";

  const expl = String(row.explanation ?? "").toLowerCase();
  if (expl.includes("passed standard compliance screening")) {
    return "Cleared — complete";
  }
  return "Cleared — OK";
}

function operatorRationale(row: Record<string, unknown>, needsReview: boolean): string {
  const expl = String(row.explanation ?? "").trim();
  const drivers = buildOperatorRiskDrivers(row);
  const material = drivers.filter((d) => !/lower-priority/i.test(d));
  const driverLine = material.join(" ").trim();

  if (expl && driverLine) return `${expl} | ${driverLine}`;
  if (expl) return expl;
  if (driverLine) return driverLine;
  return needsReview ? "Flagged for governance review — see severity and hybrid composite." : "No material screening flags at this pass.";
}

/**
 * Enrich row for export (non-destructive copy).
 */
export function enrichRecordForFullCohortExport(row: Record<string, unknown>): Record<string, unknown> {
  const needs = recordRequiresOperationalReview(row);
  return {
    ...row,
    risk_indicator: riskIndicatorFromHybridLabel(row.hybrid_risk_label ?? row.risk_label),
    operator_triage_status: operatorTriageStatus(row, needs),
    operator_rationale: operatorRationale(row, needs),
  };
}

/**
 * Review cohort first (highest hybrid_score first), then cleared tail (calmer rows last).
 */
export function sortFullCohortForOperationalExport(
  records: Record<string, unknown>[],
): Record<string, unknown>[] {
  const copy = [...records];
  copy.sort((a, b) => {
    const ar = recordRequiresOperationalReview(a);
    const br = recordRequiresOperationalReview(b);
    if (ar !== br) return ar ? -1 : 1;

    if (ar && br) {
      const dh = hybridScore(b) - hybridScore(a);
      if (dh !== 0) return dh;
      const rpA = Number(a.review_priority);
      const rpB = Number(b.review_priority);
      if (Number.isFinite(rpA) && Number.isFinite(rpB) && rpA !== rpB) return rpA - rpB;
      return String(a.record_id ?? "").localeCompare(String(b.record_id ?? ""));
    }

    const dh = hybridScore(a) - hybridScore(b);
    if (dh !== 0) return dh;
    return String(a.record_id ?? "").localeCompare(String(b.record_id ?? ""));
  });
  return copy;
}

/** Lead columns: operator context first, then core risk fields, then ICC extension, then remainder alphabetically. */
const FULL_COHORT_ORDERED_PREFIX: readonly string[] = [
  "record_id",
  "operator_triage_status",
  "operator_rationale",
  "recommended_action",
  "review_status",
  "compliance_issue",
  "severity_level",
  "requires_review",
  "hybrid_score",
  "hybrid_risk_label",
  "hybrid_pred",
  "rule_flag_count",
  "fraud_score",
  "fraud_risk_label",
  "batch_risk_score",
  "anomaly_class",
  "risk_indicator",
  "explanation",
];

export function buildFullCohortCsvColumnOrder(rows: Record<string, unknown>[]): string[] {
  const union = new Set<string>();
  for (const r of rows) {
    for (const k of Object.keys(r)) union.add(k);
  }

  const ordered: string[] = [];
  const pushIfPresent = (key: string) => {
    if (union.has(key) && !ordered.includes(key)) ordered.push(key);
  };

  for (const k of FULL_COHORT_ORDERED_PREFIX) pushIfPresent(k);
  for (const k of PRIORITY_QUEUE_EXTENSION_COLUMNS) pushIfPresent(k);

  const rest = [...union]
    .filter((k) => !ordered.includes(k))
    .sort((a, b) => a.localeCompare(b));
  return [...ordered, ...rest];
}

export function prepareFullCohortExportRows(records: Record<string, unknown>[]): Record<string, unknown>[] {
  const sorted = sortFullCohortForOperationalExport(records);
  return sorted.map((r) => enrichRecordForFullCohortExport(r));
}
