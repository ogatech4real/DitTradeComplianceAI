import type { Metadata } from "next";

import Link from "next/link";

import { MarketingArticleShell } from "@/components/marketing/marketing-article-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Research & innovation",
  description:
    "Research-led rigour for Digital Trade Compliance Intelligence: explainable AI, ICC-aligned interoperability, hybrid screening, and human-in-the-loop governance for digital trade operations.",
};

const ARCHITECTURE_THEMES = [
  "ICC-aligned trade data interoperability and harmonised semantics",
  "Hybrid AI and rules-based compliance screening with explicit governance bands",
  "Explainable operational analytics tied to reviewer duty-of-care",
  "Fraud, anomaly, and cohort intelligence for supervisory triage",
  "Jurisdiction-aware governance orchestration — context without substituting legal advice",
  "Operator-centred review prioritisation and disposition-ready narratives",
] as const;

const RESEARCH_MOTIVATIONS = [
  "Accelerating digitisation of international trade and documentary depth",
  "Carbon border adjustment and related disclosure expectations on filings",
  "Supply-chain traceability and attestation evidence alongside declarations",
  "Fragmented compliance workflows that strain manual throughput",
  "Operational review complexity at enterprise scale",
  "Cross-jurisdiction regulatory overlays on the same trade records",
] as const;

const ENGINEERING_PRIORITIES = [
  "Modular orchestration so intake, scoring, and review stages compose cleanly",
  "Explainable scoring pipelines with inspectable drivers and thresholds",
  "Schema intelligence and canonicalisation that preserve audit trails",
  "Resilient operational workflows for high-volume screening teams",
  "Scalable, accessible frontend intelligence surfaces for daily use",
  "Enterprise-oriented design: tenancy, controls, and integration realism",
] as const;

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-[color-mix(in_oklch,var(--home-accent)_72%,transparent)]"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ResearchInnovationPage() {
  return (
    <MarketingArticleShell
      kicker="Research"
      title={
        <>
          How we frame <span className="text-gradient-home">rigour</span>
        </>
      }
      description="Digital Trade Compliance Intelligence rests on a single premise: research discipline, operational realism, and shipping-grade software must move together. The programme asks how explainable AI can strengthen digital trade governance — through operational compliance intelligence, hybrid risk scoring, and interoperable workflows aligned with international standards and supervisory expectations — without pretending software replaces judgment."
      headerAside={
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Published benchmarks and studies are cited where they exist; the commitments below describe how we design, ship, and
            disclose the product in production.
          </p>
          <Link
            href="/platform"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "home-cta-outline w-full justify-center rounded-lg",
            )}
          >
            Capability modules
          </Link>
          <Link
            href="https://github.com/ogatech4real/DitTradeComplianceAI"
            className={cn(buttonVariants({ variant: "outline" }), "home-cta-outline w-full justify-center rounded-lg")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Technical repository
          </Link>
        </div>
      }
      contentClassName="space-y-0"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-14 lg:col-span-8">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Research stance</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              We treat explainable artificial intelligence as infrastructure for modern trade compliance: interoperable data,
              defensible scores, and review artefacts that supervisors and partners can interrogate. The question is not whether
              models can run unattended, but how they make evidence visible, workloads legible, and escalation paths accountable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Architecture themes</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              These themes map directly to the shipped workspace; the{" "}
              <Link href="/platform" className="font-medium text-foreground underline-offset-4 hover:underline">
                Platform
              </Link>{" "}
              page names the operational modules they roll up into.
            </p>
            <BulletList items={ARCHITECTURE_THEMES} />
          </section>

          <section className="rounded-xl border border-[color-mix(in_oklch,var(--home-accent)_28%,var(--border))] bg-[color-mix(in_oklch,var(--home-accent)_6%,var(--card))] p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-foreground">Human-in-the-loop by design</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              The research rejects fully autonomous compliance adjudication. It foregrounds transparent governance: humans retain
              disposition authority, model limits stay legible, and review environments privilege evidence visibility and
              operational explainability over opaque optimisation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">What motivates the programme</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Contemporary trade operations sit at the intersection of customs digitisation, climate-related border measures,
              traceability regimes, and multi-jurisdiction reporting. The programme is oriented to those pressures as design
              inputs — not as one-off features bolted onto legacy review.
            </p>
            <BulletList items={RESEARCH_MOTIVATIONS} />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Orchestration objective</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Intelligent orchestration should help organisations surface elevated-risk trade records earlier and with clearer
              rationale — while preserving transparency, auditability, and day-to-day usability for officers and control teams.
              The aim is assistive intelligence that tightens the feedback loop between data, risk signals, and accountable review.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Engineering priorities</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              From implementation through release, the work prioritises qualities that make research claims testable in
              production, not only in slides.
            </p>
            <BulletList items={ENGINEERING_PRIORITIES} />
          </section>

          <section className="max-w-3xl border-t border-border/60 pt-10">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              The broader objective is to advance{" "}
              <span className="font-medium text-foreground">
                trustworthy, interoperable, operationally deployable AI
              </span>{" "}
              for digital trade governance and compliance intelligence — systems that institutions can run, audit, and extend
              under their own risk and legal frameworks.
            </p>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_38%,var(--background))] p-6 lg:sticky lg:top-28">
            <h2 className="text-base font-semibold text-foreground">Disclosure &amp; assurance</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>Model roles, failure modes, and human override paths documented per release.</li>
              <li>Ingestion and mapping diagnostics that support cohort and posture narratives.</li>
              <li>Versioned API contracts aligned with shipped UI behaviour for integrators.</li>
            </ul>
          </div>
        </aside>
      </div>
    </MarketingArticleShell>
  );
}
