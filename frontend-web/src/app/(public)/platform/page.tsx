import type { Metadata } from "next";
import Link from "next/link";

import { MarketingArticleShell } from "@/components/marketing/marketing-article-shell";
import { PUBLIC_PLATFORM_MODULES } from "@/lib/public-platform-modules";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Platform capabilities",
  description:
    "Production capability modules for digital trade compliance: ICC-aligned data, hybrid scoring, fraud and batch intelligence, explainability, jurisdiction-aware review, and operational risk posture.",
};

export default function PlatformCapabilitiesPage() {
  return (
    <MarketingArticleShell
      kicker="Platform"
      title="Six integrated modules"
      description="Each module ships in the live workspace: hybrid rules and models, fraud and cohort intelligence, explainable outputs, and human-led disposition. The platform assists compliance operations; it does not issue certificates or replace legal or regulatory judgment."
      actions={
        <>
          <Link
            href={WORKSPACE_ROUTES.home}
            className={cn(buttonVariants({ size: "lg" }), "home-cta-primary rounded-lg px-8")}
          >
            Open workspace
          </Link>
          <Link
            href="/research"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-cta-outline rounded-lg px-8")}
          >
            Research
          </Link>
        </>
      }
      headerAside={
        <div className="space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Operating Model</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            ICC-aligned digital trade semantics, auditable operational review workflows, and versioned API-driven integration
            architecture deployed under organisation-controlled governance and data residency policies.
          </p>
          <ul className="space-y-2 border-t border-border/50 pt-5 text-[13px] text-foreground/90">
            <li className="flex gap-2">
              <span className="text-[color-mix(in_oklch,var(--home-accent)_85%,transparent)]" aria-hidden>
                ·
              </span>
              Built around human oversight
            </li>
            <li className="flex gap-2">
              <span className="text-[color-mix(in_oklch,var(--home-accent)_85%,transparent)]" aria-hidden>
                ·
              </span>
              Explainable operational intelligence
            </li>
            <li className="flex gap-2">
              <span className="text-[color-mix(in_oklch,var(--home-accent)_85%,transparent)]" aria-hidden>
                ·
              </span>
              Evidence-driven compliance analytics
            </li>
            <li className="flex gap-2">
              <span className="text-[color-mix(in_oklch,var(--home-accent)_85%,transparent)]" aria-hidden>
                ·
              </span>
              Interoperable and standards-aligned
            </li>
          </ul>
        </div>
      }
      contentClassName="space-y-0"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PUBLIC_PLATFORM_MODULES.map((c) => {
          const Icon = c.icon;
          const Secondary = c.secondaryIcon;
          return (
            <div
              key={c.title}
              className="rounded-xl border border-border/75 bg-[color-mix(in_oklch,var(--background)_52%,var(--card))] p-5 transition-colors hover:border-[color-mix(in_oklch,var(--home-accent)_35%,var(--border))]"
            >
              <div className="flex items-center gap-2">
                <Icon className="size-5 text-[color-mix(in_oklch,var(--home-accent)_88%,transparent)]" strokeWidth={1.5} aria-hidden />
                {Secondary ? (
                  <Secondary className="size-4 text-muted-foreground opacity-80" strokeWidth={1.5} aria-hidden />
                ) : null}
              </div>
              <h2 className="mt-3 text-[15px] font-semibold leading-snug">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-12 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Technical specifications, integration guides, and API contracts are maintained in the repository and product documentation
        alongside each release.
      </p>
    </MarketingArticleShell>
  );
}
