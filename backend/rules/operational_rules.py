# backend/rules/operational_rules.py

from __future__ import annotations

from typing import Dict, Any

import pandas as pd


# =========================================================
# OPERATIONAL THRESHOLDS
# =========================================================

CRITICAL_HYBRID_SCORE = 0.85
HIGH_HYBRID_SCORE = 0.65
MEDIUM_HYBRID_SCORE = 0.40

HIGH_EMISSIONS_THRESHOLD = 150
VERY_HIGH_EMISSIONS_THRESHOLD = 300

LOW_TRACEABILITY_THRESHOLD = 0.30
VERY_LOW_TRACEABILITY_THRESHOLD = 0.15

MULTI_RULE_THRESHOLD = 3

# =========================================================
# SEVERITY CLASSIFICATION
# =========================================================


def determine_severity_level(
    row: pd.Series,
) -> str:
    """
    Enterprise severity mapping.
    """

    hybrid_score = float(
        row.get(
            "hybrid_score",
            0,
        )
    )

    rule_count = int(
        row.get(
            "rule_flag_count",
            0,
        )
    )

    emissions = float(
        row.get(
            "embedded_emissions",
            0,
        )
    )

    traceability = float(
        row.get(
            "traceability_score",
            1,
        )
    )

    # =====================================================
    # CRITICAL
    # =====================================================

    if (
        hybrid_score >= CRITICAL_HYBRID_SCORE
        or rule_count >= 5
        or emissions >= VERY_HIGH_EMISSIONS_THRESHOLD
        or traceability <= VERY_LOW_TRACEABILITY_THRESHOLD
    ):

        return "critical"

    # =====================================================
    # HIGH
    # =====================================================

    if (
        hybrid_score >= HIGH_HYBRID_SCORE
        or rule_count >= MULTI_RULE_THRESHOLD
        or emissions >= HIGH_EMISSIONS_THRESHOLD
        or traceability <= LOW_TRACEABILITY_THRESHOLD
    ):

        return "high"

    # =====================================================
    # MEDIUM
    # =====================================================

    if hybrid_score >= MEDIUM_HYBRID_SCORE:

        return "medium"

    return "low"


# =========================================================
# REVIEW STATUS
# =========================================================


def determine_review_status(
    severity_level: str,
) -> str:
    """
    Operational workflow routing.
    """

    mapping = {
        "critical": "Immediate Review",
        "high": "Priority Review",
        "medium": "Secondary Review",
        "low": "Cleared",
    }

    return mapping.get(
        severity_level,
        "Review Required",
    )


# =========================================================
# COMPLIANCE ISSUE CATEGORY
# =========================================================


def determine_compliance_issue(
    row: pd.Series,
) -> str:
    """
    Main operational compliance category.
    """

    rule_count = int(
        row.get(
            "rule_flag_count",
            0,
        )
    )

    emissions = float(
        row.get(
            "embedded_emissions",
            0,
        )
    )

    traceability = float(
        row.get(
            "traceability_score",
            1,
        )
    )

    if rule_count >= MULTI_RULE_THRESHOLD:

        return (
            "Multiple Compliance Violations"
        )

    if emissions >= HIGH_EMISSIONS_THRESHOLD:

        return (
            "Carbon Disclosure Risk"
        )

    if traceability <= LOW_TRACEABILITY_THRESHOLD:

        return (
            "Traceability Documentation Gap"
        )

    return (
        "General Compliance Monitoring"
    )


# =========================================================
# RECOMMENDED ACTION
# =========================================================


def determine_recommended_action(
    severity_level: str,
) -> str:
    """
    Operator action guidance.
    """

    mapping = {
        "critical": (
            "Escalate immediately to compliance leadership"
        ),
        "high": (
            "Conduct priority manual compliance review"
        ),
        "medium": (
            "Request supporting trade documentation"
        ),
        "low": (
            "No immediate compliance action required"
        ),
    }

    return mapping.get(
        severity_level,
        "Review manually",
    )


# =========================================================
# OPERATOR EXPLANATION
# =========================================================


def build_operator_explanation(
    row: pd.Series,
) -> str:
    """
    Human-readable operator explanation.
    """

    reasons = []

    rule_count = int(
        row.get(
            "rule_flag_count",
            0,
        )
    )

    emissions = float(
        row.get(
            "embedded_emissions",
            0,
        )
    )

    traceability = float(
        row.get(
            "traceability_score",
            1,
        )
    )

    if rule_count > 0:

        reasons.append(
            f"{rule_count} compliance inconsistencies detected"
        )

    if emissions >= HIGH_EMISSIONS_THRESHOLD:

        reasons.append(
            "elevated embedded emissions profile"
        )

    if traceability <= LOW_TRACEABILITY_THRESHOLD:

        reasons.append(
            "weak supply-chain traceability evidence"
        )

    if not reasons:

        reasons.append(
            "record passed standard compliance screening"
        )

    return "; ".join(reasons)


# =========================================================
# OPERATIONAL INSIGHTS
# =========================================================


def generate_operational_insights(
    scored_df: pd.DataFrame,
) -> Dict[str, Any]:
    """
    Aggregate operator-focused insights.
    """

    insights = {}

    if scored_df.empty:

        return insights

    # =====================================================
    # MOST COMMON ISSUE
    # =====================================================

    if (
        "compliance_issue"
        in scored_df.columns
    ):

        top_issue = (
            scored_df["compliance_issue"]
            .astype(str)
            .value_counts()
            .idxmax()
        )

        insights[
            "most_common_violation_type"
        ] = top_issue

    # =====================================================
    # HIGHEST RISK MARKET
    # =====================================================

    market_column = None

    for col in [
        "destination_market",
        "market",
        "country",
    ]:

        if col in scored_df.columns:
            market_column = col
            break

    if market_column is not None:

        high_risk_df = scored_df[
            scored_df["severity_level"]
            .isin(
                [
                    "critical",
                    "high",
                ]
            )
        ]

        if not high_risk_df.empty:

            top_market = (
                high_risk_df[market_column]
                .astype(str)
                .value_counts()
                .idxmax()
            )

            insights[
                "highest_risk_market"
            ] = top_market

    # =====================================================
    # MOST AFFECTED PRODUCT CATEGORY
    # =====================================================

    category_column = None

    for col in [
        "product_category",
        "commodity_category",
        "hs_category",
    ]:

        if col in scored_df.columns:
            category_column = col
            break

    if category_column is not None:

        top_category = (
            scored_df[category_column]
            .astype(str)
            .value_counts()
            .idxmax()
        )

        insights[
            "most_affected_product_category"
        ] = top_category

    return insights