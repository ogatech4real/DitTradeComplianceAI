"use client";

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

export function ExecutiveBriefPanel({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const si = payload.system_insights;

  return (
    <div className="operational-surface relative overflow-hidden rounded-2xl border border-border/80 p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_120%_-10%,var(--accent-intelligence)_/_0.11,transparent_52%)]" />
      <div className="relative">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Executive synopsis
        </h3>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Plain-language rollup for briefings — cross-check headline metrics above when preparing escalation packets.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground">{payload.executive_summary}</p>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Highest-pressure market signal
            </dt>
            <dd className="mt-2 font-semibold text-foreground">
              {si.highest_risk_market ?? si.most_common_violation_type ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Dominant finding theme
            </dt>
            <dd className="mt-2 font-semibold text-foreground">{si.most_common_violation_type ?? "—"}</dd>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Product posture
            </dt>
            <dd className="mt-2 text-foreground">
              {si.most_affected_product_category ?? si.most_affected_category ?? "—"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
