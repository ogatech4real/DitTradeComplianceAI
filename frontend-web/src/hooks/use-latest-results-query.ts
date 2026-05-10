"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchLatestResults } from "@/lib/api/services/results";
import { queryKeys } from "@/lib/api/query-keys";

export function useLatestResultsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.latestResults(),
    queryFn: fetchLatestResults,
    enabled,
    staleTime: 10_000,
  });
}
