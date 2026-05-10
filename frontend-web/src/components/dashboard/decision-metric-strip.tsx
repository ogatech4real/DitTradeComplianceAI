"use client";

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { cn } from "@/lib/utils";

interface MetricProps {
  label: string;
  value: string;
  hint: string;
  accent?: "default" | "warn" | "risk";
}

function Metric({ label, value, hint, accent = "default" }: MetricProps) {
  return (
    <div
      className={cn(
        "enterprise-surface rounded-lg border p-4",
        accent === "risk" && "border-rose-500/25 bg-rose-500/[0.04]",
        accent === "warn" && "border-amber-500/20 bg-amber-500/[0.04]",
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-2 text-[11px] leading-snug text-muted-foreground">{hint}</div>
    </div>
  );
}

export function DecisionMetricStrip({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const { screening_summary: s, operational_metrics: o } = payload;
  const total = s.total_records ?? payload.records.length;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Metric
        label="Review exposure"
        value={`${o.review_rate_percent ?? 0}%`}
        hint={`${s.records_requiring_review ?? s.flagged_records ?? "—"} of ${total} declarations require governance attention.`}
        accent={(o.review_rate_percent ?? 0) >= 35 ? "warn" : "default"}
      />
      <Metric
        label="Critical lane pressure"
        value={`${Number(o.critical_risk_rate_percent ?? 0).toFixed(1)}%`}
        hint={`Elevated-critical share of cohort; paired high lane ${Number(o.high_risk_rate_percent ?? 0).toFixed(1)}%.`}
        accent={(o.critical_risk_rate_percent ?? 0) > 8 ? "risk" : "default"}
      />
      <Metric
        label="Hybrid risk centroid"
        value={(o.average_risk_score ?? s.average_risk_score ?? 0).toFixed(3)}
        hint="Population mean of calibrated hybrid scorepost composition."
      />
      <Metric
        label="Fraud-pressure index"
        value={`${o.fraud_alerts ?? 0} alerts`}
        hint={`Mean cohort fraud composite ${(s.average_fraud_risk ?? 0).toFixed?.(3) ?? "—"}.`}
        accent={(o.fraud_alerts ?? 0) > 5 ? "warn" : "default"}
      />
    </div>
  );
}
