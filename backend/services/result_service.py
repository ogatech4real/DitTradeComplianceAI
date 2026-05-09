from __future__ import annotations

from typing import (
    Dict,
    Any,
    List,
)

import numpy as np
import pandas as pd


class ResultService:
    """
    Central production-grade result service.

    Responsibilities:
    - operator-facing summaries
    - severity aggregation
    - dashboard payload generation
    - API-safe serialization
    - compliance insight generation
    - operational metrics
    """

    # =====================================================
    # SAFE SERIALISATION
    # =====================================================

    @staticmethod
    def sanitise_dataframe(
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        out = df.copy()

        out.replace(
            [np.inf, -np.inf],
            0,
            inplace=True,
        )

        # ---------------------------------------------
        # NUMERIC COLUMNS
        # ---------------------------------------------

        numeric_cols = out.select_dtypes(
            include=[np.number]
        ).columns

        out[numeric_cols] = (
            out[numeric_cols]
            .apply(
                pd.to_numeric,
                errors="coerce",
            )
            .fillna(0)
        )

        # ---------------------------------------------
        # OBJECT COLUMNS
        # ---------------------------------------------

        object_cols = out.select_dtypes(
            include=["object"]
        ).columns

        out[object_cols] = (
            out[object_cols]
            .fillna("")
            .astype(str)
        )

        return out

    # =====================================================
    # SCREENING SUMMARY
    # =====================================================

    @staticmethod
    def generate_screening_summary(
        scored_df: pd.DataFrame,
    ) -> Dict[str, Any]:

        total_records = len(
            scored_df
        )

        flagged_records = 0

        if (
            "hybrid_pred"
            in scored_df.columns
        ):

            flagged_records = int(
                (
                    scored_df[
                        "hybrid_pred"
                    ] == 1
                ).sum()
            )

        critical_records = 0
        priority_review_records = 0
        cleared_records = 0

        if (
            "severity_level"
            in scored_df.columns
        ):

            severity = (
                scored_df[
                    "severity_level"
                ]
                .astype(str)
                .str.lower()
            )

            critical_records = int(
                (
                    severity
                    == "critical"
                ).sum()
            )

            priority_review_records = int(
                (
                    severity
                    == "priority"
                ).sum()
            )

            cleared_records = int(
                (
                    severity
                    == "cleared"
                ).sum()
            )

        average_score = 0.0

        if (
            "hybrid_score"
            in scored_df.columns
        ):

            average_score = round(
                float(
                    pd.to_numeric(
                        scored_df[
                            "hybrid_score"
                        ],
                        errors="coerce",
                    )
                    .fillna(0)
                    .mean()
                ),
                4,
            )

        return {
            "total_records":
                total_records,

            "flagged_records":
                flagged_records,

            "critical_records":
                critical_records,

            "priority_review_records":
                priority_review_records,

            "cleared_records":
                cleared_records,

            "average_risk_score":
                average_score,
        }

    # =====================================================
    # SEVERITY BREAKDOWN
    # =====================================================

    @staticmethod
    def generate_severity_breakdown(
        scored_df: pd.DataFrame,
    ) -> Dict[str, int]:

        if (
            "severity_level"
            not in scored_df.columns
        ):

            return {}

        counts = (
            scored_df[
                "severity_level"
            ]
            .fillna("unknown")
            .astype(str)
            .value_counts()
            .to_dict()
        )

        return {
            str(k): int(v)
            for k, v in counts.items()
        }

    # =====================================================
    # COMPLIANCE RISKS
    # =====================================================

    @staticmethod
    def generate_compliance_risks(
        scored_df: pd.DataFrame,
    ) -> Dict[str, Any]:

        risks = {
            "carbon_disclosure_inconsistencies": 0,
            "origin_declaration_conflicts": 0,
            "missing_traceability_data": 0,
            "high_emissions_anomalies": 0,
            "anomalous_trade_patterns": 0,
        }

        # -------------------------------------------------
        # EMISSIONS
        # -------------------------------------------------

        if (
            "embedded_emissions"
            in scored_df.columns
        ):

            risks[
                "high_emissions_anomalies"
            ] = int(
                (
                    pd.to_numeric(
                        scored_df[
                            "embedded_emissions"
                        ],
                        errors="coerce",
                    )
                    > 150
                ).sum()
            )

        # -------------------------------------------------
        # TRACEABILITY
        # -------------------------------------------------

        if (
            "traceability_score"
            in scored_df.columns
        ):

            risks[
                "missing_traceability_data"
            ] = int(
                (
                    pd.to_numeric(
                        scored_df[
                            "traceability_score"
                        ],
                        errors="coerce",
                    )
                    < 0.3
                ).sum()
            )

        # -------------------------------------------------
        # RULE VIOLATIONS
        # -------------------------------------------------

        if (
            "rule_flag_count"
            in scored_df.columns
        ):

            risks[
                "carbon_disclosure_inconsistencies"
            ] = int(
                (
                    pd.to_numeric(
                        scored_df[
                            "rule_flag_count"
                        ],
                        errors="coerce",
                    )
                    > 0
                ).sum()
            )

        # -------------------------------------------------
        # ORIGIN CONFLICTS
        # -------------------------------------------------

        if (
            "country_of_origin"
            in scored_df.columns
            and "destination_country"
            in scored_df.columns
        ):

            risks[
                "origin_declaration_conflicts"
            ] = int(
                (
                    scored_df[
                        "country_of_origin"
                    ]
                    .astype(str)
                    ==
                    scored_df[
                        "destination_country"
                    ]
                    .astype(str)
                ).sum()
            )

        # -------------------------------------------------
        # ANOMALOUS PATTERNS
        # -------------------------------------------------

        if (
            "if_score"
            in scored_df.columns
        ):

            risks[
                "anomalous_trade_patterns"
            ] = int(
                (
                    pd.to_numeric(
                        scored_df[
                            "if_score"
                        ],
                        errors="coerce",
                    )
                    >= 0.7
                ).sum()
            )

        return risks

    # =====================================================
    # PRIORITY REVIEW QUEUE
    # =====================================================

    @staticmethod
    def build_priority_review_queue(
        scored_df: pd.DataFrame,
        top_n: int = 20,
    ) -> List[Dict[str, Any]]:

        if scored_df.empty:
            return []

        ranked_df = (
            scored_df
            .sort_values(
                by="hybrid_score",
                ascending=False,
            )
            .head(top_n)
            .copy()
        )

        columns = [
            col for col in [
                "record_id",
                "severity_level",
                "hybrid_risk_label",
                "hybrid_score",
                "compliance_issue",
                "recommended_action",
                "review_status",
                "review_priority",
                "explanation",
            ]
            if col in ranked_df.columns
        ]

        ranked_df = ranked_df[
            columns
        ]

        ranked_df = ranked_df.fillna(
            ""
        )

        return ranked_df.to_dict(
            orient="records"
        )

    # =====================================================
    # SYSTEM INSIGHTS
    # =====================================================

    @staticmethod
    def generate_system_insights(
        scored_df: pd.DataFrame,
    ) -> Dict[str, Any]:

        insights = {
            "most_common_violation": None,
            "highest_risk_market": None,
            "most_affected_category": None,
        }

        # -------------------------------------------------
        # MOST COMMON VIOLATION
        # -------------------------------------------------

        if (
            "compliance_issue"
            in scored_df.columns
        ):

            counts = (
                scored_df[
                    "compliance_issue"
                ]
                .astype(str)
                .value_counts()
            )

            if not counts.empty:

                insights[
                    "most_common_violation"
                ] = counts.index[0]

        # -------------------------------------------------
        # HIGHEST RISK MARKET
        # -------------------------------------------------

        if (
            "destination_country"
            in scored_df.columns
        ):

            grouped = (
                scored_df.groupby(
                    "destination_country"
                )[
                    "hybrid_score"
                ]
                .mean()
                .sort_values(
                    ascending=False
                )
            )

            if not grouped.empty:

                insights[
                    "highest_risk_market"
                ] = grouped.index[0]

        # -------------------------------------------------
        # MOST AFFECTED CATEGORY
        # -------------------------------------------------

        if (
            "product_category"
            in scored_df.columns
        ):

            grouped = (
                scored_df.groupby(
                    "product_category"
                )[
                    "hybrid_score"
                ]
                .mean()
                .sort_values(
                    ascending=False
                )
            )

            if not grouped.empty:

                insights[
                    "most_affected_category"
                ] = grouped.index[0]

        return insights

    # =====================================================
    # OPERATIONAL METRICS
    # =====================================================

    @staticmethod
    def generate_operational_metrics(
        scored_df: pd.DataFrame,
    ) -> Dict[str, Any]:

        total_records = max(
            len(scored_df),
            1,
        )

        flagged_records = 0

        if (
            "hybrid_pred"
            in scored_df.columns
        ):

            flagged_records = int(
                (
                    scored_df[
                        "hybrid_pred"
                    ] == 1
                ).sum()
            )

        critical_records = 0

        if (
            "severity_level"
            in scored_df.columns
        ):

            critical_records = int(
                (
                    scored_df[
                        "severity_level"
                    ]
                    .astype(str)
                    .str.lower()
                    == "critical"
                ).sum()
            )

        average_score = 0.0

        if (
            "hybrid_score"
            in scored_df.columns
        ):

            average_score = float(
                pd.to_numeric(
                    scored_df[
                        "hybrid_score"
                    ],
                    errors="coerce",
                )
                .fillna(0)
                .mean()
            )

        return {
            "review_rate_percent":
                round(
                    (
                        flagged_records
                        / total_records
                    ) * 100,
                    2,
                ),

            "average_risk_score":
                round(
                    average_score,
                    4,
                ),

            "critical_risk_rate_percent":
                round(
                    (
                        critical_records
                        / total_records
                    ) * 100,
                    2,
                ),
        }

    # =====================================================
    # API RESPONSE
    # =====================================================

    @staticmethod
    def build_api_response(
        scored_df: pd.DataFrame,
        processing_metadata: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:

        scored_df = (
            ResultService
            .sanitise_dataframe(
                scored_df
            )
        )

        return {
            "status": "success",

            "screening_summary":
                ResultService
                .generate_screening_summary(
                    scored_df
                ),

            "severity_breakdown":
                ResultService
                .generate_severity_breakdown(
                    scored_df
                ),

            "system_insights":
                ResultService
                .generate_system_insights(
                    scored_df
                ),

            "operational_metrics":
                ResultService
                .generate_operational_metrics(
                    scored_df
                ),

            "compliance_risks":
                ResultService
                .generate_compliance_risks(
                    scored_df
                ),

            "priority_review_queue":
                ResultService
                .build_priority_review_queue(
                    scored_df
                ),

            "processing_metadata":
                processing_metadata or {},

            "records":
                scored_df.to_dict(
                    orient="records"
                ),
        }