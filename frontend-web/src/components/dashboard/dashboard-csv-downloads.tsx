"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { recordsToCsvWithColumns, triggerCsvDownload } from "@/lib/export/csv";
import {
  buildFullCohortCsvColumnOrder,
  prepareFullCohortExportRows,
} from "@/lib/export/operational-full-cohort-csv";
import {
  buildPriorityQueueCsvColumnOrder,
  buildRecordIdMap,
  mergePriorityItemWithRecord,
  riskIndicatorFromHybridLabel,
} from "@/lib/export/priority-queue-csv";

interface DashboardCsvDownloadsProps {
  payload: ScreeningSuccessResponse;
}

function stamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function DashboardCsvDownloads({ payload }: DashboardCsvDownloadsProps) {
  const sortedQueue = [...(payload.priority_review_queue ?? [])].sort((a, b) => {
    const hs = Number(b?.hybrid_score ?? 0) - Number(a?.hybrid_score ?? 0);
    if (hs !== 0) return hs;
    return Number(a?.review_priority ?? 0) - Number(b?.review_priority ?? 0);
  });
  const queue20 = sortedQueue.slice(0, 20);
  const records = payload.records ?? [];
  const recordById = buildRecordIdMap(records);

  const queueRows: Record<string, unknown>[] =
    queue20.length > 0
      ? queue20.map((q) => mergePriorityItemWithRecord(q, recordById))
      : [...records]
          .sort((a, b) => Number(b.hybrid_score ?? 0) - Number(a.hybrid_score ?? 0))
          .slice(0, 20)
          .map((r) => {
            const row = { ...r };
            row.risk_indicator = riskIndicatorFromHybridLabel(
              row.hybrid_risk_label ?? row.risk_label,
            );
            return row;
          });

  const priorityDisabled = queueRows.length === 0;

  function downloadPriorityCsv() {
    if (priorityDisabled) return;
    const columns = buildPriorityQueueCsvColumnOrder(queueRows);
    const csv = recordsToCsvWithColumns(queueRows, columns);
    triggerCsvDownload(csv, `priority-queue-top-20_${stamp()}.csv`);
  }

  const fullRecords = payload.records ?? [];
  const fullDisabled = fullRecords.length === 0;

  function downloadFullCsv() {
    if (fullDisabled) return;
    const enriched = prepareFullCohortExportRows(fullRecords);
    const columns = buildFullCohortCsvColumnOrder(enriched);
    const csv = recordsToCsvWithColumns(enriched, columns);
    triggerCsvDownload(csv, `operational-review-full-cohort_${stamp()}.csv`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={priorityDisabled}
        className="gap-1.5 font-medium"
        onClick={downloadPriorityCsv}
      >
        <Download className="size-4" aria-hidden />
        Download priority queue (top 20) CSV
      </Button>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        disabled={fullDisabled}
        className="gap-1.5 font-medium"
        title="Every screened row: review cohort first (highest hybrid pressure), then cleared rows. Columns include operator_triage_status, operator_rationale (API explanation + risk drivers), recommended_action, and review_status."
        onClick={downloadFullCsv}
      >
        <Download className="size-4" aria-hidden />
        Full cohort CSV (priority-ranked)
      </Button>
    </div>
  );
}
