import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { WorkspaceAtmosphere } from "@/components/layout/workspace-atmosphere";

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
    <div className="workspace-app relative flex min-h-dvh overflow-hidden bg-background">
      <WorkspaceAtmosphere />
      <AppSidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <AppHeader title={title} description={description} />
        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
