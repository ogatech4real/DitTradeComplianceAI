"use client";

import { cn } from "@/lib/utils";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

function SurfaceMetric(opts: {
  label: string;
  value: string;
  subtitle?: string;
  className?: string;
  emphasis?: "neutral" | "pressure" | "positive" | "alert";
}) {
  const ring =
    opts.emphasis === "alert"
      ? "shadow-[inset_0_0_0_1px_oklch(0_0_0_/0.04)] border-[var(--semantic-critical)]/30"
      : opts.emphasis === "pressure"
        ? "border-[var(--semantic-orange)]/28"
        : opts.emphasis === "positive"
          ? "border-[var(--semantic-emerald)]/30"
          : "border-border/70";

  return (
    <div
      className={cn(
        "operational-surface rounded-xl border p-4 shadow-[0_14px_40px_-30px_oklch(0_0_0_/0.25)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-32px_oklch(0_0_0_/0.3)]",
        ring,
        opts.className,
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {opts.label}
      </div>
      <div className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {opts.value}
      </div>
      {opts.subtitle ? (
        <div className="mt-2 text-[12px] leading-snug text-muted-foreground">{opts.subtitle}</div>
      ) : null}
    </div>
  );
}

/**
 * Decision-grade summary metrics — aligns with hydrated screening payloads without surfacing schema jargon.
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

  type PostureTone = "critical" | "elevated" | "watch" | "stable";
  let overallTone: PostureTone = "stable";
  if (criticalRecords > 0) overallTone = "critical";
  else if (highRiskOnly > 0) overallTone = "elevated";
  else if (mediumRisk > 0) overallTone = "watch";

  const postureCopy: Record<
    PostureTone,
    { headline: string; body: string }
  > = {
    critical: {
      headline: "Critical escalation posture",
      body: `${criticalRecords} declaration${criticalRecords === 1 ? "" : "s"} require supervisory intervention before release.`,
    },
    elevated: {
      headline: "High severity concentration",
      body: `${highRiskOnly} high-tier declaration${highRiskOnly === 1 ? "" : "s"} need expedited investigative coverage.`,
    },
    watch: {
      headline: "Residual medium-tier attention",
      body: `${mediumRisk} declaration${mediumRisk === 1 ? "" : "s"} remain in measured review lanes.`,
    },
    stable: {
      headline: "Stable compliance posture",
      body: `No unresolved critical tier in this cohort (${totalRecords.toLocaleString("en-US")} declarations screened).`,
    },
  };

  const pct01 = (x: number) => `${Math.min(999, Math.max(-999, x * 100)).toFixed(1)}%`;

  const avgHybrid = Number(s.average_risk_score ?? o.average_risk_score ?? 0);
  const fraudAlerts = Number(o.fraud_alerts ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          Executive intelligence summary
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {postureCopy[overallTone].body}
        </p>
      </div>

      <div
        className={cn(
          "rounded-2xl border px-5 py-4 sm:flex sm:items-center sm:justify-between",
          overallTone === "critical" && "border-[var(--semantic-critical)]/35 bg-[var(--semantic-critical-soft)]/55",
          overallTone === "elevated" &&
            "border-[var(--semantic-orange)]/35 bg-[var(--semantic-orange-soft)]/65",
          overallTone === "watch" &&
            "border-[var(--semantic-amber)]/35 bg-[var(--semantic-amber)]/[0.08]",
          overallTone === "stable" &&
            "border-[var(--semantic-emerald)]/35 bg-[var(--semantic-emerald-soft)]/55",
        )}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Operational disposition
          </p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-xl font-semibold text-foreground">
            {postureCopy[overallTone].headline}
          </p>
        </div>
        <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tabular-nums text-foreground sm:mt-0 sm:text-right">
          {avgHybrid.toFixed(2)}
          <span className="block text-[11px] font-normal uppercase tracking-[0.16em] text-muted-foreground">
            mean calibrated exposure
          </span>
        </p>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Cohort coverage
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SurfaceMetric label="Declarations screened" value={totalRecords.toLocaleString("en-US")} />
          <SurfaceMetric label="Released as compliant" value={clearedRecords.toLocaleString("en-US")} emphasis="positive" />
          <SurfaceMetric
            label="Routing to review"
            value={flaggedRecords.toLocaleString("en-US")}
            subtitle={`${reviewRatePct.toFixed(1)}% of cohort`}
            emphasis={reviewRatePct >= 35 ? "pressure" : "neutral"}
          />
          <SurfaceMetric
            label="High severity tier"
            value={highRiskOnly.toLocaleString("en-US")}
            emphasis={highRiskOnly > 0 ? "pressure" : "neutral"}
          />
          <SurfaceMetric label="Critical tier" value={criticalRecords.toLocaleString("en-US")} emphasis={criticalRecords > 0 ? "alert" : "neutral"} />
        </div>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Exposure ratios
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SurfaceMetric
            label="Share requiring disposition"
            value={`${reviewRatePct.toFixed(1)}%`}
            subtitle={`${flaggedRecords.toLocaleString("en-US")} declarations`}
            emphasis={reviewRatePct >= 35 ? "pressure" : "neutral"}
          />
          <SurfaceMetric
            label="Critical ∪ high prevalence"
            value={`${combinedCriticalHighPct.toFixed(2)}%`}
            subtitle={`${highSeverityCount.toLocaleString("en-US")} combined declarations`}
          />
          <SurfaceMetric label="Fraud escalation count" value={fraudAlerts.toLocaleString("en-US")} />
          <SurfaceMetric
            label="Batch anomaly pressure"
            value={pct01(batchRisk)}
            emphasis={batchRisk >= 0.33 ? "pressure" : "neutral"}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,0.95fr)]">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Intelligence fidelity
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <SurfaceMetric label="Batch pressure index" value={pct01(batchRisk)} />
            <SurfaceMetric label="Schema alignment score" value={pct01(mappingConf)} />
            <SurfaceMetric label="Dataset fitness score" value={pct01(dq)} />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
            Mapping and fitness communicate how faithfully the ingestion pass understood your headings and cell
            completeness. Batch pressure summarises anomalies at the cohort level.
          </p>
        </div>
        <div className="operational-surface rounded-2xl border border-dashed border-border/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Analyst note
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            Mean cohort exposure sits at{" "}
            <span className="font-semibold">{avgHybrid.toFixed(4)}</span>. Fraud escalation handlers recorded{" "}
            <span className="font-semibold">{fraudAlerts.toLocaleString("en-US")}</span>.
          </p>
          {(mappingConf > 0 && mappingConf < 0.65) || (dq > 0 && dq < 0.7) ? (
            <div className="mt-4 space-y-2 rounded-xl border border-[var(--semantic-amber)]/40 bg-[var(--semantic-amber)]/[0.08] px-3 py-2.5 text-[13px] text-foreground">
              {mappingConf > 0 && mappingConf < 0.65 ? (
                <p>
                  Mapping confidence is below the controlled threshold — validate column synonyms before interpreting
                  jurisdiction signals.
                </p>
              ) : null}
              {dq > 0 && dq < 0.7 ? (
                <p>
                  Dataset fitness is degraded — reconcile missing counterparties or malformed dates upstream.
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Structured intelligence inputs look healthy enough for escalation packets without ingest caveats.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
