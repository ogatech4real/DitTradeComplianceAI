"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/35 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
      {children}
    </span>
  );
}

/**
 * Chips and bullet signals derived from hydrated screening outcomes (no synopsis excerpt;
 * synopsis lives on ExecutiveBriefPanel).
 */
export function NarrativeIntelligenceStrip({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const si = payload.system_insights;
  const fraud = payload.operational_metrics.fraud_alerts ?? 0;
  const anomalies = payload.operational_metrics.anomaly_records ?? 0;
  const batchRisk = payload.operational_metrics.batch_risk_score ?? 0;
  const reviewRate = payload.operational_metrics.review_rate_percent ?? 0;

  const lines: string[] = [];
  if (si.highest_risk_market && si.highest_risk_market.trim() !== "") {
    lines.push(
      `Jurisdiction spotlight — ${si.highest_risk_market} concentrates elevated screening attention.`,
    );
  }
  if (si.most_common_violation_type && si.most_common_violation_type.trim() !== "") {
    lines.push(
      `Violation theme dominance — recurrent pattern: ${si.most_common_violation_type}.`,
    );
  }
  if (batchRisk >= 0.33) {
    lines.push(
      "Batch anomaly pressure elevated — duplication or clustering effects warrant supervisory scan.",
    );
  }
  if (Number(fraud) > 0) {
    lines.push(
      `${fraud} orchestrated fraud signal${Number(fraud) === 1 ? "" : "s"} flagged for governance overlays.`,
    );
  }
  if (Number(anomalies) > 0) {
    lines.push(`${anomalies} cohort anomaly spike${Number(anomalies) === 1 ? "" : "s"} outside normal density.`);
  }
  return (
    <motion.div
      className="operational-surface relative overflow-hidden rounded-2xl border border-border/80 p-5 sm:p-6"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-intelligence)]/35 to-transparent" />
      <div className="flex flex-wrap items-center gap-2">
        <Chip>{reviewRate >= 25 ? "High triage velocity" : "Measured triage load"}</Chip>
        {batchRisk >= 0.33 ? <Chip>Emerging batch pattern</Chip> : null}
        {Number(fraud) > 0 ? <Chip>Fraud overlays active</Chip> : null}
      </div>
      <div className="mt-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Thematic signals
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          Automated pulls from cohort metrics — cross-check against the synopsis panel above before escalation packs.
        </p>
      </div>
      {lines.length ? (
        <ul className="mt-5 space-y-2.5 text-[13px] leading-relaxed text-muted-foreground">
          {lines.map((line) => (
            <li key={line} className="flex gap-3">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-[var(--accent-governance)]/70"
                aria-hidden
              />
              <span className="text-foreground">{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          No thematic amplifications detected beyond baseline posture — cohort remains homogeneous at macro level.
        </p>
      )}
    </motion.div>
  );
}
