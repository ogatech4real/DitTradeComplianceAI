"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { MarketingFigure } from "@/components/marketing/illustrations/marketing-figure";
import { TradeDeclarationEvaluationArt } from "@/components/marketing/illustrations/trade-declaration-evaluation-art";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";

export function HeroExecutiveSurface() {
  return (
    <section className="relative overflow-hidden border-b border-[color-mix(in_oklch,var(--brand-secondary)_28%,var(--border))] bg-[linear-gradient(185deg,var(--marketing-canvas),color-mix(in_oklch,var(--muted)_65%,transparent),color-mix(in_oklch,var(--accent-intelligence-soft)_35%,transparent))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_90%_60%_at_72%_-6%,color-mix(in_oklch,var(--brand-secondary)_38%,transparent),transparent_60%)]" />
      <div className="pointer-events-none absolute -left-[20%] top-28 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--brand-tertiary)_32%,transparent),transparent_62%)] blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <motion.div
          className="min-w-0 lg:col-span-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex max-w-full rounded-full border border-[color-mix(in_oklch,var(--brand-secondary)_40%,transparent)] bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Subject · digitised customs &amp; trade declarations
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-heading)] text-[clamp(1.95rem,4.4vw,3.05rem)] font-semibold leading-[1.06] tracking-tight text-[color-mix(in_oklch,var(--foreground)_94%,var(--primary)_6%)]">
            AI-assisted evaluation of <span className="text-gradient-brand">declaration filings</span> at supervisory scale
          </h1>
          <ul className="mt-8 max-w-xl space-y-2 text-[13px] leading-snug text-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
            <li className="border-l-[3px] border-[color-mix(in_oklch,var(--brand-secondary)_72%,transparent)] pl-4">
              <strong>Major focus:</strong> shipment, customs &amp; border-carbon dossiers — line items, attestations, corridor-linked context.
            </li>
            <li className="border-l-[3px] border-[color-mix(in_oklch,var(--brand-tertiary)_55%,transparent)] pl-4">
              <strong>How it lands:</strong> hybrid screening proposes severity + fraud cues; narratives keep humans in the adjudication loop.
            </li>
          </ul>
          <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground">
            Operational workspace for ICC-aware transforms, cohort intelligence, and explainable dossiers reviewers can escalate
            with defensible rationale — not autopilot adjudication.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={WORKSPACE_ROUTES.home} className={buttonVariants({ size: "lg", className: "rounded-xl px-7" })}>
              Launch workspace
            </Link>
            <Link href="/platform" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-xl px-7" })}>
              Explore platform
            </Link>
            <Link
              href="/research"
              className={buttonVariants({ variant: "ghost", size: "lg", className: "rounded-xl px-5 text-muted-foreground" })}
            >
              Research &amp; innovation
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="relative lg:col-span-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <MarketingFigure
            caption="Illustrative routing only: dossier-shaped filings through hybrid screening into explainable disposition language — schematic, no live filings."
            className="mx-auto lg:mx-0"
          >
            <div className="p-4 sm:p-5">
              <TradeDeclarationEvaluationArt />
            </div>
          </MarketingFigure>
        </motion.div>
      </div>
    </section>
  );
}
