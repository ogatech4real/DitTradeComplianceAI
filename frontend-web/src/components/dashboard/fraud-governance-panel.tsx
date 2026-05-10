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
    <div className="enterprise-surface rounded-xl border p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Fraud indicators (governance briefing)
      </h3>
      <ul className="mt-4 space-y-3">
        {signals.map((s) => (
          <li key={s.label} className="rounded-lg border border-border/50 bg-muted/25 px-3 py-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-foreground">{s.label}</span>
              <span className="font-mono text-sm tabular-nums text-primary">{s.value}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              {s.interpretation}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
