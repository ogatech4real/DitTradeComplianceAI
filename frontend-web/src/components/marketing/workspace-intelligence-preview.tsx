"use client";

import Link from "next/link";

import { EmptyDecisionState } from "@/components/dashboard/empty-decision-state";
import { InvestigationConsoleChrome } from "@/components/marketing/investigation-console-chrome";
import { WorkflowStatusRail } from "@/components/workflow/workflow-status-rail";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";

export function WorkspaceIntelligencePreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Operational intelligence preview
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight sm:text-3xl">
            Interfaces drawn from the same surfaces operators use daily
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Shown components are reused from the live workspace chrome. Screens below reflect unloaded or structural
            states — not fictional metrics — mirroring freshly opened sessions prior to ingestion.
          </p>
        </div>
        <Link href={WORKSPACE_ROUTES.dashboard} className={buttonVariants({ variant: "secondary" })}>
          Open live workspace
        </Link>
      </div>
      <div className="mt-12 grid gap-8 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <p className="mb-4 text-[12px] font-medium text-muted-foreground">Lifecycle rail</p>
          <div className="max-h-[min(28rem,70vh)] origin-top overflow-hidden rounded-2xl border border-border/70 bg-background/55 shadow-[0_24px_60px_-32px_oklch(0_0_0_/0.2)] xl:scale-[0.93] xl:[transform-origin:top_left] xl:justify-self-start">
            <WorkflowStatusRail />
          </div>
        </div>
        <div className="space-y-8 xl:col-span-8">
          <div>
            <p className="mb-4 text-[12px] font-medium text-muted-foreground">
              Decision intelligence surface (unsettled cohort)
            </p>
            <EmptyDecisionState
              message="This is exactly what analysts see before a screened dataset hydrates dashboards — prompting return to intake or connecting services."
              ctaLabel="Go to workspace home"
              ctaHref={WORKSPACE_ROUTES.home}
            />
          </div>
          <div>
            <p className="mb-4 text-[12px] font-medium text-muted-foreground">Investigation chrome</p>
            <InvestigationConsoleChrome />
          </div>
        </div>
      </div>
    </section>
  );
}
