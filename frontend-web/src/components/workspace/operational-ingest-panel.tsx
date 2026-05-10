"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCompliancePipelineMutation } from "@/hooks/use-compliance-pipeline-mutation";
import { ApiHttpError } from "@/lib/api/errors";
import { TradeFileParseError } from "@/lib/file-ingest/parse-trade-file";
import { useWorkflowUiStore } from "@/stores/workflow-ui-store";
import { WORKFLOW_PHASE_METADATA } from "@/lib/contracts/workflow";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { shouldUseMockApi } from "@/lib/api/mock-mode";

function workflowProgressPercent(phaseId: string, isRunning: boolean): number {
  if (!isRunning) return 0;
  const order = WORKFLOW_PHASE_METADATA.map((p) => p.id);
  const idx = order.indexOf(phaseId as (typeof order)[number]);
  if (idx < 0) return 12;
  return Math.min(
    100,
    Math.round((idx / Math.max(order.length - 1, 1)) * 100),
  );
}

export function OperationalIngestPanel() {
  const [dragOver, setDragOver] = useState(false);
  const mutation = useCompliancePipelineMutation();
  const wfActive = useWorkflowUiStore((s) => s.activePhaseId);
  const wfStatus = useWorkflowUiStore((s) => s.status);
  const wfPipelineMessage = useWorkflowUiStore((s) => s.pipelineMessage);

  const onRun = useCallback(
    async (file: File) => {
      await mutation.mutateAsync(file);
    },
    [mutation],
  );

  const handleFiles = async (list: FileList | null) => {
    const f = list?.[0];
    if (!f) return;
    await onRun(f);
  };

  const errMsg =
    mutation.error instanceof TradeFileParseError
      ? mutation.error.message
      : mutation.error instanceof ApiHttpError
        ? mutation.error.message
        : mutation.error instanceof Error
          ? mutation.error.message
          : null;

  const pct = workflowProgressPercent(
    wfActive,
    mutation.isPending || wfStatus === "running",
  );

  const phaseLabel =
    WORKFLOW_PHASE_METADATA.find((p) => p.id === wfActive)?.label ?? "Ready";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className={cn(
          "operational-surface overflow-hidden border-dashed shadow-sm transition-colors",
          dragOver && "border-[var(--accent-governance)]/45 bg-[var(--accent-governance)]/[0.04]",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight">
                Import &amp; screen
              </CardTitle>
              <CardDescription className="mt-1.5 max-w-2xl text-sm leading-relaxed">
                Upload trade declarations in CSV or Excel. We parse the file locally, send a
                secure intake confirmation, then run the full compliance screening pass. Results flow
                to decision intelligence and the investigation workspace automatically.
              </CardDescription>
            </div>
            {shouldUseMockApi() ? (
              <Badge
                variant="outline"
                className="shrink-0 border-[var(--semantic-amber)]/40 bg-[var(--semantic-amber)]/[0.08] text-[10px] font-medium tracking-wide text-[var(--semantic-amber-fg)]"
              >
                Demo data mode
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            className={cn(
              "rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/[0.35] px-6 py-12 text-center transition-colors",
              dragOver && "border-[var(--accent-governance)]/40 bg-muted/[0.5]",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              void handleFiles(e.dataTransfer.files);
            }}
            role="presentation"
          >
            <Upload
              className="mx-auto size-10 text-muted-foreground/70"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="mt-4 text-sm font-medium text-foreground">
              Drop a file here, or browse below
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              The first worksheet or CSV row should use clear column headings that match your
              declaration schema. Stronger headings improve mapping confidence in later steps.
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2 text-left">
              <label htmlFor="trade-file-upload" className="text-xs font-medium text-muted-foreground">
                File
              </label>
              <Input
                id="trade-file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                disabled={mutation.isPending}
                onChange={(e) => void handleFiles(e.target.files)}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
              onClick={() => document.getElementById("trade-file-upload")?.click()}
            >
              Browse files
            </Button>
          </div>

          {(mutation.isPending || wfPipelineMessage) && (
            <div className="space-y-2 rounded-xl border border-border/70 bg-muted/25 p-4">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <span>In progress</span>
                <span className="font-normal capitalize text-foreground">{phaseLabel}</span>
              </div>
              <Progress value={pct} className="h-1.5" />
              {wfPipelineMessage ? (
                <p className="text-xs leading-relaxed text-muted-foreground">{wfPipelineMessage}</p>
              ) : null}
            </div>
          )}

          {errMsg ? (
            <div className="flex gap-3 rounded-xl border border-destructive/35 bg-destructive/[0.06] p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <div>
                <p className="font-medium text-destructive">Screening did not complete</p>
                <p className="mt-1 text-xs leading-relaxed opacity-95">{errMsg}</p>
              </div>
            </div>
          ) : null}

          {mutation.isSuccess && wfStatus === "succeeded" ? (
            <div className="flex flex-col gap-4 rounded-xl border border-[var(--semantic-emerald)]/30 bg-[var(--semantic-emerald)]/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3 text-sm text-foreground">
                <CheckCircle2 className="size-5 shrink-0 text-[var(--semantic-emerald)]" aria-hidden />
                <span>
                  Screening finished. Decision intelligence is updated — open the surface to review
                  exposure, rationale, and next actions.
                </span>
              </div>
              <Link
                href={WORKSPACE_ROUTES.dashboard}
                className={buttonVariants({ size: "sm" })}
              >
                View decision intelligence
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
