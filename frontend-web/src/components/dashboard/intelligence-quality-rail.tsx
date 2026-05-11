"use client";

import { Progress } from "@/components/ui/progress";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { TechnicalMetricsGlossarySelect } from "@/components/dashboard/technical-metrics-glossary-select";
import { IccTechnicalPayloadSheet } from "@/components/dashboard/icc-technical-payload-sheet";

function QRow({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 1000) / 10;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-medium text-foreground">{pct}%</span>
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
    <div className="operational-surface space-y-5 rounded-2xl border border-border/80 p-6">
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Workflow &amp; governance depth
        </h3>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          Extended ingest diagnostics complement the cohort summary scores — cite these when auditors ask whether the
          engine received trustworthy structure.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border/65 bg-muted/20 p-4">
          <p className="text-xs font-semibold text-foreground">Schema &amp; mapping</p>
          <QRow label="Mapping confidence" value={iq?.mapping_confidence ?? 0} />
          <QRow label="Structural consistency" value={iq?.schema_consistency_score ?? 0} />
          <QRow label="Completeness" value={iq?.completeness_score ?? 0} />
        </div>
        <div className="space-y-3 rounded-xl border border-border/65 bg-muted/20 p-4">
          <p className="text-xs font-semibold text-foreground">Dataset transformation</p>
          <QRow label="Overall dataset fitness" value={iq?.data_quality_score ?? 0} />
          <QRow
            label="Trade alignment coverage"
            value={iq?.icc_transformation_coverage ?? 0}
          />
          <div className="rounded-lg border border-border/65 bg-background/70 px-3 py-2.5 text-[12px] text-muted-foreground">
            Mapped{" "}
            <span className="font-semibold text-foreground">
              {payload.processing_metadata.matched_schema_fields ?? "—"}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {payload.processing_metadata.required_schema_fields ?? "—"}
            </span>{" "}
            mandatory screening headings · model lineage{" "}
            <span className="font-medium text-foreground">{payload.processing_metadata.model_version ?? "—"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t border-border/70 pt-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="min-w-0 flex-1 lg:max-w-md">
          <TechnicalMetricsGlossarySelect />
        </div>
        <div className="flex shrink-0 flex-col gap-3 lg:items-end">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:text-right">
            Raw orchestration artefacts
          </p>
          <IccTechnicalPayloadSheet payload={payload} />
        </div>
      </div>

      {dq ? (
        <div className="border-t border-border/70 pt-4 text-[12px] text-muted-foreground">
          Invalid value rate {(dq.invalid_values_rate ?? 0) * 100}% · coercion events{" "}
          {(dq.coercion_rate ?? 0) * 100}%
        </div>
      ) : null}
    </div>
  );
}
