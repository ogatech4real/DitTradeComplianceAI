"use client";

import Link from "next/link";

import { EmptyDecisionState } from "@/components/dashboard/empty-decision-state";
import { InvestigationConsoleChrome } from "@/components/marketing/investigation-console-chrome";
import { WorkflowStatusRail } from "@/components/workflow/workflow-status-rail";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";

export function WorkspaceIntelligencePreview() {
  return (
    <section className="border-t border-border/70 bg-[color-mix(in_oklch,var(--card)_32%,var(--background))]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-6 border-b border-border/60 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="public-kicker">Operational intelligence preview</p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-[2.125rem]">
              The same surfaces operators use — shown in structural context
            </h2>
            <p className="text-[1.05rem] leading-relaxed text-muted-foreground">
              Components below are reused from the live workspace chrome. States mirror freshly opened sessions prior to data
              hydration — credible preview, not fabricated metrics.
            </p>
          </div>
          <Link
            href={WORKSPACE_ROUTES.dashboard}
            className={buttonVariants({ variant: "outline", size: "lg", className: "shrink-0 rounded-lg px-6" })}
          >
            Open live workspace
          </Link>
        </div>
        <div className="mt-12 grid gap-10 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Lifecycle rail</p>
            <div className="max-h-[min(28rem,70vh)] origin-top overflow-hidden rounded-2xl border border-border/70 bg-[color-mix(in_oklch,var(--background)_45%,var(--card))] shadow-[0_28px_70px_-40px_color-mix(in_oklch,var(--foreground)_45%,transparent)] xl:scale-[0.93] xl:[transform-origin:top_left] xl:justify-self-start">
              <WorkflowStatusRail />
            </div>
          </div>
          <div className="space-y-10 xl:col-span-8">
            <div>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Decision intelligence surface
              </p>
              <EmptyDecisionState
                message="Analysts see this structural prompt before screened data hydrates dashboards — an honest empty state drawn from production components."
                ctaLabel="Go to workspace home"
                ctaHref={WORKSPACE_ROUTES.home}
              />
            </div>
            <div>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Investigation chrome
              </p>
              <InvestigationConsoleChrome />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
