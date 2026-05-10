"use client";

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { deriveFraudSignals } from "@/lib/intelligence/decision/fraud-signals";

export function FraudGovernancePanel({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const signals = deriveFraudSignals(payload);

  return (
    <div className="operational-surface rounded-2xl border border-border/80 p-6">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Fraud posture &amp; governance signals
      </h3>
      <ul className="mt-5 space-y-3">
        {signals.map((s) => (
          <li key={s.label} className="rounded-xl border border-[var(--accent-fraud)]/15 bg-muted/25 px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-foreground">{s.label}</span>
              <span className="tabular-nums text-sm font-semibold text-[var(--accent-fraud)]">{s.value}</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.interpretation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
