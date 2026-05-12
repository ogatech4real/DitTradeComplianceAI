"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
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

function statusTone(status: WorkflowRunStatus, sidebar: boolean): string {
  if (sidebar) {
    switch (status) {
      case "running":
        return "border-[color-mix(in_oklch,var(--home-accent)_30%,transparent)] bg-[color-mix(in_oklch,var(--home-accent)_14%,var(--sidebar))] text-foreground";
      case "succeeded":
        return "border-[var(--semantic-emerald)]/40 bg-[var(--semantic-emerald-soft)]/[0.35] text-foreground";
      case "failed":
        return "border-destructive/35 bg-destructive/12 text-destructive";
      case "partial":
        return "border-[var(--semantic-amber)]/35 bg-[var(--semantic-amber)]/[0.12] text-foreground";
      default:
        return "border-sidebar-border bg-sidebar-accent/50 text-muted-foreground";
    }
  }
  switch (status) {
    case "running":
      return "border-[var(--accent-intelligence)]/35 bg-[var(--accent-intelligence-soft)] text-foreground";
    case "succeeded":
      return "border-[var(--semantic-emerald)]/35 bg-[var(--semantic-emerald-soft)] text-foreground";
    case "failed":
      return "border-destructive/35 bg-destructive/10 text-destructive";
    case "partial":
      return "border-[var(--semantic-amber)]/40 bg-[var(--semantic-amber)]/[0.12] text-foreground";
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

export type WorkflowRailPlacement = "page" | "sidebar";

interface WorkflowStatusRailProps {
  placement?: WorkflowRailPlacement;
}

/**
 * Operational workflow — step through lifecycle stages without re-running screening.
 */
export function WorkflowStatusRail({ placement = "page" }: WorkflowStatusRailProps) {
  const sidebar = placement === "sidebar";
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
    <div
      className={cn(
        sidebar
          ? "rounded-xl border border-sidebar-border/85 bg-sidebar-accent/[0.35] px-3 py-3 shadow-sm"
          : "operational-surface rounded-2xl border border-border/80 p-5",
      )}
    >
      <div className={cn("flex flex-wrap gap-3", sidebar ? "items-center justify-between" : "items-start justify-between")}>
        <div className="min-w-0 flex-1">
          <h2
            className={cn(
              "font-[family-name:var(--font-heading)] font-semibold tracking-tight",
              sidebar ? "text-[11px]" : "text-sm",
            )}
          >
            {sidebar ? "Screening workflow" : "Screening phases"}
          </h2>
          {!sidebar ? (
            <p className="mt-1 text-xs text-muted-foreground">Twelve stages, read-only (does not re-run screening).</p>
          ) : null}
          {pipelineMessage ? (
            <p
              className={cn(
                "line-clamp-2 text-foreground",
                sidebar ? "mt-2 rounded-md border border-sidebar-border bg-sidebar/90 px-2 py-1.5 text-[10px] leading-snug" : "mt-3 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-[12px] leading-relaxed",
              )}
              title={pipelineMessage}
            >
              {pipelineMessage}
            </p>
          ) : null}
          {status === "running" || status === "succeeded" ? (
            <div className={sidebar ? "mt-2 space-y-0.5" : "mt-3 space-y-1"}>
              <Progress value={runningProgress} className={sidebar ? "h-0.5" : "h-1"} />
              <span
                className={cn(
                  "uppercase tracking-[0.12em] text-muted-foreground",
                  sidebar ? "text-[9px]" : "text-[10px]",
                )}
              >
                {runningProgress}% · {status === "succeeded" ? "Settled" : "Active"}
              </span>
            </div>
          ) : null}
        </div>
        <div className={cn("flex shrink-0 flex-col items-end gap-1.5", sidebar && "-mt-px")}>
          <Badge variant="outline" className={cn("font-normal", statusTone(status, sidebar), sidebar && "border px-2 py-0 text-[10px]")}>
            {statusVerb(status)}
          </Badge>
          <Button type="button" variant="ghost" size="xs" className={cn(sidebar ? "h-6 text-[10px]" : "h-7 text-[11px]")} onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </div>

      <div className={cn("flex gap-2", sidebar ? "mt-2.5 justify-center border-t border-sidebar-border/60 pt-2.5" : "mt-4 flex-wrap")}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={atStart}
          className={cn("gap-0.5", sidebar ? "h-8 flex-1 border-sidebar-border px-2 text-[10px]" : "gap-1 text-xs")}
          onClick={() => stepPhaseBackward()}
        >
          <ChevronLeft className={cn(sidebar ? "size-3" : "size-3.5")} aria-hidden />
          {!sidebar ? "Previous stage" : "Prev"}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={atEnd}
          className={cn(
            !sidebar ? "gap-1 bg-primary text-xs text-primary-foreground hover:bg-primary/92" : "h-8 flex-1 gap-0.5 bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/92",
          )}
          onClick={() => stepPhaseForward()}
        >
          {!sidebar ? "Next stage" : "Next"}
          <ChevronRight className={cn(sidebar ? "size-3" : "size-3.5")} aria-hidden />
        </Button>
      </div>
      {!sidebar && activePhaseId === "review_queue" ? (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Routed to analyst queue —{" "}
          <Link href={WORKSPACE_ROUTES.review} className="font-medium text-primary underline-offset-4 hover:underline">
            Review queue
          </Link>
        </p>
      ) : null}
      {sidebar && activePhaseId === "review_queue" ? (
        <Link
          href={WORKSPACE_ROUTES.review}
          className="mt-2 block rounded-md px-2 py-1 text-center text-[10px] font-medium text-primary underline-offset-4 hover:bg-sidebar-accent hover:underline"
        >
          Open review queue
        </Link>
      ) : null}

      <ol
        className={cn(
          "space-y-1 overflow-y-auto pr-0.5",
          sidebar ? "mt-2.5 max-h-[min(38vh,17rem)]" : "mt-4 max-h-[26rem]",
        )}
      >
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
                title={phase.description}
                aria-label={`${phase.label}: ${phase.description}`}
                onClick={() => setActivePhase(phase.id)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg border px-2 py-1.5 text-left transition-colors",
                  sidebar ? "gap-2 border-sidebar-border bg-sidebar/70 hover:bg-sidebar-accent" : "rounded-xl px-3 py-2.5",
                  !sidebar &&
                    done &&
                    "border-[var(--semantic-emerald)]/28 bg-[var(--semantic-emerald-soft)]/[0.45]",
                  !sidebar &&
                    current &&
                    "border-[var(--accent-governance)]/45 bg-[var(--accent-governance)]/[0.08] shadow-[inset_0_0_0_1px_oklch(0_0_0_/0.04)]",
                  !sidebar && !done && !current && "border-border/70 bg-muted/15 hover:border-border hover:bg-muted/40",
                  sidebar && done && "border-[var(--semantic-emerald)]/35 bg-[var(--semantic-emerald-soft)]/[0.25]",
                  sidebar && current &&
                    "border-[color-mix(in_oklch,var(--home-accent)_45%,transparent)] bg-[color-mix(in_oklch,var(--home-accent)_12%,transparent)] ring-1 ring-[color-mix(in_oklch,var(--home-accent)_22%,transparent)]",
                  sidebar && !done && !current && "border-sidebar-border",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex shrink-0 items-center justify-center rounded-full border font-semibold",
                    sidebar ? "size-5 text-[10px]" : "size-6 text-[11px]",
                    done &&
                      "border-[var(--semantic-emerald)]/55 bg-[var(--semantic-emerald-soft)]/[0.7] text-[var(--semantic-emerald)]",
                    current && !sidebar &&
                      "border-primary bg-primary text-primary-foreground shadow-sm",
                    current &&
                      sidebar &&
                      "border-primary bg-primary text-primary-foreground",
                    !done &&
                      !current &&
                      (sidebar ? "border-muted-foreground/30 text-muted-foreground" : "border-muted-foreground/35 text-muted-foreground"),
                  )}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className={cn("block min-w-0 font-medium leading-snug", sidebar ? "text-[11px]" : "text-sm")}>
                  {phase.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
