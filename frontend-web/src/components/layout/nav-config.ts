import { LayoutDashboard, Layers, ListChecks } from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

export interface NavItem {
  href: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
}

export interface NavSection {
  heading: string;
  items: NavItem[];
}

/** Workspace routes grouped by job: run the pipeline vs triage review. */
export const navSections: NavSection[] = [
  {
    heading: "Workspace",
    items: [
      {
        href: WORKSPACE_ROUTES.home,
        label: "Overview & import",
        hint: "Executive surface, workflow, intake",
        icon: Layers,
      },
      {
        href: WORKSPACE_ROUTES.dashboard,
        label: "Decision dashboard",
        hint: "Posture, themes, exposure",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    heading: "Review",
    items: [
      {
        href: WORKSPACE_ROUTES.review,
        label: "Review queue",
        hint: "Prioritised cases & explainability",
        icon: ListChecks,
      },
    ],
  },
];

/** Flattened primary destinations for mobile sheet */
export const mainNavItems: NavItem[] = navSections.flatMap((s) => s.items);
