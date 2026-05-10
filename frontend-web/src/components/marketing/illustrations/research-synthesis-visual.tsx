"use client";

import { motion } from "framer-motion";

/** Editorial synthesis motif: corroborating signals + narrative layer over quantitative trace. */
export function ResearchSynthesisVisual() {
  return (
    <svg viewBox="0 0 440 280" className="size-full" role="img" aria-labelledby="rs-title rs-desc">
      <title id="rs-title">Research-aligned explainability and corroborating evidence trails</title>
      <desc id="rs-desc">
        Stacked harmonic curves suggest empirical traces; clipped panels evoke peer artefacts and supervisory narrative overlays
        converging toward a labelled synthesis crest.
      </desc>
      <defs>
        <linearGradient id="rsBand" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="var(--accent-intelligence-soft)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand-tertiary)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="416" height="256" rx="20" fill="color-mix(in oklch, var(--card) 93%, transparent)" stroke="color-mix(in oklch, var(--border) 80%, transparent)" strokeWidth="1.6" />
      {[0, 1, 2].map((k) => (
        <motion.path
          key={k}
          d={`M32 ${148 + k * 10} Q120 ${98 + k * 26} 220 ${132 + k * 8} T408 ${118 + k * 14}`}
          fill="none"
          stroke="url(#rsBand)"
          strokeWidth={2.8 - k * 0.4}
          strokeLinecap="round"
          opacity={0.52 - k * 0.08}
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: [0, 0.12, 0] }}
          strokeDasharray="8 14"
          transition={{ duration: 7 + k, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <rect x="40" y="44" width="92" height="68" rx="12" fill="color-mix(in oklch, var(--muted) 94%, transparent)" stroke="color-mix(in oklch, var(--primary) 38%, transparent)" strokeWidth="1.8" />
      <text x="86" y="76" fontSize="11.5" textAnchor="middle" fill="currentColor" fontWeight="640" opacity="0.92">
        Peer cues
      </text>
      <text x="86" y="94" fontSize="10.5" textAnchor="middle" fill="currentColor" opacity="0.6" fontWeight="500">
        ICC · standards
      </text>
      <rect x="300" y="44" width="98" height="68" rx="12" fill="color-mix(in oklch, var(--muted) 94%, transparent)" stroke="color-mix(in oklch, var(--brand-secondary) 45%, transparent)" strokeWidth="1.8" />
      <text x="349" y="74" fontSize="11.5" textAnchor="middle" fill="currentColor" fontWeight="640" opacity="0.92">
        Trace bundles
      </text>
      <text x="349" y="94" fontSize="10.5" textAnchor="middle" fill="currentColor" opacity="0.6" fontWeight="500">
        evidence graphs
      </text>
      <motion.ellipse
        cx="220"
        cy="188"
        rx="132"
        ry="44"
        fill="color-mix(in oklch, var(--primary) 26%, transparent)"
        stroke="var(--brand-secondary)"
        strokeWidth="3"
        initial={{ ry: 40 }}
        animate={{ ry: [40, 48, 41], opacity: [0.75, 0.95, 0.82] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="220" y="186" fontSize="14" textAnchor="middle" fill="currentColor" fontWeight="660">
        Explainable synthesis
      </text>
      <text x="220" y="206" fontSize="11" textAnchor="middle" fill="currentColor" opacity="0.65" fontWeight="500">
        narrative + artefacts + governance posture
      </text>
      <motion.rect
        x="162"
        y="224"
        width="116"
        height="34"
        rx="10"
        fill="color-mix(in oklch, var(--brand-tertiary) 42%, transparent)"
        initial={{ opacity: 0.75 }}
        animate={{ opacity: [0.7, 1, 0.78] }}
        transition={{ duration: 3.6, repeat: Infinity }}
      />
      <text x="220" y="246" fontSize="11" textAnchor="middle" fill="currentColor" opacity="0.88" fontWeight="640">
        Review-ready dossier language
      </text>
    </svg>
  );
}
