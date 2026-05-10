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

        priority_queue_size = len(priority_queue)

        compliance_risks = (
            self.generate_compliance_risks(
                scored_df
            )
        )

        operational_metrics = (
            self.generate_operational_metrics(
                scored_df,
                processing_metadata=processing_metadata,
            )
        )

        severity_breakdown = (
            self.generate_severity_breakdown(
                scored_df
            )
        )

        executive_summary = (
            self.generate_executive_summary(
                screening_summary,
                priority_queue_size=priority_queue_size,
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
        processing_metadata: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:

        metrics = {}

        if processing_metadata is None:
            processing_metadata = {}

        total_records = len(
            scored_df
        )

        records_requiring_review = 0

        if (
            "requires_review"
            in scored_df.columns
        ):

            records_requiring_review = int(
                (
                    scored_df[
                        "requires_review"
                    ]
                    .fillna(False)
                    .astype(bool)
                ).sum()
            )
        elif "hybrid_pred" in scored_df.columns:
            records_requiring_review = int(
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
                    records_requiring_review
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
        high_only = 0
        critical_only = 0

        if (
            "severity_level"
            in scored_df.columns
        ):

            sev = (
                scored_df[
                    "severity_level"
                ]
                .astype(str)
                .str.strip()
                .str.lower()
            )

            critical_only = int((sev == "critical").sum())

            high_only = int((sev == "high").sum())

            high_risk = int(
                sev.isin(
                    [
                        "critical",
                        "high",
                    ]
                ).sum()
            )

        if total_records > 0:

            metrics[
                "critical_risk_rate_percent"
            ] = round(
                (
                    critical_only
                    / total_records
                ) * 100,
                2,
            )

            metrics[
                "high_tier_only_rate_percent"
            ] = round(
                (
                    high_only
                    / total_records
                ) * 100,
                2,
            )

            metrics[
                "high_risk_rate_percent"
            ] = round(
                (
                    high_risk
                    / total_records
                ) * 100,
                2,
            )

        if "fraud_score" in scored_df.columns:
            metrics["fraud_alerts"] = int(
                (
                    pd.to_numeric(
                        scored_df["fraud_score"],
                        errors="coerce",
                    )
                    .fillna(0)
                    >= 0.5
                ).sum()
            )
        else:
            metrics["fraud_alerts"] = 0

        if "if_pred" in scored_df.columns:
            metrics["anomaly_records"] = int(
                (
                    pd.to_numeric(
                        scored_df["if_pred"],
                        errors="coerce",
                    )
                    .fillna(0)
                    == 1
                ).sum()
            )
        else:
            metrics["anomaly_records"] = 0

        if "batch_risk_score" in scored_df.columns:
            metrics["batch_risk_score"] = round(
                float(
                    pd.to_numeric(
                        scored_df["batch_risk_score"],
                        errors="coerce",
                    )
                    .fillna(0)
                    .mean()
                ),
                4,
            )
        else:
            metrics["batch_risk_score"] = 0.0

        intelligence_quality = processing_metadata.get(
            "intelligence_quality",
            {},
        )

        if "mapping_confidence" in scored_df.columns:
            metrics["mapping_confidence"] = round(
                float(
                    pd.to_numeric(
                        scored_df["mapping_confidence"],
                        errors="coerce",
                    )
                    .fillna(0)
                    .mean()
                ),
                4,
            )
        else:
            metrics["mapping_confidence"] = float(
                intelligence_quality.get(
                    "mapping_confidence",
                    processing_metadata.get(
                        "mapping_confidence",
                        0.0,
                    ),
                )
            )

        metrics["data_quality_score"] = float(
            intelligence_quality.get(
                "data_quality_score",
                processing_metadata.get(
                    "data_quality_score",
                    0.0,
                ),
            )
        )

        return metrics

    # =========================================================
    # EXECUTIVE SUMMARY
    # =========================================================

    @staticmethod
    def generate_executive_summary(
        screening_summary: Dict[str, Any],
        priority_queue_size: int = 0,
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

        high_tier = screening_summary.get(
            "high_risk_records",
            0,
        )

        medium_tier = screening_summary.get(
            "medium_risk_records",
            0,
        )

        return (
            f"{flagged} out of {total} uploaded trade records "
            f"require compliance review (severity tiers: "
            f"{critical} critical, {high_tier} high, {medium_tier} medium). "
            f"{priority_queue_size} of the highest-risk records are "
            f"surfaced in the priority review queue."
        )