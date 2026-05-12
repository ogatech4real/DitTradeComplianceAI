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

/** Workspace routes: intake, results, queue. */
export const navSections: NavSection[] = [
  {
    heading: "Operate",
    items: [
      {
        href: WORKSPACE_ROUTES.home,
        label: "Overview & import",
        hint: "Upload your file first",
        icon: Layers,
      },
      {
        href: WORKSPACE_ROUTES.dashboard,
        label: "Results dashboard",
        hint: "After a run: charts & scores",
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
        hint: "Prioritised cases",
        icon: ListChecks,
      },
    ],
  },
];

/** Flattened primary destinations for mobile sheet */
export const mainNavItems: NavItem[] = navSections.flatMap((s) => s.items);
