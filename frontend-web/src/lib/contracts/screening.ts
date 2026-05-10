/**
 * Screening run — mirrors backend.api.models.ScoringRequest + operator response.
 * Record rows stay loose until codegen from OpenAPI; domain columns are progressively tightened.
 */

export interface ScreeningRunRequest {
  records: Record<string, unknown>[];
}

export interface UploadSummary {
  upload_timestamp?: string;
  total_records: number;
  total_columns: number;
  markets_involved: string[];
  product_categories: string[];
}

export interface ScreeningSummary {
  total_records?: number;
  flagged_records?: number;
  records_requiring_review?: number;
  critical_records?: number;
  high_risk_records?: number;
  medium_risk_records?: number;
  priority_review_records?: number;
  cleared_records?: number;
  average_risk_score?: number;
  screening_precision?: number;
  average_fraud_risk?: number;
}

export interface IntelligenceQuality {
  mapping_confidence?: number;
  matched_schema_fields?: number;
  required_schema_fields?: number;
  icc_transformation_coverage?: number;
  completeness_score?: number;
  invalid_values_rate?: number;
  coercion_rate?: number;
  schema_consistency_score?: number;
  data_quality_score?: number;
}

export interface DataQualitySubset {
  completeness?: number;
  invalid_values_rate?: number;
  coercion_rate?: number;
  schema_consistency_score?: number;
  overall_quality_score?: number;
}

export interface ProcessingMetadata {
  processing_timestamp?: string;
  processing_duration_seconds?: number;
  model_version?: string;
  workflow_status?: string;
  records_processed?: number;
  ml_models_loaded?: Record<string, boolean>;
  intelligence_quality?: IntelligenceQuality;
  mapping_confidence?: number;
  matched_schema_fields?: number;
  required_schema_fields?: number;
  icc_transformation_coverage?: number;
  data_quality?: DataQualitySubset;
  data_quality_score?: number;
}

export interface SystemInsights {
  most_common_violation_type?: string | null;
  highest_risk_market?: string | null;
  most_affected_category?: string | null;
  most_affected_product_category?: string | null;
  mapping_confidence?: number;
  matched_schema_fields?: number;
  required_schema_fields?: number;
  icc_transformation_coverage?: number;
  data_quality_score?: number;
}

export interface OperationalMetrics {
  review_rate_percent?: number;
  average_risk_score?: number;
  critical_risk_rate_percent?: number;
  /** Severity `high` only (excludes critical). */
  high_tier_only_rate_percent?: number;
  /** Share with severity critical ∪ high (legacy / Streamlit exposure %). */
  high_risk_rate_percent?: number;
  fraud_alerts?: number;
  anomaly_records?: number;
  batch_risk_score?: number;
  mapping_confidence?: number;
  data_quality_score?: number;
}

export interface PriorityReviewItem {
  record_id?: string;
  severity_level?: string;
  hybrid_risk_label?: string;
  hybrid_score?: number;
  compliance_issue?: string;
  recommended_action?: string;
  review_status?: string;
  review_priority?: number;
  explanation?: string;
}

export type FraudAnalysisAggregate = Record<string, unknown>;
export type BatchAnalysisAggregate = Record<string, unknown>;
export type ComplianceRisks = Record<string, number>;
export type SeverityBreakdown = Record<string, number>;

export interface ScreeningSuccessResponse {
  status: "success";
  upload_summary: UploadSummary;
  screening_summary: ScreeningSummary;
  processing_metadata: ProcessingMetadata;
  system_insights: SystemInsights;
  severity_breakdown: SeverityBreakdown;
  compliance_risks: ComplianceRisks;
  operational_metrics: OperationalMetrics;
  priority_review_queue: PriorityReviewItem[];
  executive_summary: string;
  fraud_analysis: FraudAnalysisAggregate;
  batch_analysis: BatchAnalysisAggregate;
  records: Record<string, unknown>[];
}
