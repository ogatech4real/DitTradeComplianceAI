"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <motion.div
        className="mx-auto flex h-[4rem] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0.92, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/" className="group flex flex-col gap-0.5">
          <span className="font-[family-name:var(--font-heading)] text-[15px] font-semibold tracking-tight text-foreground">
            Digital Trade Compliance AI
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-foreground/90">
            Institutional platform
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Site sections">
          <Link
            href="/"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/" || pathname === ""
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Home
          </Link>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={WORKSPACE_ROUTES.home}
            className={cn(
              buttonVariants({
                size: "sm",
                className: "hidden rounded-lg px-4 font-semibold shadow-none sm:inline-flex",
              }),
              "home-cta-primary",
            )}
          >
            Launch workspace
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              nativeButton={false}
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="rounded-lg md:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,20rem)] gap-6 border-border/80">
              <SheetHeader className="text-left">
                <SheetTitle className="text-base font-semibold">Navigate</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium",
                    pathname === "/" ? "bg-muted text-foreground" : "hover:bg-muted",
                  )}
                >
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
                  className={cn(
                    buttonVariants({
                      size: "default",
                      className: "w-full justify-center rounded-lg font-semibold",
                    }),
                    "home-cta-primary",
                  )}
                >
                  Launch workspace
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </header>
  );
}
