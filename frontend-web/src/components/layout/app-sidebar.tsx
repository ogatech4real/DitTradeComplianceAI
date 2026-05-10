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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_130%_90%_at_50%_-20%,oklch(0.55_0.1_264_/_0.12),transparent_55%)]" />
      <div className="relative border-b border-sidebar-border/80 px-5 py-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Digital Trade
        </div>
        <div className="mt-1.5 font-[family-name:var(--font-heading)] text-[15px] font-semibold leading-tight tracking-tight">
          Compliance intelligence
        </div>
      </div>
      <nav className="relative flex flex-1 flex-col gap-6 overflow-y-auto p-3 pb-6">
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
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_1px_0_oklch(0_0_0_/0.05)] ring-1 ring-sidebar-ring/35"
                        : "text-muted-foreground hover:bg-sidebar-accent/65 hover:text-sidebar-accent-foreground",
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
