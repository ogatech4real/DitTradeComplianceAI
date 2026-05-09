from __future__ import annotations

from typing import Dict, Any, List

import pandas as pd


class OperatorReportService:
    """
    Production-grade operator reporting layer.

    Responsibilities:
    - operator-friendly reporting
    - executive summaries
    - compliance risk aggregation
    - operational insights
    - review prioritisation
    - dashboard-ready reporting
    """

    # =========================================================
    # MAIN REPORT GENERATION
    # =========================================================

    def generate_report(
        self,
        scored_df: pd.DataFrame,
        upload_summary: Dict[str, Any],
        screening_summary: Dict[str, Any],
        system_insights: Dict[str, Any],
        processing_metadata: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:

        priority_queue = (
            self.generate_priority_queue(
                scored_df
            )
        )

        compliance_risks = (
            self.generate_compliance_risks(
                scored_df
            )
        )

        operational_metrics = (
            self.generate_operational_metrics(
                scored_df
            )
        )

        severity_breakdown = (
            self.generate_severity_breakdown(
                scored_df
            )
        )

        executive_summary = (
            self.generate_executive_summary(
                screening_summary
            )
        )

        return {
            "executive_summary":
                executive_summary,

            "upload_summary":
                upload_summary,

            "screening_summary":
                screening_summary,

            "processing_metadata":
                processing_metadata or {},

            "system_insights":
                system_insights,

            "severity_breakdown":
                severity_breakdown,

            "compliance_risks":
                compliance_risks,

            "priority_review_queue":
                priority_queue,

            "operational_metrics":
                operational_metrics,
        }

    # =========================================================
    # PRIORITY REVIEW QUEUE
    # =========================================================

    @staticmethod
    def generate_priority_queue(
        scored_df: pd.DataFrame,
        top_k: int = 25,
    ) -> List[Dict[str, Any]]:

        if scored_df.empty:
            return []

        ranked_df = (
            scored_df.sort_values(
                by="hybrid_score",
                ascending=False,
            )
            .head(top_k)
            .copy()
        )

        display_columns = [
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
            display_columns
        ]

        ranked_df = ranked_df.fillna("")

        return ranked_df.to_dict(
            orient="records"
        )

    # =========================================================
    # COMPLIANCE RISKS
    # =========================================================

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

        # =====================================================
        # HIGH EMISSIONS
        # =====================================================

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

        # =====================================================
        # TRACEABILITY
        # =====================================================

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

        # =====================================================
        # RULE FLAGS
        # =====================================================

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

        # =====================================================
        # ORIGIN CONFLICTS
        # =====================================================

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

        # =====================================================
        # ANOMALY PATTERNS
        # =====================================================

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

    # =========================================================
    # SEVERITY BREAKDOWN
    # =========================================================

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

    # =========================================================
    # OPERATIONAL METRICS
    # =========================================================

    @staticmethod
    def generate_operational_metrics(
        scored_df: pd.DataFrame,
    ) -> Dict[str, Any]:

        metrics = {}

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

        if total_records > 0:

            metrics[
                "review_rate_percent"
            ] = round(
                (
                    flagged_records
                    / total_records
                ) * 100,
                2,
            )

        if (
            "hybrid_score"
            in scored_df.columns
        ):

            metrics[
                "average_risk_score"
            ] = round(
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

        high_risk = 0

        if (
            "severity_level"
            in scored_df.columns
        ):

            high_risk = int(
                (
                    scored_df[
                        "severity_level"
                    ]
                    .astype(str)
                    .isin(
                        [
                            "critical",
                            "priority",
                        ]
                    )
                ).sum()
            )

        if total_records > 0:

            metrics[
                "high_risk_rate_percent"
            ] = round(
                (
                    high_risk
                    / total_records
                ) * 100,
                2,
            )

        return metrics

    # =========================================================
    # EXECUTIVE SUMMARY
    # =========================================================

    @staticmethod
    def generate_executive_summary(
        screening_summary: Dict[str, Any],
    ) -> str:

        total = screening_summary.get(
            "total_records",
            0,
        )

        flagged = screening_summary.get(
            "flagged_records",
            0,
        )

        critical = screening_summary.get(
            "critical_records",
            0,
        )

        priority = screening_summary.get(
            "priority_review_records",
            0,
        )

        return (
            f"{flagged} out of {total} uploaded trade records "
            f"require compliance review. "
            f"{critical} records were classified as critical risk "
            f"and {priority} require priority operational assessment."
        )