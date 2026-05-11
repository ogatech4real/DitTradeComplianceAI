import type { LucideIcon } from "lucide-react";
import { BarChart3, Brain, Cpu, FileSearch, Layers, Map, Radar, Shield } from "lucide-react";

/** Six production capability modules — shared by Home and Platform. */
export const PUBLIC_PLATFORM_MODULES: ReadonlyArray<{
  title: string;
  body: string;
  icon: LucideIcon;
  secondaryIcon?: LucideIcon;
}> = [
  {
    title: "ICC-aligned trade data",
    body: "Declarations and proofs normalised to interoperable expectations — field fidelity and completeness surfaced in operator-grade views.",
    icon: Layers,
  },
  {
    title: "Hybrid compliance scoring",
    body: "Rules and models run together behind explicit governance bands so screening stays reviewable and auditable.",
    icon: Cpu,
  },
  {
    title: "Fraud & batch intelligence",
    body: "Record-level risk alongside cohort signals — duplication, corridors, and bursts surfaced for supervisory triage.",
    icon: Radar,
    secondaryIcon: BarChart3,
  },
  {
    title: "Explainable analytics",
    body: "Narratives and drivers packaged with scores so reviewers receive decision-ready packets, not opaque totals.",
    icon: Brain,
  },
  {
    title: "Jurisdiction & review queues",
    body: "Routing and market context for triage, plus severity-ranked queues and disposition language aligned to your process.",
    icon: Map,
    secondaryIcon: FileSearch,
  },
  {
    title: "Operational risk posture",
    body: "Screening cadence, data fitness, and exportable artefacts for audit, supervisory review, and partner assurance.",
    icon: Shield,
  },
];
