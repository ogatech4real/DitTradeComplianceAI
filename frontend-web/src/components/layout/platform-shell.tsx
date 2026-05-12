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
    description: "Current screening posture and where to upload the next declarations file.",
  },
  [WORKSPACE_ROUTES.dashboard]: {
    title: "Results dashboard",
    description: "Cohort summaries, charts, and review handoff.",
  },
  [WORKSPACE_ROUTES.review]: {
    title: "Review queue",
    description: "Prioritised declarations with severity, rationale, and per-record detail.",
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
