export class ApiHttpError extends Error {
  readonly status: number;

  readonly bodyText: string;

  constructor(message: string, status: number, bodyText: string) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

export function parseFastApiDetail(bodyText: string): string | null {
  try {
    const parsed = JSON.parse(bodyText) as { detail?: unknown };
    if (parsed.detail == null) return null;
    if (typeof parsed.detail === "string") return parsed.detail;
    return JSON.stringify(parsed.detail);
  } catch {
    return null;
  }
}
