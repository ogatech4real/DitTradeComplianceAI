"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { recordsToCsv, triggerCsvDownload } from "@/lib/export/csv";

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

  const queueRows: Record<string, unknown>[] =
    queue20.length > 0 ? queue20.map((q) => ({ ...q })) : [...(payload.records ?? [])]
          .sort((a, b) => Number(b.hybrid_score ?? 0) - Number(a.hybrid_score ?? 0))
          .slice(0, 20);

  const priorityDisabled = queueRows.length === 0;

  function downloadPriorityCsv() {
    if (priorityDisabled) return;
    const csv = recordsToCsv(queueRows);
    triggerCsvDownload(csv, `priority-queue-top-20_${stamp()}.csv`);
  }

  const fullRecords = payload.records ?? [];
  const fullDisabled = fullRecords.length === 0;

  function downloadFullCsv() {
    if (fullDisabled) return;
    const csv = recordsToCsv(fullRecords);
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
        onClick={downloadFullCsv}
      >
        <Download className="size-4" aria-hidden />
        Download full operational review CSV
      </Button>
    </div>
  );
}
