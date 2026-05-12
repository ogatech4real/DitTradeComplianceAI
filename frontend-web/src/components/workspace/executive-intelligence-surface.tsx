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
    return {
      headline: "No results yet",
      sub: "Upload a declarations file below. When screening finishes, open Results for charts and summaries, or Review queue to work cases one by one.",
      tier: "low",
    };
  }
  const s = payload.screening_summary;
  const critical = Number(s.critical_records ?? 0);
  const high = Number(s.high_risk_records ?? 0);
  if (critical > 0) {
    return {
      headline: "Urgent items need attention",
      sub: `${fmt(critical)} declaration${critical === 1 ? "" : "s"} from your latest file should be reviewed without delay.`,
      tier: "critical",
    };
  }
  if (high > 0) {
    return {
      headline: "High-priority review suggested",
      sub: `${fmt(high)} declaration${high === 1 ? "" : "s"} are marked high severity — use the review queue to work through them.`,
      tier: "high",
    };
  }
  const med = Number(s.medium_risk_records ?? 0);
  if (med > 0) {
    return {
      headline: "Some items still in review",
      sub: `${fmt(med)} declaration${med === 1 ? "" : "s"} are medium severity. Nothing critical is waiting, but follow your usual process.`,
      tier: "medium",
    };
  }
  return {
    headline: "Latest file looks calm",
    sub: "No critical or high-severity flags on your most recent screening. You can still open Results for the full picture.",
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

  const activityLine =
    status === "running"
      ? "Screening is running. Watch the steps in the sidebar on the left."
      : status === "succeeded"
        ? "Your last screening finished. Open Results for charts or Review queue for case detail."
        : status === "failed"
          ? "The last run did not finish. Try uploading again or check the message in the upload area."
          : "Upload a file below when you are ready.";

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

      <div className="relative max-w-3xl space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Overview
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Start with a file upload
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This page is for importing your declarations and running screening. Charts, breakdowns, and file-quality
            scores live on the{" "}
            <Link href={WORKSPACE_ROUTES.dashboard} className="font-medium text-primary underline-offset-4 hover:underline">
              Results dashboard
            </Link>
            — open it after a run completes.
          </p>
        </div>

        <div
          className={cn(
            "rounded-xl border border-border/60 border-l-4 bg-muted/[0.25] p-4",
            tierAccent[summary.tier],
          )}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Where things stand
          </p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
            {summary.headline}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{summary.sub}</p>
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

        <div className="border-t border-border/60 pt-4 text-sm text-muted-foreground">
          {q.isError ? (
            <p className="text-[var(--semantic-critical)]">We could not load your latest results. Check the connection badge above.</p>
          ) : (
            <p>{activityLine}</p>
          )}
        </div>
      </div>
    </motion.section>
  );
}
