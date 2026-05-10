"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "@/lib/api/services/health";
import { queryKeys } from "@/lib/api/query-keys";

export function useHealthQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.health(),
    queryFn: fetchHealth,
    enabled,
    staleTime: 15_000,
  });
}
