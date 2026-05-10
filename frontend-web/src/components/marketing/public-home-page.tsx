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
  ListOrdered,
} from "lucide-react";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { HeroExecutiveSurface } from "@/components/marketing/hero-executive-surface";
import { WorkspaceIntelligencePreview } from "@/components/marketing/workspace-intelligence-preview";
import { buttonVariants } from "@/components/ui/button";

const CAPABILITIES = [
  {
    title: "ICC-aligned trade intelligence",
    body: "Structured alignment with interoperable ICC Digital Trade Toolkit data expectations for declarations, proofs, and supporting documentation.",
    icon: Layers,
  },
  {
    title: "Hybrid AI + rules compliance scoring",
    body: "Calibrated fusion of deterministic controls and empirical models keeps automation bounded by explicit governance overlays.",
    icon: Cpu,
  },
  {
    title: "Fraud intelligence",
    body: "Pattern surfaces that escalate suspicious concentration, coercion, or documentation inconsistencies to reviewers early.",
    icon: Radar,
  },
  {
    title: "Batch intelligence",
    body: "Cohort-level anomalies — duplication bursts, corridors, clustering — surfaced before they propagate through filings.",
    icon: BarChart3,
  },
  {
    title: "Explainable compliance analytics",
    body: "Narratives and thematic drivers articulate why exposures matter rather than collapsing outcomes to opaque totals.",
    icon: Brain,
  },
  {
    title: "Jurisdiction-aware governance",
    body: "Market and routing insight help teams understand geopolitical overlays without substituting jurisdictional advisory.",
    icon: Map,
  },
  {
    title: "Priority review orchestration",
    body: "Queues reflect severity, confidence bands, and recommended disposition — built for supervisory throughput.",
    icon: FileSearch,
  },
  {
    title: "Operational risk intelligence",
    body: "Posture dashboards connect screening cadence with data fitness, anomaly pressure, and traceable audit artefacts.",
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

      <section className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-8 top-[18%] h-52 w-52 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_26%,transparent),transparent_72%)] blur-3xl" />
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Section 02 · systemic context
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight sm:text-3xl">
              Why the platform matters
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Digitisation of customs, carbon border regimes, supplier traceability mandates, and ESG disclosures is
              outpacing analogue review throughput. Institutions need explainable oversight that scales with filings yet
              keeps humans accountable at the adjudication boundary.
            </p>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Border carbon measures and extended producer responsibility widen the documentary surface area that must be
              checked coherently — not field-by-field in isolation.
            </p>
            <p>
              Traceability regimes expect consistent identifiers, harmonised descriptions, and evidence trails aligned to
              global standards; manual adjudication struggles to reconcile cross-border inconsistencies at volume.
            </p>
            <p>
              The platform investigates records pre-orchestration: hybrid scoring proposes posture, narratives justify attention,
              and reviewers retain authority — an AI governance posture grounded in supervisory realism, not full automation hype.
            </p>
          </div>
        </div>
      </section>

      <section className="surface-spotlight border-y border-[color-mix(in_oklch,var(--brand-secondary)_32%,var(--border))] bg-[linear-gradient(172deg,color-mix(in_oklch,var(--muted)_92%,transparent),color-mix(in_oklch,var(--accent-intelligence-soft)_45%,transparent))] py-[1px]">
        <div className="relative z-[1] mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
              Section 03 · engineered capabilities
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight sm:text-3xl">
              Core intelligence capabilities
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Capability modules deploy together inside the workspace — each tuned for officers, supervisory analysts, and
              partner engineering teams validating integration paths.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c, idx) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="group rounded-2xl border border-[color-mix(in_oklch,var(--border)_74%,var(--brand-secondary)_26%)] bg-[linear-gradient(160deg,var(--card),color-mix(in_oklch,var(--accent-intelligence-soft)_55%,var(--card)))] p-5 shadow-[0_26px_64px_-40px_color-mix(in_oklch,var(--primary)_42%,transparent)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/55 hover:shadow-[0_32px_70px_-36px_color-mix(in_oklch,var(--brand-secondary)_52%,transparent)]"
                >
                  <Icon
                    className="size-[22px] text-[color-mix(in_oklch,var(--brand-secondary)_88%,transparent)] transition-colors group-hover:text-primary"
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
          <div className="mt-12 text-center">
            <Link href="/platform" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-xl" })}>
              Full capability synopsis
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Section 04 · supervisory narrative
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight sm:text-3xl">
            Operational workflow — from ingestion to disposition
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The sequence communicates how heterogeneous trade files become explainable dossiers reviewers can escalate with
            confidence — suitable for stakeholder decks without exposing internal identifiers.
          </p>
        </div>
        <div className="relative mt-16 rounded-3xl border border-[color-mix(in_oklch,var(--brand-secondary)_28%,var(--border))] bg-[linear-gradient(90deg,color-mix(in_oklch,var(--muted)_82%,transparent),transparent)] px-6 py-8 pl-8 sm:pl-12 lg:max-w-[44rem]">
          {WORKFLOW.map((step, idx) => (
            <div key={step} className="relative pb-14 last:pb-0">
              <div className="absolute top-1 -left-[43px] flex size-[24px] items-center justify-center rounded-full border-2 border-[color-mix(in_oklch,var(--brand-secondary)_75%,transparent)] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] shadow-md shadow-[color-mix(in_oklch,var(--brand-secondary)_40%,transparent)] sm:-left-[51px]" />
              <div className="flex flex-wrap items-baseline gap-3">
                <ListOrdered className="size-[18px] text-primary" aria-hidden />
                <span className="font-medium text-muted-foreground">Stage {idx + 1}</span>
              </div>
              <p className="mt-2 font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">{step}</p>
            </div>
          ))}
          <Link
            href={WORKSPACE_ROUTES.home}
            className={`${buttonVariants({ variant: "link" })} !px-0 text-sm`}
          >
            Experience the staging rail inside the workspace →
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[color-mix(in_oklch,var(--brand-secondary)_32%,var(--border))] bg-[linear-gradient(168deg,color-mix(in_oklch,var(--accent-intelligence-soft)_70%,transparent),color-mix(in_oklch,var(--brand-tertiary-soft)_38%,transparent),transparent)] py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_minmax(0,1fr)] lg:gap-16">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Section 05 · scholarly &amp; engineering integrity
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight sm:text-3xl">
                Research &amp; innovation anchor
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                The workspace operationalises hypotheses around explainable trade governance — hybrid orchestration tying
                rules, probabilistic estimation, ICC interoperability, and supervisory analytics without promising autonomous
                legal outcomes.
              </p>
              <ul className="space-y-3 text-[14px] leading-relaxed text-foreground">
                <li className="flex gap-3">
                  <Activity className="mt-1 size-[18px] shrink-0 text-primary" aria-hidden />
                  Narrative-aligned explainability for duty-of-care documentation alongside numerical scoring artefacts.
                </li>
                <li className="flex gap-3">
                  <Waves className="mt-1 size-[18px] shrink-0 text-primary" aria-hidden />
                  Harmonisation cues informed by ICC digital trade artefacts and sustainable trade metadata expectations.
                </li>
                <li className="flex gap-3">
                  <Cpu className="mt-1 size-[18px] shrink-0 text-primary" aria-hidden />
                  Operational analytics that pair cohort intelligence with escalation transparency for institutional review.
                </li>
              </ul>
              <Link href="/research" className={buttonVariants({ size: "lg", className: "rounded-xl px-8" })}>
                Read the research pillars
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WorkspaceIntelligencePreview />

      <section className="border-t border-border/55 bg-muted/20 py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Section 07 · stewardship
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight sm:text-3xl">
              Contributors &amp; institutional framing
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Leadership spans principal research-engineering stewardship, nominated collaborators, and industrial validation
              partners. Named affiliations accompany peer-reviewed artefacts and organisational disclosures rather than speculative
              marketing claims.
            </p>
          </div>
          <div className="rounded-3xl border border-border/65 bg-card/92 p-8 shadow-xl">
            <p className="text-sm leading-relaxed text-muted-foreground">
              The programme emphasises academically verifiable experimentation, interoperability pilots, and responsible AI
              documentation suitable for auditors, reviewers, and policy counterparts engaging with digitally native trade rails.
            </p>
            <Link href="/about" className={buttonVariants({ variant: "outline", className: "mt-8 rounded-xl" })}>
              Institutional context &amp; roles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
