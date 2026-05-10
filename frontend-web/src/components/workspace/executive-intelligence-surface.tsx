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
      headline: "Awaiting a screened cohort",
      sub: "Import a declaration file to populate operational posture.",
      tier: "low",
    };
  }
  const s = payload.screening_summary;
  const critical = Number(s.critical_records ?? 0);
  const high = Number(s.high_risk_records ?? 0);
  if (critical > 0) {
    return {
      headline: "Critical exposure present",
      sub: `${fmt(critical)} declaration${critical === 1 ? "" : "s"} warrant immediate escalation review.`,
      tier: "critical",
    };
  }
  if (high > 0) {
    return {
      headline: "Elevated tier concentration",
      sub: `${fmt(high)} high-severity declaration${high === 1 ? "" : "s"} deserve priority disposition.`,
      tier: "high",
    };
  }
  const med = Number(s.medium_risk_records ?? 0);
  if (med > 0) {
    return {
      headline: "Controlled residual risk",
      sub: `${fmt(med)} medium-severity items remain in workflow — governance trace is intact.`,
      tier: "medium",
    };
  }
  return {
    headline: "Stable operational posture",
    sub: "No acute severity concentration in the latest screened cohort.",
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
              Digital Trade Compliance
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Operational intelligence workspace
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              A single place to import trade data, monitor screening posture, and move from signal to
              substantiated decision — with governance context kept visible at every step.
            </p>
          </div>

          <div
            className={cn(
              "rounded-xl border border-border/60 border-l-4 bg-muted/[0.25] p-4",
              tierAccent[posture.tier],
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Live operational posture
            </p>
            <p className="mt-2 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
              {posture.headline}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{posture.sub}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#import-screen" className={buttonVariants({ size: "default" })}>
              Upload declarations
            </a>
            <Link href={WORKSPACE_ROUTES.dashboard} className={buttonVariants({ variant: "secondary", size: "default" })}>
              Open decision intelligence
            </Link>
            <Link
              href={WORKSPACE_ROUTES.review}
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              Investigation workspace
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
                Latest intelligence snapshot unavailable.
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <PostureTile
            icon={ClipboardCheck}
            label="Review pressure"
            value={reviewQueue != null ? fmt(reviewQueue) : "—"}
            hint={
              reviewQueue != null
                ? "Declarations routed for analyst review in this cohort."
                : "Visible after a completed screening run."
            }
            className="sm:col-span-2"
          />
          <PostureTile
            icon={Gauge}
            label="Schema alignment"
            value={mappingConfPct != null ? `${mappingConfPct}%` : "—"}
            hint="How confidently column mappings reflect your declared schema."
          />
          <PostureTile
            icon={BarChart3}
            label="Dataset fitness"
            value={dqPct != null ? `${dqPct}%` : "—"}
            hint="Completeness and consistency of source values after validation."
          />
          <PostureTile
            icon={Sparkles}
            label="Intelligence confidence"
            value={mappingConfPct != null && dqPct != null ? `${Math.round((mappingConfPct + dqPct) / 2)}%` : "—"}
            hint="Blended view of mapping and data fitness for this run."
            className="sm:col-span-2"
          />
          <PostureTile
            icon={Shield}
            label="Governance"
            value={payload ? "Trace retained" : "Idle"}
            hint="Screening outputs remain bound to the active session for audit."
            className="sm:col-span-2"
          />
        </div>
      </div>
    </motion.section>
  );
}
