"use client";

import Link from "next/link";

import { ABOUT_PLATFORM_INTRO, RESEARCH_DIRECTION } from "@/lib/about-platform-content";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Programme overview previously on /about — placed immediately after the home hero.
 */
export function HomeAboutAfterHero() {
  return (
    <section
      id="about-the-platform"
      className="scroll-mt-[5.5rem] border-b border-border/70 bg-[color-mix(in_oklch,var(--card)_18%,var(--background))]"
      aria-labelledby="about-the-platform-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="max-w-3xl border-b border-border/50 pb-10">
          <p className="public-kicker">About the platform</p>
          <h2
            id="about-the-platform-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]"
          >
            Digital Trade <span className="text-gradient-home">Compliance intelligence</span>
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">{ABOUT_PLATFORM_INTRO}</p>
          <div className="mt-8 flex flex-wrap gap-3">
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
            <Link
              href="https://github.com/ogatech4real/DitTradeComplianceAI"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-cta-outline rounded-lg px-7")}
            >
              GitHub
            </Link>
          </div>
        </header>

        <div className="mt-12 space-y-14 lg:space-y-16">
          <div className="max-w-3xl space-y-4 text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground">What it is</h3>
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
          </div>

          <div className="max-w-3xl">
            <h3 className="text-lg font-semibold text-foreground">Research direction</h3>
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
          </div>

          <div className="max-w-3xl rounded-xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_28%,var(--background))] p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground">Platform philosophy</h3>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-foreground/95">
              AI that supports governance and compliance should favour transparency, explainability, operational usability, and human
              oversight — not opaque automation.
            </p>
            <p className="mt-4 text-muted-foreground">
              The emphasis is predictive and evidential: visible reasoning, clear workflows, and review support operators can act on —
              alongside model outputs, not hidden behind them.
            </p>
          </div>

          <div className="max-w-3xl border-t border-border/60 pt-10 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Further collaborators &amp; industry:</span> additional names are listed
              when publications, partner programmes, or mutual disclosures permit. Industrial validation follows agreed integration and
              documentation checkpoints — not speculative branding on this site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
