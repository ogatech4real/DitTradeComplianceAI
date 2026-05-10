"use client";

import { cn } from "@/lib/utils";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

const RISK_UI = {
  critical: "#B71C1C",
  high: "#D50000",
  medium: "#FFD600",
  low: "#00C853",
} as const;

function sectionTitle(main: string, source: string) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-tight text-foreground">{main}</h3>
      <p className="mt-1 font-mono text-[10px] leading-relaxed text-muted-foreground">{source}</p>
    </div>
  );
}

function MetricCard(opts: {
  label: string;
  value: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("enterprise-surface rounded-lg border border-border/80 p-4", opts.className)}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {opts.label}
      </div>
      <div className="mt-2 font-mono text-xl font-semibold tabular-nums tracking-tight text-foreground">
        {opts.value}
      </div>
      {opts.subtitle ? (
        <div className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">{opts.subtitle}</div>
      ) : null}
    </div>
  );
}

/**
 * Mirrors Streamlit `summary_cards.render_summary_cards` — same labels and fields
 * from `screening_summary` / `operational_metrics` so operators can cross-read API docs.
 */
export function OperatorAlignedMetrics({ payload }: { payload: ScreeningSuccessResponse }) {
  const s = payload.screening_summary;
  const o = payload.operational_metrics;

  const totalRecords = Number(s.total_records ?? payload.records?.length ?? 0);
  const clearedRecords = Number(s.cleared_records ?? 0);
  const flaggedRecords = Number(s.flagged_records ?? s.records_requiring_review ?? 0);
  const highRiskOnly = Number(s.high_risk_records ?? 0);
  const criticalRecords = Number(s.critical_records ?? 0);
  const mediumRisk = Number(s.medium_risk_records ?? 0);

  const reviewRatePct = Number(o.review_rate_percent ?? 0);
  const combinedCriticalHighPct = Number(o.high_risk_rate_percent ?? 0);

  const highSeverityCount = highRiskOnly + criticalRecords;

  const batchRisk = Number(o.batch_risk_score ?? 0);
  const mappingConf = Number(o.mapping_confidence ?? 0);
  const dq = Number(o.data_quality_score ?? 0);

  let overallStatus: keyof typeof RISK_UI = "low";
  if (criticalRecords > 0) overallStatus = "critical";
  else if (highRiskOnly > 0) overallStatus = "high";
  else if (mediumRisk > 0) overallStatus = "medium";

  const bannerColour = RISK_UI[overallStatus];
  const bannerFg = overallStatus === "medium" ? "#111827" : "#ffffff";

  const fmtBig = (n: number) => n.toLocaleString("en-US");
  const pct01 = (x: number) => `${Math.min(999, Math.max(-999, x * 100)).toFixed(1)}%`;
  const pct02 = (x: number) => `${Math.min(999, Math.max(-999, x * 100)).toFixed(2)}%`;

  const avgHybrid = Number(s.average_risk_score ?? o.average_risk_score ?? 0);
  const fraudAlerts = Number(o.fraud_alerts ?? 0);

  return (
    <div className="space-y-8">
      {sectionTitle(
        "Screening Summary",
        "fields: screening_summary.total_records | cleared_records | flagged_records | high_risk_records | critical_records",
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Total Shipments" value={fmtBig(totalRecords)} />
        <MetricCard label="Cleared Records" value={fmtBig(clearedRecords)} />
        <MetricCard label="Records Requiring Review" value={fmtBig(flaggedRecords)} />
        <MetricCard label="High severity tier (excl. critical)" value={fmtBig(highRiskOnly)} />
        <MetricCard label="Critical Cases" value={fmtBig(criticalRecords)} />
      </div>

      {sectionTitle(
        "Operational Exposure",
        "counts from screening_summary; cohort % from operational_metrics.review_rate_percent & high_risk_rate_percent",
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Requires Review"
          value={fmtBig(flaggedRecords)}
          subtitle={`${reviewRatePct.toFixed(2)}% of cohort`}
        />
        <MetricCard
          label="High Severity"
          value={fmtBig(highSeverityCount)}
          subtitle={`${combinedCriticalHighPct.toFixed(2)}% of cohort (severity critical ∪ high)`}
        />
        <MetricCard label="Critical Cases" value={fmtBig(criticalRecords)} />
        <MetricCard label="Cleared" value={fmtBig(clearedRecords)} />
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Exposure reflects the screened cohort (n={fmtBig(totalRecords)}). Records Requiring Review follows operator{" "}
        <span className="font-mono">requires_review</span> semantics (severity critical + high + medium). “High severity
        tier” counts only severity <span className="font-mono">high</span>, excluding critical or medium — same wording as
        the Streamlit Results dashboard.
      </p>

      {sectionTitle(
        "Intelligence Quality",
        "fields: operational_metrics.batch_risk_score | mapping_confidence | data_quality_score",
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Batch Risk Score" value={pct01(batchRisk)} />
        <MetricCard label="Mapping Confidence" value={pct02(mappingConf)} />
        <MetricCard label="Data Quality Score" value={pct02(dq)} />
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Scores are percentages (0–100%) where shown: mapping and data quality encode how confidently the ingest layer
        understood the file; batch risk summarises cluster-level anomaly pressure (same captions as Streamlit).
      </p>

      <div
        className="rounded-xl py-4 text-center text-base font-bold shadow-sm"
        style={{ backgroundColor: bannerColour, color: bannerFg }}
      >
        Operational Compliance Status: {overallStatus.toUpperCase()}
      </div>

      <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
        Supplementary engine reads (not in Streamlit summary row): screening_summary.average_risk_score ={" "}
        {avgHybrid.toFixed(4)} · operational_metrics.fraud_alerts = {fraudAlerts.toLocaleString("en-US")}
      </p>

      {(mappingConf > 0 && mappingConf < 0.65) || (dq > 0 && dq < 0.7) ? (
        <div className="space-y-2 rounded-lg border border-amber-500/35 bg-amber-500/[0.06] p-4 text-[12px] text-foreground">
          {mappingConf > 0 && mappingConf < 0.65 ? (
            <p>
              <span className="font-semibold">Low schema mapping confidence</span> (operational_metrics.
              mapping_confidence &lt; 0.65) — inconsistent field shapes may attenuate ICC alignment.
            </p>
          ) : null}
          {dq > 0 && dq < 0.7 ? (
            <p>
              <span className="font-semibold">Data quality degradation</span> (operational_metrics.data_quality_score
              &lt; 0.70) — investigate missing tokens, coercion drift, or malformed rows upstream.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
