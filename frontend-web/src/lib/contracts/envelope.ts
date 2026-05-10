/**
 * Discriminated API envelopes aligned with frontend_api_contract.md §3.4–3.5.
 * Use narrowing on `status` before reading domain fields.
 */

export type ApiSuccessStatus = "success";

export type ApiEmptyStatus = "empty";

export type ApiEnvelopeStatus = ApiSuccessStatus | ApiEmptyStatus;

export interface EmptyEnvelope {
  status: ApiEmptyStatus;
  message: string;
}

export function isEmptyEnvelope(value: unknown): value is EmptyEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as EmptyEnvelope).status === "empty" &&
    typeof (value as EmptyEnvelope).message === "string"
  );
}
