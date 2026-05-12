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

/** Adewale — woven summary + stack-style tags (from focus-area themes). */
const ADEWALE_FOCUS_SUMMARY =
  "Work bridges compliance and trade AI, operations and platforms, and analytics and energy: explainable, interoperable intelligence for the trade stack; industrial workflow orchestration with human-centred tooling; and sustainable analytics with energy-aware systems thinking.";

const ADEWALE_FOCUS_TAGS = [
  "AI-assisted compliance intelligence",
  "Digital trade interoperability",
  "Explainable AI systems",
  "Intelligent workflow orchestration",
  "Industrial AI & automation",
  "Human-centred operational tech",
  "Sustainable operational analytics",
  "Energy optimisation & sustainability",
] as const;

/** Michael — compact interests as prose + tags. */
const MICHAEL_INTEREST_SUMMARY =
  "Research spans intelligent operational systems, applied machine learning, and governance-oriented technology — with emphasis on digital trade ecosystems, industrial informatics, and analytics that support defensible decisions.";

const MICHAEL_INTEREST_TAGS = [
  "Intelligent operational systems",
  "AI-driven analytics",
  "Digital trade ecosystems",
  "Applied machine learning",
  "Industrial informatics",
  "Governance-oriented technology",
] as const;

function chipClass() {
  return cn(
    "inline-flex items-center rounded-md border border-border/60 bg-[color-mix(in_oklch,var(--card)_55%,var(--muted)_45%)] px-2 py-0.5 text-[11px] font-medium leading-snug text-foreground/90 shadow-[inset_0_1px_0_oklch(1_0_0_/0.04)]",
  );
}

function ProfileThumb({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <figure className="mx-auto shrink-0 sm:mx-0">
      <div
        className={cn(
          "overflow-hidden rounded-xl bg-muted ring-1 ring-border/55 shadow-sm",
          "h-20 w-20 sm:h-[5.25rem] sm:w-[5.25rem]",
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={128}
          height={128}
          priority={priority}
          className="size-full object-cover object-[center_12%]"
        />
      </div>
    </figure>
  );
}

function TagRow({ tags }: { tags: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {tags.map((t) => (
        <span key={t} className={chipClass()}>
          {t}
        </span>
      ))}
    </div>
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

      {/* Leadership — compact photo + wrapping prose + stacks */}
      <section className="space-y-10 border-t border-border/60 pt-12 lg:space-y-12 lg:pt-16">
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-foreground">Leadership</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Platform engineering with academic supervision and collaboration that inform direction and review posture.
          </p>
        </div>

        <article className="max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <ProfileThumb
              src="/about/adewale.png"
              alt="Adewale O., research and technical lead"
              priority
            />
            <div className="min-w-0 flex-1 space-y-3">
              <header>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color-mix(in_oklch,var(--home-accent)_72%,var(--muted-foreground)_28%)]">
                  Research &amp; technical lead
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Adewale O.</h3>
              </header>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Interdisciplinary researcher and engineer across applied AI, operational intelligence, instrumentation and control,
                  energy, and intelligent software — a decade-plus in industry (instrumentation, control, automation, infrastructure)
                  with a focus on deployable systems that combine explainability, governance, and scalable architecture.
                </p>
                <p className="text-foreground/90">
                  This platform extends that direction: trustworthy, explainable governance in modern digital ecosystems.
                </p>
                <p className="text-[13px] text-muted-foreground">{ADEWALE_FOCUS_SUMMARY}</p>
                <TagRow tags={ADEWALE_FOCUS_TAGS} />
              </div>
            </div>
          </div>
        </article>

        <article className="max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <ProfileThumb src="/about/michael.png" alt="Michael Short, research supervisor and academic collaborator" />
            <div className="min-w-0 flex-1 space-y-3">
              <header>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color-mix(in_oklch,var(--home-accent)_72%,var(--muted-foreground)_28%)]">
                  Research supervisor &amp; academic collaborator
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Michael Short</h3>
              </header>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Academic researcher and supervisor in intelligent systems, digital trade technologies, operational analytics, and
                  applied AI in industrial and governance settings — shaping this programme toward explainable operational
                  intelligence, ICC-aligned interoperability, and AI-assisted compliance workflows.
                </p>
                <p className="text-[13px] text-muted-foreground">{MICHAEL_INTEREST_SUMMARY}</p>
                <TagRow tags={MICHAEL_INTEREST_TAGS} />
              </div>
            </div>
          </div>
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
