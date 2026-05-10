import type { Metadata } from "next";
import Link from "next/link";

import { MarketingArticleShell } from "@/components/marketing/marketing-article-shell";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Digital Trade Compliance Intelligence — platform purpose, research & technical lead Adewale O., research direction, and philosophy.",
};

const RESEARCH_DIRECTION = [
  "Explainable trade governance workflows",
  "AI-assisted compliance review orchestration",
  "Fraud and anomaly intelligence",
  "Sustainability and carbon-aware screening context",
  "Interoperable digital trade systems",
  "Enterprise-ready operational intelligence environments",
] as const;

const FOCUS_AREAS = [
  {
    label: "Compliance & trade AI",
    items: ["AI-assisted compliance intelligence", "Digital trade interoperability", "Explainable AI systems"],
  },
  {
    label: "Operations & platforms",
    items: ["Intelligent workflow orchestration", "Industrial AI and automation", "Human-centred operational technologies"],
  },
  {
    label: "Analytics & energy",
    items: ["Sustainable operational analytics", "Energy optimisation and sustainability systems"],
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingArticleShell
      kicker="About"
      title={
        <>
          Digital Trade <span className="text-gradient-home">Compliance intelligence</span>
        </>
      }
      description="An AI-assisted operational intelligence system for digital trade governance — explainable screening, fraud and batch signals, and jurisdiction-aware triage. The workspace is where operations run; this page states who builds it and why."
      actions={
        <>
          <Link
            href={WORKSPACE_ROUTES.home}
            className={cn(buttonVariants({ size: "lg" }), "home-cta-primary rounded-lg px-7")}
          >
            Workspace
          </Link>
          <Link
            href="/research"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-cta-outline rounded-lg px-7")}
          >
            Research
          </Link>
        </>
      }
      headerAside={
        <div className="flex flex-col gap-3">
          <Link
            href="https://github.com/ogatech4real/DitTradeComplianceAI"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "home-cta-outline justify-center rounded-lg")}
          >
            GitHub
          </Link>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Collaborations follow documented evaluation protocols; sensitive engagements stay off the public site until mutually
            agreed.
          </p>
        </div>
      }
      contentClassName="space-y-16 lg:space-y-20"
    >
      {/* Platform — consolidated from brief */}
      <section className="max-w-3xl space-y-4 text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">What it is</h2>
        <p>
          The platform supports modern digital trade governance: cross-border compliance, carbon and disclosure pressures,
          traceability expectations, and demand for interoperable, explainable systems. Hybrid AI, rules-based reasoning, fraud
          intelligence, and operational analytics help teams surface high-risk records, prioritise review, and improve governance
          visibility — with humans in the loop.
        </p>
        <p>
          It aligns with ICC Digital Trade Toolkit ideas and explores explainable AI in compliance orchestration, sustainability
          context, and trade decision support — without replacing legal judgment or jurisdictional advice.
        </p>
      </section>

      {/* Lead */}
      <section className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h2 className="text-lg font-semibold text-foreground">Research &amp; technical lead</h2>
          <p className="mt-2 text-xl font-semibold text-foreground">Adewale O.</p>
          <div className="mt-5 space-y-4 text-muted-foreground">
            <p>
              Interdisciplinary researcher and engineer across applied AI, operational intelligence, instrumentation and control,
              energy systems, and intelligent software. Over a decade in industry — instrumentation, control, automation, and
              operational infrastructure — with a focus today on deployable systems that combine explainability, governance, and
              scalable architecture.
            </p>
            <p>
              This platform is part of a wider direction: trustworthy, explainable, operationally deployable governance in
              modern digital ecosystems.
            </p>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_32%,var(--background))] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Focus areas</h3>
            <ul className="mt-5 space-y-6">
              {FOCUS_AREAS.map((block) => (
                <li key={block.label}>
                  <p className="text-sm font-semibold text-[color-mix(in_oklch,var(--home-accent)_82%,var(--foreground)_18%)]">
                    {block.label}
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {block.items.map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Direction — bullets from brief; link to research for narrative */}
      <section className="max-w-3xl">
        <h2 className="text-lg font-semibold text-foreground">Research direction</h2>
        <p className="mt-3 text-muted-foreground">
          The programme extends toward a broader operational compliance intelligence framework. Long-term aim: more transparent,
          scalable digital trade governance that supports operational and regulatory decision-making — with clarity on scope and
          limits. Narrative detail lives on{" "}
          <Link href="/research" className="font-medium text-foreground underline-offset-4 hover:underline">
            Research
          </Link>
          .
        </p>
        <ul className="mt-6 space-y-2.5 text-[15px] text-foreground/95">
          {RESEARCH_DIRECTION.map((line) => (
            <li key={line} className="flex gap-2">
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[color-mix(in_oklch,var(--home-accent)_72%,transparent)]"
                aria-hidden
              />
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* Philosophy */}
      <section className="max-w-3xl rounded-xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_28%,var(--background))] p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Platform philosophy</h2>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-foreground/95">
          AI that supports governance and compliance should favour transparency, explainability, operational usability, and
          human oversight — not opaque automation.
        </p>
        <p className="mt-4 text-muted-foreground">
          The emphasis is predictive and evidential: visible reasoning, clear workflows, and review support operators can act on
          — alongside model outputs, not hidden behind them.
        </p>
      </section>

      {/* Light-touch collaborators — no duplicate cards */}
      <section className="max-w-3xl border-t border-border/60 pt-12 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Collaborators &amp; industry:</span> named where publications, pilots, or
          mutual disclosures allow. Industrial partners validate integration and documentation paths through governed pilots —
          not speculative logos on this page.
        </p>
      </section>
    </MarketingArticleShell>
  );
}
