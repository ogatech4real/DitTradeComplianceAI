"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadDatasetFile } from "@/lib/api/services/upload";
import { runScreening } from "@/lib/api/services/screening";
import { queryKeys } from "@/lib/api/query-keys";
import { parseTradeFileToRecords } from "@/lib/file-ingest/parse-trade-file";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { useWorkflowUiStore } from "@/stores/workflow-ui-store";

function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Upload → ingest acknowledgment → scoring → client-side materialisation stages
 * (review queue hydration, explainability surfaces, export-ready envelope).
 * Mirrors backend orchestration for operator transparency (not a second engine).
 */
export function useCompliancePipelineMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<ScreeningSuccessResponse> => {
      const sf = useWorkflowUiStore.getState();

      sf.setStatus("running");
      sf.setPipelineMessage("Parsing dataset locally for screening transport…");
      sf.setActivePhase("upload_dataset");

      const { records, columns } = await parseTradeFileToRecords(file);

      sf.setActivePhase("schema_intelligence");
      sf.setPipelineMessage("Server ingest / schema validation…");
      await uploadDatasetFile(file, {
        rowCount: records.length,
        columns,
      });

      sf.setActivePhase("hybrid_scoring");
      sf.setPipelineMessage("Hybrid ML + rules scoring (synchronous run)…");
      const result = await runScreening({ records });

      sf.setActivePhase("review_queue");
      sf.setPipelineMessage("Hydrating review queue and latest-results envelope…");
      // Authoritative screening response — do not invalidate/refetch `/results/latest`
      // here: refetch loses data on transient errors, empty server memory across
      // workers, or focus/stale churn and clears the hydrated dashboard briefly.
      queryClient.setQueryData(queryKeys.latestResults(), result);

      sf.setActivePhase("explainability");
      sf.setPipelineMessage("Binding explainability themes and operator narratives to the cohort…");
      await delayMs(140);

      sf.setActivePhase("export_audit");
      sf.setPipelineMessage("Results ready for dashboard, triage, and governance export actions…");
      await delayMs(140);

      sf.setPipelineMessage(null);
      sf.setStatus("succeeded");
      return result;
    },
    onError: () => {
      const sf = useWorkflowUiStore.getState();
      sf.setStatus("failed");
      sf.setPipelineMessage(null);
    },
  });
}
