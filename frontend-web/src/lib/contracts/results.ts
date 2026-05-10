import type { ScreeningSuccessResponse } from "./screening";

import type { EmptyEnvelope } from "./envelope";

/**
 * GET /api/v1/results/latest — returns full screening envelope when a run exists.
 */

export type LatestResultsResponse =
  | ScreeningSuccessResponse
  | EmptyEnvelope;
