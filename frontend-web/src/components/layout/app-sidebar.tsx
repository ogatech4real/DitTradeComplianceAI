"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navSections } from "@/components/layout/nav-config";
import { isWorkspaceNavActive } from "@/lib/nav-active";
import { WORKSPACE_APP_VERSION_LABEL } from "@/lib/workspace-chrome";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { WorkflowStatusRail } from "@/components/workflow/workflow-status-rail";

export function AppSidebar() {
  const pathname = usePathname();
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const showWorkflowRail =
    path === WORKSPACE_ROUTES.home ||
    path === WORKSPACE_ROUTES.dashboard;

  return (
    <aside
      className={cn(
        "relative hidden min-h-0 shrink-0 flex-col overflow-hidden border-r border-border/70 bg-sidebar/95 text-sidebar-foreground backdrop-blur-md md:flex md:w-[17rem] lg:w-[17.75rem]",
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
      <div className="relative flex min-h-0 flex-1 flex-col">
        <nav className="relative min-h-0 flex flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-3 py-4">
          {navSections.map((section) => (
            <div key={section.heading}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/90">
                {section.heading}
              </p>
              <div className="flex flex-col gap-px">
                {section.items.map((item) => {
                  const active = isWorkspaceNavActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-start gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium leading-snug transition-all duration-200",
                        active
                          ? "bg-[color-mix(in_oklch,var(--home-accent)_16%,var(--sidebar))] text-foreground shadow-sm ring-2 ring-[color-mix(in_oklch,var(--home-accent)_35%,transparent)]"
                          : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "mt-0.5 size-[17px] shrink-0 opacity-80 transition-opacity",
                          active
                            ? "text-[color-mix(in_oklch,var(--home-accent)_85%,var(--foreground)_15%)] opacity-100"
                            : "group-hover:opacity-100",
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0 leading-snug">
                        <span className="block">{item.label}</span>
                        {item.hint ? (
                          <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground/85">
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

        {showWorkflowRail ? (
          <section className="relative shrink-0 border-t border-sidebar-border/75 px-3 py-3" aria-label="Screening workflow progress">
            <WorkflowStatusRail placement="sidebar" />
          </section>
        ) : null}
      </div>
      <div className="relative shrink-0 border-t border-sidebar-border/70 px-5 py-3">
        <p
          className="border-l-2 border-[color-mix(in_oklch,var(--home-accent)_42%,transparent)] pl-3 text-[10px] font-medium leading-snug tracking-wide text-muted-foreground"
          aria-label="Software version"
        >
          {WORKSPACE_APP_VERSION_LABEL}
        </p>
      </div>
    </aside>
  );
}
