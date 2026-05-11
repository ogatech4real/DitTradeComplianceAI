"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  ClipboardCheck,
  Gauge,
  Shield,
  Sparkles,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLatestResultsQuery } from "@/hooks/use-latest-results-query";
import { isLatestResultsSuccess } from "@/lib/api/services/results";
import { isEmptyEnvelope } from "@/lib/contracts/envelope";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { useWorkflowUiStore } from "@/stores/workflow-ui-store";
import { WORKFLOW_PHASE_METADATA } from "@/lib/contracts/workflow";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function postureFromPayload(payload: ScreeningSuccessResponse | undefined): {
  headline: string;
  sub: string;
  tier: "critical" | "high" | "medium" | "low";
} {
  if (!payload) {
    return {
      headline: "No cohort loaded yet",
      sub: "Import a declarations file below to populate posture for this session.",
      tier: "low",
    };
  }
  const s = payload.screening_summary;
  const critical = Number(s.critical_records ?? 0);
  const high = Number(s.high_risk_records ?? 0);
  if (critical > 0) {
    return {
      headline: "Critical items in this cohort",
      sub: `${fmt(critical)} declaration${critical === 1 ? "" : "s"} need immediate supervisory review.`,
      tier: "critical",
    };
  }
  if (high > 0) {
    return {
      headline: "High severity concentration",
      sub: `${fmt(high)} declaration${high === 1 ? "" : "s"} at elevated severity — prioritize in the queue.`,
      tier: "high",
    };
  }
  const med = Number(s.medium_risk_records ?? 0);
  if (med > 0) {
    return {
      headline: "Residual medium-tier items",
      sub: `${fmt(med)} at medium severity still in workflow; traceability is intact for audit.`,
      tier: "medium",
    };
  }
  return {
    headline: "Stable posture for this cohort",
    sub: "No critical or high-severity spike in the latest screened file.",
    tier: "low",
  };
}

const tierAccent: Record<
  "critical" | "high" | "medium" | "low",
  string
> = {
  critical: "border-l-[var(--semantic-critical)]",
  high: "border-l-[var(--semantic-orange)]",
  medium: "border-l-[var(--semantic-amber)]",
  low: "border-l-[var(--semantic-emerald)]",
};

interface PostureTileProps {
  icon: typeof Shield;
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

function PostureTile({ icon: Icon, label, value, hint, className }: PostureTileProps) {
  return (
    <div
      className={cn(
        "operational-surface flex flex-col justify-between rounded-xl border border-border/80 p-4 shadow-[0_1px_0_oklch(0_0_0_/0.04)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <Icon className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
      </div>
      <p className="mt-3 font-[family-name:var(--font-heading)] text-xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function ExecutiveIntelligenceSurface() {
  const q = useLatestResultsQuery(true);
  const status = useWorkflowUiStore((s) => s.status);
  const phaseId = useWorkflowUiStore((s) => s.activePhaseId);

  const payload =
    q.data && !q.isError && !isEmptyEnvelope(q.data) && isLatestResultsSuccess(q.data)
      ? q.data
      : undefined;

  const posture = postureFromPayload(payload);
  const workflowLabel =
    WORKFLOW_PHASE_METADATA.find((p) => p.id === phaseId)?.label ?? "Idle";

  const reviewQueue =
    payload != null
      ? Number(
          payload.screening_summary.records_requiring_review ??
            payload.screening_summary.flagged_records ??
            0,
        )
      : null;

  const mappingConfPct =
    payload != null
      ? Math.round(
          Math.min(1, Math.max(0, payload.operational_metrics.mapping_confidence ?? 0)) * 100,
        )
      : null;

  const dqPct =
    payload != null
      ? Math.round(
          Math.min(1, Math.max(0, payload.operational_metrics.data_quality_score ?? 0)) * 100,
        )
      : null;

  const workflowStatusPhrase =
    status === "running"
      ? "Screening pipeline active"
      : status === "succeeded"
        ? "Last run completed"
        : status === "failed"
          ? "Last run halted"
          : "Ready for import";

  return (
    <motion.section
      className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-muted/[0.35] p-6 shadow-sm sm:p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.12_264_/_0.14),transparent_68%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 size-[22rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.58_0.09_195_/_0.1),transparent_65%)]"
        aria-hidden
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0 space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              This session
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Posture and what to do next
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Declarations you screen here appear on the results dashboard and in the review queue. Upload
              when you are ready; metrics below refresh after each completed run.
            </p>
          </div>

          <div
            className={cn(
              "rounded-xl border border-border/60 border-l-4 bg-muted/[0.25] p-4",
              tierAccent[posture.tier],
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Live posture snapshot
            </p>
            <p className="mt-2 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
              {posture.headline}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{posture.sub}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#import-screen" className={buttonVariants({ size: "default" })}>
              Upload file
            </a>
            <Link href={WORKSPACE_ROUTES.dashboard} className={buttonVariants({ variant: "secondary", size: "default" })}>
              Open results dashboard
            </Link>
            <Link
              href={WORKSPACE_ROUTES.review}
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              Review queue
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Activity className="size-3.5 text-[var(--accent-intelligence)]" aria-hidden />
              <span className="font-medium text-foreground">{workflowStatusPhrase}</span>
              <span className="text-muted-foreground">·</span>
              <span>Stage: {workflowLabel}</span>
            </span>
            {q.isError ? (
              <span className="text-[var(--semantic-critical)]">
                Latest screening summary could not be loaded.
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <PostureTile
            icon={ClipboardCheck}
            label="Queued for review"
            value={reviewQueue != null ? fmt(reviewQueue) : "—"}
            hint={
              reviewQueue != null
                ? "Records flagged or routed into the analyst queue from this cohort."
                : "Appears after a completed screening run."
            }
            className="sm:col-span-2"
          />
          <PostureTile
            icon={Gauge}
            label="Column mapping fit"
            value={mappingConfPct != null ? `${mappingConfPct}%` : "—"}
            hint="Confidence between your file headings and how we interpreted them."
          />
          <PostureTile
            icon={BarChart3}
            label="Data completeness"
            value={dqPct != null ? `${dqPct}%` : "—"}
            hint="Consistency and completeness of values after parsing and validation."
          />
          <PostureTile
            icon={Sparkles}
            label="Run confidence (blend)"
            value={mappingConfPct != null && dqPct != null ? `${Math.round((mappingConfPct + dqPct) / 2)}%` : "—"}
            hint="Approximate midpoint of mapping fit and completeness for this cohort."
            className="sm:col-span-2"
          />
          <PostureTile
            icon={Shield}
            label="Audit trail"
            value={payload ? "Retained for session" : "Idle"}
            hint="Outputs for this cohort stay tied to this session for traceability."
            className="sm:col-span-2"
          />
        </div>
      </div>
    </motion.section>
  );
}
