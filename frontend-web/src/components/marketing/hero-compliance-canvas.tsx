"use client";

import { useCallback, useRef } from "react";
import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { GitBranch, Inbox, ListChecks, Scale, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const ORBIT_R = "min(36vw, 7.25rem)";

/**
 * Rich decorative hero visual — intake → hybrid intelligence → governance → review.
 * Interactive spotlight; pseudo-3D terrain; SVG signal paths. Not operational data.
 */
export function HeroComplianceCanvas({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const spotX = useSpring(0.62, { stiffness: 26, damping: 18, mass: 0.4 });
  const spotY = useSpring(0.38, { stiffness: 26, damping: 18, mass: 0.4 });

  const spotlight = useMotionTemplate`radial-gradient(120% 90% at ${spotX}% ${spotY}%, color-mix(in oklch, var(--home-accent) 42%, transparent) 0%, transparent 55%)`;

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      spotX.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      spotY.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
    },
    [spotX, spotY],
  );

  const onLeave = useCallback(() => {
    spotX.set(0.62);
    spotY.set(0.38);
  }, [spotX, spotY]);

  const stages = [
    { Icon: Inbox, label: "Intake", deg: 0 },
    { Icon: GitBranch, label: "Score", deg: 90 },
    { Icon: ListChecks, label: "Review", deg: 180 },
    { Icon: Scale, label: "Govern", deg: 270 },
  ] as const;

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative isolate aspect-[5/4] w-full max-w-lg select-none overflow-hidden rounded-2xl sm:aspect-[4/3] sm:max-w-none",
        "border border-[color-mix(in_oklch,var(--home-accent)_28%,var(--border))] bg-[color-mix(in_oklch,var(--card)_42%,transparent)]",
        "shadow-[0_28px_80px_-36px_color-mix(in_oklch,var(--home-accent)_38%,transparent),inset_0_1px_0_color-mix(in_oklch,white_8%,transparent)]",
        className,
      )}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden
    >
      <motion.div className="pointer-events-none absolute inset-0 opacity-90" style={{ background: spotlight }} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,color-mix(in_oklch,var(--home-accent)_16%,transparent),transparent_58%)]" />

      {/* Pseudo-3D trade floor */}
      <div className="pointer-events-none absolute inset-x-[-18%] bottom-[-42%] flex justify-center overflow-hidden">
        <div
          className="hero-compliance-terrain h-[85%] w-[140%] opacity-[0.42]"
          style={{
            maskImage: "linear-gradient(to top, black 22%, transparent 78%)",
            WebkitMaskImage: "linear-gradient(to top, black 22%, transparent 78%)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute size-1 rounded-full bg-[color-mix(in_oklch,var(--home-accent)_55%,transparent)]"
            style={{
              left: `${8 + (i * 7) % 86}%`,
              top: `${12 + ((i * 13) % 70)}%`,
            }}
            animate={{ opacity: [0.15, 0.55, 0.15], scale: [0.85, 1.15, 0.85] }}
            transition={{
              duration: 3.2 + i * 0.21,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
          />
        ))}
      </div>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-[color-mix(in_oklch,var(--home-accent)_48%,transparent)]"
        viewBox="0 0 400 320"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="hero-lane-a" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="35%" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.12" />
          </linearGradient>
          <filter id="hero-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M -20 210 Q 110 80 200 160 T 420 120"
          stroke="url(#hero-lane-a)"
          strokeWidth="1.35"
          strokeLinecap="round"
          filter="url(#hero-soft-glow)"
          initial={{ pathLength: 0.15, opacity: 0.35 }}
          animate={{ pathLength: [0.15, 1, 0.15], opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 420 240 Q 260 280 200 170 T -30 60"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeOpacity="0.35"
          strokeLinecap="round"
          initial={{ pathLength: 0.2 }}
          animate={{ pathLength: [0.2, 1, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
        <motion.path
          d="M 40 300 C 120 120 260 260 360 40"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeOpacity="0.28"
          strokeDasharray="6 10"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [-80, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Orbiting pipeline stages (behind hub) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className={cn("relative size-[min(78vw,17.5rem)] sm:size-[19rem]", "hero-compliance-orbit")}>
          {stages.map(({ Icon, label, deg }) => (
            <div
              key={label}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(calc(-1 * ${ORBIT_R}))`,
              }}
            >
              <div className="hero-compliance-orbit-counter flex flex-col items-center gap-1">
                <span className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_72%,var(--background))] shadow-md backdrop-blur-sm sm:size-11">
                  <Icon className="size-[1.15rem] text-[color-mix(in_oklch,var(--home-accent)_90%,var(--foreground)_10%)] sm:size-5" strokeWidth={1.5} />
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Central hub */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-[8%]">
        <motion.div
          className="relative flex flex-col items-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-[-18px] rounded-full border border-[color-mix(in_oklch,var(--home-accent)_35%,transparent)] bg-[color-mix(in_oklch,var(--home-accent)_8%,transparent)] blur-[2px]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex size-[4.5rem] items-center justify-center rounded-2xl border border-[color-mix(in_oklch,var(--home-accent)_45%,var(--border))] bg-[color-mix(in_oklch,var(--card)_55%,var(--background))] shadow-[0_12px_40px_-16px_color-mix(in_oklch,var(--home-accent)_45%,transparent)] backdrop-blur-md sm:size-[5rem]">
            <ShieldCheck
              className="size-[2.1rem] text-[color-mix(in_oklch,var(--home-accent)_88%,var(--foreground)_12%)] sm:size-10"
              strokeWidth={1.35}
            />
          </div>
          <motion.div
            className="mt-2.5 flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="size-3 text-[color-mix(in_oklch,var(--home-accent)_80%,transparent)]" aria-hidden />
            Hybrid intelligence
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklch,var(--home-accent)_45%,transparent)] to-transparent opacity-70" />
    </div>
  );
}
