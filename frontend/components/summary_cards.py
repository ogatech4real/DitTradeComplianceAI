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

    Label order and wording stay in lockstep with the Next.js Results dashboard
    (``frontend-web`` ``OperatorAlignedMetrics``) — both read the same REST fields.
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
    # SCREENING SUMMARY (operator order)
    # =====================================================

    st.markdown(
        "### Screening Summary"
    )

    st.caption(
        "REST alignment: ``screening_summary.total_records``, "
        "``.cleared_records``, ``.flagged_records``, "
        "``.high_risk_records`` (severity == high only), "
        "``.critical_records``. "
        "Same labels as ``frontend-web`` dashboard."
    )

    c1, c2, c3, c4, c5 = st.columns(5)

    with c1:
        st.metric(
            label="Total Shipments",
            value=f"{total_records:,}",
        )

    with c2:
        st.metric(
            label="Cleared Records",
            value=f"{cleared_records:,}",
        )

    with c3:
        st.metric(
            label="Records Requiring Review",
            value=f"{flagged_records:,}",
        )

    with c4:
        st.metric(
            label="High severity tier (excl. critical)",
            value=f"{high_risk_records:,}",
        )

    with c5:
        st.metric(
            label="Critical Cases",
            value=f"{critical_records:,}",
        )

    # =====================================================
    # OPERATIONAL EXPOSURE (immediately below summary)
    # =====================================================

    st.markdown(
        "### Operational Exposure"
    )

    st.caption(
        "Counts mirror ``screening_summary`` tiles. Percent deltas pull from "
        "``operational_metrics.review_rate_percent`` (% of cohort with "
        "``requires_review``) and ``operational_metrics.high_risk_rate_percent`` "
        "(% with severity ∈ {critical, high}). "
        "``High Severity`` card value equals ``critical_records + "
        "high_risk_records``."
    )

    exposure_col1, exposure_col2, exposure_col3, exposure_col4 = (
        st.columns(4)
    )

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
        f"Exposure is based on full screened results (n={total_records:,}). "
        "“Records Requiring Review” follows operator `requires_review` "
        "(critical + high + medium severity). “High severity tier” counts only "
        "`severity_level == high`, not critical or medium."
    )

    st.divider()

    # =====================================================
    # INTELLIGENCE QUALITY
    # =====================================================

    st.markdown(
        "### Intelligence Quality"
    )

    st.caption(
        "REST alignment: ``operational_metrics.batch_risk_score``, "
        "``.mapping_confidence``, ``.data_quality_score`` "
        "(0–1 fractions rendered as percentages, "
        "same three tiles as Next.js)."
    )

    iq1, iq2, iq3 = st.columns(3)

    with iq1:
        st.metric(
            label="Batch Risk Score",
            value=f"{batch_risk_score:.1%}",
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

    st.caption(
        "Scores are percentages (0–100%) where applicable: mapping and data "
        "quality describe how confidently the dataset was understood; batch "
        "risk summarises shipment-cluster signals."
    )

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

    st.divider()

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

    st.caption(
        "Same banner rule as Next.js Results: "
        "``critical_records`` > 0 → critical; elif ``high_risk_records`` "
        "> 0 → high; elif ``medium_risk_records`` > 0 → medium; else low."
    )

    st.divider()

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
