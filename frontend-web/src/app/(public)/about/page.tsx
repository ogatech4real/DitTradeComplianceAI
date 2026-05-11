import type { Metadata } from "next";
import Link from "next/link";

import { MarketingArticleShell } from "@/components/marketing/marketing-article-shell";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Digital Trade Compliance Intelligence — platform purpose, research & technical lead Adewale O., supervisor Michael Short, research direction, and philosophy.",
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

const MICHAEL_INTERESTS = [
  "Intelligent operational systems",
  "AI-driven analytics",
  "Digital trade ecosystems",
  "Applied machine learning",
  "Industrial informatics",
  "Governance-oriented intelligent technologies",
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
      description="AI-assisted operational intelligence for digital trade governance — explainable screening, fraud and batch signals, and jurisdiction-aware triage. Operations run in the workspace; this page introduces the programme, leadership, and design principles."
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
          It aligns with ICC Digital Trade Toolkit semantics and applies explainable AI in compliance orchestration, sustainability
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

      {/* Academic supervisor & collaborator */}
      <section className="grid gap-10 border-t border-border/60 pt-16 lg:grid-cols-12 lg:gap-12 lg:pt-20">
        <div className="flex justify-center lg:col-span-4 lg:justify-start">
          <div
            className="relative flex aspect-[3/4] w-full max-w-[240px] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-[color-mix(in_oklch,var(--home-accent)_35%,var(--border))] bg-[color-mix(in_oklch,var(--muted)_55%,var(--card))] px-4 text-center"
            aria-label="Portrait placeholder for Michael Short"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Portrait</span>
            <span className="text-sm font-medium text-foreground/80">Michael Short</span>
            <span className="max-w-[11rem] text-xs leading-relaxed text-muted-foreground">Photo forthcoming</span>
          </div>
        </div>
        <div className="lg:col-span-8">
          <h2 className="text-lg font-semibold text-foreground">Research supervisor &amp; academic collaborator</h2>
          <p className="mt-3 text-xl font-semibold text-foreground">Michael Short</p>
          <div className="mt-5 space-y-4 text-muted-foreground">
            <p>
              Academic researcher and supervisor working across intelligent systems, digital trade technologies, operational
              analytics, and applied artificial intelligence in complex industrial and governance settings.
            </p>
            <p>
              His research and supervisory input have helped shape the Digital Trade Compliance Intelligence platform toward
              explainable operational intelligence, ICC-aligned digital trade interoperability, and AI-assisted compliance
              governance.
            </p>
          </div>
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-[color-mix(in_oklch,var(--home-accent)_75%,var(--muted-foreground)_25%)]">
            Broader academic interests
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] text-foreground/95">
            {MICHAEL_INTERESTS.map((item) => (
              <li key={item} className="flex gap-2">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-[color-mix(in_oklch,var(--home-accent)_70%,transparent)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Direction — bullets from brief; link to research for narrative */}
      <section className="max-w-3xl">
        <h2 className="text-lg font-semibold text-foreground">Research direction</h2>
        <p className="mt-3 text-muted-foreground">
          The programme addresses enterprise operational compliance intelligence: transparent, scalable digital trade governance
          that supports operational and supervisory decision-making — with explicit scope boundaries. Full disclosure narrative on{" "}
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

      <section className="max-w-3xl border-t border-border/60 pt-12 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Further collaborators &amp; industry:</span> additional names are listed
          when publications, partner programmes, or mutual disclosures permit. Industrial validation follows agreed integration
          and documentation checkpoints — not speculative branding on this page.
        </p>
      </section>
    </MarketingArticleShell>
  );
}
