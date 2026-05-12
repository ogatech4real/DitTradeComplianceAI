"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileSpreadsheet, LayoutDashboard, ListChecks } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLatestResultsQuery } from "@/hooks/use-latest-results-query";
import { isLatestResultsSuccess } from "@/lib/api/services/results";
import { isEmptyEnvelope } from "@/lib/contracts/envelope";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { useWorkflowUiStore } from "@/stores/workflow-ui-store";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function summaryFromPayload(payload: ScreeningSuccessResponse | undefined): {
  headline: string;
  sub: string;
  tier: "critical" | "high" | "medium" | "low";
} {
  if (!payload) {
    return { headline: "", sub: "", tier: "low" };
  }
  const s = payload.screening_summary;
  const critical = Number(s.critical_records ?? 0);
  const high = Number(s.high_risk_records ?? 0);
  if (critical > 0) {
    return {
      headline: "Urgent items need attention",
      sub: `${fmt(critical)} declaration${critical === 1 ? "" : "s"} need review soon.`,
      tier: "critical",
    };
  }
  if (high > 0) {
    return {
      headline: "High-priority review suggested",
      sub: `${fmt(high)} declaration${high === 1 ? "" : "s"} at high severity.`,
      tier: "high",
    };
  }
  const med = Number(s.medium_risk_records ?? 0);
  if (med > 0) {
    return {
      headline: "Some items still in review",
      sub: `${fmt(med)} at medium severity.`,
      tier: "medium",
    };
  }
  return {
    headline: "Latest run looks calm",
    sub: "No critical or high-severity flags.",
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

export function ExecutiveIntelligenceSurface() {
  const q = useLatestResultsQuery(true);
  const status = useWorkflowUiStore((s) => s.status);

  const payload =
    q.data && !q.isError && !isEmptyEnvelope(q.data) && isLatestResultsSuccess(q.data)
      ? q.data
      : undefined;

  const summary = summaryFromPayload(payload);

  const totalRows =
    payload != null
      ? Number(
          payload.screening_summary.total_records ?? payload.records?.length ?? 0,
        )
      : null;

  const forReview =
    payload != null
      ? Number(
          payload.screening_summary.records_requiring_review ??
            payload.screening_summary.flagged_records ??
            0,
        )
      : null;

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

      <div className="relative max-w-3xl space-y-5">
        <div
          className={cn(
            "rounded-xl border border-border/60 border-l-4 bg-muted/[0.25] p-5 sm:p-6",
            tierAccent[payload ? summary.tier : "low"],
          )}
        >
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Start with a file upload here
          </h2>
          {payload && summary.headline ? (
            <p className="mt-2 text-sm font-medium text-foreground">{summary.headline}</p>
          ) : null}
          {payload && summary.sub ? (
            <p className="mt-1 text-sm text-muted-foreground">{summary.sub}</p>
          ) : null}
          {status === "running" ? (
            <p className="mt-2 text-sm text-muted-foreground">Screening in progress — see the steps in the sidebar.</p>
          ) : null}
          {status === "failed" ? (
            <p className="mt-2 text-sm text-muted-foreground">Last run did not finish — check below and try again.</p>
          ) : null}
          {q.isError ? (
            <p className="mt-2 text-sm text-[var(--semantic-critical)]">
              Could not load latest results. Check the connection badge above.
            </p>
          ) : null}
        </div>

        {payload && totalRows != null && totalRows > 0 ? (
          <div className="flex flex-wrap gap-4 rounded-xl border border-border/70 bg-card/80 px-4 py-3 text-sm">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Latest file</p>
              <p className="mt-1 font-semibold tabular-nums text-foreground">{fmt(totalRows)} declarations</p>
            </div>
            <div className="hidden h-10 w-px bg-border/80 sm:block" aria-hidden />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Marked for review</p>
              <p className="mt-1 font-semibold tabular-nums text-foreground">
                {forReview != null ? fmt(forReview) : "—"}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <a href="#import-screen" className={buttonVariants({ size: "default" })}>
            <FileSpreadsheet className="size-4" aria-hidden />
            Go to upload
          </a>
          <Link
            href={WORKSPACE_ROUTES.dashboard}
            className={buttonVariants({ variant: "secondary", size: "default" })}
          >
            <LayoutDashboard className="size-4" aria-hidden />
            Results dashboard
            <ArrowRight className="size-3.5 opacity-70" aria-hidden />
          </Link>
          <Link href={WORKSPACE_ROUTES.review} className={buttonVariants({ variant: "outline", size: "default" })}>
            <ListChecks className="size-4" aria-hidden />
            Review queue
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
