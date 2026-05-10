"use client";

/**
 * Abstract trade-flow / jurisdiction mesh — decorative only, not operational data.
 */
export function HeroIntelligenceTopology({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
    >
      <svg
        viewBox="0 0 560 420"
        className="h-full w-full text-[color-mix(in_oklch,var(--primary)_55%,transparent)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pub-hero-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.38" />
          </linearGradient>
          <radialGradient id="pub-hero-glow" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="oklch(0.5 0.1 200)" stopOpacity="0.35" />
            <stop offset="55%" stopColor="oklch(0.14 0.02 264)" stopOpacity="0" />
          </radialGradient>
          <filter id="pub-hero-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <rect width="560" height="420" fill="url(#pub-hero-glow)" />
        <g opacity="0.9" stroke="url(#pub-hero-line)" strokeWidth="1.15" strokeLinecap="round">
          <path d="M48 312 C 120 240, 200 360, 280 268 S 420 200, 512 128" filter="url(#pub-hero-blur)" />
          <path d="M72 96 C 160 180, 240 72, 332 156 S 460 288, 520 340" />
          <path d="M24 196 H 536" opacity="0.35" />
          <path d="M196 24 V 396" opacity="0.28" />
        </g>
        <g fill="currentColor" opacity="0.85">
          <circle cx="92" cy="118" r="4" className="animate-pulse" style={{ animationDuration: "3.2s" }} />
          <circle cx="268" cy="248" r="5" />
          <circle cx="412" cy="156" r="3.5" opacity="0.7" />
          <circle cx="484" cy="292" r="4" className="animate-pulse" style={{ animationDuration: "4.1s" }} />
        </g>
        <g stroke="color-mix(in oklch, var(--brand-secondary) 50%, transparent)" strokeWidth="1" opacity="0.55">
          <path d="M128 88 L 168 128 M 352 72 L 392 112 M 120 320 L 168 280 M 400 320 L 448 280" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
