import type { Metadata } from "next";
import Link from "next/link";

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
    <article className="mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-6 lg:px-8 lg:pb-36 lg:pt-16">
      <header className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">Institutional presentation</p>
        <h1 className="mt-5 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-[2.35rem]">
          Stewardship anchored in verifiable artefacts
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground lg:mx-0">
          Public references emphasise corroborating materials — publications, release notes, and repository governance —
          avoiding speculative uptake statistics or embellished deployment guarantees.
        </p>
      </header>
      <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-2">
        <div className="space-y-8">
          {STEWARDSHIP.map((role) => (
            <section key={role.title} className="rounded-3xl border border-border/70 bg-card/95 p-8 shadow-xl">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">{role.title}</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">{role.body}</p>
            </section>
          ))}
        </div>
        <aside className="flex flex-col rounded-3xl border border-dashed border-border/70 bg-muted/40 p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">Collaboration entry points</h2>
          <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
            Funding bodies, supervisory innovation labs, and industrial consortia are invited to align through documented
            evaluation protocols. Sensitive engagements remain off public pages until disclosures are mutually agreed.
          </p>
          <ul className="mt-10 space-y-6 text-[14px] leading-relaxed text-muted-foreground">
            <li>• Institutional diligence packages pair engineering diagrams with qualitative explainability artefacts.</li>
            <li>• Repository milestones capture reproducible scaffolding for hybrid screening experiments.</li>
            <li>• Workspace onboarding clarifies confidentiality boundaries governing live filings.</li>
          </ul>
          <Link
            href="https://github.com/ogatech4real/DitTradeComplianceAI"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
              className: "mt-auto rounded-xl",
            })}
          >
            View repository stewardship
          </Link>
          <Link
            href={WORKSPACE_ROUTES.home}
            className={buttonVariants({
              variant: "secondary",
              className: "mt-4 rounded-xl",
            })}
          >
            Access operational workspace
          </Link>
        </aside>
      </div>
    </article>
  );
}
