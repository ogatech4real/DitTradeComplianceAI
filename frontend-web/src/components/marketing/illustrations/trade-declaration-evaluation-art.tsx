"use client";

import { motion } from "framer-motion";

/**
 * Editorial illustration: digitised shipment / customs declarations entering hybrid screening → explainable reviewer posture.
 * Pure SVG — no external stock assets.
 */
export function TradeDeclarationEvaluationArt() {
  return (
    <div className="relative aspect-[5/4] min-h-[240px] w-full lg:aspect-[560/460]">
      <svg
        viewBox="0 0 560 460"
        className="size-full drop-shadow-xl"
        role="img"
        aria-labelledby="hero-art-title hero-art-desc"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="hero-art-title">Trade declarations under hybrid compliance evaluation</title>
        <desc id="hero-art-desc">
          Stylised depiction of digitally filed freight and customs dossiers routed through corridor-aware screening layers,
          producing severity posture and supervisory review signals.
        </desc>
        <defs>
          <linearGradient id="heroFillPanel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--muted)" />
            <stop offset="100%" stopColor="var(--card)" />
          </linearGradient>
          <linearGradient id="heroCorridor" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-tertiary)" stopOpacity="0.95" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.88" />
            <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="heroGlow" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-secondary)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0.22" />
          </linearGradient>
          <clipPath id="heroDocClip">
            <rect x="48" y="108" width="132" height="152" rx="14" />
          </clipPath>
          <marker id="hero-arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="var(--brand-secondary)" />
          </marker>
        </defs>

        <rect x="20" y="24" width="520" height="412" rx="28" fill="url(#heroFillPanel)" opacity="0.92" />

        <path
          d="M390 380 C338 294 392 218 466 174 C492 157 526 154 548 154"
          fill="none"
          stroke="url(#heroCorridor)"
          strokeWidth="3.6"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d="M52 362 C146 294 258 274 394 294 C448 302 496 344 526 394"
          fill="none"
          stroke="url(#heroCorridor)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeDasharray="7 13"
          opacity="0.55"
        />

        <ellipse cx="360" cy="92" rx="154" ry="74" fill="url(#heroGlow)" />

        {/* Port / jurisdiction nodes */}
        {[
          { cx: 120, cy: 72 },
          { cx: 392, cy: 58 },
          { cx: 494, cy: 128 },
          { cx: 168, cy: 404 },
          { cx: 444, cy: 380 },
        ].map((pt, i) => (
          <motion.circle
            key={`${pt.cx}-${pt.cy}`}
            cx={pt.cx}
            cy={pt.cy}
            r="7"
            fill="var(--primary)"
            stroke="var(--brand-tertiary)"
            strokeWidth="2"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.45, 1, 0.55], scale: [1, 1.15, 1] }}
            transition={{ duration: 4.2 + i * 0.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        ))}

        {/* Document stack — subject under screening */}
        <g clipPath="url(#heroDocClip)">
          <motion.rect
            x="62"
            y="124"
            width="132"
            height="28"
            rx="7"
            fill="color-mix(in oklch, var(--primary) 42%, transparent)"
            initial={{ x: 52 }}
            animate={{ x: [52, 58, 52] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect
            x="56"
            y="162"
            width="148"
            height="36"
            rx="9"
            fill="var(--card)"
            stroke="color-mix(in oklch, var(--primary) 52%, transparent)"
            strokeWidth="2.2"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: [0.88, 1, 0.9] }}
            transition={{ duration: 5.5, repeat: Infinity }}
          />
          <rect x="72" y="176" width="84" height="6" rx="3" fill="color-mix(in oklch, var(--foreground) 18%, transparent)" />
          <rect x="72" y="188" width="108" height="5" rx="2.5" fill="color-mix(in oklch, var(--foreground) 10%, transparent)" />
          <rect x="72" y="198" width="96" height="5" rx="2.5" fill="color-mix(in oklch, var(--foreground) 8%, transparent)" />
        </g>
        <text x="114" y="102" fontSize="12" fill="currentColor" className="font-sans opacity-95" fontWeight="660" textAnchor="middle">
          Shipment dossiers · columns &amp; attestations
        </text>

        {/* Scan beam */}
        <motion.rect
          x="48"
          y="132"
          width="132"
          height="42"
          fill="color-mix(in oklch, var(--brand-tertiary) 52%, transparent)"
          clipPath="url(#heroDocClip)"
          opacity="0.35"
          initial={{ y: 108 }}
          animate={{ y: [108, 220, 108] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Screening core */}
        <rect
          x="248"
          y="176"
          width="132"
          height="112"
          rx="18"
          fill="color-mix(in oklch, var(--card) 75%, transparent)"
          stroke="url(#heroCorridor)"
          strokeWidth="3"
        />
        <text x="314" y="215" fontSize="13" fill="currentColor" textAnchor="middle" fontWeight="640" opacity="0.95">
          Hybrid screening pass
        </text>
        <text x="314" y="236" fontSize="11.5" fill="currentColor" textAnchor="middle" opacity="0.48" fontWeight="500">
          rules + calibrated models · cohort context
        </text>
        <rect x="270" y="252" width="88" height="18" rx="9" fill="color-mix(in oklch, var(--primary) 18%, transparent)" />
        <text x="314" y="265" fontSize="10" fill="currentColor" textAnchor="middle" opacity="0.82" fontWeight="600">
          severity · fraud · corridors
        </text>

        {/* Arrows */}
        <path
          d="M182 212 H235"
          stroke="var(--brand-secondary)"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#hero-arrowhead)"
        />
        <path
          d="M382 226 H446"
          stroke="var(--brand-secondary)"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#hero-arrowhead)"
        />

        {/* Reviewer surface */}
        <rect
          x="454"
          y="166"
          width="118"
          height="146"
          rx="16"
          fill="color-mix(in oklch, var(--muted) 92%, transparent)"
          stroke="color-mix(in oklch, var(--brand-secondary) 45%, transparent)"
          strokeWidth="2.6"
        />
        <text x="512" y="196" fontSize="12.5" textAnchor="middle" fill="currentColor" fontWeight="640">
          Explainable dossier
        </text>
        <motion.g
          initial={{ opacity: 0.7 }}
          animate={{ opacity: [0.72, 1, 0.72] }}
          transition={{ duration: 3.2, repeat: Infinity }}
        >
          <rect x="474" y="214" width="78" height="22" rx="8" fill="color-mix(in oklch, var(--semantic-critical) 16%, transparent)" />
          <text x="498" y="229" fontSize="11" fill="currentColor" textAnchor="middle" opacity="0.88" fontWeight="600">
            Risk posture
          </text>
          <rect x="474" y="244" width="78" height="22" rx="8" fill="color-mix(in oklch, var(--brand-tertiary) 20%, transparent)" />
          <text x="498" y="259" fontSize="11" fill="currentColor" textAnchor="middle" opacity="0.88" fontWeight="600">
            Routing cues
          </text>
          <rect x="474" y="274" width="78" height="26" rx="9" fill="color-mix(in oklch, var(--primary) 22%, transparent)" />
          <text x="498" y="292" fontSize="11" fill="currentColor" textAnchor="middle" opacity="0.92" fontWeight="600">
            Analyst narrative
          </text>
        </motion.g>

        {/* Caption rail */}
        <rect x="32" y="324" width="496" height="84" rx="16" fill="color-mix(in oklch, var(--primary) 8%, transparent)" />
        <text x="284" y="354" fontSize="13" textAnchor="middle" fill="currentColor" opacity="0.82" fontWeight="640">
          Subject under evaluation: digitised customs &amp; trade declarations
        </text>
        <text x="284" y="378" fontSize="11.5" textAnchor="middle" fill="currentColor" opacity="0.55" fontWeight="500">
          Line-level consistency · documentation trace · corridor exposure · escalation-ready disposition language
        </text>
      </svg>
    </div>
  );
}
