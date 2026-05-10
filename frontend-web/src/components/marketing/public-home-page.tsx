"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Brain,
  Cpu,
  FileSearch,
  Layers,
  Map,
  Radar,
  Shield,
  Waves,
} from "lucide-react";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { HeroExecutiveSurface } from "@/components/marketing/hero-executive-surface";
import { MarketingCaptionFigure } from "@/components/marketing/marketing-caption-figure";
import { WorkspaceIntelligencePreview } from "@/components/marketing/workspace-intelligence-preview";
import { buttonVariants } from "@/components/ui/button";

const CAPABILITIES = [
  {
    title: "ICC-aligned trade intelligence",
    body: "Canonical discipline for declarations, proofs, and supporting artefacts — expressed as operator-legible fidelity, not opaque schema plumbing.",
    icon: Layers,
  },
  {
    title: "Hybrid AI + rules compliance scoring",
    body: "Deterministic controls and empirical models interlock behind explicit governance bands so automation never replaces discretionary checkpoints.",
    icon: Cpu,
  },
  {
    title: "Fraud intelligence",
    body: "Early signals for concentrated risk, documentation tension, and coercion-shaped patterns — framed for escalation, not headline alarmism.",
    icon: Radar,
  },
  {
    title: "Batch intelligence",
    body: "Cohort pressure — duplication bursts, corridor clustering, temporal bunching — surfaced before inconsistencies propagate across filings.",
    icon: BarChart3,
  },
  {
    title: "Explainable compliance analytics",
    body: "Narratives, drivers, and thematic recurrence translate scores into review packets auditors and partners can actually interrogate.",
    icon: Brain,
  },
  {
    title: "Jurisdiction-aware governance",
    body: "Routing and market context inform triage and disclosure posture without pretending to substitute specialised legal advice.",
    icon: Map,
  },
  {
    title: "Priority review orchestration",
    body: "Queues inherit severity, calibrated confidence, and disposition language aligned to supervisory throughput — humans remain authoritative.",
    icon: FileSearch,
  },
  {
    title: "Operational risk intelligence",
    body: "Posture dashboards connect screening cadence, data fitness, anomaly load, and traceable artefacts suitable for diligence conversations.",
    icon: Shield,
  },
] as const;

const WORKFLOW = [
  "Upload trade data",
  "Schema intelligence",
  "ICC transformation",
  "Hybrid compliance scoring",
  "Fraud & batch intelligence",
  "Explainability generation",
  "Review queue",
  "Governance decisions",
] as const;

export function PublicHomePage() {
  return (
    <>
      <HeroExecutiveSurface />

      {/* Why it matters — editorial + visual */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-5">
            <p className="public-kicker">Global context</p>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight tracking-tight sm:text-[2.125rem]">
              Why disciplined evaluation matters now
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-muted-foreground">
              Trade is digitising faster than analogue review models can absorb. Carbon-border measures, extended producer
              responsibility, and traceability mandates widen the documentary surface that must be read as a single coherent
              story — not a stack of isolated field checks.
            </p>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
              Manual adjudication at volume struggles with cross-border identifier drift, harmonisation gaps, and sustainability
              attestations that only make sense when linked to the underlying declaration fabric.
            </p>
          </div>
          <div className="space-y-8 lg:col-span-7">
            <p className="text-[1.05rem] leading-relaxed text-muted-foreground lg:max-w-2xl lg:pt-2">
              The platform is designed for pre-orchestration intelligence: hybrid scoring proposes posture, explainability
              justifies attention, and reviewers retain authority at the adjudication boundary — a serious AI governance stance
              aligned to supervisory realism rather than automation theatre.
            </p>
            <MarketingCaptionFigure
              className="lg:sticky lg:top-28"
              src="/marketing/section-global-obligations.png"
              alt="Abstract map-style visual suggesting overlapping trade, carbon, and traceability obligations — illustrative only."
              captionLabel="Caption"
              caption={
                <>
                  Obligations stack on the same evidence: customs, climate-border context, and chain-of-custody claims only hold
                  together when evaluation is{" "}
                  <span className="text-white">cross-regime coherent</span> — the visual is metaphor, not live policy data.
                </>
              }
              aspectClassName="aspect-[16/10] min-h-[220px] w-full"
              imageClassName="object-[55%_40%]"
            />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-y border-border/70 bg-[color-mix(in_oklch,var(--card)_40%,var(--background))]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-6 lg:max-w-3xl">
            <p className="public-kicker">Engineered capabilities</p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-[2.125rem]">
              Core intelligence modules
            </h2>
            <p className="text-[1.05rem] leading-relaxed text-muted-foreground">
              These modules deploy together inside the operational workspace. The public site explains intent; the workspace is
              where filings, queues, and explainability artefacts are exercised under your organisation&apos;s controls.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c, idx) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-32px" }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                  className="group rounded-2xl border border-border/80 bg-[color-mix(in_oklch,var(--background)_55%,var(--card))] p-5 transition-colors duration-300 hover:border-[color-mix(in_oklch,var(--primary)_45%,var(--border))]"
                >
                  <Icon
                    className="size-[22px] text-[color-mix(in_oklch,var(--primary)_90%,var(--foreground)_10%)] transition-transform duration-300 group-hover:translate-y-[-2px]"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <h3 className="mt-4 font-[family-name:var(--font-heading)] text-[15px] font-semibold leading-snug tracking-tight">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{c.body}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12">
            <Link href="/platform" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-lg px-8" })}>
              Full capability narrative
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="public-kicker">End-to-end posture</p>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-[2.125rem]">
            From ingestion to governance decisions
          </h2>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-muted-foreground">
            The sequence is deliberately legible for non-technical stakeholders, industrial partners, and research funders — a
            credible map of how heterogeneous trade files become explainable dossiers without exposing internal identifiers on
            this public surface.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-border/70 bg-card/35 p-8">
              <ol className="space-y-0">
                {WORKFLOW.map((step, idx) => (
                  <li key={step} className="relative flex gap-5 pb-10 last:pb-0">
                    {idx < WORKFLOW.length - 1 ? (
                      <div
                        className="absolute left-[15px] top-8 bottom-0 w-px bg-[color-mix(in_oklch,var(--border)_70%,var(--primary)_30%)]"
                        aria-hidden
                      />
                    ) : null}
                    <div className="relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-xs font-semibold text-foreground">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-[family-name:var(--font-heading)] text-[1.05rem] font-semibold leading-snug text-foreground sm:text-lg">
                        {step}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                href={WORKSPACE_ROUTES.home}
                className={`${buttonVariants({ variant: "link" })} !px-0 mt-2 text-sm font-semibold`}
              >
                Open the live staging rail in the workspace →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <MarketingCaptionFigure
              className="lg:sticky lg:top-28"
              src="/marketing/hero-trade-evaluation.png"
              alt="Symbolic progression visual — not a live pipeline screenshot or proprietary scoring output."
              captionLabel="Caption"
              caption={
                <>
                  Each stage compounds structure and evidence until reviewers inherit a disposition-ready narrative — the
                  figure is{" "}
                  <span className="text-white">symbolic progression</span>, not a claim about model performance on this page.
                </>
              }
              aspectClassName="aspect-[16/12] min-h-[220px] w-full"
              imageClassName="object-[center_35%]"
            />
          </div>
        </div>
      </section>

      {/* Research */}
      <section className="border-t border-border/70 bg-[color-mix(in_oklch,var(--card)_28%,var(--background))]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="public-kicker">Research &amp; innovation</p>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-[2.125rem]">
                Legitimacy engineered into disclosure
              </h2>
              <p className="mt-6 text-[1.05rem] leading-relaxed text-muted-foreground">
                The programme treats explainable trade governance as a joint research and engineering obligation: ICC Digital
                Trade Toolkit interoperability hypotheses, hybrid orchestration between rules and estimation, sustainability-informed
                screening context, and operator-centred narratives suitable for diligence — without promising autonomous
                regulatory outcomes.
              </p>
              <ul className="mt-10 space-y-4 text-[15px] leading-relaxed text-foreground/95">
                <li className="flex gap-3">
                  <Activity className="mt-1 size-[18px] shrink-0 text-[color-mix(in_oklch,var(--primary)_85%,transparent)]" aria-hidden />
                  Explainability artefacts aligned to duty-of-care documentation alongside numerical scoring envelopes.
                </li>
                <li className="flex gap-3">
                  <Waves className="mt-1 size-[18px] shrink-0 text-[color-mix(in_oklch,var(--primary)_85%,transparent)]" aria-hidden />
                  Harmonisation cues grounded in interoperable digital trade semantics and evolving traceability metadata expectations.
                </li>
                <li className="flex gap-3">
                  <Cpu className="mt-1 size-[18px] shrink-0 text-[color-mix(in_oklch,var(--primary)_85%,transparent)]" aria-hidden />
                  Operational analytics that pair cohort intelligence with transparent escalation boundaries for institutional review.
                </li>
              </ul>
              <Link href="/research" className={buttonVariants({ size: "lg", className: "mt-10 rounded-lg px-8" })}>
                Research pillars &amp; evaluation posture
              </Link>
            </div>
            <aside className="flex flex-col justify-between rounded-2xl border border-border/80 bg-[color-mix(in_oklch,var(--background)_40%,var(--card))] p-8 lg:col-span-5">
              <div>
                <p className="font-[family-name:var(--font-heading)] text-xl font-semibold leading-snug text-foreground">
                  “Serious platforms separate public positioning from operational truth. Here, the workspace remains the system of
                  record; this site is the defensible front door.”
                </p>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Framing for partners and funders: traceable contracts, reproducible scaffolding, and bounded claims — not
                  marketing uplift statistics.
                </p>
              </div>
              <Link
                href="https://github.com/ogatech4real/DitTradeComplianceAI"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", className: "mt-10 w-full rounded-lg sm:w-auto" })}
              >
                Review artefacts on GitHub
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <WorkspaceIntelligencePreview />

      {/* Contributors bridge */}
      <section className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <p className="public-kicker">Stewardship</p>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-[2.125rem]">
                Principal leadership, collaborators, and industrial context
              </h2>
              <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground">
                Public pages emphasise verifiable stewardship: principal research-engineering lead, nominated collaborators, and
                industrial validation framed through artefacts and disclosures — not speculative team marketing tiles.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border/80 bg-card/40 p-8">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  For institutional framing, collaboration entry points, and diligence-oriented context, see the About section.
                  The operational workspace remains unchanged for live screening workflows.
                </p>
                <Link href="/about" className={buttonVariants({ variant: "outline", className: "mt-8 w-full rounded-lg lg:w-auto" })}>
                  Authors, collaborators &amp; context
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
