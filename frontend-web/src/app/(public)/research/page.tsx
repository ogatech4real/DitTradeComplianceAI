import type { Metadata } from "next";

import Link from "next/link";

import {
  MarketingArticleCtaBand,
  MarketingArticleShell,
} from "@/components/marketing/marketing-article-shell";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Research & innovation",
  description:
    "Explainable trade governance research themes: ICC interoperability, hybrid intelligence orchestration, sustainability-adjacent compliance analytics, and operator-centred disclosures.",
};

const PILLARS = [
  {
    title: "Explainable governance for digitally native trade filings",
    body: "The programme emphasises supervisory narratives alongside quantitative composites so reviewers can reconcile model behaviour with escalation obligations.",
  },
  {
    title: "ICC interoperability & toolkit alignment",
    body: "Data harmonisation hypotheses track ICC Digital Toolkit semantics — stressing auditability rather than asserting universal certification parity.",
  },
  {
    title: "Hybrid intelligence orchestration",
    body: "Deterministic guards and probabilistic estimation interlock with explicit escalation thresholds, resisting both brittle rule-only regimes and unchecked scoring automation.",
  },
  {
    title: "Operational compliance analytics",
    body: "Cohort posture, anomaly pressure, and mapping fidelity articulate system health indicators that auditors and partners can scrutinise collaboratively.",
  },
  {
    title: "Carbon & traceability-informed screening context",
    body: "Documentary expectations tied to evolving border carbon regimes and sustainability reporting inform feature design — without substituting specialised environmental counsel.",
  },
  {
    title: "Responsible AI disclosures",
    body: "Model lineage, thematic explainability artefacts, and review boundaries are surfaced as artefacts suitable for diligence interviews and funding checkpoints.",
  },
] as const;

export default function ResearchInnovationPage() {
  return (
    <MarketingArticleShell
      kicker="Research legitimacy"
      title={
        <>
          Narratives that underpin the engineered <span className="text-gradient-brand">workspace</span>
        </>
      }
      description={
        <>
          Institutional stakeholders should expect traceable rationales bridging academic contribution, interoperability pilots,
          and responsibly scoped operational analytics — not unsubstantiated production claims or marketing uplift statistics.
        </>
      }
      headerAside={
        <div className="space-y-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Evaluation posture</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Controlled experiments complement partner pilots. Published outputs and repository artefacts remain the authoritative
              venue for quantitative efficacy statements.
            </p>
          </div>
          <Link
            href="https://github.com/ogatech4real/DitTradeComplianceAI"
            className={buttonVariants({ variant: "outline", className: "w-full rounded-lg sm:w-auto" })}
            target="_blank"
            rel="noopener noreferrer"
          >
            Review implementation artefacts
          </Link>
        </div>
      }
      contentClassName="space-y-0"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
        <aside className="order-2 rounded-2xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_35%,var(--background))] p-8 lg:order-1 lg:col-span-4 lg:sticky lg:top-28">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">Disclosure commitments</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>Transparency on model roles, failure modes, and human override paths.</p>
            <p>Traceable ingestion diagnostics for mapping and cohort fitness narratives.</p>
            <p>Documentation aligning API contracts with supervisory UI disclosures.</p>
          </div>
        </aside>
        <div className="order-1 space-y-12 lg:order-2 lg:col-span-8">
          {PILLARS.map((pillar) => (
            <section
              key={pillar.title}
              className="border-l-2 border-[color-mix(in_oklch,var(--primary)_55%,transparent)] pl-6 lg:pl-8"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold leading-snug">{pillar.title}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{pillar.body}</p>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <MarketingArticleCtaBand
          body={
            <>
              Launch the operational workspace to correlate these research themes with tactile flows — ingestion, cohort
              intelligence, explainability narratives, investigations, and export readiness — under your organisation&apos;s
              controls.
            </>
          }
          actions={
            <Link href={WORKSPACE_ROUTES.home} className={buttonVariants({ size: "lg", className: "rounded-lg px-8" })}>
              Open operational workspace
            </Link>
          }
        />
      </div>
    </MarketingArticleShell>
  );
}
