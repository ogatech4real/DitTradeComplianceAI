"use client";

import Link from "next/link";

import { EmptyDecisionState } from "@/components/dashboard/empty-decision-state";
import { InvestigationConsoleChrome } from "@/components/marketing/investigation-console-chrome";
import { WorkflowStatusRail } from "@/components/workflow/workflow-status-rail";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WorkspaceIntelligencePreview({ home = false }: { home?: boolean }) {
  return (
    <section className="border-t border-border/70 bg-[color-mix(in_oklch,var(--card)_28%,var(--background))]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-5 border-b border-border/60 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="public-kicker">Workspace</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
              {home ? (
                <>
                  Production UI — <span className="text-gradient-home">live</span> components
                </>
              ) : (
                "The same surfaces operators use in production"
              )}
            </h2>
            <p className="text-muted-foreground">
              {home
                ? "The chrome below is taken from the shipping workspace. This marketing view omits customer data; behaviour matches a signed-in session before a cohort is selected."
                : "The chrome below is taken from the shipping workspace. States reflect a signed-in session without a loaded cohort — identical patterns to production, without customer data on this page."}
            </p>
          </div>
          <Link
            href={WORKSPACE_ROUTES.dashboard}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg", className: "shrink-0 rounded-lg px-6" }),
              home && "home-cta-outline",
            )}
          >
            Open workspace
          </Link>
        </div>
        <div className="mt-10 grid gap-8 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Workflow</p>
            <div className="max-h-[min(26rem,68vh)] origin-top overflow-hidden rounded-xl border border-border/70 bg-[color-mix(in_oklch,var(--background)_45%,var(--card))] xl:scale-[0.93] xl:[transform-origin:top_left] xl:justify-self-start">
              <WorkflowStatusRail />
            </div>
          </div>
          <div className="space-y-8 xl:col-span-8">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Decision surface</p>
              <EmptyDecisionState
                message="Standard idle state when no screened cohort is loaded — the same prompt analysts see in production after sign-in."
                ctaLabel="Workspace home"
                ctaHref={WORKSPACE_ROUTES.home}
              />
            </div>
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Investigation chrome</p>
              <InvestigationConsoleChrome />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
