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


def operational_review_backlog_state(
    df: pd.DataFrame,
) -> tuple[pd.DataFrame | None, str, str]:

    """
    Returns (backlog_df_or_none, caption, state_code).

    state_code — one of ``no_mask`` (cannot isolate backlog),
    ``empty`` (rule fired but cohort empty),
    ``backlog`` (canonical subset).
    """

    mask, provenance_short = RiskTables.operational_review_mask(
        df,
    )

    if mask is None:

        caption = (
            f"Workflow fields to isolate the review backlog are missing — "
            f"**{len(df):,}** screened records are shown intake-wide. "
            "Charts labelled backlog-only are suppressed or use full intake."
        )

        return (
            None,
            caption,
            "no_mask",
        )

    backlog = df[
        mask.fillna(False)
    ].copy()

    if backlog.empty:

        return (
            None,
            "",
            "empty",
        )

    caption = (
        f"Backlog-focused charts use the **operational review cohort** "
        f"(**{len(backlog):,}** rows; {provenance_short}) — same rule as "
        "**Flagged Compliance Records**."
    )

    return backlog, caption, "backlog"


def slice_operational_review_dataframe(
    df: pd.DataFrame,
) -> tuple[pd.DataFrame | None, str]:

    """
    Back-compat wrapper returning (backlog, caption) only.
    Prefer operational_review_backlog_state when state matters.
    """

    bl, cap, _state = operational_review_backlog_state(
        df,
    )

    return bl, cap


COMMODITY_PROFILE_COLUMNS: frozenset[
    str,
] = frozenset(
    {
        "product_family",
        "hs_code",
        "product_description",
        "commodity",
        "material",
        "harmonised_code",
        "harmonized_code",
    },
)

_SNAPSHOT_DENY_TOKEN: tuple[
    str,
    ...] = (
    "record_id",
    "shipment_id",
    "invoice_id",
    "uuid",
    "_hash",
    "checksum",
    "embedding",
    "vector",
    "timestamp",
    "payload",
)

_SNAPSHOT_DENY_PREFIX: tuple[
    str,
    ...] = (
    "explain",
    "raw_",
)

_INTAKE_COLUMN_PRIORITY: tuple[
    str,
    ...] = (
    "destination_market",
    "applicable_jurisdiction",
    "destination_country",
    "declared_origin_country",
    "country_of_export",
    "country_of_last_substantial_transformation",
    "production_stage_country_1",
    "production_stage_country_2",
    "port_of_export",
    "port_of_entry",
    "transport_mode",
    "incoterm",
    "production_method_tag",
)

_MATERIAL_KEYWORD_BUCKETS: tuple[
    tuple[str, tuple[str, ...]],
    ...] = (
    (
        "Battery / critical minerals",
        (
            "lithium",
            "cobalt",
            "nickel",
            "graphite",
            "rare earth",
            "neodymium",
        ),
    ),
    (
        "Copper",
        (
            "copper",
            "cathode",
        ),
    ),
    (
        "Steel / iron",
        (
            "steel",
            "iron",
            "stainless",
            "rebar",
            "pig iron",
        ),
    ),
    (
        "Aluminium",
        (
            "aluminium",
            "aluminum",
        ),
    ),
    (
        "Plastics / polymers",
        (
            "plastic",
            "polymer",
            "polyethylene",
            "polypropylene",
            "pvc",
        ),
    ),
    (
        "Wood / paper",
        (
            "timber",
            "lumber",
            "wood",
            "pulp",
            "paper",
        ),
    ),
    (
        "Cement / concrete",
        (
            "cement",
            "concrete",
            "clinker",
        ),
    ),
    (
        "Fuels / chemicals",
        (
            "petrol",
            "diesel",
            "fuel",
            "chemical",
            "fertilizer",
            "ammonia",
        ),
    ),
)


def _clean_label_series(
    series: pd.Series,
) -> pd.Series:

    raw = (
        series.fillna(
            "",
        )
        .astype(
            str,
        )
        .str.strip()
    )

    out = raw.mask(
        raw.eq(
            "",
        ),
        "Unknown",
    )

    return out.mask(
        out.str.casefold().isin(
            {
                "nan",
                "none",
            }
        ),
        "Unknown",
    )


def _column_name_unfit_for_intake_snapshot(
    col: str,
) -> bool:

    key = col.lower()

    if key in COMMODITY_PROFILE_COLUMNS:

        return True

    if any(
        key.startswith(
            p,
        )
        for p in _SNAPSHOT_DENY_PREFIX
    ):

        return True

    if any(
        tok in key for tok in _SNAPSHOT_DENY_TOKEN
    ):

        return True

    if key.endswith(
        "_score",
    ) or key in (
        "hybrid_risk_label",
        "severity_level",
        "requires_review",
        "review_status",
        "recommended_action",
        "compliance_issue",
        "anomaly_class",
        "risk_label",
    ):

        return True

    return False


def _series_ok_for_snapshot_bar(
    series: pd.Series,
) -> bool:

    if pd.api.types.is_datetime64_any_dtype(
        series,
    ):

        return False

    if pd.api.types.is_numeric_dtype(
        series,
    ):

        vals = pd.to_numeric(
            series,
            errors="coerce",
        ).dropna()

        if vals.empty:

            return False

        nu = int(
            vals.nunique(),
        )

        return (
            2 <= nu <= 28
        )

    cleaned = _clean_label_series(
        series,
    )

    mask = cleaned.ne(
        "Unknown",
    )

    if not mask.any():

        return False

    tt = cleaned[
        mask
    ]

    nu = int(
        tt.nunique(),
    )

    if nu < 2 or nu > 46:

        return False

    if float(
        tt.str.len().mean(),
    ) > 58.0:

        return False

    return True


def pick_ranked_intake_snapshot_columns(
    df: pd.DataFrame,
    max_columns: int = 4,
) -> list[str]:

    chosen: list[str] = []

    for col in _INTAKE_COLUMN_PRIORITY:

        if col in df.columns:

            if _series_ok_for_snapshot_bar(
                df[
                    col
                ],
            ):

                chosen.append(
                    col,
                )

        if len(
            chosen,
        ) >= max_columns:

            return chosen

    for col in df.columns:

        if len(
            chosen,
        ) >= max_columns:

            break

        if col in chosen:

            continue

        if _column_name_unfit_for_intake_snapshot(
            col,
        ):

            continue

        if _series_ok_for_snapshot_bar(
            df[
                col
            ],
        ):

            chosen.append(
                col,
            )

    return chosen[
        :max_columns
    ]


def _labels_for_intake_column(
    df: pd.DataFrame,
    col: str,
) -> pd.Series:

    series = df[
        col
    ]

    if pd.api.types.is_numeric_dtype(
        series,
    ):

        vals = pd.to_numeric(
            series,
            errors="coerce",
        )

        return vals.fillna(
            0,
        ).map(
            lambda x: f"{float(x):g}",
        )

    return _clean_label_series(
        series,
    )


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
        scope_note: str = "",
    ) -> None:

        st.subheader(
            "Compliance Risk Distribution"
        )

        if scope_note:

            st.caption(
                scope_note,
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
    # MANAGER / OPERATOR DASHBOARD BLOCKS
    # =====================================================

    @staticmethod
    def _render_single_intake_column_barh(
        df: pd.DataFrame,
        col: str,
        top_n: int = 8,
    ) -> None:

        labels = _labels_for_intake_column(
            df,
            col,
        )

        vc = labels.value_counts().head(
            top_n,
        )

        if vc.empty:

            st.caption(
                f"No usable values for `{col}`.",
            )

            return

        fig_h = max(
            3.2,
            0.38 * len(vc),
        )

        fig, ax = plt.subplots(
            figsize=(
                5.9,
                fig_h,
            ),
        )

        y_p = np.arange(
            len(vc),
        )

        blues = plt.cm.Blues_r(
            np.linspace(
                0.32,
                0.85,
                len(vc),
            )
        )

        ax.barh(
            y_p,
            vc.values,
            color=blues,
            edgecolor="white",
            linewidth=0.55,
            height=0.7,
        )

        ax.set_yticks(
            y_p,
        )

        ax.set_yticklabels(
            [
                (
                    str(ix)[:42] + "…"
                    if len(
                        str(ix),
                    )
                    > 44
                    else str(ix)
                )
                for ix in vc.index
            ],
            fontsize=8,
        )

        ax.set_xlabel(
            "Records"
        )

        readable = col.replace(
            "_",
            " ",
        )

        apply_chart_style(
            ax,
        )

        ax.invert_yaxis()

        plt.tight_layout()

        st.pyplot(
            fig,
        )

        st.caption(
            f"`{readable}` — top {len(vc)} values (ties arbitrary).",
        )

    @staticmethod
    def render_intake_snapshot_ranked_charts(
        full_df: pd.DataFrame,
        max_plots: int = 4,
        top_n_each: int = 8,
    ) -> None:

        st.subheader(
            "Intake snapshot — ranked columns"
        )

        st.caption(
            "Automatic pick of the most informative low-cardinality columns "
            "(route, geography, mode, …), after schema heuristics. "
            "Commodity-specific views sit in the next block.",
        )

        if full_df.empty:

            st.warning(
                "No rows to profile.",
            )

            return

        picked = pick_ranked_intake_snapshot_columns(
            full_df,
            max_columns=max_plots,
        )

        if not picked:

            st.info(
                "No additional categorical columns met the bar-chart rules "
                "for this dataset.",
            )

            return

        for i in range(
            0,
            len(picked),
            2,
        ):

            left, right = st.columns(
                2,
            )

            with left:

                Charts._render_single_intake_column_barh(
                    full_df,
                    picked[
                        i
                    ],
                    top_n=top_n_each,
                )

            if i + 1 < len(picked):

                with right:

                    Charts._render_single_intake_column_barh(
                        full_df,
                        picked[
                            i + 1
                        ],
                        top_n=top_n_each,
                    )

    @staticmethod
    def render_trade_commodity_snapshot(
        full_df: pd.DataFrame,
        top_n_hs: int = 12,
        top_n_family: int = 12,
    ) -> None:

        st.subheader(
            "Trade & carbon-related commodity signals"
        )

        st.caption(
            "HS chapter (leading digits), product_family mix, and keyword "
            "hits from description / family text (no LLM).",
        )

        if full_df.empty:

            return

        col_hs, col_fam, col_kw = st.columns(
            3,
        )

        with col_hs:

            st.markdown(
                "**HS chapter (2-digit)**",
            )

            if (
                "hs_code"
                not in full_df.columns
            ):

                st.caption(
                    "No `hs_code` column.",
                )

            else:

                digits = (
                    full_df[
                        "hs_code"
                    ]
                    .astype(
                        str,
                    )
                    .str.replace(
                        r"\D",
                        "",
                        regex=True,
                    )
                )

                chapter = digits.str.slice(
                    0,
                    2,
                )

                chapter = chapter.mask(
                    chapter.str.len() < 2,
                    "Unknown",
                )

                vc = chapter.value_counts().head(
                    top_n_hs,
                )

                if not vc.empty:

                    fig, ax = plt.subplots(
                        figsize=(
                            4.6,
                            max(
                                2.8,
                                0.35 * len(vc),
                            ),
                        ),
                    )

                    y_p = np.arange(
                        len(vc),
                    )

                    ax.barh(
                        y_p,
                        vc.values,
                        color="#5E35B1",
                        edgecolor="white",
                        height=0.68,
                    )

                    ax.set_yticks(
                        y_p,
                    )

                    ax.set_yticklabels(
                        vc.index.astype(
                            str,
                        ),
                        fontsize=8,
                    )

                    ax.set_xlabel(
                        "Rows",
                    )

                    apply_chart_style(
                        ax,
                    )

                    ax.invert_yaxis()

                    plt.tight_layout()

                    st.pyplot(
                        fig,
                    )

        with col_fam:

            st.markdown(
                "**Product family**",
            )

            if (
                "product_family"
                not in full_df.columns
            ):

                st.caption(
                    "No `product_family` column.",
                )

            else:

                fam = _clean_label_series(
                    full_df[
                        "product_family"
                    ],
                )

                vc = fam.value_counts().head(
                    top_n_family,
                )

                if not vc.empty:

                    fig, ax = plt.subplots(
                        figsize=(
                            4.6,
                            max(
                                2.8,
                                0.35 * len(vc),
                            ),
                        ),
                    )

                    y_p = np.arange(
                        len(vc),
                    )

                    ax.barh(
                        y_p,
                        vc.values,
                        color="#00695C",
                        edgecolor="white",
                        height=0.68,
                    )

                    ax.set_yticks(
                        y_p,
                    )

                    ax.set_yticklabels(
                        [
                            (
                                str(x)[:36] + "…"
                                if len(
                                    str(x),
                                )
                                > 38
                                else str(x)
                            )
                            for x in vc.index
                        ],
                        fontsize=8,
                    )

                    ax.set_xlabel(
                        "Rows",
                    )

                    apply_chart_style(
                        ax,
                    )

                    ax.invert_yaxis()

                    plt.tight_layout()

                    st.pyplot(
                        fig,
                    )

        with col_kw:

            st.markdown(
                "**Material keywords**",
            )

            blob_parts = []

            for cand in (
                "product_description",
                "product_family",
                "commodity",
                "material",
            ):

                if cand in full_df.columns:

                    blob_parts.append(
                        full_df[
                            cand
                        ].astype(
                            str,
                        )
                    )

            if not blob_parts:

                st.caption(
                    "Need at least one of: product_description, "
                    "product_family, commodity, material.",
                )

            else:

                joined = (
                    blob_parts[
                        0
                    ]
                    .astype(
                        str,
                    )
                    .fillna(
                        "",
                    )
                )

                for extra in blob_parts[
                    1:
                ]:

                    joined = (
                        joined
                        + " "
                        + extra.astype(
                            str,
                        ).fillna(
                            "",
                        )
                    )

                joined_l = joined.str.lower()

                bucket = pd.Series(
                    [""] * len(
                        full_df,
                    ),
                    index=full_df.index,
                    dtype=object,
                )

                for label, needles in _MATERIAL_KEYWORD_BUCKETS:

                    empty_mask = bucket.eq(
                        "",
                    )

                    if not empty_mask.any():

                        break

                    hit = pd.Series(
                        False,
                        index=full_df.index,
                    )

                    for nd in needles:

                        hit = hit | joined_l.str.contains(
                            nd,
                            regex=False,
                            na=False,
                        )

                    bucket = bucket.mask(
                        empty_mask & hit,
                        label,
                    )

                counts = bucket[
                    bucket.ne(
                        "",
                    )
                ].value_counts()

                if counts.empty:

                    st.caption(
                        "No configured keyword buckets matched.",
                    )

                else:

                    fig, ax = plt.subplots(
                        figsize=(
                            4.6,
                            max(
                                2.8,
                                0.35 * len(counts),
                            ),
                        ),
                    )

                    y_p = np.arange(
                        len(counts),
                    )

                    ax.barh(
                        y_p,
                        counts.values,
                        color="#E65100",
                        edgecolor="white",
                        height=0.68,
                    )

                    ax.set_yticks(
                        y_p,
                    )

                    ax.set_yticklabels(
                        counts.index,
                        fontsize=8,
                    )

                    ax.set_xlabel(
                        "Rows (first matching bucket wins)",
                    )

                    apply_chart_style(
                        ax,
                    )

                    ax.invert_yaxis()

                    plt.tight_layout()

                    st.pyplot(
                        fig,
                    )

                    matched = int(
                        bucket.ne(
                            "",
                        ).sum(),
                    )

                    st.caption(
                        f"Keyword scan coverage: {matched:,} / {len(full_df):,} rows hit at least one bucket.",
                    )

    @staticmethod
    def render_backlog_risk_concentration(
        backlog_df: pd.DataFrame,
    ) -> None:

        st.subheader(
            "Where backlog risk concentrates"
        )

        st.caption(
            "Rows ordered from highest composite risk downward. Tracks how "
            "much of summed composite exposure you capture scanning the backlog "
            "from the top.",
        )

        if backlog_df.empty:

            st.warning(
                "Backlog is empty."
            )

            return

        if (
            "hybrid_score"
            not in backlog_df.columns
        ):

            st.info(
                "Needs hybrid_score on backlog rows to chart concentration.",
            )

            return

        scores_raw = pd.to_numeric(
            backlog_df[
                "hybrid_score"
            ],
            errors="coerce",
        ).fillna(
            0,
        )

        vals = scores_raw.to_numpy()

        order = np.argsort(
            vals,
        )[
            ::-1
        ]

        scores = vals[
            order
        ]

        if (
            scores.size
            == 0
            or scores.sum()
            <= 0
        ):

            st.info(
                "No positive composite scores in the backlog to aggregate.",
            )

            return

        total = float(
            scores.sum(),
        )

        n = len(
            scores,
        )

        cum = np.cumsum(
            scores,
        )

        x_pct = (
            np.arange(
                1,
                n + 1,
            )
            / n
            * 100.0
        )

        y_pct = cum / total * 100.0

        fig, ax = plt.subplots(
            figsize=(
                7,
                4.2,
            ),
        )

        ax.plot(
            x_pct,
            y_pct,
            color="#BF360C",
            linewidth=2.5,
        )

        ax.fill_between(
            x_pct,
            y_pct,
            alpha=0.12,
            color="#BF360C",
        )

        ax.axhline(
            80,
            color="#546E7A",
            linestyle=":",
            linewidth=1,
            label="80% reference",
        )

        ax.axvline(
            20,
            color="#546E7A",
            linestyle="--",
            linewidth=0.85,
            alpha=0.7,
            label="Top 20% of backlog rows",
        )

        ix20 = max(
            0,
            min(
                int(
                    np.ceil(
                        0.2 * n,
                    ),
                )
                - 1,
                n - 1,
            ),
        )

        pct_at_twenty = round(
            float(
                y_pct[
                    ix20
                ],
            ),
            1,
        )

        ax.scatter(
            [
                x_pct[
                    ix20
                ],
            ],
            [
                y_pct[
                    ix20
                ],
            ],
            color="#FFB300",
            s=54,
            zorder=6,
            edgecolor="#263238",
            linewidth=0.6,
        )

        ax.set_xlabel(
            "% of backlog rows (priority queue order)"
        )

        ax.set_ylabel(
            "% of summed composite scores captured"
        )

        apply_chart_style(ax)

        ax.set_ylim(
            0,
            103,
        )

        ax.set_xlim(
            0,
            100,
        )

        ax.legend(
            fontsize=8,
            loc="lower right",
            framealpha=0.93,
        )

        plt.tight_layout()

        st.pyplot(fig)

        st.metric(
            "Pareto-style readout",
            (
                "Top fifth of backlog rows carry about "
                f"{pct_at_twenty}% of summed composite scores"
                if n
                >= 5
                else "Backlog too small for a fifth-band readout."
            ),
        )

    @staticmethod
    def render_compliance_themes_full_intake(
        full_df: pd.DataFrame,
        top_n: int = 12,
    ) -> None:

        st.subheader(
            "Top compliance themes (full intake)"
        )

        st.caption(
            "Most frequent compliance_issue labels across all screened rows — "
            "manager-facing portfolio briefing.",
        )

        if full_df.empty:

            return

        if (
            "compliance_issue"
            not in full_df.columns
        ):

            st.info(
                "compliance_issue field not available for this upload.",
            )

            return

        text = (
            full_df[
                "compliance_issue"
            ]
            .astype(
                str,
            )
            .str.strip()
        )

        text = text.mask(
            text.eq(
                "",
            )
            | text.str.casefold().isin(
                {
                    "nan",
                    "none",
                    "unknown",
                }
            ),
            "Unspecified",
        )

        vc = text.value_counts().head(
            top_n,
        )

        if vc.empty:

            st.caption(
                "No compliance issue text populated on this intake.",
            )

            return

        fig, ax = plt.subplots(
            figsize=(
                7.2,
                max(
                    3.6,
                    0.38 * len(vc),
                ),
            ),
        )

        palette = plt.cm.Purples_r(
            np.linspace(
                0.25,
                0.92,
                len(vc),
            )
        )

        y_p = np.arange(
            len(vc),
        )

        bars = ax.barh(
            y_p,
            vc.values,
            color=palette,
            edgecolor="white",
            linewidth=0.5,
            height=0.65,
        )

        ax.set_yticks(
            y_p,
        )

        wrap = [
            (
                str(ix)[:44] + "…"
                if len(
                    str(ix),
                )
                > 46
                else str(ix)
            )
            for ix in vc.index
        ]

        ax.set_yticklabels(
            wrap,
            fontsize=8,
        )

        ax.set_xlabel(
            "Record count (all screened)"
        )

        apply_chart_style(ax)

        ax.invert_yaxis()

        for bar, val in zip(
            bars,
            vc.values,
        ):

            ax.text(
                bar.get_width()
                + max(
                    0.02 * vc.sum(),
                    0.35,
                ),
                bar.get_y()
                + bar.get_height()
                / 2,
                f"{int(val):,}",
                va="center",
                fontsize=8,
            )

        plt.tight_layout()

        st.pyplot(fig)

        st.caption(
            f"Top {len(vc)} themes by row count.",
        )

    @staticmethod
    def render_queue_routing_hints(
        backlog_df: pd.DataFrame,
        top_n: int = 8,
    ) -> None:

        st.subheader(
            "Recommended actions (backlog)"
        )

        st.caption(
            "Workflow guidance frequencies for rows still needing review.",
        )

        if backlog_df.empty:

            return

        if (
            "recommended_action"
            not in backlog_df.columns
        ):

            st.info(
                "recommended_action is not present.",
            )

            return

        act = (
            backlog_df[
                "recommended_action"
            ]
            .astype(
                str,
            )
            .str.strip()
        )

        act = act.mask(
            act.eq(
                "",
            )
            | act.str.casefold().isin(
                {
                    "nan",
                    "none",
                }
            ),
            "Unspecified",
        )

        vc = act.value_counts().head(
            top_n,
        )

        if vc.empty:

            return

        fig, ax = plt.subplots(
            figsize=(
                7,
                max(
                    3.5,
                    0.38 * len(vc),
                ),
            ),
        )

        hues = plt.cm.Spectral_r(
            np.linspace(
                0.08,
                0.94,
                len(vc),
            )
        )

        y_p = np.arange(
            len(vc),
        )

        ax.barh(
            y_p,
            vc.values,
            color=hues,
            edgecolor="white",
            height=0.62,
        )

        ax.set_yticks(
            y_p,
        )

        ax.set_yticklabels(
            [
                (
                    str(lb)[:46] + "…"
                    if len(
                        str(lb),
                    )
                    > 48
                    else str(lb)
                )
                for lb in vc.index
            ],
            fontsize=8,
        )

        ax.set_xlabel(
            "Backlog rows"
        )

        apply_chart_style(ax)

        ax.invert_yaxis()

        plt.tight_layout()

        st.pyplot(fig)

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
        backlog_state: str

        (
            backlog_df,
            scope_note,
            backlog_state,
        ) = operational_review_backlog_state(
            df,
        )

        if backlog_state == "empty":

            st.success(
                "Operational review backlog is empty for this intake — "
                "intake dashboards still populate below.",
            )

        if scope_note:

            st.caption(
                scope_note,
            )

        Charts.render_intake_snapshot_ranked_charts(
            df,
        )

        st.divider()

        Charts.render_trade_commodity_snapshot(
            df,
        )

        st.divider()

        if backlog_state == "backlog" and backlog_df is not None:

            row_risk_row, row_risk_r = st.columns(
                2,
            )

            with row_risk_row:

                Charts.render_risk_distribution(
                    backlog_df,
                    (
                        "Operational review backlog only — same cohort "
                        "as flagged compliance records."
                    ),
                )

            with row_risk_r:

                Charts.render_backlog_risk_concentration(
                    backlog_df,
                )

            st.divider()

        elif backlog_state == "no_mask":

            row_fallback, row_pad = st.columns(
                2,
            )

            with row_fallback:

                Charts.render_risk_distribution(
                    df,
                    (
                        "**Full screened intake.** Backlog cohort cannot be "
                        "isolated (requires_review / severity tier fields "
                        "absent)."
                    ),
                )

            with row_pad:

                st.markdown(
                    "##### Risk concentration curve",
                )

                st.caption(
                    "Available once the operational review backlog can be "
                    "isolated from workflow fields.",
                )

            st.divider()

        else:

            st.info(
                "Risk tier donut and concentration curve need at least one "
                "row in the operational review backlog.",
            )

            st.divider()

        row_op_m, row_op_r = st.columns(
            2,
        )

        with row_op_m:

            Charts.render_compliance_themes_full_intake(
                df,
            )

        with row_op_r:

            if backlog_state == "backlog" and backlog_df is not None:

                Charts.render_queue_routing_hints(
                    backlog_df,
                )

            else:

                st.markdown(
                    "##### Recommended actions (backlog)",
                )

                st.caption(
                    "Shows when backlog rows carry recommended_action text.",
                )

        if (
            "anomaly_class"
            in df.columns
        ):

            ac_probe = (
                df[
                    "anomaly_class"
                ]
                .astype(
                    str,
                )
                .str.strip()
            )

            ac_probe = ac_probe[
                ac_probe.ne(
                    "",
                )
                & ac_probe.str.lower().ne(
                    "none",
                )
                & ac_probe.str.lower().ne(
                    "nan",
                )
            ]

            if (
                len(
                    ac_probe.dropna(),
                )
                >= 1
                and ac_probe.nunique()
                <= 36
            ):

                st.divider()

                Charts.render_anomaly_distribution(
                    df,
                )

                st.caption(
                    "Across **all screened records** — portfolio exposure, "
                    "not backlog-only.",
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