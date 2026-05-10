/** POST /api/v1/datasets/upload/ — tabular ingestion preview payload */

export interface UploadSuccessResponse {
  status: string;
  filename: string;
  rows: number;
  columns: string[];
  preview: Record<string, unknown>[];
}
