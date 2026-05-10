"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";

interface RouteMeta {
  title: string;
  description?: string;
}

const ROUTES: Record<string, RouteMeta> = {
  "/dashboard": {
    title: "Operator dashboard",
    description:
      "Cross-signal compliance posture, intelligence cards, and workflow architecture.",
  },
  "/upload": {
    title: "Upload workspace",
    description:
      "Dataset intake staging for ICC-aligned transformation and downstream screening.",
  },
  "/review-queue": {
    title: "Review queue",
    description:
      "Prioritised operational triage shell — binds to priority_review_queue next.",
  },
};

const DEFAULT_META: RouteMeta = {
  title: "Digital Trade Compliance AI",
  description: "Enterprise compliance intelligence platform.",
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
