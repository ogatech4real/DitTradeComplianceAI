from __future__ import annotations

from typing import (
    Optional,
    List,
    Dict,
    Any,
)

from pydantic import (
    BaseModel,
    Field,
)


# =========================================================
# HEALTH RESPONSE
# =========================================================

class HealthResponse(
    BaseModel
):

    status: str

    service: str

    version: Optional[str] = None


# =========================================================
# UPLOAD RESPONSE
# =========================================================

class UploadResponse(
    BaseModel
):

    status: str

    filename: str

    rows: int

    columns: List[str]


# =========================================================
# UPLOAD SUMMARY
# =========================================================

class UploadSummary(
    BaseModel
):

    total_records: int

    total_columns: int

    markets_involved: List[
        str
    ] = Field(default_factory=list)

    product_categories: List[
        str
    ] = Field(default_factory=list)


# =========================================================
# PROCESSING METADATA
# =========================================================

class ProcessingMetadata(
    BaseModel
):

    processing_duration_seconds: Optional[
        float
    ] = None

    model_version: Optional[
        str
    ] = None

    workflow_status: Optional[
        str
    ] = None

    records_processed: Optional[
        int
    ] = None


# =========================================================
# SCREENING SUMMARY
# =========================================================

class ScreeningSummary(
    BaseModel
):

    total_records: int

    flagged_records: int

    critical_records: int

    priority_review_records: int

    cleared_records: int

    average_risk_score: float

    screening_precision: Optional[
        float
    ] = None


# =========================================================
# SYSTEM INSIGHTS
# =========================================================

class SystemInsights(
    BaseModel
):

    most_common_violation_type: Optional[
        str
    ] = None

    highest_risk_market: Optional[
        str
    ] = None

    most_affected_category: Optional[
        str
    ] = None


# =========================================================
# OPERATIONAL METRICS
# =========================================================

class OperationalMetrics(
    BaseModel
):

    review_rate_percent: Optional[
        float
    ] = None

    average_risk_score: Optional[
        float
    ] = None

    critical_risk_rate_percent: Optional[
        float
    ] = None


# =========================================================
# PRIORITY REVIEW RECORD
# =========================================================

class PriorityReviewRecord(
    BaseModel
):

    record_id: Optional[
        str
    ] = None

    severity_level: Optional[
        str
    ] = None

    hybrid_risk_label: Optional[
        str
    ] = None

    hybrid_score: Optional[
        float
    ] = None

    compliance_issue: Optional[
        str
    ] = None

    recommended_action: Optional[
        str
    ] = None

    review_status: Optional[
        str
    ] = None

    explanation: Optional[
        str
    ] = None

    review_priority: Optional[
        int
    ] = None


# =========================================================
# SCREENING RECORD
# =========================================================

class ScreeningRecord(
    BaseModel
):

    record_id: Optional[
        str
    ] = None

    severity_level: Optional[
        str
    ] = None

    hybrid_risk_label: Optional[
        str
    ] = None

    hybrid_score: Optional[
        float
    ] = None

    fraud_score: Optional[
        float
    ] = None

    batch_risk_score: Optional[
        float
    ] = None

    rf_probability: Optional[
        float
    ] = None

    if_score: Optional[
        float
    ] = None

    rule_flag_count: Optional[
        int
    ] = None

    compliance_issue: Optional[
        str
    ] = None

    recommended_action: Optional[
        str
    ] = None

    review_status: Optional[
        str
    ] = None

    operator_action: Optional[
        str
    ] = None

    explanation: Optional[
        str
    ] = None

    review_priority: Optional[
        int
    ] = None

    metadata: Optional[
        Dict[str, Any]
    ] = None


# =========================================================
# MAIN SCORING RESPONSE
# =========================================================

class ScoringResponse(
    BaseModel
):

    status: str

    executive_summary: Optional[
        str
    ] = None

    upload_summary: Optional[
        UploadSummary
    ] = None

    screening_summary: Optional[
        ScreeningSummary
    ] = None

    processing_metadata: Optional[
        ProcessingMetadata
    ] = None

    system_insights: Optional[
        SystemInsights
    ] = None

    operational_metrics: Optional[
        OperationalMetrics
    ] = None

    severity_breakdown: Optional[
        Dict[str, int]
    ] = None

    compliance_risks: Optional[
        Dict[str, Any]
    ] = None

    priority_review_queue: List[
        Dict[str, Any]
    ] = Field(default_factory=list)

    records: List[
        Dict[str, Any]
    ] = Field(default_factory=list)


# =========================================================
# WORKFLOW RESPONSE
# =========================================================

class WorkflowResponse(
    BaseModel
):

    workflow_id: Optional[
        str
    ] = None

    status: str

    execution_time_seconds: Optional[
        float
    ] = None

    records_processed: Optional[
        int
    ] = None


# =========================================================
# EXPORT RESPONSE
# =========================================================

class ExportResponse(
    BaseModel
):

    status: str

    export_format: str

    exported_records: int

    download_ready: bool


# =========================================================
# ERROR RESPONSE
# =========================================================

class ErrorResponse(
    BaseModel
):

    status: str = "error"

    error: str

    details: Optional[
        str
    ] = None