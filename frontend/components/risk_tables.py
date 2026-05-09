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

        RiskTables.render_flagged_records(
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

        st.subheader(
            "Priority Review Queue"
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

        top_k = st.slider(
            "Records for operational review",
            min_value=5,
            max_value=100,
            value=20,
            step=5,
        )

        ranked_df = ranked_df.head(
            top_k
        )

        st.caption(
            "Queue is ranked by hybrid risk score; records shown are for operational triage."
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
        selected_idx = st.selectbox(
            "Inspect record for operator explanation",
            options=selector_options,
            format_func=lambda idx: (
                f"{ranked_df.iloc[idx].get('record_id', f'row_{idx + 1}')} "
                f"| risk={float(pd.to_numeric(ranked_df.iloc[idx].get('hybrid_score', 0), errors='coerce') or 0):.3f}"
            ),
            index=0,
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
                "Hybrid Risk Score",
                f"{float(pd.to_numeric(focus_row.get('hybrid_score', 0), errors='coerce') or 0):.3f}",
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

        col1, col2, col3, col4 = st.columns(4)

        with col1:

            st.metric(
                "Displayed Queue Records",
                len(ranked_df),
            )

        with col2:

            high_count = (
                ranked_df[
                    "hybrid_risk_label"
                ]
                .astype(str)
                .str.lower()
                .isin(
                    ["critical", "high"]
                )
                .sum()
            )

            st.metric(
                "Critical / High",
                int(high_count),
            )

        with col3:
            medium_count = (
                ranked_df[
                    "hybrid_risk_label"
                ]
                .astype(str)
                .str.lower()
                .eq("medium")
                .sum()
            )
            st.metric(
                "Medium",
                int(medium_count),
            )

        with col4:

            avg_score = round(
                pd.to_numeric(
                    ranked_df[
                        "hybrid_score"
                    ],
                    errors="coerce",
                )
                .fillna(0)
                .mean(),
                3,
            )

            st.metric(
                "Average Risk",
                avg_score,
            )

        st.dataframe(
            ranked_df[
                display_columns
            ].head(MAX_TABLE_ROWS),
            width="stretch",
        )

        csv_data = ranked_df[
            display_columns
        ].to_csv(
            index=False
        ).encode("utf-8")

        st.download_button(
            label="Download Review Queue CSV",
            data=csv_data,
            file_name="priority_review_queue.csv",
            mime="text/csv",
        )

    # =====================================================
    # FLAGGED RECORDS
    # =====================================================

    @staticmethod
    def render_flagged_records(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Flagged Compliance Records"
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

        if (
            "hybrid_risk_label"
            not in df.columns
        ):

            st.warning(
                "Risk label column missing."
            )

            return

        flagged_df = df[
            df[
                "hybrid_risk_label"
            ]
            .astype(str)
            .str.lower()
            .isin(
                [
                    "high",
                    "medium",
                    "critical",
                ]
            )
        ]

        if flagged_df.empty:

            st.success(
                "No records currently require review."
            )

            return

        display_columns = [
            col for col in [
                "record_id",
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

        display_columns = list(
            dict.fromkeys(display_columns)
        )

        flagged_df = RiskTables.sanitise_dataframe(
            flagged_df
        )

        st.dataframe(
            flagged_df[
                display_columns
            ].head(MAX_TABLE_ROWS),
            width="stretch",
        )

        csv_data = flagged_df[
            display_columns
        ].to_csv(
            index=False
        ).encode("utf-8")

        st.download_button(
            label="Download Flagged Records CSV",
            data=csv_data,
            file_name="flagged_records.csv",
            mime="text/csv",
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