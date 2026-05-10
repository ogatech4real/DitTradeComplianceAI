"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";

function TradeTopologyGraphic() {
  return (
    <motion.div
      className="relative aspect-[5/4] min-h-[220px] w-full overflow-hidden rounded-[1.75rem] border-2 border-[color-mix(in_oklch,var(--primary)_40%,var(--border))] bg-[linear-gradient(155deg,color-mix(in_oklch,var(--muted)_55%,transparent),color-mix(in_oklch,var(--accent-intelligence-soft)_70%,transparent),color-mix(in_oklch,var(--brand-tertiary-soft)_82%,transparent))] shadow-[0_28px_80px_-44px_color-mix(in_oklch,var(--brand-secondary)_52%,transparent),inset_0_1px_0_color-mix(in_oklch,white_70%,transparent)]"
      animate={{ rotate: [0, 0.2, 0], scale: [1, 1.01, 1] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 400 320"
        className="absolute inset-0 size-full opacity-[0.45]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <motion.path
          d="M20 260 C110 210 120 140 210 118 S320 140 382 94"
          stroke="var(--brand-secondary)"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeDasharray="6 11"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.8, ease: "easeOut" }}
        />
        <motion.path
          d="M48 92 C136 146 218 164 294 226 S376 274 392 274"
          stroke="var(--brand-tertiary)"
          strokeWidth="1.05"
          strokeLinecap="round"
          opacity={0.7}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.3, ease: "easeOut", delay: 0.15 }}
        />
        <motion.path
          d="M296 54 C258 132 216 206 174 274"
          stroke="var(--primary)"
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
            fill="color-mix(in oklch, var(--primary) 60%, var(--brand-secondary))"
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
          linear-gradient(96deg, color-mix(in oklch, var(--brand-secondary) 38%, transparent) 0.5px, transparent 0.5px),
          linear-gradient(12deg, color-mix(in oklch, var(--brand-tertiary) 32%, transparent) 0.5px, transparent 0.5px)`,
          backgroundSize: "32px 32px, 28px 28px",
        }}
      />
      <p className="absolute bottom-4 left-5 right-5 text-[11px] leading-relaxed text-muted-foreground">
        Abstract trade-flow topology illustrating jurisdiction crossings and supervisory routing — illustrative geometry,
        not live transaction data.
      </p>
    </motion.div>
  );
}

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
          <p className="inline-flex rounded-full border border-[color-mix(in_oklch,var(--brand-secondary)_40%,transparent)] bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            AI-assisted governance · digital trade ecosystems
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-heading)] text-[clamp(1.95rem,4.4vw,3.05rem)] font-semibold leading-[1.06] tracking-tight text-[color-mix(in_oklch,var(--foreground)_94%,var(--primary)_6%)]">
            AI-Assisted Digital Trade <span className="text-gradient-brand">Compliance Intelligence</span>
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
