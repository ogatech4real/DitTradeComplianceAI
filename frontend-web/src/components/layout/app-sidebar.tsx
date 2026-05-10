"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { mainNavItems } from "@/components/layout/nav-config";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-border bg-sidebar text-sidebar-foreground md:flex md:w-60 md:flex-col",
      )}
      aria-label="Primary navigation"
    >
      <div className="border-b border-sidebar-border px-5 py-4">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Digital Trade
        </div>
        <div className="font-semibold tracking-tight">Compliance AI</div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {mainNavItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4 text-[11px] leading-relaxed text-muted-foreground">
        Foundation build — orchestration-connected flows ship incrementally behind
        this shell.
      </div>
    </aside>
  );
}
