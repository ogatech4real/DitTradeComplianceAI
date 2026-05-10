"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const PUBLIC_PLATFORM_LINKS = [
  { href: "/", label: "Site overview" },
  { href: "/platform", label: "Platform" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
] as const;

/**
 * Persisted shortcuts to institutional pages inside the workspace shell.
 */
export function PublicPlatformMiniNav() {
  const pathname = usePathname();

  return (
    <div className="relative mx-2 mt-3 overflow-hidden rounded-2xl border border-[color-mix(in_oklch,var(--brand-secondary)_32%,var(--border))] bg-[linear-gradient(145deg,color-mix(in_oklch,var(--primary)_10%,transparent),color-mix(in_oklch,var(--brand-secondary)_12%,transparent))] p-3 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_110%_-20%,color-mix(in_oklch,var(--brand-secondary)_25%,transparent),transparent_55%)]" />
      <div className="relative">
        <p className="px-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
          Public platform
        </p>
        <nav className="mt-3 flex flex-col gap-1" aria-label="Institutional pages">
          {PUBLIC_PLATFORM_LINKS.map((item) => {
            const isHome = item.href === "/";
            const active = isHome
              ? pathname === "/" || pathname === ""
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-colors",
                  active
                    ? "bg-background/95 text-primary shadow-sm ring-1 ring-primary/35"
                    : "text-muted-foreground hover:bg-background/85 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
