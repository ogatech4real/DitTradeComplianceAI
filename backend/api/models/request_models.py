from __future__ import annotations

from typing import Optional, List, Dict, Any

from pydantic import (
    BaseModel,
    Field,
)


# =========================================================
# DIRECT DATA SCORING REQUEST
# =========================================================

class ScoringRequest(
    BaseModel
):
    """
    Direct dataframe scoring request.
    """

    records: List[
        Dict[str, Any]
    ]


# =========================================================
# SCREENING CONFIGURATION
# =========================================================

class ScreeningRequest(
    BaseModel
):
    """
    Screening workflow configuration.
    """

    enable_rules: bool = Field(
        default=True,
        description=(
            "Enable rule-based validation."
        ),
    )

    enable_anomaly_detection: bool = Field(
        default=True,
        description=(
            "Enable anomaly detection."
        ),
    )

    enable_classification: bool = Field(
        default=True,
        description=(
            "Enable supervised classification."
        ),
    )

    risk_threshold: float = Field(
        default=0.7,
        ge=0.0,
        le=1.0,
        description=(
            "High-risk threshold."
        ),
    )

    top_k_priority: int = Field(
        default=20,
        ge=1,
        le=1000,
        description=(
            "Priority review queue size."
        ),
    )


# =========================================================
# WORKFLOW REQUEST
# =========================================================

class WorkflowRequest(
    BaseModel
):
    """
    Workflow execution metadata.
    """

    workflow_name: str = Field(
        ...,
        description=(
            "Workflow execution name."
        ),
    )

    source_system: Optional[str] = Field(
        default=None,
        description=(
            "Source trade platform."
        ),
    )

    notes: Optional[str] = Field(
        default=None,
        description=(
            "Optional execution notes."
        ),
    )


# =========================================================
# EXPORT REQUEST
# =========================================================

class ExportRequest(
    BaseModel
):
    """
    Export configuration request.
    """

    export_format: str = Field(
        default="csv",
        description=(
            "Export format."
        ),
    )

    include_high_risk_only: bool = Field(
        default=False,
        description=(
            "Export only high-risk records."
        ),
    )


# =========================================================
# FILTER REQUEST
# =========================================================

class FilterRequest(
    BaseModel
):
    """
    Result filtering request.
    """

    risk_levels: Optional[
        List[str]
    ] = None

    anomaly_classes: Optional[
        List[str]
    ] = None

    min_score: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0,
    )

    max_score: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0,
    )