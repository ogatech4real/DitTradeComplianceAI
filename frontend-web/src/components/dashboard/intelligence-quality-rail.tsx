"use client";

import { Progress } from "@/components/ui/progress";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";

function QRow({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 1000) / 10;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums text-foreground">{pct}%</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}

export function IntelligenceQualityRail({
  payload,
}: {
  payload: ScreeningSuccessResponse;
}) {
  const iq = payload.processing_metadata.intelligence_quality;
  const dq = payload.processing_metadata.data_quality;

  return (
    <div className="enterprise-surface space-y-4 rounded-xl border p-5">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Intelligence quality & schema governance
        </h3>
        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
          ICC mapping confidence, schema coverage, and DQ envelope from processing metadata.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <QRow label="Mapping confidence" value={iq?.mapping_confidence ?? 0} />
          <QRow label="Schema consistency" value={iq?.schema_consistency_score ?? 0} />
          <QRow label="Completeness" value={iq?.completeness_score ?? 0} />
        </div>
        <div className="space-y-3">
          <QRow label="Data quality score" value={iq?.data_quality_score ?? 0} />
          <QRow
            label="ICC transformation coverage"
            value={iq?.icc_transformation_coverage ?? 0}
          />
          <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
            Matched {payload.processing_metadata.matched_schema_fields ?? "—"} / required{" "}
            {payload.processing_metadata.required_schema_fields ?? "—"} screening fields · model{" "}
            <span className="font-mono text-foreground">
              {payload.processing_metadata.model_version ?? "—"}
            </span>
          </div>
        </div>
      </div>
      {dq ? (
        <div className="border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
          DQ · invalid rates {(dq.invalid_values_rate ?? 0) * 100}% · coercion{" "}
          {(dq.coercion_rate ?? 0) * 100}%
        </div>
      ) : null}
    </div>
  );
}
