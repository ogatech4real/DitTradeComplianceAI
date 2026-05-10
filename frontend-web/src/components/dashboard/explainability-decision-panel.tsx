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
    <div className="operational-surface rounded-2xl border border-border/80 p-6">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Explainability &amp; decision themes
      </h3>
      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
        Each theme summarises cohort-level reasoning surfaced from narratives and calibrated risk telemetry — pairing
        what analysts read with quantitative prevalence.
      </p>
      <ul className="mt-5 space-y-3">
        {themes.map((t) => (
          <li
            key={t.theme}
            className="rounded-xl border border-border/65 bg-gradient-to-br from-muted/35 to-transparent px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-sm font-semibold tracking-tight text-foreground">{t.theme}</span>
              <span className="tabular-nums text-[12px] font-medium text-muted-foreground">
                {t.sharePercent}% of cohort ({t.count} declaration{t.count === 1 ? "" : "s"})
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t.decisionHint}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
