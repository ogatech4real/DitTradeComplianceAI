"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchLatestResults } from "@/lib/api/services/results";
import { queryKeys } from "@/lib/api/query-keys";

export function useLatestResultsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.latestResults(),
    queryFn: fetchLatestResults,
    enabled,
    // Keep client-side hydration from mutation; avoid stripping it on focus/remount churn.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
  });
}
