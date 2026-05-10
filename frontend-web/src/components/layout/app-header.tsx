"use client";

import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { ConnectionBadge } from "@/components/layout/connection-badge";

interface AppHeaderProps {
  title: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[color-mix(in_oklch,var(--home-accent)_22%,var(--border))] bg-[color-mix(in_oklch,var(--background)_88%,transparent)] shadow-[0_16px_40px_-32px_color-mix(in_oklch,var(--home-accent)_32%,transparent)] backdrop-blur-2xl">
      <div
        className="h-[3px] w-full bg-[linear-gradient(90deg,var(--home-accent-deep),var(--home-accent),color-mix(in_oklch,var(--home-accent)_65%,oklch(0.72_0.1_85)_35%))]"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-start gap-3">
          <MobileNavSheet />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-[1.38rem]">
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
