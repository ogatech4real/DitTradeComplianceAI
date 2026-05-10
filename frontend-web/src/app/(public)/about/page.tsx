import type { Metadata } from "next";
import Link from "next/link";

import { MarketingArticleShell } from "@/components/marketing/marketing-article-shell";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About & institutional context",
  description:
    "Stewardship model for Digital Trade Compliance AI — research collaboration, engineering leadership, industrial validation, without speculative affiliation claims.",
};

const STEWARDSHIP = [
  {
    title: "Principal research & engineering lead",
    body: "Responsible for hybrid screening architecture, API contract coherence, ICC-aligned data pathways, and the operational UX governing investigations.",
  },
  {
    title: "Research collaborators",
    body: "Academic collaborators are acknowledged alongside peer-reviewed artefacts and interoperability studies. Naming follows publication cadence rather than marketing bios.",
  },
  {
    title: "Industrial contributors",
    body: "Partner organisations participate through governed pilots validating integration assumptions, escalation flows, and documentation sufficiency.",
  },
  {
    title: "Institutional context",
    body: "The initiative positions itself at the intersection of global trade digitisation and responsible automation — aligning engineering disclosure with supervisory duties.",
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingArticleShell
      kicker="Institutional presentation"
      title={
        <>
          Stewardship anchored in <span className="text-gradient-brand">verifiable</span> artefacts
        </>
      }
      description={
        <>
          Public references emphasise corroborating materials — publications, release notes, and repository governance —
          avoiding speculative uptake statistics or embellished deployment guarantees.
        </>
      }
      headerAside={
        <div className="space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Collaboration</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Funding bodies, supervisory innovation labs, and industrial consortia align through documented evaluation protocols.
            Sensitive engagements stay off public pages until disclosures are mutually agreed.
          </p>
          <div className="flex flex-col gap-3 border-t border-border/50 pt-5">
            <Link
              href="https://github.com/ogatech4real/DitTradeComplianceAI"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", className: "w-full justify-center rounded-lg" })}
            >
              Repository stewardship
            </Link>
            <Link
              href={WORKSPACE_ROUTES.home}
              className={buttonVariants({ className: "w-full justify-center rounded-lg" })}
            >
              Operational workspace
            </Link>
          </div>
        </div>
      }
      contentClassName="space-y-0"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-7">
          {STEWARDSHIP.map((role) => (
            <section
              key={role.title}
              className="rounded-2xl border border-border/80 bg-[color-mix(in_oklch,var(--background)_48%,var(--card))] p-8"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold leading-snug">{role.title}</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">{role.body}</p>
            </section>
          ))}
        </div>
        <aside className="lg:col-span-5">
          <div className="sticky top-28 space-y-8 rounded-2xl border border-dashed border-border/60 bg-[color-mix(in_oklch,var(--card)_30%,var(--background))] p-8">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">Diligence-oriented entry points</h2>
              <ul className="mt-6 space-y-5 text-[14px] leading-relaxed text-muted-foreground">
                <li>Institutional diligence packages pair engineering diagrams with qualitative explainability artefacts.</li>
                <li>Repository milestones capture reproducible scaffolding for hybrid screening experiments.</li>
                <li>Workspace onboarding clarifies confidentiality boundaries governing live filings.</li>
              </ul>
            </div>
            <p className="border-t border-border/50 pt-6 text-xs leading-relaxed text-muted-foreground">
              This public site is the institutional front door; the workspace remains the venue for operational screening and
              disposition.
            </p>
          </div>
        </aside>
      </div>
    </MarketingArticleShell>
  );
}
