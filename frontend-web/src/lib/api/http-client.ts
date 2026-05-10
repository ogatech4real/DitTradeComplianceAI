import { apiV1Url } from "./config";
import { ApiHttpError, parseFastApiDetail } from "./errors";

export interface HttpClientOptions extends RequestInit {
  /** Relative to /api/v1, e.g. "/health/" */
  path: string;
}

async function parseErrorBody(response: Response): Promise<string> {
  const text = await response.text();
  const detail = parseFastApiDetail(text);
  return detail ?? text.slice(0, 2000);
}

/**
 * Thin fetch wrapper — all intelligence services go through here
 * so timeouts, tracing, and auth headers can be centralised later.
 */
export async function apiV1Fetch<T>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: BodyInit | null },
): Promise<T> {
  const url = apiV1Url(path);
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...((init?.headers as Record<string, string>) ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const msg = await parseErrorBody(response);
    throw new ApiHttpError(
      msg || `Request failed with HTTP ${response.status}`,
      response.status,
      msg,
    );
  }

  return response.json() as Promise<T>;
}

export async function apiV1PostJson<TResponse, TBody>(
  path: string,
  body: TBody,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<TResponse> {
  return apiV1Fetch<TResponse>(path, {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
    body: JSON.stringify(body),
  });
}

export async function apiV1UploadFile(
  path: string,
  file: File,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<unknown> {
  const url = apiV1Url(path);
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(url, {
    ...init,
    method: "POST",
    body: form,
    cache: "no-store",
  });

  if (!response.ok) {
    const msg = await parseErrorBody(response);
    throw new ApiHttpError(
      msg || `Upload failed with HTTP ${response.status}`,
      response.status,
      msg,
    );
  }

  return response.json();
}
