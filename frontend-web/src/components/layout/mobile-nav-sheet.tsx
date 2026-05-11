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
      <SheetContent
        side="left"
        className="workspace-app public-site dark marketing-warm w-[min(100vw,20rem)] border-border/60 bg-background p-0 text-foreground"
      >
        <SheetHeader className="border-b border-border/60 px-4 py-3 text-left">
          <SheetTitle className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Digital Trade
          </SheetTitle>
          <p className="text-base font-semibold leading-tight">
            <span className="text-gradient-home">Compliance intelligence</span>
          </p>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3">
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
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
                    ? "bg-[color-mix(in_oklch,var(--home-accent)_14%,var(--accent))] text-foreground ring-1 ring-[color-mix(in_oklch,var(--home-accent)_35%,transparent)]"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
