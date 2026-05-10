"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { MarketingCaptionFigure } from "@/components/marketing/marketing-caption-figure";
import { buttonVariants } from "@/components/ui/button";

export function HeroExecutiveSurface() {
  return (
    <section className="relative overflow-hidden border-b border-[color-mix(in_oklch,var(--brand-secondary)_28%,var(--border))] bg-[linear-gradient(185deg,var(--marketing-canvas),color-mix(in_oklch,var(--muted)_65%,transparent),color-mix(in_oklch,var(--accent-intelligence-soft)_35%,transparent))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_90%_60%_at_72%_-6%,color-mix(in_oklch,var(--brand-secondary)_38%,transparent),transparent_60%)]" />
      <div className="pointer-events-none absolute -left-[20%] top-28 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--brand-tertiary)_32%,transparent),transparent_62%)] blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-8 lg:py-28">
        <motion.div
          className="min-w-0 lg:col-span-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex rounded-full border border-[color-mix(in_oklch,var(--brand-secondary)_40%,transparent)] bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Operational compliance intelligence
          </p>

          <div className="mt-5 rounded-2xl border-2 border-[color-mix(in_oklch,var(--brand-secondary)_45%,transparent)] bg-[linear-gradient(125deg,color-mix(in_oklch,var(--primary)_12%,transparent),color-mix(in_oklch,var(--accent-intelligence-soft)_55%,transparent))] px-4 py-4 shadow-lg shadow-[color-mix(in_oklch,var(--primary)_16%,transparent)] sm:px-5 sm:py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Subject under evaluation — read this first
            </p>
            <p className="mt-2.5 text-[15px] font-semibold leading-snug text-foreground sm:text-[1.05rem]">
              Cross-border trade{" "}
              <span className="text-[color-mix(in_oklch,var(--foreground)_82%,var(--brand-secondary)_18%)]">
                declarations, origin &amp; product attestations
              </span>
              , and traceability-aligned documentation — scored with hybrid AI and rules then routed into explainable human
              disposition.
            </p>
          </div>

          <h1 className="mt-8 font-[family-name:var(--font-heading)] text-[clamp(1.92rem,4.2vw,3.08rem)] font-semibold leading-[1.05] tracking-tight text-[color-mix(in_oklch,var(--foreground)_93%,var(--primary)_7%)]">
            AI-assisted screening for digital trade compliance &amp;{" "}
            <span className="text-gradient-brand">governance</span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
            From intake through review-ready narratives: coherence checks, anomaly and fraud overlays, jurisdictional cues, and
            audit-visible reasoning — engineered for supervisory teams preparing filings for clearance or escalation.
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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
        >
          <MarketingCaptionFigure
            src="/marketing/hero-trade-evaluation.png"
            priority
            alt="Abstract depiction of networked trade corridors and customs declaration artefacts under evaluation—not operational data."
            captionLabel="Visual caption"
            caption={
              <>
                Trade declarations read as interconnected evidence parcels — routes, corridors, documentation nodes — so the{" "}
                <span className="text-white">object of scrutiny</span> is obvious before you open analytics.
              </>
            }
            aspectClassName="aspect-[5/4] min-h-[240px] w-full lg:aspect-[16/11]"
          />
        </motion.div>
      </div>
    </section>
  );
}
