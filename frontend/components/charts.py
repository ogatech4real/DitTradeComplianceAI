from __future__ import annotations

import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.cm as cm

from frontend.state.session_manager import (
    SessionManager,
)

# =====================================================
# VISUAL PALETTES
# =====================================================

RISK_COLOURS = {
    "critical": "#B71C1C",
    "high": "#D50000",
    "medium": "#FFD600",
    "low": "#00C853",
}

CHART_BACKGROUND = "#0E1117"

GRID_COLOUR = "#444444"

# =====================================================
# CHART STYLING
# =====================================================

def apply_chart_style(ax) -> None:

    ax.grid(
        alpha=0.25,
        linestyle="--",
        color=GRID_COLOUR,
    )

    ax.set_axisbelow(True)


class Charts:
    """
    Operator-facing compliance analytics.

    Responsibilities:
    - compliance exposure visualisation
    - operational risk monitoring
    - review workload visibility
    - shipment risk analytics
    """

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

        Charts.render_risk_distribution(
            df
        )

        st.divider()

        Charts.render_score_distribution(
            df
        )

        st.divider()

        Charts.render_rule_flag_distribution(
            df
        )

        st.divider()

        Charts.render_compliance_issue_distribution(
            df
        )

        st.divider()

        Charts.render_anomaly_distribution(
            df
        )

        st.divider()

        Charts.render_review_priority_analysis(
            df
        )

    # =====================================================
    # RISK DISTRIBUTION
    # =====================================================

    @staticmethod
    def render_risk_distribution(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Compliance Risk Distribution"
        )

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        if (
            "hybrid_risk_label"
            not in df.columns
        ):

            st.warning(
                "hybrid_risk_label column missing."
            )

            return

        counts = (
            df[
                "hybrid_risk_label"
            ]
            .astype(str)
            .value_counts()
        )

        fig, ax = plt.subplots(
            figsize=(6, 4)
        )

        risk_colours = [
            RISK_COLOURS.get(
                str(label).lower(),
                "#2979FF",
            )
            for label in counts.index
        ]

        ax.pie(
            counts.values,
            labels=counts.index,
            autopct="%1.1f%%",
            startangle=90,
            colors=risk_colours,
            wedgeprops={
                "width": 0.42,
                "edgecolor": "white",
            },
        )

        ax.set_xlabel(
            "Risk Classification"
        )

        ax.set_ylabel(
            "Shipment Count"
        )

        ax.set_title(
            "Distribution of Compliance Risk"
        )

        apply_chart_style(ax)

        st.pyplot(fig)

    # =====================================================
    # RISK SCORE DISTRIBUTION
    # =====================================================

    @staticmethod
    def render_score_distribution(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Operational Risk Score Distribution"
        )

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        if "hybrid_score" not in df.columns:

            st.warning(
                "hybrid_score column missing."
            )

            return

        fig, ax = plt.subplots(
            figsize=(7, 4)
        )

        ax.hist(
            pd.to_numeric(
                df["hybrid_score"],
                errors="coerce",
            ).dropna(),
            bins=20,
            color="#2979FF",
            edgecolor="black",
            alpha=0.85,
        )

        ax.set_xlabel(
            "Risk Score"
        )

        ax.set_ylabel(
            "Frequency"
        )

        ax.set_title(
            "Operational Risk Exposure"
        )

        apply_chart_style(ax)

        st.pyplot(fig)

    # =====================================================
    # RULE FLAG DISTRIBUTION
    # =====================================================

    @staticmethod
    def render_rule_flag_distribution(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Compliance Rule Violations"
        )

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        if (
            "rule_flag_count"
            not in df.columns
        ):

            st.warning(
                "rule_flag_count column missing."
            )

            return

        counts = (
            pd.to_numeric(
                df[
                    "rule_flag_count"
                ],
                errors="coerce",
            )
            .fillna(0)
            .astype(int)
            .value_counts()
            .sort_index()
        )

        fig, ax = plt.subplots(
            figsize=(7, 4)
        )

        colour_map = cm.viridis(
            np.linspace(
                0.2,
                0.9,
                len(counts),
            )
        )

        ax.bar(
            counts.index.astype(str),
            counts.values,
            color=colour_map,
        )

        ax.set_xlabel(
            "Number of Violations"
        )

        ax.set_ylabel(
            "Shipment Count"
        )

        ax.set_title(
            "Rule Violation Distribution"
        )

        apply_chart_style(ax)

        st.pyplot(fig)

    # =====================================================
    # REVIEW PRIORITY ANALYSIS
    # =====================================================

    @staticmethod
    def render_review_priority_analysis(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Review Workload Concentration"
        )

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        if "hybrid_score" not in df.columns:

            st.warning(
                "hybrid_score column missing."
            )

            return

        ranked_df = (
            df.sort_values(
                by="hybrid_score",
                ascending=False,
            )
            .copy()
        )

        percentages = [
            10,
            20,
            30,
            40,
            50,
        ]

        cumulative_risk = []

        total_risk = (
            pd.to_numeric(
                ranked_df[
                    "hybrid_score"
                ],
                errors="coerce",
            )
            .fillna(0)
            .sum()
        )

        if total_risk <= 0:

            st.warning(
                "No measurable operational risk detected."
            )

            return

        for pct in percentages:

            cutoff = int(
                len(ranked_df)
                * pct
                / 100
            )

            subset = ranked_df.head(
                cutoff
            )

            subset_risk = (
                pd.to_numeric(
                    subset[
                        "hybrid_score"
                    ],
                    errors="coerce",
                )
                .fillna(0)
                .sum()
            )

            concentration = (
                subset_risk
                / total_risk
            )

            cumulative_risk.append(
                concentration
            )

        fig, ax = plt.subplots(
            figsize=(7, 4)
        )

        ax.plot(
            percentages,
            cumulative_risk,
            marker="o",
            linewidth=3,
            color="#FF6D00",
        )

        ax.fill_between(
            percentages,
            cumulative_risk,
            alpha=0.2,
            color="#FF6D00",
        )

        ax.set_xlabel(
            "Top Priority Review Percentage"
        )

        ax.set_ylabel(
            "Captured Operational Risk"
        )

        ax.set_title(
            "Risk Concentration by Review Priority"
        )

        apply_chart_style(ax)

        st.pyplot(fig)

    # =====================================================
    # COMPLIANCE ISSUE DISTRIBUTION
    # =====================================================

    @staticmethod
    def render_compliance_issue_distribution(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Compliance Issue Categories"
        )

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        if "compliance_issue" not in df.columns:

            st.warning(
                "compliance_issue column missing."
            )

            return

        counts = (
            df["compliance_issue"]
            .astype(str)
            .value_counts()
        )

        fig, ax = plt.subplots(
            figsize=(7, 4)
        )

        issue_colours = cm.Set3(
            np.linspace(
                0,
                1,
                len(counts),
            )
        )

        ax.bar(
            counts.index,
            counts.values,
            color=issue_colours,
        )

        ax.set_xlabel(
            "Compliance Issue"
        )

        ax.set_ylabel(
            "Record Count"
        )

        ax.set_title(
            "Compliance Issue Distribution"
        )

        apply_chart_style(ax)

        plt.xticks(rotation=15)

        st.pyplot(fig)

    # =====================================================
    # FRAUD / ANOMALY DISTRIBUTION
    # =====================================================

    @staticmethod
    def render_anomaly_distribution(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Fraud & Anomaly Indicators"
        )

        if df.empty:

            st.warning(
                "Results dataframe is empty."
            )

            return

        if "anomaly_class" not in df.columns:

            st.info(
                "No anomaly intelligence available."
            )

            return

        counts = (
            df[
                "anomaly_class"
            ]
            .astype(str)
            .value_counts()
        )

        fig, ax = plt.subplots(
            figsize=(7, 4)
        )

        colours = cm.coolwarm(
            np.linspace(
                0.2,
                0.9,
                len(counts),
            )
        )

        ax.bar(
            counts.index,
            counts.values,
            color=colours,
        )

        ax.set_xlabel(
            "Anomaly Type"
        )

        ax.set_ylabel(
            "Detected Records"
        )

        ax.set_title(
            "Fraud and Anomaly Detection"
        )

        plt.xticks(
            rotation=20
        )

        apply_chart_style(ax)

        st.pyplot(fig)


# =========================================================
# FUNCTIONAL WRAPPERS
# =========================================================

def render_risk_distribution_chart(
    dataframe: pd.DataFrame,
) -> None:

    Charts.render_risk_distribution(
        dataframe
    )


def render_risk_breakdown_chart(
    dataframe: pd.DataFrame,
) -> None:

    Charts.render_rule_flag_distribution(
        dataframe
    )