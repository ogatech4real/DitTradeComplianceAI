"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

export function EmptyDecisionState(opts: {
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="operational-surface rounded-2xl border border-dashed border-border/80 p-12 text-center">
      <p className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
        No screened cohort yet
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {opts.message ??
          "Import a declarations file from the workspace overview, or enable demo/sample data via your deployment environment if available."}
      </p>
      <Link
        href={opts.ctaHref ?? WORKSPACE_ROUTES.home}
        className={buttonVariants({ className: "mt-8" })}
      >
        {opts.ctaLabel ?? "Back to overview"}
      </Link>
    </div>
  );
}
