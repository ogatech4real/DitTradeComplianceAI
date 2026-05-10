"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";

interface RouteMeta {
  title: string;
  description?: string;
}

const ROUTES: Record<string, RouteMeta> = {
  "/": {
    title: "Operational intelligence workspace",
    description:
      "Executive posture, secure import, and immediate navigation into decision-grade surfaces.",
  },
  "/dashboard": {
    title: "Decision intelligence",
    description:
      "Exposure concentrations, rationale themes, governance quality, and review pressure in one coherent view.",
  },
  "/review": {
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
  const meta = ROUTES[pathname] ?? DEFAULT_META;

  return (
    <AppShell title={meta.title} description={meta.description}>
      {children}
    </AppShell>
  );
}
