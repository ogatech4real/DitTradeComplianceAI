import type { LatestResultsResponse } from "@/lib/contracts/results";
import type { ScreeningSuccessResponse } from "@/lib/contracts/screening";
import { isEmptyEnvelope } from "@/lib/contracts/envelope";
import { apiV1Fetch } from "@/lib/api/http-client";
import { mockNetworkDelay, shouldUseMockApi } from "@/lib/api/mock-mode";
import { MOCK_SCREENING_SUCCESS } from "@/lib/mocks/screening-success.fixture";

function shouldPrefillMockResults(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_PREFILL_RESULTS === "true";
}

export async function fetchLatestResults(): Promise<LatestResultsResponse> {
  if (shouldUseMockApi()) {
    await mockNetworkDelay(180);
    if (shouldPrefillMockResults()) {
      return structuredClone(MOCK_SCREENING_SUCCESS);
    }
    return {
      status: "empty",
      message: "No workflow results available (mock — run upload pipeline).",
    };
  }
  return apiV1Fetch<LatestResultsResponse>("/results/latest", {
    method: "GET",
  });
}

export function isLatestResultsSuccess(
  data: LatestResultsResponse | undefined,
): data is ScreeningSuccessResponse {
  return (
    !!data &&
    !isEmptyEnvelope(data) &&
    (data as { status?: string }).status === "success"
  );
}

export interface ResultsInfoResponse {
  service: string;
  description: string;
  supported_exports: string[];
}

export function fetchResultsInfo(): Promise<ResultsInfoResponse> {
  return apiV1Fetch<ResultsInfoResponse>("/results/info", {
    method: "GET",
  });
}
