"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
] as const;

export function MarketingHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-[var(--marketing-canvas)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-[15px] font-semibold tracking-tight text-foreground"
        >
          Digital Trade Compliance<span className="text-muted-foreground"> AI</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-muted/70 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={WORKSPACE_ROUTES.home}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "hidden md:inline-flex",
            })}
          >
            Launch workspace
          </Link>
          <Link
            href={WORKSPACE_ROUTES.home}
            className={buttonVariants({
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            Operational console
          </Link>
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
            <SheetContent side="right" className="w-[min(100vw,20rem)] gap-6">
              <SheetHeader className="text-left">
                <SheetTitle className="text-base font-semibold">Navigate</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1">
                <Link href="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">
                  Home
                </Link>
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="my-3 border-border/60" />
                <Link
                  href={WORKSPACE_ROUTES.home}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary px-3 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-primary/92"
                >
                  Launch workspace
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
