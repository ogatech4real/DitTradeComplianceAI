import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { WorkspaceAtmosphere } from "@/components/layout/workspace-atmosphere";
import { WORKSPACE_COPYRIGHT_FOOTER } from "@/lib/workspace-chrome";

interface AppShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AppShell({
  title,
  description,
  children,
}: AppShellProps) {
  return (
    <div className="workspace-app public-site dark marketing-warm relative flex min-h-dvh overflow-hidden bg-background text-foreground">
      <WorkspaceAtmosphere />
      <AppSidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <AppHeader title={title} description={description} />
        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
        <footer className="shrink-0 border-t border-border/50 px-4 py-3 sm:px-6 lg:px-10">
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground sm:text-left">
            {WORKSPACE_COPYRIGHT_FOOTER}
          </p>
        </footer>
      </div>
    </div>
  );
}
