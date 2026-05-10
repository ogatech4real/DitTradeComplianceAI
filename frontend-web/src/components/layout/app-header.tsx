"use client";

import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { ConnectionBadge } from "@/components/layout/connection-badge";

interface AppHeaderProps {
  title: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[color-mix(in_oklch,var(--brand-secondary)_18%,transparent)] bg-[color-mix(in_oklch,var(--background)_86%,transparent)] shadow-[0_16px_40px_-32px_color-mix(in_oklch,var(--primary)_45%,transparent)] backdrop-blur-2xl">
      <div
        className="h-[3px] w-full bg-[linear-gradient(90deg,var(--primary),color-mix(in_oklch,var(--brand-secondary)_82%,transparent),var(--brand-tertiary))]"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-start gap-3">
          <MobileNavSheet />
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[color-mix(in_oklch,var(--foreground)_94%,var(--primary)_6%)] sm:text-[1.38rem]">
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
