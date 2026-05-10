export const queryKeys = {
  root: ["dtc-api"] as const,
  health: () => [...queryKeys.root, "health"] as const,
  latestResults: () => [...queryKeys.root, "results", "latest"] as const,
  resultsInfo: () => [...queryKeys.root, "results", "info"] as const,
} as const;
