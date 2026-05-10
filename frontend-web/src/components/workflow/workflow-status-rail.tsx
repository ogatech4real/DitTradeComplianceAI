"use client";

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

/**
 * Lifecycle rail — clickable for UX demos; mirrors upload pipeline phases when runs execute.
 */
export function WorkflowStatusRail() {
  const status = useWorkflowUiStore((s) => s.status);
  const activePhaseId = useWorkflowUiStore((s) => s.activePhaseId);
  const pipelineMessage = useWorkflowUiStore((s) => s.pipelineMessage);
  const setActivePhase = useWorkflowUiStore((s) => s.setActivePhase);
  const setStatus = useWorkflowUiStore((s) => s.setStatus);
  const reset = useWorkflowUiStore((s) => s.reset);

  const activeIdx = phaseIndex(activePhaseId);
  const runningProgress = workflowProgressPercent(activePhaseId, status);

  return (
    <div className="enterprise-surface rounded-xl border border-border/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold tracking-tight">Workflow architecture</h2>
          <p className="text-xs text-muted-foreground">
            Stages mirror PipelineManager sequencing; async `workflow_id` lands later.
          </p>
          {pipelineMessage ? (
            <p className="mt-2 rounded-md border border-border/70 bg-muted/40 px-2 py-1.5 text-[11px] text-muted-foreground">
              {pipelineMessage}
            </p>
          ) : null}
          {status === "running" || status === "succeeded" ? (
            <div className="mt-3 space-y-1">
              <Progress value={runningProgress} className="h-1" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {status === "succeeded" ? "Pipeline complete" : "Live pipeline"} {runningProgress}%
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px] uppercase">
            {status}
          </Badge>
          <Button type="button" size="xs" variant="outline" onClick={() => reset()}>
            Reset rail
          </Button>
        </div>
      </div>
      <ol className="mt-4 max-h-[24rem] space-y-2 overflow-y-auto pr-1 text-sm">
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
                onClick={() => {
                  setActivePhase(phase.id);
                  setStatus(phase.id === "idle" ? "idle" : "pending");
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
                  done && "border-emerald-500/30 bg-emerald-500/[0.05]",
                  current &&
                    "border-primary/55 bg-primary/[0.08] ring-1 ring-primary/25",
                  !done &&
                    !current &&
                    "border-border/70 bg-muted/15 hover:bg-muted/35",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                    done &&
                      "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
                    current && "border-primary bg-primary text-primary-foreground",
                    !done &&
                      !current &&
                      "border-muted-foreground/30 text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block font-medium leading-snug">{phase.label}</span>
                  <span className="text-xs text-muted-foreground">
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
