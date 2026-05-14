import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { PUBLIC_GITHUB_REPOSITORY_URL } from "@/lib/public-site-links";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

const PLATFORM = [
  { href: "/", label: "Home" },
  { href: "/platform", label: "Platform capabilities" },
  { href: "/research", label: "Research & innovation" },
];

const OPERATIONS = [{ href: WORKSPACE_ROUTES.home, label: "Operational workspace" }];

const EXTERNAL = [
  {
    href: PUBLIC_GITHUB_REPOSITORY_URL,
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
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Digital Trade <span className="text-gradient-home">Compliance Intelligence</span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Public platform for Digital Trade Compliance Intelligence, providing explainable trade screening, operational
              compliance analytics, partner diligence support, and evidence-based compliance intelligence workflows.
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              This platform is intended for operational decision support and research demonstration purposes only and does not
              constitute legal, regulatory, or jurisdiction-specific compliance advice.
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
        <p className="mt-14 border-t border-border/70 pt-8 text-center text-[11px] leading-relaxed text-muted-foreground lg:text-left">
          © 2026 ICC Digital Trade Toolkit alignment
        </p>
      </div>
    </footer>
  );
}
