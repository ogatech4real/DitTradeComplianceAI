import type { HealthResponse } from "@/lib/contracts/health";
import { apiV1Fetch } from "@/lib/api/http-client";
import { mockNetworkDelay, shouldUseMockApi } from "@/lib/api/mock-mode";

export async function fetchHealth(): Promise<HealthResponse> {
  if (shouldUseMockApi()) {
    await mockNetworkDelay(120);
    return {
      status: "ok",
      service: "Digital Trade Compliance AI (mock transport)",
    };
  }
  return apiV1Fetch<HealthResponse>("/health/", { method: "GET" });
}
