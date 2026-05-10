import type {
  PriorityReviewItem,
  ScreeningSuccessResponse,
  SeverityBreakdown,
} from "@/lib/contracts/screening";

import { MOCK_DECISION_RECORDS } from "@/lib/mocks/screening-records.partial";

function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function severityBreakdown(records: Record<string, unknown>[]): SeverityBreakdown {
  const m: SeverityBreakdown = {};
  for (const r of records) {
    const s = String(r.severity_level ?? "unknown").toLowerCase();
    m[s] = (m[s] ?? 0) + 1;
  }
  return m;
}

function buildPriorityQueue(records: Record<string, unknown>[], topK: number): PriorityReviewItem[] {
  return [...records]
    .sort((a, b) => toNumber(b.hybrid_score) - toNumber(a.hybrid_score))
    .slice(0, topK)
    .map((row, rank) => ({
      record_id: String(row.record_id ?? ""),
      severity_level: row.severity_level ? String(row.severity_level) : undefined,
      hybrid_risk_label: row.hybrid_risk_label ? String(row.hybrid_risk_label) : undefined,
      hybrid_score: toNumber(row.hybrid_score),
      compliance_issue: row.compliance_issue ? String(row.compliance_issue) : undefined,
      recommended_action: row.recommended_action
        ? String(row.recommended_action)
        : undefined,
      review_status: row.review_status ? String(row.review_status) : undefined,
      explanation: row.explanation ? String(row.explanation) : undefined,
      review_priority: rank + 1,
    }));
}

/**
 * Full-fidelity mock of `POST /api/v1/screening/run` success payload.
 * Optionally rescale `records` to caller-provided rows while keeping summary coherent.
 */
export function createMockScreeningResponse(
  records: Record<string, unknown>[] = MOCK_DECISION_RECORDS,
): ScreeningSuccessResponse {
  const total = records.length;
  const sev = severityBreakdown(records);
  const critical = sev.critical ?? 0;
  const high = sev.high ?? 0;
  const medium = sev.medium ?? 0;
  const low = sev.low ?? 0;
  const requiring = critical + high + medium;
  const avgHybrid =
    total > 0
      ? records.reduce((s, r) => s + toNumber(r.hybrid_score), 0) / total
      : 0;
  const avgFraud =
    total > 0
      ? records.reduce((s, r) => s + toNumber(r.fraud_score), 0) / total
      : 0;

  const markets = [
    ...new Set(
      records
        .map((r) =>
          r.destination_market
            ? String(r.destination_market)
            : r.destination_country
              ? String(r.destination_country)
              : "",
        )
        .filter(Boolean),
    ),
  ].slice(0, 8);

  const categories = [
    ...new Set(
      records
        .map((r) => (r.product_family ? String(r.product_family) : ""))
        .filter(Boolean),
    ),
  ].slice(0, 8);

  const queue = buildPriorityQueue(records, 25);

  const executive = `${requiring} of ${total} uploaded trade records sit in active review lanes. ${critical} classified critical; batch and fraud intelligence elevated ${Math.min(4, total)} cohort-level alerts.`;

  return {
    status: "success",
    upload_summary: {
      upload_timestamp: new Date().toISOString(),
      total_records: total,
      total_columns: 48,
      markets_involved: markets,
      product_categories: categories,
    },
    screening_summary: {
      total_records: total,
      flagged_records: requiring,
      records_requiring_review: requiring,
      critical_records: critical,
      high_risk_records: high,
      medium_risk_records: medium,
      cleared_records: low,
      average_risk_score: Math.round(avgHybrid * 10000) / 10000,
      screening_precision: 0.7812,
      average_fraud_risk: Math.round(avgFraud * 10000) / 10000,
    },
    processing_metadata: {
      processing_timestamp: new Date().toISOString(),
      processing_duration_seconds: 4.812,
      model_version: "production-v1.0",
      ml_models_loaded: {
        preprocessor: true,
        isolation_forest: true,
        classifier: true,
      },
      intelligence_quality: {
        mapping_confidence: 0.8812,
        matched_schema_fields: 9,
        required_schema_fields: 7,
        icc_transformation_coverage: 0.8812,
        completeness_score: 0.952,
        invalid_values_rate: 0.024,
        coercion_rate: 0.024,
        schema_consistency_score: 0.8812,
        data_quality_score: 0.894,
      },
      mapping_confidence: 0.8812,
      matched_schema_fields: 9,
      required_schema_fields: 7,
      icc_transformation_coverage: 0.8812,
      data_quality_score: 0.894,
      data_quality: {
        completeness: 0.952,
        invalid_values_rate: 0.024,
        coercion_rate: 0.024,
        schema_consistency_score: 0.8812,
        overall_quality_score: 0.894,
      },
    },
    system_insights: {
      most_common_violation_type: "Multiple Compliance Violations",
      highest_risk_market: "EU",
      most_affected_category: "steel_coil",
      most_affected_product_category: "steel_coil",
      mapping_confidence: 0.8812,
      matched_schema_fields: 9,
      required_schema_fields: 7,
      icc_transformation_coverage: 0.8812,
      data_quality_score: 0.894,
    },
    severity_breakdown: sev,
    compliance_risks: {
      carbon_disclosure_inconsistencies: 12,
      origin_declaration_conflicts: 5,
      missing_traceability_data: 14,
      high_emissions_anomalies: 8,
      anomalous_trade_patterns: 9,
    },
    operational_metrics: {
      review_rate_percent: total > 0 ? Math.round((requiring / total) * 10000) / 100 : 0,
      average_risk_score: Math.round(avgHybrid * 10000) / 10000,
      critical_risk_rate_percent:
        total > 0 ? Math.round((critical / total) * 10000) / 100 : 0,
      high_risk_rate_percent:
        total > 0 ? Math.round(((critical + high) / total) * 10000) / 100 : 0,
      fraud_alerts: records.filter((r) => toNumber(r.fraud_score) >= 0.5).length,
      anomaly_records: 5,
      batch_risk_score: 0.2033,
      mapping_confidence: 0.8812,
      data_quality_score: 0.894,
    },
    priority_review_queue: queue,
    executive_summary: executive,
    fraud_analysis: {
      emissions_fraud_flag: 2,
      traceability_fraud_flag: 4,
      document_fraud_flag: 3,
      origin_fraud_flag: 5,
      high_fraud_risk_records: 3,
    },
    batch_analysis: {
      duplicate_shipment_records: 2,
      supplier_concentration_records: 6,
      market_cluster_records: 3,
      mean_batch_risk_score: 0.2033,
    },
    records,
  };
}

/** Fixture used in Storybook/tests — default row population. */
export const MOCK_SCREENING_SUCCESS: ScreeningSuccessResponse =
  createMockScreeningResponse(MOCK_DECISION_RECORDS);
