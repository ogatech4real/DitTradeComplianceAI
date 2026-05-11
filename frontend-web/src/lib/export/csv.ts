/**
 * Minimal CSV serialization for cohort exports (no Papa dependency).
 */

function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function csvEscapeCell(raw: string): string {
  if (/[,"\r\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
}

export function recordsToCsv(records: Record<string, unknown>[]): string {
  if (records.length === 0) return "";
  const keys = [...new Set(records.flatMap((r) => Object.keys(r)))].sort();
  const header = keys.map((k) => csvEscapeCell(k)).join(",");
  const lines = records.map((row) =>
    keys.map((k) => csvEscapeCell(stringifyCell(row[k]))).join(","),
  );
  return `\uFEFF${header}\r\n${lines.join("\r\n")}\r\n`;
}

export function triggerCsvDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
