"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { PUBLIC_PLATFORM_MODULES } from "@/lib/public-platform-modules";
import { HeroExecutiveSurface } from "@/components/marketing/hero-executive-surface";
import { WorkspaceIntelligencePreview } from "@/components/marketing/workspace-intelligence-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WORKFLOW = [
  "Upload trade data",
  "Schema intelligence",
  "ICC transformation",
  "Hybrid compliance scoring",
  "Fraud & batch intelligence",
  "Explainability generation",
  "Review queue",
  "Governance decisions",
] as const;

export function PublicHomePage() {
  return (
    <>
      <HeroExecutiveSurface />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="public-kicker">Context</p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-[1.75rem]">
            Filings outpace <span className="text-gradient-home">manual review</span>
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Carbon-border rules, traceability claims, and digitised customs widen what must be read as one coherent dossier.
              Checking fields in isolation stops working at volume.
            </p>
            <p>
              The product front-loads intelligence: hybrid scoring surfaces posture, explainability supports escalation, and
              reviewers retain authority. The live system of record is the{" "}
              <Link href={WORKSPACE_ROUTES.home} className="font-medium text-foreground underline-offset-4 hover:underline">
                workspace
              </Link>
              ; this page is the executive overview.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-[color-mix(in_oklch,var(--card)_32%,var(--background))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="public-kicker">Capabilities</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-[1.75rem]">
              What the <span className="text-gradient-home">workspace</span> delivers
            </h2>
            <p className="mt-4 text-muted-foreground">
              Six production modules, delivered as one stack. Full capability breakdown on{" "}
              <Link href="/platform" className="font-medium text-foreground underline-offset-4 hover:underline">
                Platform
              </Link>
              .
            </p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PUBLIC_PLATFORM_MODULES.map((c, idx) => {
              const Primary = c.icon;
              const Secondary = c.secondaryIcon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-24px" }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className="rounded-xl border border-border/75 bg-[color-mix(in_oklch,var(--background)_52%,var(--card))] p-5 transition-colors hover:border-[color-mix(in_oklch,var(--home-accent)_35%,var(--border))]"
                >
                  <div className="flex items-center gap-2">
                    <Primary className="size-5 shrink-0 text-[color-mix(in_oklch,var(--home-accent)_88%,transparent)]" strokeWidth={1.5} aria-hidden />
                    {Secondary ? (
                      <Secondary className="size-4 shrink-0 text-muted-foreground opacity-80" strokeWidth={1.5} aria-hidden />
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold leading-snug text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10">
            <Link
              href="/platform"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-cta-outline rounded-lg px-6")}
            >
              Platform detail
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="public-kicker">Pipeline</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-[1.75rem]">
            From file to <span className="text-gradient-home">disposition</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Eight production stages from intake through disposition — executed end-to-end in the workspace.
          </p>
        </div>
        <div className="mt-10 max-w-3xl rounded-xl border border-border/70 bg-card/30 p-6 sm:p-8">
          <ol className="space-y-0">
            {WORKFLOW.map((step, idx) => (
              <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
                {idx < WORKFLOW.length - 1 ? (
                  <div className="absolute left-[14px] top-7 bottom-0 w-px home-rule opacity-80" aria-hidden />
                ) : null}
                <span className="relative z-[1] flex size-7 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-[11px] font-semibold text-foreground">
                  {idx + 1}
                </span>
                <span className="pt-0.5 text-[15px] font-semibold leading-snug text-foreground">{step}</span>
              </li>
            ))}
          </ol>
          <Link
            href={WORKSPACE_ROUTES.home}
            className={cn(
              buttonVariants({ variant: "link" }),
              "!px-0 mt-2 text-sm font-semibold text-[color-mix(in_oklch,var(--home-accent)_75%,var(--foreground)_25%)]",
            )}
          >
            Start in the workspace →
          </Link>
        </div>
      </section>

      <section className="border-t border-border/70 bg-[color-mix(in_oklch,var(--card)_24%,var(--background))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="public-kicker">Research</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-[1.75rem]">
              Research &amp; <span className="text-gradient-home">assurance</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Methodology, interoperability stance, and governance disclosures are documented on{" "}
              <Link href="/research" className="font-medium text-foreground underline-offset-4 hover:underline">
                Research
              </Link>{" "}
              and in release materials — aligned with what the shipped product does today.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/research" className={cn(buttonVariants({ size: "lg" }), "home-cta-primary rounded-lg px-6")}>
                Research
              </Link>
              <Link
                href="https://github.com/ogatech4real/DitTradeComplianceAI"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-cta-outline rounded-lg px-6")}
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WorkspaceIntelligencePreview home />

      <section className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-6 rounded-xl border border-border/70 bg-card/25 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="max-w-2xl">
              <p className="public-kicker">People &amp; context</p>
              <p className="mt-2 text-foreground">
                Lead, collaborators, and philosophy — on{" "}
                <Link href="/about" className="font-medium underline-offset-4 hover:underline">
                  About
                </Link>
                .
              </p>
            </div>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-cta-outline shrink-0 rounded-lg px-6")}
            >
              About
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
