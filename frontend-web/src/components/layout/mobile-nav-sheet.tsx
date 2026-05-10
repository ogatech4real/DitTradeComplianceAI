"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { isWorkspaceNavActive } from "@/lib/nav-active";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PUBLIC_PLATFORM_LINKS } from "@/components/layout/public-platform-mini-nav";
import { mainNavItems } from "@/components/layout/nav-config";

export function MobileNavSheet() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        nativeButton={false}
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="md:hidden"
            aria-label="Open navigation"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(100vw,20rem)] p-0">
        <SheetHeader className="border-b px-4 py-3 text-left">
          <SheetTitle className="text-base font-semibold">
            Workspace
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3">
          {mainNavItems.map((item) => {
            const active = isWorkspaceNavActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
          <div className="mx-3 my-4 border-t border-[color-mix(in_oklch,var(--brand-secondary)_30%,transparent)] pt-4">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Public platform
            </p>
            {PUBLIC_PLATFORM_LINKS.map((item) => {
              const isHome = item.href === "/";
              const active = isHome
                ? pathname === "/" || pathname === ""
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "mx-3 flex rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors last:mb-2",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
