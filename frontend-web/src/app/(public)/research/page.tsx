import type { Metadata } from "next";

import Link from "next/link";

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
    <article className="mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-6 lg:px-8 lg:pb-36 lg:pt-16">
      <header className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">Research legitimacy</p>
        <h1 className="mt-5 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-[2.375rem]">
          Research narratives that underpin the engineered workspace
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground lg:mx-0">
          Institutional stakeholders should expect traceable rationales bridging academic contribution, interoperability pilots,
          and responsibly scoped operational analytics — not unsubstantiated production claims.
        </p>
      </header>
      <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[1fr_1.15fr]">
        <aside className="order-2 h-fit rounded-3xl border border-border/65 bg-muted/35 p-8 lg:order-1">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">Evaluation posture</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Controlled experiments complement partner pilots. Published outputs and artefacts remain the authoritative venue
            for quantitative efficacy statements.
          </p>
          <div className="mt-10 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>• Transparency on model roles, failure modes, and human override paths.</p>
            <p>• Traceable ingestion diagnostics for mapping and cohort fitness narratives.</p>
            <p>• Documentation aligning API contracts with supervisory UI disclosures.</p>
          </div>
          <Link
            href="https://github.com/ogatech4real/DitTradeComplianceAI"
            className={buttonVariants({
              variant: "outline",
              className: "mt-10 w-full rounded-xl",
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            Review implementation artefacts on GitHub
          </Link>
        </aside>
        <div className="order-1 space-y-12 lg:order-2">
          {PILLARS.map((pillar) => (
            <section key={pillar.title} className="border-l-2 border-[var(--accent-governance)]/45 pl-6">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">{pillar.title}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{pillar.body}</p>
            </section>
          ))}
        </div>
      </div>
      <div className="mt-20 rounded-3xl bg-gradient-to-r from-muted/65 via-transparent to-[var(--accent-intelligence-soft)]/45 p-[1px]">
        <div className="rounded-[calc(1.5rem-1px)] bg-[var(--marketing-canvas)] p-10 text-center lg:text-left">
          <p className="text-[15px] leading-relaxed text-foreground">
            Launch the sandbox workspace to correlate these research themes with tactile operator flows — ingestion, cohort
            intelligence, explainability narratives, investigations, and export readiness.
          </p>
          <Link href={WORKSPACE_ROUTES.home} className={buttonVariants({ className: "mt-8 rounded-xl" })}>
            Open operational workspace
          </Link>
        </div>
      </div>
    </article>
  );
}
