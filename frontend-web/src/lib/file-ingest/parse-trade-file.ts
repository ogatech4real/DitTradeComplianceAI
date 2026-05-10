import Papa from "papaparse";
import readXlsxFile from "read-excel-file/browser";

export class TradeFileParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TradeFileParseError";
  }
}

function normalizeCell(value: unknown): unknown {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  const s = String(value).trim();
  if (s === "") return "";
  const n = Number(s);
  if (
    !Number.isNaN(n) &&
    s !== "" &&
    /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(s)
  ) {
    return n;
  }
  return s;
}

function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    const key = k.trim();
    if (!key) continue;
    out[key] = normalizeCell(v);
  }
  return out;
}

/**
 * Parse operator upload to record array for `POST /screening/run`.
 * CSV is fully client-parsed; Excel uses `read-excel-file` (first sheet).
 */
export async function parseTradeFileToRecords(file: File): Promise<{
  records: Record<string, unknown>[];
  columns: string[];
}> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".csv")) {
    const text = await file.text();
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => String(h).trim(),
    });
    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      const first = parsed.errors[0];
      throw new TradeFileParseError(
        `CSV parse issue: ${first.message} (row ${first.row ?? "?"})`,
      );
    }
    const rows = parsed.data.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").trim() !== ""),
    );
    if (rows.length === 0) {
      throw new TradeFileParseError("CSV contains no data rows.");
    }
    const normalized = rows.map((r) =>
      normalizeRow(r as unknown as Record<string, unknown>),
    );
    const columns = Object.keys(normalized[0] ?? {});
    return { records: normalized, columns };
  }

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const sheets = await readXlsxFile(file);
    const sheetRows = sheets[0]?.data;
    if (!sheetRows || sheetRows.length < 2) {
      throw new TradeFileParseError(
        "Workbook needs a header row and at least one data row.",
      );
    }
    const headers = sheetRows[0].map((cell, i) => {
      const n = normalizeCell(cell);
      const label =
        n === "" || n == null
          ? ""
          : typeof n === "number"
            ? String(n)
            : String(n).trim();
      return label || `column_${i + 1}`;
    });

    const records: Record<string, unknown>[] = [];
    for (let r = 1; r < sheetRows.length; r++) {
      const row = sheetRows[r];
      const obj: Record<string, unknown> = {};
      headers.forEach((key, ci) => {
        obj[key] = normalizeCell(row[ci]);
      });
      const norm = normalizeRow(obj);
      if (Object.values(norm).some((v) => v !== "")) {
        records.push(norm);
      }
    }
    if (records.length === 0) {
      throw new TradeFileParseError("No rows parsed from workbook.");
    }
    return {
      records,
      columns: headers,
    };
  }

  throw new TradeFileParseError(
    "Unsupported file type. Upload CSV (.csv) or Excel (.xlsx).",
  );
}
