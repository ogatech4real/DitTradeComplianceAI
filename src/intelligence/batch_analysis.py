from __future__ import annotations

from typing import Dict, Any, List

import numpy as np
import pandas as pd


class BatchAnalysisEngine:
    """
    Batch-level compliance intelligence engine.

    Responsibilities:
    - duplicate shipment detection
    - supplier concentration analysis
    - high-risk batch identification
    - anomalous batch trend detection
    - operational workload concentration
    """

    # =====================================================
    # DUPLICATE RECORD DETECTION
    # =====================================================

    @staticmethod
    def detect_duplicate_shipments(
        df: pd.DataFrame,
    ) -> pd.Series:

        duplicate_keys = [
            col for col in [
                "record_id",
                "shipment_value_usd",
                "shipment_quantity",
                "declared_origin_country",
                "product_family",
            ]
            if col in df.columns
        ]

        if not duplicate_keys:

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        duplicates = (
            df.duplicated(
                subset=duplicate_keys,
                keep=False,
            )
            .astype(int)
        )

        return duplicates

    # =====================================================
    # SUPPLIER CONCENTRATION
    # =====================================================

    @staticmethod
    def detect_supplier_concentration(
        df: pd.DataFrame,
        threshold: float = 0.30,
    ) -> pd.Series:

        if (
            "supplier_name"
            not in df.columns
        ):

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        supplier_share = (
            df["supplier_name"]
            .astype(str)
            .value_counts(normalize=True)
        )

        flagged_suppliers = supplier_share[
            supplier_share >= threshold
        ].index

        return (
            df["supplier_name"]
            .astype(str)
            .isin(flagged_suppliers)
            .astype(int)
        )

    # =====================================================
    # HIGH-RISK MARKET CLUSTER
    # =====================================================

    @staticmethod
    def detect_market_risk_clusters(
        df: pd.DataFrame,
    ) -> pd.Series:

        if (
            "destination_market"
            not in df.columns
            or "hybrid_score"
            not in df.columns
        ):

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        grouped = (
            df.groupby(
                "destination_market"
            )["hybrid_score"]
            .mean()
        )

        if grouped.empty:

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        threshold = (
            grouped.mean()
            + grouped.std(ddof=0)
        )

        high_risk_markets = grouped[
            grouped >= threshold
        ].index

        return (
            df["destination_market"]
            .isin(high_risk_markets)
            .astype(int)
        )

    # =====================================================
    # BATCH RISK SCORE
    # =====================================================

    @staticmethod
    def compute_batch_risk_score(
        df: pd.DataFrame,
    ) -> pd.Series:

        components = []

        if "duplicate_shipment_flag" in df.columns:

            components.append(
                df[
                    "duplicate_shipment_flag"
                ]
            )

        if "supplier_concentration_flag" in df.columns:

            components.append(
                df[
                    "supplier_concentration_flag"
                ]
            )

        if "market_cluster_flag" in df.columns:

            components.append(
                df[
                    "market_cluster_flag"
                ]
            )

        if not components:

            return pd.Series(
                [0.0] * len(df),
                index=df.index,
            )

        combined = np.column_stack(
            components
        )

        score = combined.mean(
            axis=1
        )

        return pd.Series(
            score,
            index=df.index,
        )

    # =====================================================
    # MAIN ANALYSIS
    # =====================================================

    @staticmethod
    def analyse(
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        out = df.copy()

        out[
            "duplicate_shipment_flag"
        ] = (
            BatchAnalysisEngine
            .detect_duplicate_shipments(
                out
            )
        )

        out[
            "supplier_concentration_flag"
        ] = (
            BatchAnalysisEngine
            .detect_supplier_concentration(
                out
            )
        )

        out[
            "market_cluster_flag"
        ] = (
            BatchAnalysisEngine
            .detect_market_risk_clusters(
                out
            )
        )

        out[
            "batch_risk_score"
        ] = (
            BatchAnalysisEngine
            .compute_batch_risk_score(
                out
            )
        )

        out[
            "batch_risk_label"
        ] = np.where(
            out[
                "batch_risk_score"
            ] >= 0.66,
            "high",
            np.where(
                out[
                    "batch_risk_score"
                ] >= 0.33,
                "medium",
                "low",
            ),
        )

        return out

    # =====================================================
    # SUMMARY REPORT
    # =====================================================

    @staticmethod
    def generate_summary(
        df: pd.DataFrame,
    ) -> Dict[str, Any]:

        summary = {
            "duplicate_shipments": 0,
            "supplier_concentration_cases": 0,
            "market_cluster_cases": 0,
            "high_batch_risk_records": 0,
        }

        if (
            "duplicate_shipment_flag"
            in df.columns
        ):

            summary[
                "duplicate_shipments"
            ] = int(
                df[
                    "duplicate_shipment_flag"
                ].sum()
            )

        if (
            "supplier_concentration_flag"
            in df.columns
        ):

            summary[
                "supplier_concentration_cases"
            ] = int(
                df[
                    "supplier_concentration_flag"
                ].sum()
            )

        if (
            "market_cluster_flag"
            in df.columns
        ):

            summary[
                "market_cluster_cases"
            ] = int(
                df[
                    "market_cluster_flag"
                ].sum()
            )

        if (
            "batch_risk_label"
            in df.columns
        ):

            summary[
                "high_batch_risk_records"
            ] = int(
                (
                    df[
                        "batch_risk_label"
                    ]
                    == "high"
                ).sum()
            )

        return summary