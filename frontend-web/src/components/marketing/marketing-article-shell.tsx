import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface MarketingArticleShellProps {
  /** Short uppercase-style section label (uses `public-kicker`). */
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  /** Right column on large screens — meta, quick facts, or secondary CTAs. */
  headerAside?: ReactNode;
  /** Primary actions below the description (left column). */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Extra classes on the main content wrapper below the header. */
  contentClassName?: string;
}

/**
 * Shared chrome for public article routes: consistent width, asymmetric header, institutional rhythm.
 * Assumes parent `(public)` layout (`.public-site` tokens).
 */
export function MarketingArticleShell({
  kicker,
  title,
  description,
  headerAside,
  actions,
  children,
  className,
  contentClassName,
}: MarketingArticleShellProps) {
  return (
    <article className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--primary)_55%,transparent),transparent)]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-border/60 pb-12 pt-6 lg:pb-16 lg:pt-10">
          <div
            className={cn(
              "grid gap-10 lg:gap-12",
              headerAside ? "lg:grid-cols-12 lg:items-start" : "",
            )}
          >
            <div className={cn(headerAside ? "lg:col-span-7 xl:col-span-8" : "max-w-3xl")}>
              <p className="public-kicker">{kicker}</p>
              <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[clamp(1.85rem,3.8vw,2.75rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
                {title}
              </h1>
              {description ? (
                <div className="mt-6 text-[1.0625rem] leading-relaxed text-muted-foreground">{description}</div>
              ) : null}
              {actions ? <div className="mt-10 flex flex-wrap gap-3">{actions}</div> : null}
            </div>
            {headerAside ? (
              <div className="flex flex-col gap-6 border-border/50 lg:col-span-5 xl:col-span-4 lg:border-l lg:pl-10 lg:pt-1">
                {headerAside}
              </div>
            ) : null}
          </div>
        </header>

        <div className={cn("pb-24 pt-14 lg:pb-32 lg:pt-20", contentClassName)}>{children}</div>
      </div>
    </article>
  );
}

/** Bottom-of-page institutional callout band (matches public marketing surfaces). */
export function MarketingArticleCtaBand({
  body,
  actions,
  className,
}: {
  body: ReactNode;
  actions: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-[color-mix(in_oklch,var(--card)_42%,var(--background))] p-8 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-10",
        className,
      )}
    >
      <div className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{body}</div>
      <div className="mt-8 flex shrink-0 flex-wrap gap-3 lg:mt-0">{actions}</div>
    </div>
  );
}
