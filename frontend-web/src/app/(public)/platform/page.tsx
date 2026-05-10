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
    <article className="mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-6 lg:px-8 lg:pb-36 lg:pt-16">
      <header className="max-w-3xl border-b border-border/60 pb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Platform overview</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-[2.125rem]">
          Capabilities spanning intake, interpretation, enforcement assist, and review
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">
          The platform concentrates on disciplined pre-filing orchestration — not certificate issuance — aligning engineering
          choices with internationally recognised interoperable trade data practices.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={WORKSPACE_ROUTES.home} className={buttonVariants({ size: "lg", className: "rounded-xl px-8" })}>
            Launch workspace
          </Link>
          <Link href="/research" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-xl px-8" })}>
            Research foundations
          </Link>
        </div>
      </header>
      <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {DEEP_CAPS.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="rounded-[1.35rem] border border-border/70 bg-card/94 p-6 shadow-[0_26px_60px_-40px_oklch(0_0_0_/0.28)] transition-transform hover:-translate-y-[3px]"
            >
              <Icon className="size-8 text-primary" strokeWidth={1.25} aria-hidden />
              <h2 className="mt-5 font-[family-name:var(--font-heading)] text-lg font-semibold leading-snug">{c.title}</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          );
        })}
      </div>
      <aside className="mt-24 rounded-[1.5rem] border border-dashed border-border/65 bg-muted/35 p-10 text-center lg:mx-auto lg:max-w-3xl">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Capability statements describe engineering intent exercised through the operational workspace UI and documented API
          contracts. Adoption maturity depends on organisational validation — not inferred from generic marketing uptake
          metrics.
        </p>
      </aside>
    </article>
  );
}
