"use client";

import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { deriveExplainabilityThemes } from "@/lib/intelligence/decision/explainability-themes";

export function ExplainabilityDecisionPanel({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const themes = deriveExplainabilityThemes(payload);

  return (
    <div className="enterprise-surface rounded-xl border p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Explainability — decision narratives
      </h3>
      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
        Themes prefer each row&apos;s{" "}
        <span className="font-mono text-foreground/80">records[].explanation</span> (
        <span className="font-mono">build_operator_explanation</span>), then Streamlit-aligned
        risk-driver signals (fraud ≥0.5, batch ≥0.33, rules, anomalies) when the narrative is
        otherwise generic — same tier logic as queue drill-down copy.
      </p>
      <ul className="mt-4 space-y-3">
        {themes.map((t) => (
          <li
            key={t.theme}
            className="rounded-lg border border-border/60 bg-background/60 px-3 py-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                {t.theme}
              </span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {t.count} · {t.sharePercent}%
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {t.decisionHint}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
