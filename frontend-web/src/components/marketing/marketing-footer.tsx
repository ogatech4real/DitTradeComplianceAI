import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

const PLATFORM = [
  { href: "/", label: "Home" },
  { href: "/platform", label: "Platform capabilities" },
  { href: "/research", label: "Research & innovation" },
  { href: "/about", label: "Authors & collaborators" },
];

const OPERATIONS = [{ href: WORKSPACE_ROUTES.home, label: "Operational workspace" }];

const EXTERNAL = [
  {
    href: "https://github.com/ogatech4real/DitTradeComplianceAI",
    label: "GitHub",
  },
];

const linkMuted =
  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

export function MarketingFooter() {
  return (
    <footer className="relative mt-auto border-t border-border/80 bg-[color-mix(in_oklch,var(--card)_55%,var(--background))]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-foreground">
              Digital Trade Compliance AI
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              A public institutional front for a research-grounded, AI-assisted operational intelligence workspace — built for
              explainable trade governance, partner diligence, and funding-ready disclosure without substituting legal or
              jurisdictional advice.
            </p>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Contact and collaboration paths are described on{" "}
              <Link href="/about" className="font-medium text-foreground underline-offset-4 hover:underline">
                About
              </Link>
              . Operational filings remain governed by your organisation&apos;s workspace policies.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="public-kicker text-foreground/90">Platform</h3>
              <ul className="mt-4 space-y-2.5">
                {PLATFORM.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkMuted}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="public-kicker text-foreground/90">Workspace</h3>
              <ul className="mt-4 space-y-2.5">
                {OPERATIONS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkMuted}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="public-kicker text-foreground/90">Repository</h3>
              <ul className="mt-4 space-y-2.5">
                {EXTERNAL.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 ${linkMuted}`}
                    >
                      {l.label}
                      <ExternalLink className="size-3.5 shrink-0 opacity-60" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 border-t border-border/70 pt-8 text-center text-[11px] leading-relaxed text-muted-foreground lg:text-left">
          ICC Digital Trade Toolkit alignment describes interoperable data discipline — not certification, clearance guarantees,
          or autonomous regulatory outcomes. The operational workspace remains the venue for live screening and disposition.
        </div>
      </div>
    </footer>
  );
}
