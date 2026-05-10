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
    <header className="sticky top-0 z-50 shadow-[0_12px_40px_-28px_color-mix(in_oklch,var(--primary)_40%,transparent)]">
      <div
        className="h-1 w-full bg-[linear-gradient(90deg,var(--primary),color-mix(in_oklch,var(--primary)_30%,var(--brand-secondary)_70%),var(--brand-tertiary))]"
        aria-hidden
      />
      <div className="border-b border-[color-mix(in_oklch,var(--brand-secondary)_22%,var(--border))] bg-[color-mix(in_oklch,var(--marketing-canvas)_92%,transparent)] backdrop-blur-2xl">
        <motion.div
          className="mx-auto flex h-[4.35rem] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0.9, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="flex flex-col gap-0.5">
            <span className="font-[family-name:var(--font-heading)] text-[15px] font-semibold tracking-tight text-foreground">
              Digital Trade
            </span>
            <span className="text-gradient-brand text-[13px] font-semibold leading-none">
              Compliance AI
            </span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Site sections">
            <Link
              href="/"
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-semibold transition-all",
                pathname === "/" || pathname === ""
                  ? "bg-primary text-primary-foreground shadow-md shadow-[color-mix(in_oklch,var(--brand-secondary)_38%,transparent)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
                    "rounded-xl px-3.5 py-2 text-sm font-semibold transition-all",
                    active
                      ? "bg-[linear-gradient(125deg,color-mix(in_oklch,var(--primary)_15%,transparent),color-mix(in_oklch,var(--brand-secondary)_22%,transparent))] text-primary ring-2 ring-primary/35 shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground hover:ring-1 hover:ring-[color-mix(in_oklch,var(--brand-secondary)_35%,transparent)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href={WORKSPACE_ROUTES.home}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "hidden md:inline-flex rounded-xl px-4 font-semibold",
              })}
            >
              Launch workspace
            </Link>
            <Link
              href={WORKSPACE_ROUTES.home}
              className={buttonVariants({
                size: "sm",
                className: "hidden sm:inline-flex rounded-xl px-4 font-semibold",
              })}
            >
              Workspace
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                nativeButton={false}
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="rounded-xl md:hidden"
                    aria-label="Open navigation"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100vw,20rem)] gap-6 border-[color-mix(in_oklch,var(--brand-secondary)_30%,transparent)]">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-base font-semibold">Navigate</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm font-semibold",
                      pathname === "/" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    Home
                  </Link>
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted"
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
                        className: "w-full rounded-xl justify-center font-semibold",
                      }),
                    )}
                  >
                    Launch workspace
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
