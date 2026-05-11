"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PUBLIC_SITE_LINKS } from "@/lib/public-site-links";
import { cn } from "@/lib/utils";

function linkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Horizontal links to marketing pages — lives in the workspace header strip.
 */
export function WorkspaceSiteNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 border-b border-border/35 bg-[color-mix(in_oklch,var(--background)_92%,transparent)] px-4 py-2 text-[13px] font-medium backdrop-blur-md sm:px-6 lg:px-10"
      aria-label="Marketing pages"
    >
      {PUBLIC_SITE_LINKS.map((item) => {
        const active = linkActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 transition-colors hover:text-foreground",
              active
                ? "text-[color-mix(in_oklch,var(--home-accent)_82%,var(--foreground)_18%)]"
                : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
