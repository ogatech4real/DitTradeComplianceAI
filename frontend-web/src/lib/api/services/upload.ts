import { apiV1UploadFile } from "@/lib/api/http-client";
import { mockNetworkDelay, shouldUseMockApi } from "@/lib/api/mock-mode";
import type { UploadSuccessResponse } from "@/lib/contracts/upload";
import { createMockUploadResponse } from "@/lib/mocks/upload-success.fixture";

export async function uploadDatasetFile(
  file: File,
  context?: { rowCount: number; columns: string[] },
): Promise<UploadSuccessResponse> {
  if (shouldUseMockApi()) {
    await mockNetworkDelay(320);
    return createMockUploadResponse(
      file.name,
      context?.rowCount ?? 0,
      context?.columns?.length ? context.columns : ["(mock — parse client-side)"],
    );
  }
  return apiV1UploadFile("/datasets/upload/", file) as Promise<UploadSuccessResponse>;
}
