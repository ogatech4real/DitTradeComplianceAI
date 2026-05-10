import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

export interface JurisdictionStratum {
  /** Display code (market / country) */
  code: string;
  recordCount: number;
  meanHybrid: number;
  /** Governance-weighted exposure for triage ordering */
  exposureIndex: number;
  /** Share of records requiring review in this stratum */
  reviewPressure: number;
}

function toNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function jurisdictionKey(row: Record<string, unknown>): string {
  const m =
    row.destination_market ?? row.destination_country ?? row.market ?? row.country;
  return m != null && String(m).trim() !== "" ? String(m) : "Unknown";
}

function requiresReview(row: Record<string, unknown>): boolean {
  const s = String(row.severity_level ?? "").toLowerCase();
  return s === "critical" || s === "high" || s === "medium";
}

/**
 * Aggregated jurisdiction / market **decision** surface — not row-level tables.
 */
export function deriveJurisdictionStrata(
  payload: ScreeningSuccessResponse,
): JurisdictionStratum[] {
  const { records } = payload;
  if (!records.length) return [];

  const groups = new Map<
    string,
    { scores: number[]; review: number; n: number }
  >();

  for (const row of records) {
    const code = jurisdictionKey(row);
    const h = toNum(row.hybrid_score);
    const g = groups.get(code) ?? { scores: [], review: 0, n: 0 };
    g.scores.push(h);
    g.n += 1;
    if (requiresReview(row)) g.review += 1;
    groups.set(code, g);
  }

  const out: JurisdictionStratum[] = [];
  for (const [code, g] of groups) {
    const meanHybrid =
      g.scores.reduce((a, b) => a + b, 0) / Math.max(g.scores.length, 1);
    const reviewPressure = g.n > 0 ? g.review / g.n : 0;
    const exposureIndex =
      meanHybrid * (1 + Math.log1p(g.n)) * (0.5 + reviewPressure);
    out.push({
      code,
      recordCount: g.n,
      meanHybrid,
      exposureIndex,
      reviewPressure,
    });
  }

  return out.sort((a, b) => b.exposureIndex - a.exposureIndex).slice(0, 8);
}
