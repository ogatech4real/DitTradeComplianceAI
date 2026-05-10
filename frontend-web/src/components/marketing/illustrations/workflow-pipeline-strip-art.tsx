"use client";

import { motion } from "framer-motion";

/** Horizontal ingestion → disposition schematic for workflow section. */
export function WorkflowPipelineStripArt() {
  const nodes = ["Ingest", "Schema", "Scoring", "Fraud IQ", "Narratives", "Queue", "Decision"] as const;
  const x = [26, 98, 170, 242, 314, 386, 454];
  return (
    <svg viewBox="0 0 520 112" className="size-full" role="img" aria-labelledby="wf-title wf-desc">
      <title id="wf-title">Workflow from ingestion to disposition</title>
      <desc id="wf-desc">
        Seven labelled stages arranged left to right with animated connectors illustrating progression from ingestion through
        review queue toward governance disposition.
      </desc>
      <defs>
        <linearGradient id="wfLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-tertiary)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="8" y="10" width="504" height="92" rx="18" fill="color-mix(in oklch, var(--card) 95%, transparent)" stroke="color-mix(in oklch, var(--primary) 28%, transparent)" strokeWidth="1.8" />
      <motion.path
        d="M56 54 H472"
        fill="none"
        stroke="url(#wfLine)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.55"
        initial={{ pathLength: 0.12 }}
        animate={{ pathLength: [0.08, 1, 0.12] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {nodes.map((label, i) => (
        <g key={label} transform={`translate(${x[i] - 24} 30)`}>
          <motion.circle
            cx="24"
            cy="24"
            r="13"
            fill="color-mix(in oklch, var(--primary) 42%, transparent)"
            stroke="var(--brand-secondary)"
            strokeWidth="2.6"
            initial={{ scale: 0.96 }}
            animate={{ scale: [0.96, 1.05, 0.98], opacity: [0.85, 1, 0.9] }}
            transition={{ duration: 3.2 + i * 0.08, repeat: Infinity, delay: i * 0.15 }}
          />
          <text x="24" y="29" fontSize="11.5" textAnchor="middle" fill="currentColor" opacity="0.92" fontWeight="640">
            {i + 1}
          </text>
          <text x="24" y="70" fontSize="9.5" textAnchor="middle" fill="currentColor" opacity="0.68" fontWeight="600">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}
