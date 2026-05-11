"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navSections } from "@/components/layout/nav-config";
import { isWorkspaceNavActive } from "@/lib/nav-active";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative hidden shrink-0 flex-col overflow-hidden border-r border-border/70 bg-sidebar/95 text-sidebar-foreground backdrop-blur-md md:flex md:w-[15.5rem] lg:w-[16.25rem]",
      )}
      aria-label="Primary navigation"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_130%_90%_at_50%_-20%,color-mix(in_oklch,var(--home-accent)_14%,transparent),transparent_58%)]" />
      <div className="relative border-b border-sidebar-border/80 px-5 py-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Digital Trade
        </div>
        <div className="mt-1.5 text-[15px] font-semibold leading-tight tracking-tight">
          <span className="text-gradient-home">Compliance intelligence</span>
        </div>
      </div>
      <nav className="relative flex flex-1 flex-col gap-6 overflow-y-auto p-3 pb-6 pt-4">
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
                        ? "bg-[color-mix(in_oklch,var(--home-accent)_16%,var(--sidebar))] text-foreground shadow-md shadow-[color-mix(in_oklch,var(--home-accent)_22%,transparent)] ring-2 ring-[color-mix(in_oklch,var(--home-accent)_38%,transparent)]"
                        : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:ring-1 hover:ring-[color-mix(in_oklch,var(--home-accent)_25%,transparent)]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "mt-0.5 size-[17px] shrink-0 opacity-80 transition-opacity",
                        active ? "text-[color-mix(in_oklch,var(--home-accent)_85%,var(--foreground)_15%)] opacity-100" : "group-hover:opacity-100",
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
      <div className="relative border-t border-sidebar-border/70 p-4 text-[11px] leading-relaxed text-muted-foreground">
        <p>Screening outputs and dashboard views apply to this browser session only unless your deployment wires persistent storage.</p>
      </div>
    </aside>
  );
}
