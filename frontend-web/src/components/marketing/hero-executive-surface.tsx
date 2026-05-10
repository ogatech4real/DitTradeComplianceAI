"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { HeroIntelligenceTopology } from "@/components/marketing/hero-intelligence-topology";
import { MarketingCaptionFigure } from "@/components/marketing/marketing-caption-figure";
import { buttonVariants } from "@/components/ui/button";

export function HeroExecutiveSurface() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_70%_-8%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:gap-y-10 lg:px-8 lg:py-24">
        <motion.div
          className="min-w-0 lg:col-span-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="public-kicker">Public platform</p>
          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-[clamp(2rem,4.8vw,3.35rem)] font-semibold leading-[1.06] tracking-tight text-foreground">
            AI-Assisted Digital Trade{" "}
            <span className="text-gradient-brand">Compliance Intelligence</span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground">
            Operational screening, explainable compliance analytics, fraud intelligence, and jurisdiction-aware governance for
            modern digital trade ecosystems.
          </p>

          <div className="mt-8 rounded-2xl border border-border/80 bg-card/50 p-5 backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color-mix(in_oklch,var(--primary)_88%,var(--foreground)_12%)]">
              Subject under evaluation
            </p>
            <p className="mt-3 text-[15px] font-medium leading-snug text-foreground/95">
              Cross-border declarations, origin and product attestations, and traceability-aligned evidence — harmonised for
              hybrid AI-and-rules scoring, then advanced into review-ready explainability and human disposition.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={WORKSPACE_ROUTES.home}
              className={buttonVariants({ size: "lg", className: "rounded-lg px-7 font-semibold" })}
            >
              Launch workspace
            </Link>
            <Link
              href="/platform"
              className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-lg px-7 font-semibold" })}
            >
              Explore platform
            </Link>
            <Link
              href="/research"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "rounded-lg px-5 text-muted-foreground hover:text-foreground",
              })}
            >
              Research &amp; innovation
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative mt-14 lg:col-span-6 lg:mt-0"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-[color-mix(in_oklch,var(--card)_42%,transparent)] shadow-[0_40px_100px_-48px_color-mix(in_oklch,var(--foreground)_35%,transparent)]">
            <div className="public-site-hero-grid pointer-events-none absolute inset-0 opacity-[0.28]" />
            <div className="relative px-5 pb-2 pt-8 sm:px-8 sm:pt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Operational intelligence visual
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Abstract topology — jurisdiction-tinged routes and documentation nodes — not live filings or proprietary graph
                data.
              </p>
              <div className="mt-6">
                <HeroIntelligenceTopology className="mx-auto h-[min(220px,42vw)] w-full max-w-lg sm:h-[260px]" />
              </div>
            </div>
            <div className="relative border-t border-border/50 bg-[color-mix(in_oklch,var(--background)_35%,transparent)] p-4 sm:p-5">
              <MarketingCaptionFigure
                src="/marketing/hero-trade-evaluation.png"
                priority
                alt="Stylised trade-corridor visualisation for narrative context only — not operational telemetry."
                captionLabel="Caption"
                caption={
                  <>
                    Filings read as an evidence network: corridors, attestations, and supervisory cues converge so stakeholders
                    immediately recognise{" "}
                    <span className="text-white">what is being evaluated</span> before opening the workspace.
                  </>
                }
                className="!rounded-2xl !border-2 !border-border/55 shadow-none"
                aspectClassName="aspect-[16/10] min-h-[180px] w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
