"use client";

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
import { JurisdictionExposureChart } from "@/components/dashboard/jurisdiction-exposure-chart";
import { SeverityConcentrationChart } from "@/components/dashboard/severity-concentration-chart";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { shouldUseMockApi } from "@/lib/api/mock-mode";

function EmptyDecisionState({ message }: { message?: string }) {
  return (
    <div className="enterprise-surface rounded-xl border border-dashed p-12 text-center">
      <p className="text-sm font-medium text-foreground">No hydrated intelligence layer</p>
      <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
        {message ??
          "Run the upload pipeline to populate operational metrics and governance surfaces. Toggle `NEXT_PUBLIC_MOCK_PREFILL_RESULTS` for deterministic demo data."}
      </p>
    </div>
  );
}

export function DashboardDecisionSurface() {
  const q = useLatestResultsQuery(true);

  if (q.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (q.isError || !q.data || isEmptyEnvelope(q.data)) {
    return (
      <EmptyDecisionState
        message={
          q.isError
            ? "Latest results unreachable — verify API URL or enable mock transports."
            : undefined
        }
      />
    );
  }

  if (!isLatestResultsSuccess(q.data)) {
    return <EmptyDecisionState message="Unexpected latest-results payload shape." />;
  }

  const payload = q.data as ScreeningSuccessResponse;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {shouldUseMockApi() ? (
          <Badge
            variant="outline"
            className="border-amber-500/35 bg-amber-500/[0.08] font-mono text-[10px] uppercase tracking-wider"
          >
            Mock transport
          </Badge>
        ) : null}
        <Badge variant="secondary" className="font-mono text-[10px] uppercase">
          Decision layer v1
        </Badge>
      </div>

      <OperatorAlignedMetrics payload={payload} />

      <ExecutiveBriefPanel payload={payload} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="enterprise-surface border-border/80 shadow-none">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">Risk topology</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SeverityConcentrationChart payload={payload} />
          </CardContent>
        </Card>
        <Card className="enterprise-surface border-border/80 shadow-none">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">Jurisdiction posture</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <JurisdictionExposureChart payload={payload} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FraudGovernancePanel payload={payload} />
        <ExplainabilityDecisionPanel payload={payload} />
      </div>

      <IntelligenceQualityRail payload={payload} />
    </motion.div>
  );
}
