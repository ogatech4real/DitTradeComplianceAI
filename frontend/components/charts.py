from __future__ import annotations

import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.cm as cm

from frontend.state.session_manager import (
    SessionManager,
)

from frontend.components.risk_tables import (
    RiskTables,
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


HYBRID_TIER_ORDER: list[str] = [
    "critical",
    "high",
    "medium",
    "low",
]


def _order_risk_label_counts(counts: pd.Series) -> pd.Series:

    order_map = {
        k: idx for idx, k in enumerate(HYBRID_TIER_ORDER)
    }

    indexed = []

    for label in counts.index:

        lbl = (
            str(label)
            .lower()
            .strip()
        )

        indexed.append(
            (
                order_map.get(
                    lbl,
                    999,
                ),
                str(label),
            )
        )

    indexed.sort(
        key=lambda t: (
            t[0],
            t[1].lower(),
        )
    )

    ordered_labels = [
        t[1] for t in indexed
    ]

    return counts.reindex(
        ordered_labels,
    )


def slice_operational_review_dataframe(
    df: pd.DataFrame,
) -> tuple[pd.DataFrame | None, str]:

    mask, provenance_short = RiskTables.operational_review_mask(
        df,
    )

    if mask is None:

        caption = (
            f"Charts use **all {len(df):,} screened records** "
            "(workflow fields needed to isolate **requires_review** backlog "
            "were not detected — same view as full export)."
        )

        return df.copy(), caption

    backlog = df[
        mask.fillna(False)
    ].copy()

    if backlog.empty:

        return None, ""

    caption = (
        f"Charts use the **full operational review backlog** "
        f"(**{len(backlog):,}** records; {provenance_short}). "
        "Same rule as **Flagged Compliance Records**."
    )

    return backlog, caption


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
            .replace(
                "",
                "Unknown",
            )
            .str.strip()
            .value_counts()
        )

        counts = counts[counts.index != ""]

        if counts.empty:

            st.info(
                "No hybrid risk tiers to chart."
            )

            return

        counts = _order_risk_label_counts(
            counts,
        )

        total = max(
            int(
                counts.values.sum(),
            ),
            1,
        )

        def _autopct_pct_count(
            pct: float,
        ) -> str:

            n_share = (
                pct
                / 100.0
                * float(
                    total,
                )
            )

            n = int(round(n_share))

            return f"{pct:.1f}%\n({n})"

        fig, ax = plt.subplots(
            figsize=(
                5.8,
                4.9,
            )
        )

        risk_colours = [
            RISK_COLOURS.get(
                str(label).lower(),
                "#5C6BC0",
            )
            for label in counts.index
        ]

        label_titles = [
            str(label).title()
            for label in counts.index
        ]

        wedges, _texts, autotexts = ax.pie(
            counts.values,
            labels=label_titles,
            autopct=_autopct_pct_count,
            startangle=90,
            counterclock=False,
            colors=risk_colours,
            wedgeprops={
                "width": 0.48,
                "edgecolor": "white",
                "linewidth": 1.05,
            },
            textprops={
                "fontsize": 9,
            },
        )

        ax.axis(
            "equal",
        )

        for t in autotexts:
            t.set_fontweight(
                "semibold",
            )

        plt.tight_layout()

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

        apply_chart_style(ax)

        st.pyplot(fig)

    # =====================================================
    # RULE FLAG DISTRIBUTION
    # =====================================================

    @staticmethod
    def derive_violation_count(
        df: pd.DataFrame,
    ) -> pd.Series | None:
        """
        Return per-record violation count with schema-tolerant fallbacks.
        """
        if "rule_flag_count" in df.columns:
            return (
                pd.to_numeric(
                    df["rule_flag_count"],
                    errors="coerce",
                )
                .fillna(0)
                .clip(lower=0)
                .astype(int)
            )

        # Fallback: sum binary-like rule indicator fields if explicit count is absent.
        candidate_cols = [
            col for col in df.columns
            if (
                col.endswith("_flag")
                or col.endswith("_violation")
                or col.startswith("rule_")
            )
            and col != "hybrid_flag"
        ]

        if not candidate_cols:
            return None

        if len(candidate_cols) > 25:
            # Guardrail for very wide schemas; keep only most likely rule indicators.
            candidate_cols = [
                col for col in candidate_cols
                if "rule" in col
            ][:25]

        if not candidate_cols:
            return None

        flags_df = (
            df[candidate_cols]
            .apply(
                pd.to_numeric,
                errors="coerce",
            )
            .fillna(0)
        )

        # Treat any positive value in a rule indicator as one violation.
        return (flags_df > 0).sum(axis=1).astype(int)

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

        violation_count = Charts.derive_violation_count(
            df
        )

        if violation_count is None:

            st.warning(
                "No compatible violation-count field found for this upload schema."
            )

            return

        total_shipments = int(
            len(violation_count)
        )

        bins = pd.cut(
            violation_count,
            bins=[-1, 0, 1, 2, 3, np.inf],
            labels=[
                "0",
                "1",
                "2",
                "3",
                "4+",
            ],
        )

        counts = (
            bins.value_counts()
            .reindex(
                [
                    "0",
                    "1",
                    "2",
                    "3",
                    "4+",
                ],
                fill_value=0,
            )
        )

        colour_map = {
            "0": "#00C853",
            "1": "#FFD600",
            "2": "#FFAB00",
            "3": "#FF6D00",
            "4+": "#D50000",
        }
        bar_colours = [
            colour_map.get(
                str(label),
                "#2979FF",
            )
            for label in counts.index
        ]

        no_violation_count = int(
            counts.get(
                "0",
                0,
            )
        )
        any_violation_count = total_shipments - no_violation_count
        high_violation_count = int(
            counts.get(
                "4+",
                0,
            )
        )
        avg_violations = float(
            violation_count.mean()
        )

        m1, m2, m3, m4 = st.columns(4)
        with m1:
            st.metric(
                "No Violations",
                f"{(no_violation_count / max(total_shipments, 1)) * 100:.1f}%",
            )
        with m2:
            st.metric(
                "At Least One Violation",
                f"{(any_violation_count / max(total_shipments, 1)) * 100:.1f}%",
            )
        with m3:
            st.metric(
                "High-Violation Shipments (4+)",
                f"{high_violation_count:,}",
            )
        with m4:
            st.metric(
                "Avg Violations / Shipment",
                f"{avg_violations:.2f}",
            )

        fig, ax = plt.subplots(
            figsize=(7, 4)
        )

        bars = ax.bar(
            counts.index.astype(str),
            counts.values,
            color=bar_colours,
        )

        for bar, value in zip(
            bars,
            counts.values,
        ):
            pct = (
                (value / max(total_shipments, 1))
                * 100
            )
            ax.text(
                bar.get_x()
                + bar.get_width() / 2,
                bar.get_height()
                + max(1, 0.01 * total_shipments),
                f"{int(value):,}\n({pct:.1f}%)",
                ha="center",
                va="bottom",
                fontsize=8,
            )

        ax.set_xlabel(
            "Compliance Rule Violations per Shipment"
        )

        ax.set_ylabel(
            "Shipment Count"
        )

        apply_chart_style(ax)

        st.pyplot(fig)
        st.caption(
            f"Backlog rows = {total_shipments:,}. Fixed buckets: 0, 1, 2, 3, 4+."
        )

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

        plt.xticks(
            rotation=20
        )

        apply_chart_style(ax)

        st.pyplot(fig)

    # =====================================================
    # REVIEW BACKLOG — OPERATOR KPIs + WORKLOAD GEO
    # =====================================================

    @staticmethod
    def render_review_backlog_kpis(
        df: pd.DataFrame,
    ) -> None:

        if df.empty:

            return

        n_backlog = len(df)

        ch_hi_share: float | None = None

        if (
            "hybrid_risk_label"
            in df.columns
        ):

            tier = (
                df[
                    "hybrid_risk_label"
                ]
                .astype(
                    str,
                )
                .str.strip()
                .str.lower()
            )

            ch_hi_share = round(
                100.0
                * float(
                    tier.isin(
                        [
                            "critical",
                            "high",
                        ]
                    ).mean(),
                ),
                1,
            )

        elif (
            "severity_level"
            in df.columns
        ):

            tier = (
                df[
                    "severity_level"
                ]
                .astype(
                    str,
                )
                .str.strip()
                .str.lower()
            )

            ch_hi_share = round(
                100.0
                * float(
                    tier.isin(
                        [
                            "critical",
                            "high",
                        ]
                    ).mean(),
                ),
                1,
            )

        avg_composite_pct: float | None = None

        if (
            "hybrid_score"
            in df.columns
        ):

            avg_composite_pct = round(
                100.0
                * float(
                    pd.to_numeric(
                        df[
                            "hybrid_score"
                        ],
                        errors="coerce",
                    )
                    .fillna(0)
                    .mean(),
                ),
                1,
            )

        vc_series = Charts.derive_violation_count(
            df,
        )

        median_violations: float | None = None

        if vc_series is not None:

            median_violations = round(
                float(
                    vc_series.median(),
                ),
                2,
            )

        k1, k2, k3, k4 = st.columns(
            4,
        )

        with k1:

            st.metric(
                "Backlog records",
                f"{n_backlog:,}",
            )

        with k2:

            st.metric(
                "Critical / High share",
                (
                    f"{ch_hi_share:.1f}%"
                    if ch_hi_share is not None
                    else "N/A"
                ),
            )

        with k3:

            st.metric(
                "Avg composite risk",
                (
                    f"{avg_composite_pct:.1f}%"
                    if avg_composite_pct is not None
                    else "N/A"
                ),
            )

        with k4:

            st.metric(
                "Median violations / row",
                (
                    f"{median_violations:.2f}"
                    if median_violations is not None
                    else "N/A"
                ),
                help=(
                    "Per-row aggregate of rule-hit columns when explicit "
                    "rule_flag_count is absent."
                    if vc_series is not None
                    else None
                ),
            )

    @staticmethod
    def render_top_destination_workload_bar(
        df: pd.DataFrame,
        top_n: int = 8,
    ) -> None:

        st.subheader(
            "Top workload corridors"
        )

        geo_col = None

        if (
            "destination_market"
            in df.columns
        ):
            geo_col = "destination_market"

        elif (
            "applicable_jurisdiction"
            in df.columns
        ):
            geo_col = "applicable_jurisdiction"

        if geo_col is None:

            st.caption(
                "Destination market and jurisdiction columns are not "
                "available on this backlog."
            )

            return

        raw_geo = (
            df[
                geo_col
            ]
            .fillna(
                "",
            )
            .astype(
                str,
            )
            .str.strip()
        )

        labels = raw_geo.mask(
            raw_geo.eq(
                "",
            ),
            "Unknown",
        )

        labels = labels.mask(
            labels.str.casefold().isin(
                {
                    "nan",
                    "none",
                }
            ),
            "Unknown",
        )

        vc = labels.value_counts().head(top_n)

        if vc.empty:

            st.caption(
                "No corridor labels populated for backlog rows."
            )

            return

        fig, ax = plt.subplots(
            figsize=(
                7,
                max(
                    3.8,
                    0.42 * len(vc),
                ),
            ),
        )

        palette = plt.cm.Blues_r(
            np.linspace(
                0.35,
                0.88,
                len(vc),
            )
        )

        y_positions = np.arange(
            len(vc),
        )

        bars = ax.barh(
            y_positions,
            vc.values,
            color=palette,
            edgecolor="white",
            linewidth=0.6,
            height=0.72,
        )

        readable_col = geo_col.replace(
            "_",
            " ",
        )

        ax.set_yticks(
            y_positions,
        )

        wrap_labels = []

        for label in vc.index.astype(str):

            text = (
                (
                    label[:38] + "…"
                    if len(label)
                    > 40
                    else label
                )
            )

            wrap_labels.append(
                text,
            )

        ax.set_yticklabels(
            wrap_labels,
            fontsize=9,
        )

        ax.set_xlabel(
            f"{readable_col.title()} — records in backlog"
        )

        apply_chart_style(ax)

        ax.invert_yaxis()

        for bar, count in zip(
            bars,
            vc.values,
        ):

            ax.text(
                bar.get_width()
                + max(
                    0.015 * vc.sum(),
                    0.4,
                ),
                bar.get_y()
                + bar.get_height()
                / 2,
                f"{int(count):,}",
                va="center",
                fontsize=8,
            )

        plt.tight_layout()

        st.pyplot(fig)

        st.caption(
            f"{readable_col}: top {len(vc)} values by backlog row count "
            "(ties broken arbitrarily)."
        )

    # =====================================================
    # REVIEW BACKLOG — SINGLE RESULTS SCREEN
    # =====================================================

    @staticmethod
    def render_operational_review_insights(
        df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Operational review analytics"
        )

        backlog_df: pd.DataFrame | None
        scope_note: str

        backlog_df, scope_note = (
            slice_operational_review_dataframe(
                df,
            )
        )

        st.caption(
            scope_note,
        )

        if backlog_df is None:

            st.success(
                "Operational review backlog is empty for this run — "
                "no flagged rows matched the backlog rule."
            )

            return

        st.caption(
            scope_note,
        )

        Charts.render_review_backlog_kpis(
            backlog_df,
        )

        st.divider()

        row_primary_1, row_primary_2 = st.columns(
            2,
        )

        with row_primary_1:

            Charts.render_risk_distribution(
                backlog_df,
            )

        with row_primary_2:

            Charts.render_rule_flag_distribution(
                backlog_df,
            )

        row_secondary_1, row_secondary_2 = (
            st.columns(
                2,
            )
        )

        with row_secondary_1:

            Charts.render_score_distribution(
                backlog_df,
            )

        with row_secondary_2:

            Charts.render_top_destination_workload_bar(
                backlog_df,
            )

        if (
            "anomaly_class"
            in backlog_df.columns
        ):

            ac = (
                backlog_df[
                    "anomaly_class"
                ]
                .astype(
                    str,
                )
                .str.strip()
            )

            ac = ac[
                ac.ne(
                    "",
                )
                & ac.str.lower().ne(
                    "none",
                )
                & ac.str.lower().ne(
                    "nan",
                )
            ]

            if (
                len(
                    ac.dropna(),
                )
                >= 1
                and ac.nunique()
                <= 36
            ):

                Charts.render_anomaly_distribution(
                    backlog_df,
                )


# =========================================================
# FUNCTIONAL WRAPPERS
# =========================================================

def render_operational_review_insights(
    dataframe: pd.DataFrame,
) -> None:

    Charts.render_operational_review_insights(
        dataframe,
    )


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