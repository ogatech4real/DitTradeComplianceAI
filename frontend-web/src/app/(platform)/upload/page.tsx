"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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

export default function UploadWorkspacePage() {
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

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {shouldUseMockApi() ? (
        <Badge
          variant="outline"
          className="self-start border-amber-500/35 bg-amber-500/[0.08] font-mono text-[10px] uppercase"
        >
          Mock transport — payloads follow backend contract shapes
        </Badge>
      ) : null}

      <Card
        className={cn(
          "enterprise-surface border-dashed shadow-none transition-colors",
          dragOver && "border-primary/55 bg-primary/[0.04]",
        )}
      >
        <CardHeader>
          <CardTitle>Ingest & screen</CardTitle>
          <CardDescription>
            Local parse builds the `records` envelope for hybrid scoring · server
            ingestion acknowledges traceability (`POST /api/v1/datasets/upload/`).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            className={cn(
              "rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 px-6 py-12 text-center",
              dragOver && "border-primary/40",
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
            <p className="text-sm font-medium text-foreground">Drop CSV or Excel</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              First-sheet columns become screening fields — align with ICC canonical headings where possible.
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2 text-left">
              <label htmlFor="file" className="text-xs font-medium text-muted-foreground">
                Upload file
              </label>
              <Input
                id="file"
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
              onClick={() => document.getElementById("file")?.click()}
            >
              Browse
            </Button>
          </div>

          {(mutation.isPending || wfPipelineMessage) && (
            <div className="space-y-2 rounded-lg border border-border/60 bg-background/80 p-4">
              <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                <span>Pipeline</span>
                <span>{wfActive.replace(/_/g, " ")}</span>
              </div>
              <Progress value={pct} className="h-1.5" />
              {wfPipelineMessage ? (
                <p className="text-xs text-muted-foreground">{wfPipelineMessage}</p>
              ) : null}
            </div>
          )}

          {errMsg ? (
            <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-medium">Pipeline blocked</p>
                <p className="mt-1 text-xs leading-relaxed opacity-90">{errMsg}</p>
              </div>
            </div>
          ) : null}

          {mutation.isSuccess && wfStatus === "succeeded" ? (
            <div className="flex flex-col gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 text-sm text-emerald-200">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Screening complete — operational intelligence hydrated.</span>
              </div>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                Open decision dashboard
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Long synchronous runs mirror FastAPI threading — leave this tab focused; Vercel
        previews should point at APIs with adequate timeout envelopes.
      </p>
    </div>
  );
}
