import { WORKSPACE_ROUTES } from "@/lib/workspace-routes";

/**
 * Highlights workspace rail items: `/workspace` is exact-match only so `/workspace/dashboard`
 * does not light up Command overview.
 */
export function isWorkspaceNavActive(pathname: string, itemHref: string): boolean {
  const path =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (itemHref === WORKSPACE_ROUTES.home) {
    return path === WORKSPACE_ROUTES.home;
  }
  return path === itemHref || path.startsWith(`${itemHref}/`);
}
