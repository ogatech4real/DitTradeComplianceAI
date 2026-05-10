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
    title: "Operational intelligence workspace",
    description:
      "Executive posture, secure import, and immediate navigation into decision-grade surfaces.",
  },
  [WORKSPACE_ROUTES.dashboard]: {
    title: "Decision intelligence",
    description:
      "Exposure concentrations, rationale themes, governance quality, and review pressure in one coherent view.",
  },
  [WORKSPACE_ROUTES.review]: {
    title: "Investigation workspace",
    description:
      "Prioritised declarations with severity context, narrative explainability, and disposition guidance.",
  },
};

const DEFAULT_META: RouteMeta = {
  title: "Digital Trade Compliance",
  description:
    "Production trade compliance intelligence for operators, supervisors, and control teams.",
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
