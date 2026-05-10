from __future__ import annotations

import ast
import json
import pandas as pd
import streamlit as st

from frontend.state.session_manager import (
    SessionManager,
)

MAX_TABLE_ROWS = 1000

# =====================================================
# RISK STYLING
# =====================================================

RISK_COLOURS = {
    "critical": "#B71C1C",
    "high": "#D50000",
    "medium": "#FFD600",
    "low": "#00C853",
}


class RiskTables:
    """
    Operator-focused compliance review tables.

    Responsibilities:
    - flagged shipment review
    - compliance issue breakdown
    - operational triage queue
    - priority investigation support
    """

    # =====================================================
    # DATAFRAME SANITISATION
    # =====================================================

    @staticmethod
    def sanitise_dataframe(
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        if df is None:
            return pd.DataFrame()

        out = df.copy()

        out = out.loc[
            :,
            ~out.columns.duplicated()
        ]

        out.replace(
            [float("inf"), float("-inf")],
            0,
            inplace=True,
        )

        out.fillna(
            "",
            inplace=True,
        )

        return out

    @staticmethod
    def operational_review_mask(
        df: pd.DataFrame,
    ) -> tuple[pd.Series | None, str]:
        """
        Canonical product rule for who belongs in operational review backlog.

        Single source order:
        1) requires_review (workflow field from orchestration).
        2) severity_level in critical/high/medium.
        3) hybrid_risk_label in critical/high/medium — legacy parity when 1–2 absent.

        Returns (boolean mask aligned to df.index, short provenance string for captions).
        """
        if df is None or df.empty:
            return None, ""

        if "requires_review" in df.columns:

            def _truthy_requires_review(val: object) -> bool:

                if val is True:
                    return True

                if val is False:
                    return False

                txt = (
                    str(val)
                    .strip()
                    .lower()
                )

                return txt in {
                    "true",
                    "1",
                    "yes",
                }

            mask = (
                df[
                    "requires_review"
                ]
                .map(
                    _truthy_requires_review,
                )
            )

            return (
                mask,
                "workflow field requires_review",
            )

        if "severity_level" in df.columns:

            mask = (
                df[
                    "severity_level"
                ]
                .astype(str)
                .str.strip()
                .str.lower()
                .isin(
                    [
                        "critical",
                        "high",
                        "medium",
                    ]
                )
            )

            return (
                mask,
                "severity_level (critical, high, or medium)",
            )

        if "hybrid_risk_label" in df.columns:

            mask = (
                df[
                    "hybrid_risk_label"
                ]
                .astype(str)
                .str.strip()
                .str.lower()
                .isin(
                    [
                        "critical",
                        "high",
                        "medium",
                    ]
                )
            )

            return (
                mask,
                "hybrid_risk_label (model tier — use when workflow fields are absent)",
            )

        return None, ""

    @staticmethod
    def _export_operational_review_csv_bytes(
        df: pd.DataFrame,
        review_mask: pd.Series,
        base_columns: list[str],
    ) -> bytes | None:

        export_columns_extra = (
            ["severity_level", "requires_review", "review_status"]
        )

        export_columns_full = list(
            dict.fromkeys(
                base_columns + [
                    col for col in export_columns_extra
                    if col in df.columns
                ],
            )
        )

        if not export_columns_full:
            return None

        full_review_df = df[
            review_mask.fillna(False)
        ].copy()

        present_cols = [
            col for col in export_columns_full
            if col in full_review_df.columns
        ]

        if not present_cols:
            return None

        return (
            full_review_df[
                present_cols
            ]
            .to_csv(
                index=False,
            )
            .encode(
                "utf-8",
            )
        )

    @staticmethod
    def render_flagged_compliance_records_section(
        df: pd.DataFrame,
        review_mask: pd.Series | None,
        requires_review_csv_data: bytes | None,
        review_source: str,
    ) -> None:

        st.subheader(
            "Flagged Compliance Records"
        )

        st.caption(
            "Filtered using workflow that requires review."
        )

        if review_mask is None:

            st.warning(
                "Cannot determine operational review backlog: dataset needs "
                "requires_review, severity_level, or hybrid_risk_label."
            )

            return

        flagged_df = df[
            review_mask.fillna(False)
        ]

        if flagged_df.empty:

            st.success(
                "No records currently require operational review."
            )

            return

        display_columns_flagged = [
            col for col in [
                "record_id",
                "requires_review",
                "severity_level",
                "review_status",
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
            ]
            if col in flagged_df.columns
        ]

        display_columns_flagged = list(
            dict.fromkeys(display_columns_flagged)
        )

        flagged_df = RiskTables.sanitise_dataframe(
            flagged_df
        )

        st.dataframe(
            flagged_df[
                display_columns_flagged
            ].head(MAX_TABLE_ROWS),
            width="stretch",
        )

        rows_shown = min(
            len(flagged_df),
            MAX_TABLE_ROWS,
        )

        if len(flagged_df) > MAX_TABLE_ROWS:

            st.caption(
                f"Showing first {rows_shown:,} of {len(flagged_df):,} "
                "operational-review rows — use the CSV export below for all."
            )

        if requires_review_csv_data is not None:

            st.download_button(
                label="Download full operational review CSV",
                data=requires_review_csv_data,
                file_name="requires_review_records.csv",
                mime="text/csv",
                help=(
                    "Full operational review backlog"
                    + (
                        f" ({review_source})."
                        if review_source
                        else "."
                    )
                ),
            )

    @staticmethod
    def parse_icc_payload(
        payload: object,
    ) -> object:
        """
        Parse ICC payloads that may arrive as dict objects or
        Python-dict-like strings from serialised backend rows.
        """
        if isinstance(
            payload,
            (dict, list),
        ):
            return payload

        if payload is None:
            return {}

        text = str(payload).strip()
        if not text:
            return {}

        # First try strict JSON.
        try:
            return json.loads(text)
        except Exception:
            pass

        # Fallback for Python literal strings (single quotes / None / True / False).
        try:
            parsed = ast.literal_eval(text)
            if isinstance(
                parsed,
                (dict, list),
            ):
                return parsed
        except Exception:
            pass

        # Return original text when structured parsing fails.
        return {"raw_icc_payload": text}

    @staticmethod
    def build_operator_risk_drivers(
        row: pd.Series,
    ) -> list[str]:
        """
        Build concise, operator-facing risk drivers for a record.
        """
        drivers: list[str] = []

        rule_hits = int(
            pd.to_numeric(
                row.get(
                    "rule_flag_count",
                    0,
                ),
                errors="coerce",
            )
            if pd.notna(
                row.get(
                    "rule_flag_count",
                    0,
                )
            )
            else 0
        )
        if rule_hits > 0:
            drivers.append(
                f"{rule_hits} compliance rule hit(s) detected."
            )

        fraud_score = float(
            pd.to_numeric(
                row.get(
                    "fraud_score",
                    0.0,
                ),
                errors="coerce",
            )
            if pd.notna(
                row.get(
                    "fraud_score",
                    0.0,
                )
            )
            else 0.0
        )
        if fraud_score >= 0.5:
            drivers.append(
                "Elevated fraud pattern signal."
            )

        batch_score = float(
            pd.to_numeric(
                row.get(
                    "batch_risk_score",
                    0.0,
                ),
                errors="coerce",
            )
            if pd.notna(
                row.get(
                    "batch_risk_score",
                    0.0,
                )
            )
            else 0.0
        )
        if batch_score >= 0.33:
            drivers.append(
                "Part of a higher-risk batch cluster."
            )

        anomaly_class = str(
            row.get(
                "anomaly_class",
                "",
            )
        ).strip().lower()
        if anomaly_class and anomaly_class not in {
            "none",
            "normal",
            "unknown",
        }:
            drivers.append(
                f"Anomaly pattern observed ({anomaly_class})."
            )

        if not drivers:
            drivers.append(
                "No strong risk drivers surfaced; record appears lower-priority."
            )

        return drivers

    # =====================================================
    # MAIN RENDER
    # =====================================================

    @staticmethod
    def render_all() -> None:

        results = SessionManager.get(
            "results_dataframe"
        )

        if results is None:

            st.info(
                "No screening results available."
            )

            return

        df = pd.DataFrame(results)

        # -------------------------------------------------
        # REMOVE DUPLICATE COLUMNS
        # -------------------------------------------------

        df = RiskTables.sanitise_dataframe(
            df
        )

        RiskTables.render_priority_review_queue(
            df
        )

        st.divider()

        RiskTables.render_compliance_issue_breakdown(
            df
        )

    # =====================================================
    # PRIORITY REVIEW QUEUE
    # =====================================================

    @staticmethod
    def render_priority_review_queue(
        df: pd.DataFrame,
    ) -> None:

        # Section title rendered once by app.py (avoid duplicate headings).

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        # -------------------------------------------------
        # REMOVE DUPLICATE COLUMNS
        # -------------------------------------------------

        df = RiskTables.sanitise_dataframe(
            df
        )

        if "hybrid_score" not in df.columns:

            st.warning(
                "hybrid_score column missing."
            )

            return

        ranking_column = (
            "hybrid_score"
            if "hybrid_score" in df.columns
            else (
                "fraud_score"
                if "fraud_score" in df.columns
                else "rule_flag_count"
            )
        )

        ranked_df = (
            df.sort_values(
                by=ranking_column,
                ascending=False,
            )
            .copy()
        )

        # Fixed on-screen queue depth for stable operator workflow (exports still allow full sets).
        QUEUE_DISPLAY_TOP_N = 20
        top_k = min(
            QUEUE_DISPLAY_TOP_N,
            len(ranked_df),
        )
        ranked_df = ranked_df.head(
            top_k
        )

        st.caption(
            f"Queue is ranked by hybrid risk score; showing top {top_k} of {len(df)} screened records."
        )

        # -------------------------------------------------
        # VISUAL RISK INDICATOR
        # -------------------------------------------------

        ranked_df[
            "risk_indicator"
        ] = ranked_df[
            "hybrid_risk_label"
        ].astype(str).str.lower().map(
            {
                "critical": "🔴",
                "high": "🟠",
                "medium": "🟡",
                "low": "🟢",
            }
        )

        # -------------------------------------------------
        # DEFAULT OPERATOR ACTIONS
        # -------------------------------------------------

        if (
            "recommended_action"
            not in ranked_df.columns
        ):

            ranked_df[
                "recommended_action"
            ] = ranked_df[
                "hybrid_risk_label"
            ].apply(
                lambda x:
                "Immediate investigation"
                if str(x).lower()
                == "high"
                else (
                    "Manual compliance review"
                    if str(x).lower()
                    == "medium"
                    else "Monitor"
                )
            )

        # -------------------------------------------------
        # DISPLAY COLUMNS
        # -------------------------------------------------

        display_columns = [
            col for col in [
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
            ]
            if col in ranked_df.columns
        ]

        # -------------------------------------------------
        # REMOVE DUPLICATE DISPLAY COLUMNS
        # -------------------------------------------------

        display_columns = list(
            dict.fromkeys(display_columns)
        )

        ranked_df = RiskTables.sanitise_dataframe(
            ranked_df
        )

        selected_idx = 0
        selector_options = list(
            range(len(ranked_df))
        )
        def _hybrid_pct(
            row: pd.Series,
        ) -> float:
            raw = pd.to_numeric(
                row.get("hybrid_score", 0),
                errors="coerce",
            )
            if pd.isna(raw):
                raw = 0.0
            return float(raw) * 100.0

        selected_idx = st.selectbox(
            "Inspect record for operator explanation",
            options=selector_options,
            format_func=lambda idx: (
                f"{ranked_df.iloc[idx].get('record_id', f'row_{idx + 1}')} "
                f"| composite risk {_hybrid_pct(ranked_df.iloc[idx]):.1f}%"
            ),
            index=0,
        )

        queue_table_df = ranked_df[
            display_columns
        ].head(MAX_TABLE_ROWS)

        st.dataframe(
            queue_table_df,
            width="stretch",
        )

        csv_data = queue_table_df.to_csv(
            index=False,
        ).encode("utf-8")

        review_mask, review_source = RiskTables.operational_review_mask(
            df,
        )

        requires_review_csv_data = None

        if review_mask is not None:

            requires_review_csv_data = (
                RiskTables._export_operational_review_csv_bytes(
                    df,
                    review_mask,
                    display_columns,
                )
            )

        st.download_button(
            label="Download Priority queue (top 20) CSV",
            data=csv_data,
            file_name="priority_review_queue.csv",
            mime="text/csv",
            help="Same rows as on-screen Priority Review Queue; triage sample only.",
        )

        RiskTables.render_flagged_compliance_records_section(
            df,
            review_mask,
            requires_review_csv_data,
            review_source,
        )

        focus_row = ranked_df.iloc[
            selected_idx
        ]

        requires_review = str(
            focus_row.get(
                "severity_level",
                "",
            )
        ).lower() in {
            "critical",
            "high",
            "medium",
        }

        severity_label = str(
            focus_row.get(
                "severity_level",
                "unknown",
            )
        ).title()
        recommended_action = str(
            focus_row.get(
                "recommended_action",
                "Manual review recommended.",
            )
        )

        hybrid_pct_display = (
            _hybrid_pct(focus_row)
        )

        st.markdown(
            "### Operator Decision Snapshot"
        )
        snapshot_col1, snapshot_col2, snapshot_col3 = st.columns(3)
        with snapshot_col1:
            st.metric(
                "Requires Review",
                "Yes" if requires_review else "No",
            )
        with snapshot_col2:
            st.metric(
                "Severity",
                severity_label,
            )
        with snapshot_col3:
            st.metric(
                label="Composite risk",
                value=f"{hybrid_pct_display:.1f}%",
                help="Combined score on a 0–100 scale (see definitions below).",
            )

        with st.expander(
            "What do severity and composite risk mean?",
            expanded=False,
        ):
            st.markdown(
                """
**Severity**

Classification for triage (**Low**, **Medium**, **High**, **Critical**) from blended signals (rules, model, anomalies, emissions, traceability guidance). Operators should escalate when severity is Critical or High.

**Composite risk (0–100%)**

Single priority number for sorting the queue. It combines model likelihood, anomaly score, compliance rules, and supporting intelligence signals on an internal scale: **≈25%–50% medium**, **≥50% high urgency**, higher values merit faster review alongside severity.

Other columns (**fraud**, **rules**, **batch** where shown) use either counts or percentages; treat higher fraud-related percentages as needing extra documentation checks.
"""
            )

        st.info(
            f"Recommended action: {recommended_action}"
        )

        st.markdown(
            "**Why this record is in the queue**"
        )
        for driver in RiskTables.build_operator_risk_drivers(
            focus_row
        ):
            st.write(f"- {driver}")

        if "icc" in ranked_df.columns:

            with st.expander(
                "View technical ICC-normalised payload"
            ):
                sample_icc_payload = (
                    ranked_df[
                        "icc"
                    ].iloc[selected_idx]
                )
                st.json(
                    RiskTables.parse_icc_payload(
                        sample_icc_payload
                    )
                )

    # =====================================================
    # FLAGGED RECORDS
    # =====================================================

    @staticmethod
    def render_flagged_records(
        df: pd.DataFrame,
    ) -> None:

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        # -------------------------------------------------
        # REMOVE DUPLICATE COLUMNS
        # -------------------------------------------------

        df = RiskTables.sanitise_dataframe(
            df
        )

        review_mask, review_source = RiskTables.operational_review_mask(
            df,
        )

        base_export_columns = [
            col for col in [
                "record_id",
                "requires_review",
                "severity_level",
                "review_status",
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
            ]
            if col in df.columns
        ]

        requires_review_csv_data = None

        if review_mask is not None:

            requires_review_csv_data = (
                RiskTables._export_operational_review_csv_bytes(
                    df,
                    review_mask,
                    base_export_columns,
                )
            )

        RiskTables.render_flagged_compliance_records_section(
            df,
            review_mask,
            requires_review_csv_data,
            review_source,
        )

    # =====================================================
    # COMPLIANCE ISSUE BREAKDOWN
    # =====================================================

    @staticmethod
    def render_compliance_issue_breakdown(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Compliance Issue Breakdown"
        )

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        # -------------------------------------------------
        # REMOVE DUPLICATE COLUMNS
        # -------------------------------------------------

        df = RiskTables.sanitise_dataframe(
            df
        )

        issue_column = None

        if "compliance_issue" in df.columns:

            issue_column = "compliance_issue"

        elif "explanation" in df.columns:

            issue_column = "explanation"

        else:

            st.warning(
                "No compliance issue column available."
            )

            return

        # -------------------------------------------------
        # BATCH INTELLIGENCE SUMMARY
        # -------------------------------------------------

        if "batch_risk_score" in df.columns:

            avg_batch_risk = round(
                pd.to_numeric(
                    df["batch_risk_score"],
                    errors="coerce",
                )
                .fillna(0)
                .mean(),
                3,
            )

            st.info(
                f"Average batch risk score: "
                f"{avg_batch_risk}"
            )

        breakdown_df = (
            df[issue_column]
            .fillna("Unknown")
            .astype(str)
            .value_counts()
            .reset_index()
        )

        breakdown_df.columns = [
            "Compliance Issue",
            "Count",
        ]

        st.dataframe(
            breakdown_df,
            width="stretch",
        )


# =========================================================
# FUNCTIONAL WRAPPERS
# =========================================================

def render_top_risk_table(
    dataframe: pd.DataFrame,
) -> None:

    RiskTables.render_priority_review_queue(
        dataframe
    )


def render_flagged_records_table(
    dataframe: pd.DataFrame,
) -> None:

    RiskTables.render_flagged_records(
        dataframe
    )