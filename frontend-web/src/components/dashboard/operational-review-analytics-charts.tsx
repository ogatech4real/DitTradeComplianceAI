"use client";

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import {
  complianceRiskDistribution,
  deriveRecommendedActionBacklog,
} from "@/lib/intelligence/decision/cohort-rankings";
import { CohortDimensionBar } from "@/components/dashboard/cohort-dimension-bar";

interface OperationalReviewAnalyticsChartsProps {
  payload: ScreeningSuccessResponse;
}

export function OperationalReviewAnalyticsCharts({ payload }: OperationalReviewAnalyticsChartsProps) {
  const compliance = complianceRiskDistribution(payload.compliance_risks);
  const actions = deriveRecommendedActionBacklog(payload.records);

  if (compliance.length === 0 && actions.length === 0) {
    return (
      <div className="operational-surface rounded-2xl border border-border/80 px-6 py-10 text-center">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Operational review analytics
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          Compliance risk buckets and recommended-action aggregates will appear once the screening response includes
          <span className="font-medium text-foreground"> compliance_risks</span> and row-level&nbsp;
          <span className="font-medium text-foreground">recommended_action</span> values.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Operational review analytics
        </h3>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          Counts surfaced from cohort-level risk tagging and backlog-style disposition strings on each record.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <CohortDimensionBar
          title="Compliance risk distribution"
          description="Interpretation counts from orchestration-calibrated buckets (aligned to compliance_risks)."
          data={compliance}
          valueLabel="Flagged occurrences"
          barFillVar="var(--chart-4)"
          chartHeightPx={Math.max(200, compliance.length * 36)}
          emptyMessage="No compliance risk buckets populated for this run."
        />
        <CohortDimensionBar
          title="Recommended actions (backlog)"
          description="How often each disposition recommendation appears across scored rows."
          data={actions}
          valueLabel="Records"
          barFillVar="var(--chart-1)"
          chartHeightPx={Math.max(240, actions.length * 38)}
          emptyMessage="Records do not expose recommended_action in this cohort."
        />
      </div>
    </section>
  );
}
