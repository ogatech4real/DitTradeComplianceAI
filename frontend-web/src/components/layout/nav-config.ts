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

export const navSections: NavSection[] = [
  {
    heading: "Intelligence workspace",
    items: [
      {
        href: WORKSPACE_ROUTES.home,
        label: "Command overview",
        hint: "Executive surface & import",
        icon: Layers,
      },
      {
        href: WORKSPACE_ROUTES.dashboard,
        label: "Decision intelligence",
        hint: "Exposure, rationale, posture",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    heading: "Operations",
    items: [
      {
        href: WORKSPACE_ROUTES.review,
        label: "Investigations",
        hint: "Prioritised review & evidence",
        icon: ListChecks,
      },
    ],
  },
];

/** Flattened primary destinations for mobile sheet */
export const mainNavItems: NavItem[] = navSections.flatMap((s) => s.items);
