import {
  LayoutDashboard,
  ListChecks,
  UploadCloud,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const mainNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Operator dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/upload",
    label: "Upload workspace",
    icon: UploadCloud,
  },
  {
    href: "/review-queue",
    label: "Review queue",
    icon: ListChecks,
  },
];
