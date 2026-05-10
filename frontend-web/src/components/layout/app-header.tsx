"use client";

import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { ConnectionBadge } from "@/components/layout/connection-badge";

interface AppHeaderProps {
  title: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-[color-mix(in_oklch,var(--primary)_42%,transparent)] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_58%,transparent),color-mix(in_oklch,var(--background)_92%,transparent))] shadow-[0_20px_48px_-28px_color-mix(in_oklch,var(--primary)_38%,transparent)] ring-1 ring-[color-mix(in_oklch,var(--brand-secondary)_24%,transparent)] backdrop-blur-2xl">
      <div
        className="animate-ai-header-shimmer relative h-[3px] w-full bg-[linear-gradient(90deg,var(--primary),var(--brand-secondary),var(--brand-tertiary),var(--primary))] bg-[length:200%_100%]"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-start gap-3">
          <MobileNavSheet />
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[color-mix(in_oklch,var(--foreground)_88%,var(--primary)_12%)] sm:text-[1.38rem]">
              {title}
            </h1>
            {description ? (
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <ConnectionBadge />
      </div>
    </header>
  );
}
