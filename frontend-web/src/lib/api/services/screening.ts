import { apiV1PostJson } from "@/lib/api/http-client";
import { mockNetworkDelay, shouldUseMockApi } from "@/lib/api/mock-mode";
import { createMockScreeningResponse } from "@/lib/mocks/screening-success.fixture";
import type {
  ScreeningRunRequest,
  ScreeningSuccessResponse,
} from "@/lib/contracts/screening";

export async function runScreening(
  payload: ScreeningRunRequest,
): Promise<ScreeningSuccessResponse> {
  if (shouldUseMockApi()) {
    await mockNetworkDelay(650);
    return createMockScreeningResponse(
      payload.records?.length ? payload.records : undefined,
    );
  }
  return apiV1PostJson<ScreeningSuccessResponse, ScreeningRunRequest>(
    "/screening/run",
    payload,
  );
}
