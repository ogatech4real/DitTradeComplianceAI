"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";

function TradeTopologyGraphic() {
  return (
    <div className="relative aspect-[5/4] min-h-[220px] w-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-muted/40 via-card/80 to-[var(--accent-intelligence-soft)]/40 shadow-[inset_0_0_0_1px_oklch(1_0_0_/0.5)]">
      <svg
        viewBox="0 0 400 320"
        className="absolute inset-0 size-full opacity-[0.45]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <motion.path
          d="M20 260 C110 210 120 140 210 118 S320 140 382 94"
          stroke="var(--accent-governance)"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeDasharray="6 11"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.8, ease: "easeOut" }}
        />
        <motion.path
          d="M48 92 C136 146 218 164 294 226 S376 274 392 274"
          stroke="var(--chart-3)"
          strokeWidth="1.05"
          strokeLinecap="round"
          opacity={0.7}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.3, ease: "easeOut", delay: 0.15 }}
        />
        <motion.path
          d="M296 54 C258 132 216 206 174 274"
          stroke="var(--accent-intelligence)"
          strokeWidth={0.9}
          strokeLinecap="round"
          opacity={0.55}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.6, ease: "easeOut", delay: 0.28 }}
        />
        {[
          { cx: 60, cy: 232, delay: 0.5 },
          { cx: 196, cy: 110, delay: 0.75 },
          { cx: 330, cy: 202, delay: 0.92 },
          { cx: 280, cy: 64, delay: 1.08 },
          { cx: 168, cy: 270, delay: 1.2 },
        ].map(({ cx, cy, delay }) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            fill="var(--primary)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.75] }}
            transition={{ duration: 1.2, delay }}
          />
        ))}
      </svg>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
          linear-gradient(96deg, oklch(0.52 0.12 258 / 42%) 0.5px, transparent 0.5px),
          linear-gradient(12deg, oklch(0.52 0.1 210 / 32%) 0.5px, transparent 0.5px)`,
          backgroundSize: "32px 32px, 28px 28px",
        }}
      />
      <p className="absolute bottom-4 left-5 right-5 text-[11px] leading-relaxed text-muted-foreground">
        Abstract trade-flow topology illustrating jurisdiction crossings and supervisory routing — illustrative geometry,
        not live transaction data.
      </p>
    </div>
  );
}

export function HeroExecutiveSurface() {
  return (
    <section className="relative border-b border-border/50 bg-gradient-to-b from-[var(--marketing-canvas)] via-transparent to-muted/15">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_80%_58%_at_60%_-8%,var(--accent-intelligence)_/_0.11,transparent_58%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <motion.div
          className="min-w-0 lg:col-span-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
            AI-assisted governance · digital trade ecosystems
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-[clamp(1.95rem,4.4vw,2.95rem)] font-semibold leading-[1.1] tracking-tight text-foreground">
            AI-Assisted Digital Trade Compliance Intelligence
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground">
            Operational screening, explainable compliance analytics, fraud intelligence, and jurisdiction-aware governance
            for modern digital trade ecosystems.
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
          <TradeTopologyGraphic />
        </motion.div>
      </div>
    </section>
  );
}
