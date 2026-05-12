import type { Metadata } from "next";
import Image from "next/image";
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

function PortraitFrame({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <figure className="relative mx-auto w-full max-w-[280px] shrink-0 lg:mx-0">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-[0_22px_56px_-28px_rgba(0,0,0,0.45)] ring-1 ring-border/55">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) min(90vw, 280px), 280px"
          className="object-cover object-[center_12%]"
        />
      </div>
    </figure>
  );
}

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

      {/* Leadership — alternating portrait layout */}
      <section className="space-y-14 border-t border-border/60 pt-14 lg:space-y-20 lg:pt-20">
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-foreground">Leadership</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Platform engineering sits alongside academic supervision and collaboration that inform the programme&apos;s direction
            and review posture.
          </p>
        </div>

        <article className="grid gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <PortraitFrame
            src="/about/adewale.png"
            alt="Adewale O., research and technical lead for Digital Trade Compliance Intelligence"
            priority
          />
          <div className="min-w-0 space-y-6">
            <header>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color-mix(in_oklch,var(--home-accent)_72%,var(--muted-foreground)_28%)]">
                Research &amp; technical lead
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Adewale O.</h3>
            </header>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Interdisciplinary researcher and engineer across applied AI, operational intelligence, instrumentation and control,
                energy systems, and intelligent software. Over a decade in industry — instrumentation, control, automation, and
                operational infrastructure — with a focus today on deployable systems that combine explainability, governance, and
                scalable architecture.
              </p>
              <p>
                This platform is part of a wider direction: trustworthy, explainable, operationally deployable governance in modern
                digital ecosystems.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_32%,var(--background))] p-5 sm:p-6">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Focus areas</h4>
              <ul className="mt-4 space-y-5">
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
        </article>

        <article className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:items-start lg:gap-12">
          <div className="min-w-0 space-y-6 lg:order-1">
            <header>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color-mix(in_oklch,var(--home-accent)_72%,var(--muted-foreground)_28%)]">
                Research supervisor &amp; academic collaborator
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Michael Short</h3>
            </header>
            <div className="space-y-4 text-muted-foreground">
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
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-[color-mix(in_oklch,var(--home-accent)_75%,var(--muted-foreground)_25%)]">
                Broader academic interests
              </h4>
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
          </div>
          <PortraitFrame
            src="/about/michael.png"
            alt="Michael Short, research supervisor and academic collaborator"
          />
        </article>
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
          AI that supports governance and compliance should favour transparency, explainability, operational usability, and human
          oversight — not opaque automation.
        </p>
        <p className="mt-4 text-muted-foreground">
          The emphasis is predictive and evidential: visible reasoning, clear workflows, and review support operators can act on —
          alongside model outputs, not hidden behind them.
        </p>
      </section>

      <section className="max-w-3xl border-t border-border/60 pt-12 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Further collaborators &amp; industry:</span> additional names are listed
          when publications, partner programmes, or mutual disclosures permit. Industrial validation follows agreed integration and
          documentation checkpoints — not speculative branding on this page.
        </p>
      </section>
    </MarketingArticleShell>
  );
}
