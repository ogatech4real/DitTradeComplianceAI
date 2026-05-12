"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

interface RouteMeta {
  title: string;
  description?: string;
}

const ROUTES: Record<string, RouteMeta> = {
  [WORKSPACE_ROUTES.home]: {
    title: "Overview & import",
    description: "Upload your declarations file here. Open Results after screening for charts and summaries.",
  },
  [WORKSPACE_ROUTES.dashboard]: {
    title: "Results dashboard",
    description: "Summaries, charts, and quality signals from your latest completed screening.",
  },
  [WORKSPACE_ROUTES.review]: {
    title: "Review queue",
    description: "Declarations that need a closer look, with severity and notes.",
  },
};

const DEFAULT_META: RouteMeta = {
  title: "Digital Trade Compliance Intelligence",
  description: "Operational workspace for AI-assisted trade screening — human-led disposition.",
};

export function PlatformShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const path =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const meta = ROUTES[path] ?? DEFAULT_META;

  return (
    <AppShell title={meta.title} description={meta.description}>
      {children}
    </AppShell>
  );
}
