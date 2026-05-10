import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Brain,
  Cpu,
  FileSearch,
  Layers,
  Map,
  Radar,
  Shield,
} from "lucide-react";

import { MarketingArticleShell } from "@/components/marketing/marketing-article-shell";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Platform capabilities",
  description:
    "ICC-aligned ingestion, hybrid compliance scoring, fraud and batch intelligence, explainability, and supervisory review tooling for digitally integrated trade filings.",
};

const DEEP_CAPS = [
  {
    icon: Layers,
    title: "ICC-aligned canonical intelligence",
    body: "Field alignment, completeness, transformation coverage — expressed as operator-legible fidelity scores rather than hidden schema deltas.",
  },
  {
    icon: Cpu,
    title: "Hybrid scoring fabric",
    body: "Rules + empirical models coexist with explicit escalation bands so automation never bypasses discretionary governance checkpoints.",
  },
  {
    icon: Radar,
    title: "Fraud & anomaly overlays",
    body: "Per-record fraud composites sit beside cohort anomalies to reveal both targeted manipulation and systemic batch pressure.",
  },
  {
    icon: BarChart3,
    title: "Batch anomaly analytics",
    body: "Concentrations, duplication, and routing bursts become first-class artefacts for supervisory triage dashboards.",
  },
  {
    icon: Brain,
    title: "Decision-grade explainability",
    body: "Narratives, thematic recurrence, driver lists, and evidence chips translate model outputs into review packets.",
  },
  {
    icon: Map,
    title: "Jurisdiction-aware overlays",
    body: "Geographic corridors and market codes contextualise escalation without asserting legal sufficiency.",
  },
  {
    icon: FileSearch,
    title: "Priority review orchestration",
    body: "Queues inherit severity ribbons, calibrated scores, and recommendation language aligned to human disposition.",
  },
  {
    icon: Shield,
    title: "Trace & audit temperament",
    body: "Session-bound screening envelopes retain linkage from intake through explainability artefacts suitable for escalation folders.",
  },
] as const;

export default function PlatformCapabilitiesPage() {
  return (
    <MarketingArticleShell
      kicker="Platform overview"
      title={
        <>
          Capabilities from intake through review — engineered for{" "}
          <span className="text-gradient-brand">explainable</span> governance
        </>
      }
      description={
        <>
          The platform concentrates on disciplined pre-filing orchestration — not certificate issuance — aligning engineering
          choices with internationally recognised interoperable trade data practices and documented API contracts.
        </>
      }
      actions={
        <>
          <Link href={WORKSPACE_ROUTES.home} className={buttonVariants({ size: "lg", className: "rounded-lg px-8" })}>
            Launch workspace
          </Link>
          <Link href="/research" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-lg px-8" })}>
            Research foundations
          </Link>
        </>
      }
      headerAside={
        <div className="space-y-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Positioning</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pre-filing intelligence and supervisory assist — not legal certification, clearance guarantees, or autonomous
              regulatory outcomes.
            </p>
          </div>
          <ul className="space-y-2.5 border-t border-border/50 pt-5 text-[13px] font-medium leading-snug text-foreground/90">
            <li className="flex gap-2">
              <span className="text-primary" aria-hidden>
                ·
              </span>
              ICC Digital Trade Toolkit discipline
            </li>
            <li className="flex gap-2">
              <span className="text-primary" aria-hidden>
                ·
              </span>
              Hybrid rules + empirical models
            </li>
            <li className="flex gap-2">
              <span className="text-primary" aria-hidden>
                ·
              </span>
              Human disposition boundary
            </li>
          </ul>
        </div>
      }
      contentClassName="space-y-0"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEEP_CAPS.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="rounded-2xl border border-border/80 bg-[color-mix(in_oklch,var(--background)_50%,var(--card))] p-6 transition-colors duration-300 hover:border-[color-mix(in_oklch,var(--primary)_40%,var(--border))]"
            >
              <Icon className="size-7 text-[color-mix(in_oklch,var(--primary)_90%,transparent)]" strokeWidth={1.35} aria-hidden />
              <h2 className="mt-5 font-[family-name:var(--font-heading)] text-[1.05rem] font-semibold leading-snug">
                {c.title}
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          );
        })}
      </div>

      <aside className="mt-16 rounded-2xl border border-dashed border-border/60 bg-[color-mix(in_oklch,var(--card)_28%,var(--background))] p-8 text-center lg:mx-auto lg:max-w-3xl lg:px-10">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Capability statements describe engineering intent exercised through the operational workspace UI and documented API
          contracts. Adoption maturity depends on organisational validation — not inferred from generic marketing uptake
          metrics.
        </p>
      </aside>
    </MarketingArticleShell>
  );
}
