"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  WORKFLOW_PHASE_METADATA,
  type WorkflowPhaseId,
  type WorkflowRunStatus,
} from "@/lib/contracts/workflow";
import { useWorkflowUiStore } from "@/stores/workflow-ui-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ORDER: WorkflowPhaseId[] = WORKFLOW_PHASE_METADATA.map((p) => p.id);

function phaseIndex(id: WorkflowPhaseId): number {
  return Math.max(0, ORDER.indexOf(id));
}

function workflowProgressPercent(phaseId: WorkflowPhaseId, status: WorkflowRunStatus): number {
  if (status === "succeeded") return 100;
  if (status !== "running") return 0;
  const idx = ORDER.indexOf(phaseId);
  if (idx < 0) return 8;
  return Math.round((idx / Math.max(ORDER.length - 1, 1)) * 100);
}

function statusTone(status: WorkflowRunStatus): string {
  switch (status) {
    case "running":
      return "border-[var(--accent-intelligence)]/35 bg-[var(--accent-intelligence-soft)] text-foreground";
    case "succeeded":
      return "border-[var(--semantic-emerald)]/35 bg-[var(--semantic-emerald-soft)] text-foreground";
    case "failed":
      return "border-destructive/35 bg-destructive/10 text-destructive";
    default:
      return "border-border/70 bg-muted/40 text-muted-foreground";
  }
}

function statusVerb(status: WorkflowRunStatus): string {
  switch (status) {
    case "idle":
      return "Ready";
    case "pending":
      return "Queued";
    case "running":
      return "Processing";
    case "succeeded":
      return "Complete";
    case "failed":
      return "Halted";
    case "partial":
      return "Partial";
    default:
      return status;
  }
}

/**
 * Operational workflow rail — step through lifecycle stages without mutating archived results.
 */
export function WorkflowStatusRail() {
  const status = useWorkflowUiStore((s) => s.status);
  const activePhaseId = useWorkflowUiStore((s) => s.activePhaseId);
  const pipelineMessage = useWorkflowUiStore((s) => s.pipelineMessage);
  const setActivePhase = useWorkflowUiStore((s) => s.setActivePhase);
  const reset = useWorkflowUiStore((s) => s.reset);
  const stepPhaseForward = useWorkflowUiStore((s) => s.stepPhaseForward);
  const stepPhaseBackward = useWorkflowUiStore((s) => s.stepPhaseBackward);

  const activeIdx = phaseIndex(activePhaseId);
  const runningProgress = workflowProgressPercent(activePhaseId, status);
  const atStart = activeIdx <= 0;
  const atEnd = activeIdx >= ORDER.length - 1;

  return (
    <div className="operational-surface rounded-2xl border border-border/80 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-heading)] text-sm font-semibold tracking-tight">
            Screening workflow
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Each stage mirrors the screening lifecycle you run from import — step through below to brief
            operators or replay what happened during the last cohort.
          </p>
          {pipelineMessage ? (
            <p className="mt-3 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-[12px] leading-relaxed text-foreground">
              {pipelineMessage}
            </p>
          ) : null}
          {status === "running" || status === "succeeded" ? (
            <div className="mt-3 space-y-1">
              <Progress value={runningProgress} className="h-1" />
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Timeline {runningProgress}% · {status === "succeeded" ? "Settled run" : "Active run"}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn("font-normal", statusTone(status))}>
            {statusVerb(status)}
          </Badge>
          <Button type="button" size="xs" variant="ghost" className="h-7 text-[11px]" onClick={() => reset()}>
            Reset timeline
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={atStart}
          className="gap-1 text-xs"
          onClick={() => stepPhaseBackward()}
        >
          <ChevronLeft className="size-3.5" aria-hidden />
          Previous stage
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={atEnd}
          className="gap-1 bg-primary text-primary-foreground text-xs hover:bg-primary/92"
          onClick={() => stepPhaseForward()}
        >
          Next stage
          <ChevronRight className="size-3.5" aria-hidden />
        </Button>
      </div>
      {activePhaseId === "review_queue" ? (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          At this stage, prioritised investigations are surfaced in the workspace.{" "}
          <Link href="/review" className="font-medium text-primary underline-offset-4 hover:underline">
            Open investigations
          </Link>
        </p>
      ) : null}

      <ol className="mt-4 max-h-[26rem] space-y-1.5 overflow-y-auto pr-1 text-sm">
        {WORKFLOW_PHASE_METADATA.map((phase, i) => {
          const allComplete = status === "succeeded";
          const idleRow = phase.id === "idle";
          const done =
            (!idleRow && allComplete) || (!allComplete && !idleRow && i < activeIdx);
          const current = !allComplete && i === activeIdx;
          return (
            <li key={phase.id}>
              <button
                type="button"
                onClick={() => setActivePhase(phase.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                  done && "border-[var(--semantic-emerald)]/28 bg-[var(--semantic-emerald-soft)]/[0.45]",
                  current &&
                    "border-[var(--accent-governance)]/45 bg-[var(--accent-governance)]/[0.08] shadow-[inset_0_0_0_1px_oklch(0_0_0_/0.04)]",
                  !done &&
                    !current &&
                    "border-border/70 bg-muted/15 hover:border-border hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                    done &&
                      "border-[var(--semantic-emerald)]/55 bg-[var(--semantic-emerald-soft)]/[0.7] text-[var(--semantic-emerald)]",
                    current &&
                      "border-primary bg-primary text-primary-foreground shadow-sm",
                    !done &&
                      !current &&
                      "border-muted-foreground/35 text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium leading-snug">{phase.label}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {phase.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
