import { shouldUseMockApi } from "@/lib/api/mock-mode";

/**
 * API base URL for the FastAPI backend (mounted v1 at /api/v1).
 *
 * Vercel: set `NEXT_PUBLIC_API_BASE_URL` to your API origin, e.g. https://api.example.com
 * (no trailing slash). Local dev defaults to http://localhost:8000 when unset.
 */
export function getApiBaseUrl(): string {
  if (shouldUseMockApi()) {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
    if (raw) return raw.replace(/\/+$/, "");
    return "http://mock-api.local";
  }
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (raw) {
    return raw.replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8000";
  }
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Configure it in Vercel Project → Environment Variables.",
  );
}

export const API_V1_PREFIX = "/api/v1" as const;

export function apiV1Url(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${API_V1_PREFIX}${p}`;
}
