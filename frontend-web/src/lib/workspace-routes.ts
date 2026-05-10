/**
 * Operational intelligence app lives under `/workspace`.
 * Marketing and institutional pages occupy other top-level routes.
 */
export const WORKSPACE_ROUTES = {
  home: "/workspace",
  dashboard: "/workspace/dashboard",
  review: "/workspace/review",
} as const;
