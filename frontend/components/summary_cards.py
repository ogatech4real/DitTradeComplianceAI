from __future__ import annotations

from typing import (
    Dict,
    Any,
)

import streamlit as st

# =====================================================
# RISK COLOUR SYSTEM
# =====================================================

RISK_COLOURS = {
    "critical": "#B71C1C",
    "high": "#D50000",
    "medium": "#FFD600",
    "low": "#00C853",
}


def render_summary_cards(
    screening_summary: Dict[str, Any],
    operational_metrics: Dict[str, Any] | None = None,
) -> None:
    """
    Render operator-facing screening metrics.
    """

    if not screening_summary:

        st.warning(
            "No screening summary available."
        )

        return

    if operational_metrics is None:
        operational_metrics = {}

    # =====================================================
    # SUMMARY VALUES
    # =====================================================

    total_records = screening_summary.get(
        "total_records",
        0,
    )

    flagged_records = screening_summary.get(
        "flagged_records",
        0,
    )

    high_risk_records = screening_summary.get(
        "high_risk_records",
        0,
    )

    critical_records = screening_summary.get(
        "critical_records",
        0,
    )

    medium_risk_records = screening_summary.get(
        "medium_risk_records",
        0,
    )

    cleared_records = screening_summary.get(
        "cleared_records",
        0,
    )

    average_risk_score = screening_summary.get(
        "average_risk_score",
        0.0,
    )

    review_rate_percent = (
        operational_metrics.get(
            "review_rate_percent",
            0.0,
        )
    )

    high_risk_rate_percent = (
        operational_metrics.get(
            "high_risk_rate_percent",
            0.0,
        )
    )

    fraud_alerts = operational_metrics.get(
        "fraud_alerts",
        0,
    )

    anomaly_records = operational_metrics.get(
        "anomaly_records",
        0,
    )

    batch_risk_score = operational_metrics.get(
        "batch_risk_score",
        0.0,
    )

    mapping_confidence = operational_metrics.get(
        "mapping_confidence",
        0.0,
    )

    data_quality_score = operational_metrics.get(
        "data_quality_score",
        0.0,
    )

    # =====================================================
    # PRIMARY METRICS
    # =====================================================

    st.markdown(
        "### Screening Summary"
    )

    col1, col2, col3, col4, col5 = (
        st.columns(5)
    )

    with col1:

        st.metric(
            label="Total Shipments",
            value=f"{total_records:,}",
        )

    with col2:

        st.metric(
            label="Records Requiring Review",
            value=f"{flagged_records:,}",
        )

    with col3:

        st.metric(
            label="High Severity Cases",
            value=f"{high_risk_records:,}",
        )

    with col4:

        st.metric(
            label="Cleared Records",
            value=f"{cleared_records:,}",
        )

    with col5:

        st.metric(
            label="Critical Cases",
            value=f"{critical_records:,}",
        )

    st.divider()

    # =====================================================
    # SECONDARY METRICS
    # =====================================================

    col6, col7, col8, col9, col10 = (
        st.columns(5)
    )

    with col6:

        st.metric(
            label="Medium Severity Cases",
            value=f"{medium_risk_records:,}",
        )

    with col7:

        st.metric(
            label="Average Risk Score",
            value=f"{average_risk_score:.3f}",
        )

    with col8:

        st.metric(
            label="Review Rate",
            value=f"{review_rate_percent:.1f}%",
        )

    with col9:

        st.metric(
            label="Fraud Alerts",
            value=f"{fraud_alerts:,}",
        )

    with col10:

        st.metric(
            label="Anomaly Records",
            value=f"{anomaly_records:,}",
        )

    # =====================================================
    # INTELLIGENCE QUALITY
    # =====================================================

    st.divider()

    st.markdown(
        "### Intelligence Quality"
    )

    iq1, iq2, iq3 = st.columns(3)

    with iq1:

        st.metric(
            label="Batch Risk Score",
            value=f"{batch_risk_score:.3f}",
        )

    with iq2:

        st.metric(
            label="Mapping Confidence",
            value=f"{mapping_confidence:.2%}",
        )

    with iq3:

        st.metric(
            label="Data Quality Score",
            value=f"{data_quality_score:.2%}",
        )

    # =====================================================
    # REVIEW PROGRESS
    # =====================================================

    # =====================================================
    # OVERALL RISK STATUS
    # =====================================================

    overall_status = "low"

    if critical_records > 0:
        overall_status = "critical"

    elif high_risk_records > 0:
        overall_status = "high"

    elif medium_risk_records > 0:
        overall_status = "medium"

    banner_colour = RISK_COLOURS.get(
        overall_status,
        "#00C853",
    )

    st.markdown(
        f"""
<div style="
padding:14px;
border-radius:10px;
background:{banner_colour};
color:white;
font-weight:700;
font-size:18px;
text-align:center;
">
Operational Compliance Status: {overall_status.upper()}
</div>
""",
        unsafe_allow_html=True,
    )

    st.divider()

    st.markdown(
        "### Operational Exposure"
    )
    exposure_col1, exposure_col2, exposure_col3, exposure_col4 = st.columns(4)
    with exposure_col1:
        st.metric(
            "Requires Review",
            f"{flagged_records:,}",
            f"{review_rate_percent:.2f}%",
        )
    with exposure_col2:
        high_severity_count = int(
            high_risk_records + critical_records
        )
        st.metric(
            "High Severity",
            f"{high_severity_count:,}",
            f"{high_risk_rate_percent:.2f}%",
        )
    with exposure_col3:
        st.metric(
            "Critical Cases",
            f"{critical_records:,}",
        )
    with exposure_col4:
        st.metric(
            "Cleared",
            f"{cleared_records:,}",
        )

    st.caption(
        f"Exposure metrics are computed on full screened results (n={total_records:,})."
    )

    if mapping_confidence < 0.65:

        st.warning(
            "Low schema mapping confidence detected. "
            "Uploaded dataset may contain inconsistent field structures."
        )

    if data_quality_score < 0.70:

        st.warning(
            "Data quality degradation detected. "
            "Review missing values, invalid units, or malformed records."
        )

    st.caption(
        f"{high_risk_rate_percent:.2f}% classified as high severity."
    )