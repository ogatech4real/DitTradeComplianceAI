/**
 * Priority queue CSV column order aligned with Streamlit
 * `frontend/components/risk_tables.py` `render_priority_review_queue` display_columns,
 * plus extended ICC / intelligence fields for parity with full-record exports.
 */

import type { PriorityReviewItem } from "@/lib/contracts/screening";

/** Same order as Streamlit `display_columns` (only columns present in DF are emitted there; we gate per-row union below). */
export const STREAMLIT_PRIORITY_QUEUE_PRIMARY: readonly string[] = [
  "record_id",
  "risk_indicator",
  "hybrid_risk_label",
  "hybrid_score",
  "rule_flag_count",
  "destination_market",
  "applicable_jurisdiction",
  "compliance_issue",
  "recommended_action",
  "review_priority",
  "anomaly_class",
  "fraud_score",
  "explanation",
];

/**
 * Additional columns (deduped) after the Streamlit prefix — matches operator full-cohort shape;
 * any record key not listed here is appended alphabetically after these.
 */
export const PRIORITY_QUEUE_EXTENSION_COLUMNS: readonly string[] = [
  "anomaly_count",
  "batch_lot_reference_available",
  "batch_risk_label",
  "batch_risk_score",
  "country_of_export",
  "country_of_last_substantial_transformation",
  "declaration_timestamp",
  "declared_origin_country",
  "document_consistency_score",
  "document_fraud_flag",
  "duplicate_shipment_flag",
  "electricity_source_tag",
  "embedded_emissions_tco2e_per_tonne",
  "emissions_estimation_method",
  "emissions_fraud_flag",
  "exporter_id",
  "fraud_risk_label",
  "hs_code",
  "hybrid_pred",
  "icc",
  "if_pred",
  "if_raw",
  "if_score",
  "importer_id",
  "incoterm",
  "injected_pattern",
  "invoice_id",
  "is_problematic",
  "mapping_confidence",
  "mapping_note",
  "market_cluster_flag",
  "origin_certificate_available",
  "origin_certificate_match_score",
  "origin_fraud_flag",
  "plant_emissions_disclosure_available",
  "port_of_entry",
  "port_of_export",
  "product_description",
  "product_family",
  "production_method_tag",
  "production_site_identifier_available",
  "production_stage_country_1",
  "production_stage_country_2",
  "quantity_unit",
  "recycled_content_percent",
  "requires_review",
  "review_status",
  "rf_pred",
  "rf_probability",
  "risk_label",
  "rule_based_risk",
  "rule_flags",
  "rule_pred",
  "rule_score",
  "sector_emissions_band",
  "severity_level",
  "shipment_id",
  "shipment_quantity",
  "shipment_value_usd",
  "supplier_chain_depth",
  "supplier_concentration_flag",
  "supplier_traceability_metadata_available",
  "supporting_document_count",
  "synthetic_record_type",
  "traceability_completeness_score",
  "traceability_fraud_flag",
  "transport_mode",
  "destination_country",
  "embedded_emissions",
  "traceability_score",
];

const RISK_INDICATOR_BY_LABEL: Record<string, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🟢",
};

export function riskIndicatorFromHybridLabel(hybridRiskLabel: unknown): string {
  const key = String(hybridRiskLabel ?? "")
    .trim()
    .toLowerCase();
  return RISK_INDICATOR_BY_LABEL[key] ?? "";
}

/**
 * Merge API `priority_review_queue` row with full `records[]` row by `record_id`
 * (Streamlit exports full ranked dataframe rows).
 */
export function mergePriorityItemWithRecord(
  item: PriorityReviewItem,
  recordById: Map<string, Record<string, unknown>>,
): Record<string, unknown> {
  const id = String(item.record_id ?? "").trim();
  const base = id ? recordById.get(id) : undefined;
  const merged: Record<string, unknown> = {
    ...(base ?? {}),
    ...item,
  };
  const label = merged.hybrid_risk_label ?? merged.risk_label;
  merged.risk_indicator = riskIndicatorFromHybridLabel(label);
  return merged;
}

export function buildRecordIdMap(records: Record<string, unknown>[]): Map<string, Record<string, unknown>> {
  const m = new Map<string, Record<string, unknown>>();
  for (const r of records) {
    const id = String(r.record_id ?? "").trim();
    if (id) m.set(id, r);
  }
  return m;
}

/** Column order: Streamlit primary (present in any row), then extension (present), then remaining keys sorted. */
export function buildPriorityQueueCsvColumnOrder(rows: Record<string, unknown>[]): string[] {
  const union = new Set<string>();
  for (const r of rows) {
    for (const k of Object.keys(r)) union.add(k);
  }

  const ordered: string[] = [];
  const pushIfPresent = (key: string) => {
    if (union.has(key) && !ordered.includes(key)) ordered.push(key);
  };

  for (const k of STREAMLIT_PRIORITY_QUEUE_PRIMARY) pushIfPresent(k);
  for (const k of PRIORITY_QUEUE_EXTENSION_COLUMNS) pushIfPresent(k);

  const rest = [...union]
    .filter((k) => !ordered.includes(k))
    .sort((a, b) => a.localeCompare(b));
  return [...ordered, ...rest];
}
