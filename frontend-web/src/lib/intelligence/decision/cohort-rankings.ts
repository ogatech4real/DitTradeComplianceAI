import type { ComplianceRisks } from "@/lib/contracts/screening";

export interface NamedCount {
  name: string;
  count: number;
}

/** Descending counts, ascending name for deterministic ties after sort. */
function sortNamedCounts(entries: NamedCount[]): NamedCount[] {
  return [...entries].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function firstDefined(row: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) {
    if (!(k in row)) continue;
    const v = row[k];
    if (v === null || v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    return v;
  }
  return undefined;
}

/** Normalise heterogeneous cell values into a single bucket label. */
function stringifyBucket(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    const joined = value
      .map((x) => (x == null ? "" : String(x).trim()))
      .filter(Boolean)
      .join(", ");
    return joined ? joined : null;
  }
  const s = String(value).trim();
  return s ? s : null;
}

function deriveHsChapter2(row: Record<string, unknown>): string | null {
  const chapterKeys = [
    "hs_chapter",
    "hs_chapter_2",
    "hs_chapter_2_digit",
    "hs_code_2_digit",
    "harmonized_system_chapter_2_digit",
  ];
  for (const k of chapterKeys) {
    const raw = stringifyBucket(firstDefined(row, [k]));
    if (!raw) continue;
    const digits = raw.replace(/\D/g, "");
    return digits.length >= 2 ? digits.slice(0, 2) : digits.length === 1 ? digits : raw.slice(0, 12);
  }
  for (const k of ["hs_code", "hs6", "hs_6_digit", "hts_code"]) {
    const raw = stringifyBucket(firstDefined(row, [k]));
    if (!raw) continue;
    const digits = raw.replace(/\D/g, "");
    if (digits.length >= 2) return digits.slice(0, 2);
  }
  return null;
}

function tally(
  records: Record<string, unknown>[],
  labelForRow: (row: Record<string, unknown>) => string | null,
): Map<string, number> {
  const m = new Map<string, number>();
  for (const row of records) {
    const label = labelForRow(row);
    if (!label) continue;
    m.set(label, (m.get(label) ?? 0) + 1);
  }
  return m;
}

function topFromMap(counts: Map<string, number>, topK: number): NamedCount[] {
  const all = [...counts.entries()].map(([name, count]) => ({ name, count }));
  return sortNamedCounts(all).slice(0, topK);
}

export function topDiscreteField(
  records: Record<string, unknown>[],
  keys: string[],
  topK: number,
): NamedCount[] {
  const counts = tally(records, (row) => stringifyBucket(firstDefined(row, keys)));
  return topFromMap(counts, topK);
}

export function deriveDeclaredOriginCountryTop(records: Record<string, unknown>[]): NamedCount[] {
  return topDiscreteField(
    records,
    ["declared_origin_country", "declared_country_of_origin", "country_of_origin", "origin_country"],
    8,
  );
}

export function deriveCountryOfExportTop(records: Record<string, unknown>[]): NamedCount[] {
  return topDiscreteField(
    records,
    ["country_of_export", "export_country", "country_of_export_declaration"],
    8,
  );
}

export function deriveLastTransformationCountryTop(records: Record<string, unknown>[]): NamedCount[] {
  return topDiscreteField(
    records,
    ["country_of_last_substantial_transformation", "last_substantial_transformation_country", "lst_country"],
    8,
  );
}

export function deriveSupplierChainDepthTop(records: Record<string, unknown>[]): NamedCount[] {
  return topDiscreteField(records, ["supplier_chain_depth", "supply_chain_depth", "chain_depth"], 4);
}

export function deriveHsChapterTop(records: Record<string, unknown>[]): NamedCount[] {
  const counts = tally(records, deriveHsChapter2);
  return topFromMap(counts, 8);
}

export function deriveProductFamilyTop(records: Record<string, unknown>[]): NamedCount[] {
  return topDiscreteField(records, ["product_family", "product_category", "product_class"], 8);
}

export function deriveMaterialKeywordsTop(records: Record<string, unknown>[]): NamedCount[] {
  /** Split coarse keyword lists once; fall back to single field. */
  const counts = new Map<string, number>();
  const splitKeywords = (s: string): string[] =>
    s
      .split(/[,;]|(?:\s+•\s+)|(?:\|\s*)|(?:\/)/)
      .map((x) => x.trim())
      .filter(Boolean);

  for (const row of records) {
    const raw =
      firstDefined(row, ["material_keywords", "material_keyword", "materials", "primary_material"]);
    let parts: string[] = [];
    if (Array.isArray(raw)) parts = raw.map((x) => String(x).trim()).filter(Boolean);
    else if (typeof raw === "string") parts = splitKeywords(raw);
    if (parts.length === 0) continue;
    for (const p of parts) {
      const key = p.length > 64 ? `${p.slice(0, 61)}…` : p;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return topFromMap(counts, 8);
}

/** Maps server risk bucket IDs to `{ name, count }` sorted by prevalence. */
export function complianceRiskDistribution(risks: ComplianceRisks | undefined): NamedCount[] {
  if (!risks || Object.keys(risks).length === 0) return [];
  const entries = Object.entries(risks).map(([k, v]) => ({
    name: humanizeComplianceKey(k),
    count: typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0,
  }));
  return sortNamedCounts(entries).filter((e) => e.count > 0);
}

function humanizeComplianceKey(raw: string): string {
  return raw
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

/** Recommended-action backlog aggregated from cohort rows (ties broken by wording sort). */
export function deriveRecommendedActionBacklog(
  records: Record<string, unknown>[],
): NamedCount[] {
  const counts = tally(records, (row) => stringifyBucket(row.recommended_action));
  const all = topFromMap(counts, 50);
  return all.slice(0, 12);
}
