import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

const PRODUCT = [
  { href: "/", label: "Home" },
  { href: "/platform", label: "Platform capabilities" },
  { href: "/research", label: "Research & innovation" },
];

const OPS = [{ href: WORKSPACE_ROUTES.home, label: "Operational workspace" }];

const EXTERNAL = [
  {
    href: "https://github.com/ogatech4real/DitTradeComplianceAI",
    label: "GitHub repository",
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative mt-auto">
      <div
        className="h-[3px] w-full bg-[linear-gradient(90deg,var(--brand-tertiary),var(--primary),var(--brand-secondary))]"
        aria-hidden
      />
      <div className="border-t border-[color-mix(in_oklch,var(--brand-secondary)_24%,var(--border))] bg-[linear-gradient(178deg,color-mix(in_oklch,var(--brand-secondary)_10%,transparent),color-mix(in_oklch,var(--muted)_88%,transparent))]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="text-gradient-brand font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight">
              Digital Trade Compliance AI
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              AI-assisted screening, hybrid intelligence orchestration, and explainable governance signals for digitally integrated
              trade ecosystems.
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              For partnership, evaluation, or research collaboration, reach out through institutional channels cited in{" "}
              <Link href="/about" className="font-semibold text-primary underline-offset-4 hover:text-[color-mix(in_oklch,var(--primary)_82%,var(--brand-secondary)_18%)] hover:underline">
                About
              </Link>{" "}
              and the GitHub organisation.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
                Platform
              </h3>
              <ul className="mt-4 space-y-2.5">
                {PRODUCT.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-[color-mix(in_oklch,var(--foreground)_74%,var(--brand-secondary)_26%)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
                Operational access
              </h3>
              <ul className="mt-4 space-y-2.5">
                {OPS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
                Repository
              </h3>
              <ul className="mt-4 space-y-2.5">
                {EXTERNAL.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-[color-mix(in_oklch,var(--brand-secondary)_75%,white)]"
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
        <div className="border-t border-border/55 bg-[color-mix(in_oklch,var(--marketing-canvas)_70%,transparent)] py-7 text-center text-[11px] leading-relaxed text-muted-foreground">
          Institutional presentation aligned with ICC Digital Toolkit positioning for interoperable trade data — not legal advice
          or jurisdictional certification.
        </div>
      </div>
    </footer>
  );
}
