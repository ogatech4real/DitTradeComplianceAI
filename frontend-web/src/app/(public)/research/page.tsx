import type { Metadata } from "next";

import Link from "next/link";

import {
  MarketingArticleCtaBand,
  MarketingArticleShell,
} from "@/components/marketing/marketing-article-shell";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Research & innovation",
  description:
    "Explainable trade governance, ICC interoperability, hybrid orchestration, and disclosure practice for the production compliance intelligence platform.",
};

const PILLARS = [
  {
    title: "Explainable governance & disclosure",
    body: "Supervisory narratives sit beside scores so reviewers can justify escalation; model roles, limits, and overrides remain visible in shipped surfaces.",
  },
  {
    title: "ICC-aligned interoperability",
    body: "Harmonisation follows Digital Trade Toolkit semantics — auditability and traceability first, without overstating certification equivalence.",
  },
  {
    title: "Hybrid intelligence in operation",
    body: "Rules and estimation interlock with explicit thresholds in production — avoiding brittle rule-only stacks and ungoverned scoring.",
  },
  {
    title: "Sustainability context, bounded scope",
    body: "Carbon and traceability expectations inform screening context in product; specialised environmental or legal counsel remains outside the platform boundary.",
  },
] as const;

export default function ResearchInnovationPage() {
  return (
    <MarketingArticleShell
      kicker="Research"
      title={
        <>
          Governance &amp; <span className="text-gradient-home">assurance</span> narrative
        </>
      }
      description="How the product is designed and disclosed: engineering discipline, ICC-aligned trade semantics, and operator-centred explainability — documented for auditors, partners, and supervisory counterparts."
      headerAside={
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Benchmarks and comparative studies are cited where we publish them; this page summarises the design commitments that
            hold in production releases.
          </p>
          <Link
            href="https://github.com/ogatech4real/DitTradeComplianceAI"
            className={cn(buttonVariants({ variant: "outline" }), "home-cta-outline w-full rounded-lg sm:w-auto")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Technical repository
          </Link>
        </div>
      }
      contentClassName="space-y-0"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <aside className="order-2 rounded-xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_35%,var(--background))] p-6 lg:order-1 lg:col-span-4 lg:sticky lg:top-28">
          <h2 className="text-base font-semibold">Disclosure &amp; assurance</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Model roles, failure modes, and human override paths documented per release.</li>
            <li>Ingestion and mapping diagnostics for cohort and posture narratives.</li>
            <li>API contracts versioned with UI behaviour for integration teams.</li>
          </ul>
        </aside>
        <div className="order-1 space-y-10 lg:order-2 lg:col-span-8">
          {PILLARS.map((pillar) => (
            <section
              key={pillar.title}
              className="border-l-2 border-[color-mix(in_oklch,var(--home-accent)_58%,transparent)] pl-5 lg:pl-7"
            >
              <h2 className="text-lg font-semibold leading-snug">{pillar.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{pillar.body}</p>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <MarketingArticleCtaBand
          body="Run intake, queues, explainability, and investigations in the live workspace under your organisation's policies and data controls."
          actions={
            <Link
              href={WORKSPACE_ROUTES.home}
              className={cn(buttonVariants({ size: "lg" }), "home-cta-primary rounded-lg px-8")}
            >
              Workspace
            </Link>
          }
        />
      </div>
    </MarketingArticleShell>
  );
}
