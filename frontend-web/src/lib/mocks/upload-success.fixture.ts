import type { UploadSuccessResponse } from "@/lib/contracts/upload";

/** Shape from `POST /api/v1/datasets/upload/` — preview only; full rows scored client-side today. */
export function createMockUploadResponse(
  filename: string,
  rowCount: number,
  columns: string[],
): UploadSuccessResponse {
  return {
    status: "success",
    filename,
    rows: rowCount,
    columns,
    preview: [],
  };
}
