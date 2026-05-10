"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navSections } from "@/components/layout/nav-config";
import { isWorkspaceNavActive } from "@/lib/nav-active";
import { PublicPlatformMiniNav } from "@/components/layout/public-platform-mini-nav";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative hidden shrink-0 flex-col overflow-hidden border-r border-[color-mix(in_oklch,var(--primary)_35%,transparent)] bg-[linear-gradient(175deg,color-mix(in_oklch,var(--sidebar)_98%,transparent),color-mix(in_oklch,var(--sidebar)_82%,transparent))] text-sidebar-foreground shadow-[4px_0_48px_-18px_color-mix(in_oklch,var(--primary)_42%,transparent),inset_-1px_0_0_color-mix(in_oklch,white_6%,transparent)] backdrop-blur-xl md:flex md:w-[15.75rem] lg:w-[17rem]",
      )}
      aria-label="Primary navigation"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_40%_-12%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 animate-sidebar-shimmer opacity-[0.55]" aria-hidden />
      <div className="relative border-b border-sidebar-border/80 px-5 py-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80">
          Digital Trade
        </div>
        <div className="mt-1.5 bg-[linear-gradient(92deg,var(--foreground),color-mix(in_oklch,var(--primary)_72%,transparent),color-mix(in_oklch,var(--brand-secondary)_92%,transparent))] bg-clip-text font-[family-name:var(--font-heading)] text-[15px] font-semibold leading-tight tracking-tight text-transparent">
          Compliance intelligence
        </div>
      </div>
      <PublicPlatformMiniNav />
      <nav className="relative flex flex-1 flex-col gap-6 overflow-y-auto p-3 pb-6 pt-5">
        {navSections.map((section) => (
          <div key={section.heading}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/90">
              {section.heading}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isWorkspaceNavActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                      active
                        ? "bg-[linear-gradient(115deg,color-mix(in_oklch,var(--primary)_52%,transparent),color-mix(in_oklch,var(--brand-secondary-soft)_74%,transparent))] text-sidebar-primary-foreground shadow-[0_0_28px_-8px_color-mix(in_oklch,var(--primary)_55%,transparent)] ring-2 ring-[color-mix(in_oklch,var(--brand-secondary)_58%,transparent)]"
                        : "text-muted-foreground hover:bg-sidebar-accent/90 hover:text-sidebar-accent-foreground hover:shadow-[0_0_22px_-10px_color-mix(in_oklch,var(--primary)_35%,transparent)] hover:ring-1 hover:ring-[color-mix(in_oklch,var(--primary)_35%,transparent)]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "mt-0.5 size-[17px] shrink-0 opacity-80 transition-opacity",
                        active ? "opacity-100" : "group-hover:opacity-100",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 leading-snug">
                      <span className="block">{item.label}</span>
                      {item.hint ? (
                        <span className="mt-0.5 block text-[11px] font-normal opacity-75">
                          {item.hint}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="relative space-y-3 border-t border-sidebar-border/70 p-4 text-[11px] leading-relaxed text-muted-foreground">
        <p>
          Session-linked screening outputs. Navigation reflects your active compliance intelligence run.
        </p>
        <Link href="/" className="inline-flex font-medium text-primary underline-offset-4 hover:underline">
          Back to institutional site →
        </Link>
      </div>
    </aside>
  );
}
