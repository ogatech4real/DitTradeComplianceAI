"use client";

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

export function ExecutiveBriefPanel({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const si = payload.system_insights;

  return (
    <div className="enterprise-surface relative overflow-hidden rounded-xl border p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
      <div className="relative">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Executive briefing
          </h3>
          <p className="mt-1 font-mono text-[10px] leading-relaxed text-muted-foreground">
            API field <span className="text-foreground/90">executive_summary</span> (verbatim operator narrative — cross-check counts
            against Screening Summary rows above).
          </p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/95">{payload.executive_summary}</p>
        <dl className="mt-4 grid gap-3 text-[11px] sm:grid-cols-3">
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground">
              Highest-risk market signal
            </dt>
            <dd className="mt-1 font-mono text-sm text-foreground">
              {si.highest_risk_market ?? si.most_common_violation_type ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground">
              Dominant violation theme
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {si.most_common_violation_type ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground">
              Product posture
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {si.most_affected_product_category ??
                si.most_affected_category ??
                "—"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
