"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { HeroIntelligenceTopology } from "@/components/marketing/hero-intelligence-topology";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroExecutiveSurface() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 home-hero-glow" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-x-10 lg:px-8 lg:py-20">
        <motion.div
          className="flex min-w-0 flex-col justify-center lg:col-span-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="public-kicker">Product</p>
          <h1 className="mt-4 text-[clamp(1.85rem,4.2vw,2.95rem)] font-semibold leading-[1.06] tracking-tight">
            <span className="block text-foreground">Digital Trade</span>
            <span className="mt-1 block text-gradient-home">Compliance intelligence</span>
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground">
            AI-assisted digital trade compliance Platform
          </p>

          <div className="mt-7 rounded-xl border border-border/70 bg-card/45 px-4 py-4 backdrop-blur-sm sm:px-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color-mix(in_oklch,var(--home-accent)_82%,var(--foreground)_18%)]">
              What we evaluate
            </p>
            <p className="mt-2 text-[15px] leading-snug text-foreground/95">
              Declarations, attestations, and traceability evidence — scored with hybrid rules and models, then handed to
              reviewers with explainability and a clear disposition path.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={WORKSPACE_ROUTES.home}
              className={cn(buttonVariants({ size: "lg" }), "home-cta-primary rounded-lg px-7 font-semibold")}
            >
              Launch workspace
            </Link>
            <Link
              href="/platform"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "home-cta-outline rounded-lg px-7 font-semibold",
              )}
            >
              Platform
            </Link>
            <Link
              href="/research"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "rounded-lg px-4 text-muted-foreground hover:text-foreground",
              })}
            >
              Research
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative mt-12 flex lg:col-span-6 lg:mt-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
        >
          <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-2xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_38%,transparent)] p-6 sm:p-8">
            <div className="public-site-hero-grid pointer-events-none absolute inset-0 opacity-[0.22]" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Flow sketch</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Abstract routes and nodes — not live data or proprietary graphs.
              </p>
              <div className="mt-5">
                <HeroIntelligenceTopology
                  accent="home"
                  className="mx-auto h-[min(200px,38vw)] w-full max-w-md sm:h-[240px]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
