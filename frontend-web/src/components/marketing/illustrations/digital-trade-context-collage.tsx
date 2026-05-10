"use client";

import { motion } from "framer-motion";

/** Visual synopsis: proliferating filings vs unified screening aperture (editorial SVG). */
export function DigitalTradeContextCollage() {
  return (
    <svg viewBox="0 0 480 340" className="size-full" role="img" aria-labelledby="ctx-title ctx-desc">
      <title id="ctx-title">Digital trade filings converging toward governed screening</title>
      <desc id="ctx-desc">
        Loose document tiles on the left represent fragmented carbon, customs, and traceability disclosures; beams converge
        into a unified evaluation aperture on the right.
      </desc>
      <defs>
        <linearGradient id="ctxBeam" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="var(--brand-tertiary)" stopOpacity="0.15" />
          <stop offset="45%" stopColor="var(--primary)" stopOpacity="0.52" />
          <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="16" y="16" width="448" height="308" rx="22" fill="color-mix(in oklch, var(--card) 94%, transparent)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.rect
          key={i}
          x={32 + (i % 3) * 52}
          y={48 + Math.floor(i / 3) * 58}
          width="42"
          height="34"
          rx="8"
          fill="color-mix(in oklch, var(--muted) 92%, transparent)"
          stroke="color-mix(in oklch, var(--foreground) 14%, transparent)"
          strokeWidth="1.8"
          initial={{ opacity: 0.75 }}
          animate={{ opacity: [0.7, 1, 0.75] }}
          transition={{ duration: 4.5 + i * 0.2, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
      <path
        d="M226 148 C294 146 344 154 394 174"
        fill="none"
        stroke="url(#ctxBeam)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.72"
      />
      <ellipse cx="394" cy="176" rx="62" ry="84" fill="none" stroke="url(#ctxBeam)" strokeWidth="18" opacity="0.35" />
      <circle cx="404" cy="168" r="58" fill="color-mix(in oklch, var(--primary) 26%, transparent)" stroke="var(--brand-secondary)" strokeWidth="4" />
      <text x="404" y="158" fontSize="13" fill="currentColor" textAnchor="middle" fontWeight="640">
        Governed
      </text>
      <text x="404" y="178" fontSize="12" fill="currentColor" textAnchor="middle" opacity="0.65" fontWeight="600">
        screening lens
      </text>
      <text x="120" y="218" fontSize="11.5" fill="currentColor" opacity="0.62" textAnchor="middle" fontWeight="500">
        CBAM · origins · proofs · disclosures
      </text>
      <motion.text
        x="404"
        y="296"
        fontSize="11.5"
        fill="currentColor"
        opacity="0.72"
        textAnchor="middle"
        fontWeight="600"
        initial={{ opacity: 0.65 }}
        animate={{ opacity: [0.62, 0.92, 0.62] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        One coherence model for escalation
      </motion.text>
    </svg>
  );
}
