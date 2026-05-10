"use client";

import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { ConnectionBadge } from "@/components/layout/connection-badge";

interface AppHeaderProps {
  title: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <MobileNavSheet />
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
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
