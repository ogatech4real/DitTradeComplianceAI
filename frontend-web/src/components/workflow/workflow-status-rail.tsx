"use client";

import Link from "next/link";
import { Check } from "lucide-react";

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
  const i = ORDER.indexOf(id);
  return i < 0 ? 0 : i;
}

function workflowProgressPercent(phaseId: WorkflowPhaseId, status: WorkflowRunStatus): number {
  if (status === "succeeded") return 100;
  if (status !== "running" && status !== "pending") return 0;
  const idx = ORDER.indexOf(phaseId);
  if (idx < 0) return 8;
  return Math.round((idx / Math.max(ORDER.length - 1, 1)) * 100);
}

/** Visual state for each workflow row — driven by pipeline status only (not user navigation). */
function rowState(
  index: number,
  status: WorkflowRunStatus,
  activeIdx: number,
): "complete" | "current" | "pending" | "error" {
  if (status === "succeeded") return "complete";
  if (status === "failed") {
    if (index < activeIdx) return "complete";
    if (index === activeIdx) return "error";
    return "pending";
  }
  if (status === "running" || status === "pending" || status === "partial") {
    if (index < activeIdx) return "complete";
    if (index === activeIdx) return "current";
    return "pending";
  }
  if (index === 0) return "current";
  return "pending";
}

function statusTone(status: WorkflowRunStatus, sidebar: boolean): string {
  if (sidebar) {
    switch (status) {
      case "running":
      case "pending":
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
    case "pending":
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

function StepRow({
  placement,
  index,
  label,
  description,
  state,
}: {
  placement: "page" | "sidebar";
  index: number;
  label: string;
  description: string;
  state: "complete" | "current" | "pending" | "error";
}) {
  const sidebar = placement === "sidebar";
  const showCheck = state === "complete";

  return (
    <li>
      <div
        title={description}
        className={cn(
          "flex items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-colors",
          sidebar ? "py-1" : "px-3 py-2",
          state === "complete" &&
            (sidebar
              ? "border-[var(--semantic-emerald)]/25 bg-[var(--semantic-emerald-soft)]/[0.18]"
              : "border-[var(--semantic-emerald)]/28 bg-[var(--semantic-emerald-soft)]/[0.4]"),
          state === "current" &&
            (sidebar
              ? "border-[color-mix(in_oklch,var(--home-accent)_40%,transparent)] bg-[color-mix(in_oklch,var(--home-accent)_10%,transparent)]"
              : "border-[var(--accent-governance)]/45 bg-[var(--accent-governance)]/[0.08]"),
          state === "error" && "border-destructive/35 bg-destructive/[0.08]",
          state === "pending" && (sidebar ? "opacity-[0.72]" : "border-border/60 bg-muted/[0.12]"),
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex shrink-0 items-center justify-center rounded-full border font-semibold",
            sidebar ? "size-5 text-[10px]" : "size-6 text-[11px]",
            state === "complete" &&
              "border-[var(--semantic-emerald)]/55 bg-[var(--semantic-emerald-soft)] text-[var(--semantic-emerald)]",
            state === "current" && "border-primary bg-primary text-primary-foreground shadow-sm",
            state === "error" && "border-destructive bg-destructive/15 text-destructive",
            state === "pending" && "border-muted-foreground/30 text-muted-foreground",
          )}
          aria-hidden
        >
          {showCheck ? <Check className={sidebar ? "size-3" : "size-3.5"} strokeWidth={2.5} /> : index + 1}
        </span>
        <span
          className={cn(
            "min-w-0 font-medium leading-snug",
            sidebar ? "text-[11px]" : "text-sm",
            state === "complete" && "text-foreground",
            state === "current" && "text-foreground",
            state === "pending" && "text-muted-foreground",
            state === "error" && "text-destructive",
          )}
        >
          {label}
        </span>
      </div>
    </li>
  );
}

/**
 * Read-only workflow progress — colours follow pipeline state (no step navigation).
 */
export function WorkflowStatusRail({ placement = "page" }: WorkflowStatusRailProps) {
  const sidebar = placement === "sidebar";
  const status = useWorkflowUiStore((s) => s.status);
  const activePhaseId = useWorkflowUiStore((s) => s.activePhaseId);
  const pipelineMessage = useWorkflowUiStore((s) => s.pipelineMessage);
  const reset = useWorkflowUiStore((s) => s.reset);

  const activeIdx = phaseIndex(activePhaseId);
  const runningProgress = workflowProgressPercent(activePhaseId, status);

  return (
    <div
      className={cn(
        sidebar ? "space-y-3" : "operational-surface rounded-2xl border border-border/80 p-5",
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
            <p className="mt-1 text-xs text-muted-foreground">
              Progress updates automatically while screening runs. This list is read-only.
            </p>
          ) : null}
          {pipelineMessage ? (
            <p
              className={cn(
                "text-foreground",
                sidebar ? "mt-2 text-[10px] leading-snug text-muted-foreground" : "mt-3 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-[12px] leading-relaxed",
              )}
              title={pipelineMessage}
            >
              {pipelineMessage}
            </p>
          ) : null}
          {status === "running" || status === "pending" || status === "succeeded" ? (
            <div className={sidebar ? "mt-2 space-y-0.5" : "mt-3 space-y-1"}>
              <Progress value={runningProgress} className={sidebar ? "h-0.5" : "h-1"} />
              {!sidebar ? (
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {runningProgress}% · {status === "succeeded" ? "Complete" : "In progress"}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className={cn("flex shrink-0 flex-col items-end gap-1.5", sidebar && "-mt-px")}>
          <Badge variant="outline" className={cn("font-normal", statusTone(status, sidebar), sidebar && "border px-2 py-0 text-[10px]")}>
            {statusVerb(status)}
          </Badge>
          {!sidebar ? (
            <Button type="button" variant="ghost" size="xs" className="h-7 text-[11px]" onClick={() => reset()}>
              Reset
            </Button>
          ) : null}
        </div>
      </div>

      {!sidebar && activePhaseId === "review_queue" ? (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Routed to analyst queue —{" "}
          <Link href={WORKSPACE_ROUTES.review} className="font-medium text-primary underline-offset-4 hover:underline">
            Review queue
          </Link>
        </p>
      ) : null}
      {sidebar && activePhaseId === "review_queue" && status === "running" ? (
        <Link
          href={WORKSPACE_ROUTES.review}
          className="block text-[10px] font-medium text-primary underline-offset-4 hover:underline"
        >
          Open review queue
        </Link>
      ) : null}

      <ol className={cn("space-y-1", sidebar ? "mt-1" : "mt-4 max-h-[26rem] space-y-1.5 overflow-y-auto pr-0.5")}>
        {WORKFLOW_PHASE_METADATA.map((phase, i) => (
          <StepRow
            key={phase.id}
            placement={placement}
            index={i}
            label={phase.label}
            description={phase.description}
            state={rowState(i, status, activeIdx)}
          />
        ))}
      </ol>
    </div>
  );
}
