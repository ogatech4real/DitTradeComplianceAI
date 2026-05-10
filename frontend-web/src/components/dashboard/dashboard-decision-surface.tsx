"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useLatestResultsQuery } from "@/hooks/use-latest-results-query";
import { isLatestResultsSuccess } from "@/lib/api/services/results";
import { isEmptyEnvelope } from "@/lib/contracts/envelope";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { OperatorAlignedMetrics } from "@/components/dashboard/operator-aligned-metrics";
import { ExecutiveBriefPanel } from "@/components/dashboard/executive-brief-panel";
import { ExplainabilityDecisionPanel } from "@/components/dashboard/explainability-decision-panel";
import { FraudGovernancePanel } from "@/components/dashboard/fraud-governance-panel";
import { IntelligenceQualityRail } from "@/components/dashboard/intelligence-quality-rail";
import { NarrativeIntelligenceStrip } from "@/components/dashboard/narrative-intelligence-strip";
import { JurisdictionExposureChart } from "@/components/dashboard/jurisdiction-exposure-chart";
import { SeverityConcentrationChart } from "@/components/dashboard/severity-concentration-chart";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { shouldUseMockApi } from "@/lib/api/mock-mode";

function EmptyDecisionState({ message }: { message?: string }) {
  return (
    <div className="operational-surface rounded-2xl border border-dashed border-border/80 p-12 text-center">
      <p className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
        No decision intelligence loaded
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {message ??
          "Import a declaration file from the workspace home to hydrate screening outputs. Operators with demo deployments can enable deterministic sample data via environment flags."}
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        Return to workspace home
      </Link>
    </div>
  );
}

export function DashboardDecisionSurface() {
  const q = useLatestResultsQuery(true);

  if (q.isPending) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  if (q.isError || !q.data || isEmptyEnvelope(q.data)) {
    return (
      <EmptyDecisionState
        message={
          q.isError
            ? "We could not reach the screening results service. Confirm connectivity from this browser session."
            : undefined
        }
      />
    );
  }

  if (!isLatestResultsSuccess(q.data)) {
    return <EmptyDecisionState message="The intelligence response did not match the expected production shape." />;
  }

  const payload = q.data as ScreeningSuccessResponse;

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-3">
        {shouldUseMockApi() ? (
          <Badge variant="outline" className="border-[var(--semantic-amber)]/40 bg-[var(--semantic-amber)]/[0.1] font-normal text-[11px] text-[var(--semantic-amber-fg)]">
            Demo data mode · outcomes are illustrative
          </Badge>
        ) : null}
        <span className="text-[13px] text-muted-foreground">
          Showing the latest hydrated screening cohort for this session.
        </span>
      </div>

      {/* Section 1 */}
      <OperatorAlignedMetrics payload={payload} />

      {/* Section 2 — signature narrative strip */}
      <NarrativeIntelligenceStrip payload={payload} />

      <ExecutiveBriefPanel payload={payload} />

      {/* Section 3 — asymmetrical operational grid */}
      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="operational-surface border-border/80 shadow-none xl:col-span-5">
          <CardHeader className="pb-0">
            <CardTitle className="font-[family-name:var(--font-heading)] text-base font-semibold">
              Severity concentration
            </CardTitle>
            <p className="text-[13px] text-muted-foreground">
              Disposition tiers across screened declarations — informs reserve capacity planning.
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <SeverityConcentrationChart payload={payload} />
          </CardContent>
        </Card>

        <div className="space-y-6 xl:col-span-7">
          <Card className="operational-surface border-border/80 shadow-none">
            <CardHeader className="pb-0">
              <CardTitle className="font-[family-name:var(--font-heading)] text-base font-semibold">
                Jurisdiction exposure
              </CardTitle>
              <p className="text-[13px] text-muted-foreground">
                Comparative routing pressure by market corridor — aligns with escalation geography.
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <JurisdictionExposureChart payload={payload} />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <FraudGovernancePanel payload={payload} />
            <ExplainabilityDecisionPanel payload={payload} />
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <IntelligenceQualityRail payload={payload} />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-muted/25 px-5 py-4">
        <p className="text-sm text-muted-foreground">
          Move from macro posture to investigative evidence with filters, severity ribbons, and narrative drawers.
        </p>
        <Link href="/review" className={buttonVariants({ variant: "secondary" })}>
          Open investigation workspace
        </Link>
      </div>
    </motion.div>
  );
}
