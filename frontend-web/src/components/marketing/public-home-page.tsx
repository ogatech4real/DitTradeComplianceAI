"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Brain, Cpu, FileSearch, Layers, Map, Radar, Shield } from "lucide-react";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { HeroExecutiveSurface } from "@/components/marketing/hero-executive-surface";
import { WorkspaceIntelligencePreview } from "@/components/marketing/workspace-intelligence-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Six modules — each line states one job, no overlap with hero. */
const CAPABILITIES = [
  {
    title: "ICC-aligned trade data",
    body: "Declarations and proofs normalised to interoperable expectations — fidelity operators can see.",
    icon: Layers,
  },
  {
    title: "Hybrid compliance scoring",
    body: "Rules and models together, with explicit bands so nothing bypasses human checkpoints.",
    icon: Cpu,
  },
  {
    title: "Fraud & batch intelligence",
    body: "Record-level risk next to cohort anomalies — duplication, corridors, bursts — before they spread.",
    icon: Radar,
    secondaryIcon: BarChart3,
  },
  {
    title: "Explainable analytics",
    body: "Narratives and drivers that turn scores into review packets, not black-box totals.",
    icon: Brain,
  },
  {
    title: "Jurisdiction & review queues",
    body: "Routing context for triage plus severity-aware queues and disposition language.",
    icon: Map,
    secondaryIcon: FileSearch,
  },
  {
    title: "Operational risk posture",
    body: "Cadence, data fitness, and audit-friendly artefacts for diligence conversations.",
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
    <div className="home-surface">
      <HeroExecutiveSurface />

      {/* 1 — Problem + approach (single narrative block) */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="public-kicker">Context</p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-[1.75rem]">
            Filings outpace <span className="text-gradient-home">manual review</span>
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Carbon-border rules, traceability claims, and digitised customs widen what must be read as one coherent dossier.
              Checking fields in isolation stops working at volume.
            </p>
            <p>
              This platform front-loads intelligence: hybrid scoring suggests posture, explainability supports escalation, and
              reviewers stay in charge. The live system of record is the{" "}
              <Link href={WORKSPACE_ROUTES.home} className="font-medium text-foreground underline-offset-4 hover:underline">
                workspace
              </Link>
              ; this page is the concise public story.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — Capabilities */}
      <section className="border-y border-border/70 bg-[color-mix(in_oklch,var(--card)_32%,var(--background))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="public-kicker">Capabilities</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-[1.75rem]">
              What the <span className="text-gradient-home">workspace</span> delivers
            </h2>
            <p className="mt-4 text-muted-foreground">
              Six modules, deployed together. Detail lives on{" "}
              <Link href="/platform" className="font-medium text-foreground underline-offset-4 hover:underline">
                Platform
              </Link>
              .
            </p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c, idx) => {
              const Primary = c.icon;
              const Secondary = "secondaryIcon" in c ? c.secondaryIcon : null;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-24px" }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className="rounded-xl border border-border/75 bg-[color-mix(in_oklch,var(--background)_52%,var(--card))] p-5 transition-colors hover:border-[color-mix(in_oklch,var(--home-accent)_35%,var(--border))]"
                >
                  <div className="flex items-center gap-2">
                    <Primary className="size-5 shrink-0 text-[color-mix(in_oklch,var(--home-accent)_88%,transparent)]" strokeWidth={1.5} aria-hidden />
                    {Secondary ? (
                      <Secondary className="size-4 shrink-0 text-muted-foreground opacity-80" strokeWidth={1.5} aria-hidden />
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold leading-snug text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10">
            <Link
              href="/platform"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-cta-outline rounded-lg px-6")}
            >
              Full capability outline
            </Link>
          </div>
        </div>
      </section>

      {/* 3 — Workflow */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="public-kicker">Pipeline</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-[1.75rem]">
            From file to <span className="text-gradient-home">disposition</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Eight stages, readable for non-engineers. Run it end-to-end in the workspace — this list is the map, not the product
            demo.
          </p>
        </div>
        <div className="mt-10 max-w-3xl rounded-xl border border-border/70 bg-card/30 p-6 sm:p-8">
          <ol className="space-y-0">
            {WORKFLOW.map((step, idx) => (
              <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
                {idx < WORKFLOW.length - 1 ? (
                  <div className="absolute left-[14px] top-7 bottom-0 w-px home-rule opacity-80" aria-hidden />
                ) : null}
                <span className="relative z-[1] flex size-7 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-[11px] font-semibold text-foreground">
                  {idx + 1}
                </span>
                <span className="pt-0.5 text-[15px] font-semibold leading-snug text-foreground">{step}</span>
              </li>
            ))}
          </ol>
          <Link
            href={WORKSPACE_ROUTES.home}
            className={cn(buttonVariants({ variant: "link" }), "!px-0 mt-2 text-sm font-semibold text-[color-mix(in_oklch,var(--home-accent)_75%,var(--foreground)_25%)]")}
          >
            Start in the workspace →
          </Link>
        </div>
      </section>

      {/* 4 — Research (one band, no duplicate quote) */}
      <section className="border-t border-border/70 bg-[color-mix(in_oklch,var(--card)_24%,var(--background))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="public-kicker">Research</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-[1.75rem]">
              Disclosure that <span className="text-gradient-home">holds up</span> under scrutiny
            </h2>
            <p className="mt-4 text-muted-foreground">
              ICC interoperability, hybrid orchestration, and sustainability-aware screening context — articulated for partners
              and funders, without claiming autonomous regulation or legal advice.
            </p>
            <ul className="mt-8 space-y-3 text-foreground/95">
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color-mix(in_oklch,var(--home-accent)_70%,transparent)]" aria-hidden />
                <span>Explainability aligned to reviewer duty-of-care, not vanity metrics.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color-mix(in_oklch,var(--home-accent)_70%,transparent)]" aria-hidden />
                <span>Contracts and UI disclosures kept in sync for institutional diligence.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color-mix(in_oklch,var(--home-accent)_70%,transparent)]" aria-hidden />
                <span>Claims bounded by artefacts — repository and publications, not marketing uplift.</span>
              </li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/research" className={cn(buttonVariants({ size: "lg" }), "home-cta-primary rounded-lg px-6")}>
                Research &amp; evaluation
              </Link>
              <Link
                href="https://github.com/ogatech4real/DitTradeComplianceAI"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-cta-outline rounded-lg px-6")}
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WorkspaceIntelligencePreview home />

      {/* 5 — Stewardship (single strip) */}
      <section className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-6 rounded-xl border border-border/70 bg-card/25 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="max-w-2xl">
              <p className="public-kicker">Stewardship</p>
              <p className="mt-2 text-foreground">
                Principal lead, collaborators, and industrial context — described through artefacts, not speculative bios.
              </p>
            </div>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "home-cta-outline shrink-0 rounded-lg px-6",
              )}
            >
              About
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
