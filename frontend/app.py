# frontend/app.py

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any, Dict


def normalise_api_base_url(raw: str) -> str:
    """
    Render / production URLs must be https without a trailing slash
    when building endpoints.
    """

    stripped = raw.strip().rstrip("/")

    return stripped


import numpy as np
import pandas as pd
import requests
import streamlit as st

# =============================================================================
# PATH CONFIGURATION
# =============================================================================

ROOT_DIR = Path(__file__).resolve().parent.parent

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# =============================================================================
# FRONTEND IMPORTS
# =============================================================================

from frontend.state.session_manager import SessionManager

from frontend.components.sidebar import render_sidebar
from frontend.components.upload_widget import render_upload_widget
from frontend.components.summary_cards import render_summary_cards

from frontend.components.risk_tables import (
    render_top_risk_table,
)

from frontend.components.charts import (
    render_risk_distribution_chart,
    render_risk_breakdown_chart,
)

# =============================================================================
# BACKEND SERVICES
# =============================================================================

from backend.services.export_service import ExportService

# =============================================================================
# PAGE CONFIGURATION
# =============================================================================

st.set_page_config(
    page_title="Digital Trade Compliance AI",
    page_icon="📦",
    layout="wide",
    initial_sidebar_state="expanded",
)

# =============================================================================
# SESSION INITIALISATION
# =============================================================================

SessionManager.initialize()

# =============================================================================
# SERVICES
# =============================================================================

export_service = ExportService()

# =============================================================================
# API CONFIGURATION
# =============================================================================

MAX_DISPLAY_ROWS = 1000
MAX_CHART_ROWS = 5000


def sample_dataframe_for_charts(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Same row cap for charts on Upload and Results pages (avoids heavy plots).
    """

    if len(df) > MAX_CHART_ROWS:

        return df.sample(
            MAX_CHART_ROWS,
            random_state=42,
        )

    return df.copy()


def get_api_base_url() -> str:
    """
    FastAPI public base URL (no trailing slash).

    Resolution order:
    1. Environment ``STREAMLIT_API_BASE_URL`` or ``API_BASE_URL`` (Render, Docker, local).
    2. Streamlit Cloud **Secrets** keys ``STREAMLIT_API_BASE_URL`` or ``API_BASE_URL``.
    3. Local default ``http://localhost:8000``.

    **You do not set RENDER_EXTERNAL_URL yourself** — Render injects that on the API
    service only. For Streamlit Cloud, copy your API’s HTTPS URL from the Render
    dashboard into Secrets as ``API_BASE_URL``.
    """

    for env_key in (
        "STREAMLIT_API_BASE_URL",
        "API_BASE_URL",
    ):

        val = os.environ.get(env_key, "").strip()

        if val:

            return normalise_api_base_url(val)

    try:

        sec = st.secrets

        for key in (
            "STREAMLIT_API_BASE_URL",
            "API_BASE_URL",
        ):

            if key in sec:

                return normalise_api_base_url(str(sec[key]))

    except Exception:

        pass

    return normalise_api_base_url("http://localhost:8000")


# =============================================================================
# API HELPERS
# =============================================================================

def check_backend_health() -> bool:
    """
    Validate backend availability.
    """

    try:

        response = requests.get(
            f"{get_api_base_url()}/health/",
            timeout=5,
        )

        return response.status_code == 200

    except Exception:

        return False

def sanitise_dataframe(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Ensure dataframe is safe for
    API transfer and rendering.

    Pandas 2+/3 Arrow string dtypes reject ``fillna(0)`` on string columns — use
    per-dtype fills (aligned with backend scoring sanitisation).
    """

    out = df.copy()

    out = out.loc[
        :,
        ~out.columns.duplicated(),
    ]

    numeric_cols = out.select_dtypes(
        include=[np.number],
    ).columns

    if len(numeric_cols) > 0:

        out[numeric_cols] = (
            out[numeric_cols]
            .replace(
                [np.inf, -np.inf],
                np.nan,
            )
            .apply(
                pd.to_numeric,
                errors="coerce",
            )
            .fillna(0)
        )

    bool_cols = out.select_dtypes(
        include=["bool", "boolean"],
    ).columns

    if len(bool_cols) > 0:

        out[bool_cols] = (
            out[bool_cols]
            .fillna(False)
        )

    other_cols = (
        out.columns
        .difference(numeric_cols)
        .difference(bool_cols)
    )

    if len(other_cols) > 0:

        for col in other_cols:

            series = out[col]

            if pd.api.types.is_datetime64_any_dtype(
                series,
            ):

                out[col] = np.where(
                    series.isna(),
                    "",
                    series.dt.strftime("%Y-%m-%d"),
                )

            else:

                out[col] = series.map(
                    lambda cell: ""
                    if pd.isna(cell)
                    else str(cell),
                )

    return out


def get_scoring_request_timeout_sec() -> float:
    """
    HTTP client timeout for /scoring/run (large uploads can exceed 5 minutes).

    Streamlit Cloud: set secret or env ``STREAMLIT_SCORING_TIMEOUT_SEC`` (seconds).
    """

    for env_key in (
        "STREAMLIT_SCORING_TIMEOUT_SEC",
        "SCORING_REQUEST_TIMEOUT_SEC",
    ):

        raw = os.environ.get(
            env_key,
            "",
        ).strip()

        if raw:

            try:

                return max(
                    30.0,
                    float(raw),
                )

            except ValueError:

                pass

    try:

        sec = st.secrets.get(
            "STREAMLIT_SCORING_TIMEOUT_SEC",
        )

        if sec is not None:

            return max(
                30.0,
                float(sec),
            )

    except Exception:

        pass

    return 600.0


def format_scoring_http_error(
    response: requests.Response,
) -> str:

    code = response.status_code

    if code in (
        502,
        503,
        504,
    ):

        return (
            f"HTTP {code}: API gateway could not reach the scoring service "
            f"or it timed out ({get_api_base_url()}). Typical causes: "
            "instance memory/CPU limits, Render proxy timeout, or cold start. "
            "Check API logs on Render; consider a larger plan or "
            "``STREAMLIT_SCORING_TIMEOUT_SEC`` if the client gave up early."
        )

    text = (
        response.text
        or ""
    )

    snippet = text.strip()[:200]

    if snippet.lower().startswith(
        "<!doctype",
    ) or "<html" in snippet.lower():

        return (
            f"HTTP {code}: received an HTML error page from the host "
            "(often 502 Bad Gateway) instead of JSON. "
            "Inspect the API service logs on Render for crashes or OOM."
        )

    try:

        parsed = response.json()

        detail = parsed.get("detail")

        if detail is not None:

            return str(detail)

    except Exception:

        pass

    if len(text) > 1200:

        return f"{text[:1200]}…"

    return text or f"HTTP {code} with empty body"


def run_screening_via_api(
    dataframe: pd.DataFrame,
) -> Dict[str, Any]:
    """
    Send dataframe to backend API.
    """

    dataframe = sanitise_dataframe(
        dataframe
    )

    payload = dataframe.to_dict(
        orient="records"
    )

    timeout_sec = get_scoring_request_timeout_sec()

    response = requests.post(
        f"{get_api_base_url()}/scoring/run",
        json={"records": payload},
        timeout=timeout_sec,
    )

    if response.status_code != 200:

        error_detail = format_scoring_http_error(
            response,
        )

        raise RuntimeError(
            f"Backend scoring failed: "
            f"{error_detail}"
        )

    api_result = response.json()

    if not api_result.get("status") == "success":
        raise RuntimeError(
            api_result.get(
                "message",
                "Backend workflow failed.",
            )
        )

    return api_result

# =============================================================================
# HEADER
# =============================================================================

st.title(
    "Digital Trade Compliance AI"
)

st.markdown(
    """
Production-grade compliance screening platform for:

- Carbon disclosure verification
- Rules-of-origin validation
- Supply-chain traceability assessment
- AI-powered shipment risk prioritisation
- Operational compliance monitoring
"""
)

# =============================================================================
# BACKEND STATUS
# =============================================================================

backend_online = (
    check_backend_health()
)

if backend_online:

    st.success(
        "Backend API connected"
    )

else:

    st.error(
        "Backend API unavailable. "
        "Start FastAPI backend before using the platform."
    )

# =============================================================================
# SIDEBAR
# =============================================================================

selected_page = render_sidebar()

# =============================================================================
# HOME PAGE
# =============================================================================

if selected_page == "Home":

    st.subheader(
        "Platform Overview"
    )

    st.markdown(
        """
This platform provides:

- Automated compliance screening
- Trade anomaly detection
- Shipment risk prioritisation
- Explainable operational insights
- Review queue generation
- Operator-focused compliance analytics
"""
    )

    st.info(
        """
Recommended workflow:

1. Upload shipment dataset
2. Run compliance screening
3. Review flagged shipments
4. Export operational report
"""
    )

# =============================================================================
# UPLOAD & SCREENING PAGE
# =============================================================================

elif selected_page == "Upload & Screening":

    st.subheader(
        "Upload Trade Dataset"
    )

    uploaded_file = (
        render_upload_widget()
    )

    if uploaded_file is not None:

        try:

            # =====================================================
            # LOAD DATASET
            # =====================================================

            if uploaded_file.name.lower().endswith(
                ".csv"
            ):

                input_df = pd.read_csv(
                    uploaded_file
                )

            else:

                input_df = pd.read_excel(
                    uploaded_file
                )

            input_df = sanitise_dataframe(
                input_df
            )

            st.success(
                f"Dataset loaded successfully: "
                f"{len(input_df):,} records"
            )

            st.dataframe(
                input_df.head(),
                width="stretch",
            )

            # =====================================================
            # STORE INPUT
            # =====================================================

            SessionManager.set(
                "input_dataframe",
                input_df,
            )

            SessionManager.set(
                "uploaded_filename",
                uploaded_file.name,
            )

            # =====================================================
            # RUN SCREENING
            # =====================================================

            if st.button(
                "Run Compliance Screening",
                type="primary",
            ):

                if not backend_online:

                    st.error(
                        "Backend API unavailable."
                    )

                else:

                    with st.spinner(
                        "Running compliance screening workflow..."
                    ):

                        api_result = (
                            run_screening_via_api(
                                dataframe=input_df
                            )
                        )

                    if not api_result:
                        raise RuntimeError(
                            "Backend returned empty response."
                        )

                    if api_result.get("status") != "success":
                        raise RuntimeError(
                            api_result.get(
                                "message",
                                "Compliance workflow failed.",
                            )
                        )

                    # =================================================
                    # RESPONSE PARSING
                    # =================================================

                    records = api_result.get(
                        "records",
                        [],
                    )

                    summary = api_result.get(
                        "screening_summary",
                        {},
                    )

                    upload_summary = api_result.get(
                        "upload_summary",
                        {},
                    )

                    system_insights = api_result.get(
                        "system_insights",
                        {},
                    )

                    operational_metrics = api_result.get(
                        "operational_metrics",
                        {},
                    )

                    compliance_risks = api_result.get(
                        "compliance_risks",
                        {},
                    )

                    priority_review_queue = api_result.get(
                        "priority_review_queue",
                        [],
                    )

                    results_df = pd.DataFrame(
                        records
                    )

                    results_df = sanitise_dataframe(
                        results_df
                    )

                    chart_df = sample_dataframe_for_charts(
                        results_df
                    )

                    # =================================================
                    # STORE SESSION DATA
                    # =================================================

                    SessionManager.set(
                        "workflow_result",
                        api_result,
                    )

                    SessionManager.set(
                        "screening_results",
                        records,
                    )

                    SessionManager.set(
                        "results_dataframe",
                        results_df,
                    )

                    SessionManager.set(
                        "summary_metrics",
                        summary,
                    )

                    SessionManager.set(
                        "upload_summary",
                        upload_summary,
                    )

                    SessionManager.set(
                        "system_insights",
                        system_insights,
                    )

                    SessionManager.set(
                        "operational_metrics",
                        operational_metrics,
                    )

                    SessionManager.set(
                        "compliance_risks",
                        compliance_risks,
                    )

                    SessionManager.set(
                        "priority_review_queue",
                        priority_review_queue,
                    )

                    SessionManager.set(
                        "api_response",
                        api_result,
                    )

                    st.success(
                        "Compliance screening completed successfully."
                    )

                    processing_metadata = api_result.get(
                        "processing_metadata",
                        {},
                    )

                    SessionManager.set(
                        "processing_metadata",
                        processing_metadata,
                    )

                    st.info(
                        f"{len(results_df):,} records screened."
                    )

        except Exception as exc:

            st.error(
                "Compliance screening failed."
            )

            st.exception(exc)

# =============================================================================
# RESULTS DASHBOARD
# =============================================================================

elif selected_page == "Results Dashboard":

    st.markdown(
        """
<div style="
padding:12px 14px;
border-radius:8px;
background:#ECEFF1;
color:#263238;
font-weight:700;
font-size:24px;
border:1px solid #CFD8DC;
">
Compliance Screening Results
</div>
""",
        unsafe_allow_html=True,
    )

    results_df = SessionManager.get(
        "results_dataframe"
    )

    summary_metrics = SessionManager.get(
        "summary_metrics"
    )

    upload_summary = SessionManager.get(
        "upload_summary"
    )

    system_insights = SessionManager.get(
        "system_insights"
    )

    operational_metrics = SessionManager.get(
        "operational_metrics"
    )

    compliance_risks = SessionManager.get(
        "compliance_risks"
    )

    priority_review_queue = SessionManager.get(
        "priority_review_queue"
    )

    uploaded_filename = SessionManager.get(
        "uploaded_filename"
    )

    processing_metadata = SessionManager.get(
        "processing_metadata"
    )

    if (
        results_df is None
        or len(results_df) == 0
    ):

        st.warning(
            "No screening results available."
        )

    else:

        results_df = sanitise_dataframe(
            results_df
        )

        chart_df = sample_dataframe_for_charts(
            results_df
        )

        if processing_metadata:
            st.subheader(
                "Workflow Processing Metadata"
            )

            col1, col2, col3 = st.columns(3)

            with col1:
                execution_seconds = float(
                    processing_metadata.get(
                        "processing_duration_seconds",
                        0,
                    )
                )
                st.metric(
                    "Execution Time",
                    f"{execution_seconds:.2f} sec",
                )

            with col2:
                st.metric(
                    "Model Version",
                    "DTCAI_V1.0",
                )

            with col3:
                st.metric(
                    "Workflow Status",
                    processing_metadata.get(
                        "workflow_status",
                        "Completed",
                    ),
                )

            st.divider()

        # =====================================================
        # UPLOAD SUMMARY
        # =====================================================

        st.subheader(
            "Upload Summary"
        )

        col1, col2 = st.columns(2)

        with col1:

            st.metric(
                "Uploaded File",
                uploaded_filename
                if uploaded_filename
                else "Unknown",
            )

        with col2:

            st.metric(
                "Total Records",
                f"{len(results_df):,}",
            )

        st.divider()

        # =====================================================
        # SCREENING SUMMARY
        # =====================================================

        render_summary_cards(
            screening_summary=summary_metrics,
            operational_metrics=operational_metrics,
        )

        st.divider()

        # =====================================================
        # SYSTEM INSIGHTS
        # =====================================================

        if system_insights:

            st.subheader(
                "System Insights"
            )

            insights = system_insights

            col1, col2, col3 = st.columns(3)

            with col1:

                st.metric(
                    "Most Common Risk",
                    insights.get(
                        "most_common_violation_type",
                        "N/A",
                    ),
                )

            with col2:

                st.metric(
                    "Highest Risk Market",
                    insights.get(
                        "highest_risk_market",
                        "N/A",
                    ),
                )

            with col3:

                st.metric(
                    "Most Affected Category",
                    insights.get(
                        "most_affected_category",
                        "N/A",
                    ),
                )

            st.divider()

        # =====================================================
        # PRIORITY REVIEW QUEUE
        # =====================================================

        st.subheader(
            "Priority Review Queue"
        )

        render_top_risk_table(
            results_df
        )

        st.divider()

        # =====================================================
        # CHARTS (last section for operator scan top-to-bottom)
        # =====================================================

        col_chart1, col_chart2 = st.columns(2)

        with col_chart1:

            render_risk_distribution_chart(
                chart_df
            )

        with col_chart2:

            render_risk_breakdown_chart(
                chart_df
            )

# =============================================================================
# EXPORT RESULTS
# =============================================================================

elif selected_page == "Export Results":

    st.subheader(
        "Export Compliance Results"
    )

    results_df = SessionManager.get(
        "results_dataframe"
    )

    upload_summary = SessionManager.get(
        "upload_summary"
    )

    system_insights = SessionManager.get(
        "system_insights"
    )

    operational_metrics = SessionManager.get(
        "operational_metrics"
    )

    compliance_risks = SessionManager.get(
        "compliance_risks"
    )

    priority_review_queue = SessionManager.get(
        "priority_review_queue"
    )

    processing_metadata = SessionManager.get(
        "processing_metadata"
    )

    if (
        results_df is None
        or len(results_df) == 0
    ):

        st.warning(
            "No screening results available for export."
        )

    else:

        results_df = sanitise_dataframe(
            results_df
        )

        # =====================================================
        # CSV EXPORT
        # =====================================================

        csv_data = (
            export_service
            .export_dataframe_to_csv_bytes(
                dataframe=results_df
            )
        )

        st.download_button(
            label="Download CSV Results",
            data=csv_data,
            file_name="compliance_results.csv",
            mime="text/csv",
        )

        # =====================================================
        # JSON EXPORT
        # =====================================================

        json_data = (
            export_service
            .export_dataframe_to_json_bytes(
                dataframe=results_df
            )
        )

        st.download_button(
            label="Download JSON Results",
            data=json_data,
            file_name="compliance_results.json",
            mime="application/json",
        )

        # =====================================================
        # OPERATOR REPORT EXPORT
        # =====================================================

        report_payload = {
            "upload_summary":
                upload_summary,

            "system_insights":
                system_insights,

            "operational_metrics":
                operational_metrics,

            "compliance_risks":
                compliance_risks,

            "priority_review_queue":
                priority_review_queue,

            "processing_metadata":
                processing_metadata,
        }

        report_json = (
            pd.DataFrame(
                [report_payload]
            )
            .to_json(
                orient="records",
                indent=2,
            )
            .encode("utf-8")
        )

        st.download_button(
            label="Download Operator Report",
            data=report_json,
            file_name="operator_report.json",
            mime="application/json",
        )

        st.success(
            "Export files ready."
        )

# =============================================================================
# SYSTEM STATUS PAGE
# =============================================================================

elif selected_page == "System Status":

    st.subheader(
        "System Diagnostics"
    )

    st.markdown(
        "### Backend API Status"
    )

    if backend_online:

        st.success(
            "Backend API operational"
        )

    else:

        st.error(
            "Backend API unavailable"
        )

    st.markdown(
        "### Active Session State"
    )

    try:

        session_keys = (
            SessionManager.keys()
        )

        st.write(session_keys)

    except Exception:

        st.info(
            "Session state inspection unavailable."
        )

    st.markdown(
        "### Loaded Records"
    )

    input_df = SessionManager.get(
        "input_dataframe"
    )

    if input_df is not None:

        st.info(
            f"{len(input_df):,} uploaded records"
        )

    results_df = SessionManager.get(
        "results_dataframe"
    )

    if (
        results_df is not None
        and len(results_df) > 0
    ):

        st.info(
            f"{len(results_df):,} screened records available"
        )

# =============================================================================
# FOOTER
# =============================================================================

st.divider()

st.caption(
    "Digital Trade Compliance AI Platform | "
    "Operational Compliance Intelligence System"
)