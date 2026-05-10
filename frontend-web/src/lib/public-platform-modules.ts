import type { LucideIcon } from "lucide-react";
import { BarChart3, Brain, Cpu, FileSearch, Layers, Map, Radar, Shield } from "lucide-react";

/** Shared six-module map for Home and Platform — single source, no drift. */
export const PUBLIC_PLATFORM_MODULES: ReadonlyArray<{
  title: string;
  body: string;
  icon: LucideIcon;
  secondaryIcon?: LucideIcon;
}> = [
  {
    title: "ICC-aligned trade data",
    body: "Declarations and proofs normalised to interoperable expectations — fidelity operators can see.",
    icon: Layers,
  },
  {
    title: "Hybrid compliance scoring",
    body: "Rules and models together, with explicit bands so nothing bypasses human checkpoints.",
    icon: Cpu,
  },
  {
    title: "Fraud & batch intelligence",
    body: "Record-level risk next to cohort anomalies — duplication, corridors, bursts — before they spread.",
    icon: Radar,
    secondaryIcon: BarChart3,
  },
  {
    title: "Explainable analytics",
    body: "Narratives and drivers that turn scores into review packets, not black-box totals.",
    icon: Brain,
  },
  {
    title: "Jurisdiction & review queues",
    body: "Routing context for triage plus severity-aware queues and disposition language.",
    icon: Map,
    secondaryIcon: FileSearch,
  },
  {
    title: "Operational risk posture",
    body: "Cadence, data fitness, and audit-friendly artefacts for diligence conversations.",
    icon: Shield,
  },
];
