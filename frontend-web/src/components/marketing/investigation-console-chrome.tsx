"use client";

/**
 * Structural preview of the investigation table header — mirrors live workspace typography,
 * no fabricated row data or metrics.
 */
export function InvestigationConsoleChrome() {
  const cols = ["Queue rank", "Declaration", "Severity", "Confidence band", "Calibrated score", "Evidence"];
  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 shadow-inner">
      <div className="border-b border-border/70 bg-muted/30 px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Investigation workspace
        </p>
        <p className="mt-2 font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground">
          Prioritised review console
        </p>
      </div>
      <div className="overflow-x-auto px-4 py-3">
        <div className="flex min-w-[640px] gap-0 rounded-lg border border-border/60 bg-background/75">
          {cols.map((c) => (
            <div
              key={c}
              className="flex-1 border-r border-border/50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground last:border-r-0"
            >
              {c}
            </div>
          ))}
        </div>
        <p className="mt-4 pb-5 text-center text-[12px] text-muted-foreground">
          Rows populate once screening hydrates prioritised exposures — workspace UI is unchanged in production runs.
        </p>
      </div>
    </div>
  );
}
