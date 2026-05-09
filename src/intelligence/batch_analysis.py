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

        # Avoid record_id as a duplicate key because it is often unique-by-design
        # and suppresses true duplicate cluster detection.
        duplicate_keys = [
            col for col in [
                "shipment_value_usd",
                "shipment_quantity",
                "declared_origin_country",
                "product_family",
                "destination_market",
            ]
            if col in df.columns
        ]

        # Require a minimum key-set to avoid noisy broad matches.
        if len(duplicate_keys) < 3:

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
        supplier_dimension = None
        for col in [
            "supplier_name",
            "exporter_id",
            "importer_id",
        ]:
            if col in df.columns:
                supplier_dimension = col
                break

        if supplier_dimension is None:

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        supplier_series = (
            df[supplier_dimension]
            .astype(str)
            .str.strip()
        )

        invalid_tokens = {
            "",
            "none",
            "null",
            "nan",
            "n/a",
            "na",
        }

        valid_mask = ~supplier_series.str.lower().isin(
            invalid_tokens
        )

        if valid_mask.sum() < 10:
            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        supplier_share = (
            supplier_series[valid_mask]
            .value_counts(normalize=True)
        )

        # Suppress noisy concentration alerts for low-cardinality identifiers.
        if supplier_share.size < 2:
            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        flagged_suppliers = supplier_share[
            supplier_share >= threshold
        ].index

        return (
            supplier_series
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
        ):

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        # This batch stage executes before hybrid_score creation in workflow_engine.
        # Use hybrid_score when available, otherwise a conservative proxy.
        if "hybrid_score" in df.columns:
            risk_signal = pd.to_numeric(
                df["hybrid_score"],
                errors="coerce",
            ).fillna(0)
        else:
            proxy_components = []
            for col in [
                "rule_score",
                "if_score",
                "rf_probability",
            ]:
                if col in df.columns:
                    proxy_components.append(
                        pd.to_numeric(
                            df[col],
                            errors="coerce",
                        ).fillna(0)
                    )

            if not proxy_components:
                return pd.Series(
                    [0] * len(df),
                    index=df.index,
                )

            risk_signal = pd.concat(
                proxy_components,
                axis=1,
            ).mean(axis=1)

        temp_df = df.copy()
        temp_df["_market_risk_signal"] = risk_signal

        grouped = (
            temp_df.groupby(
                "destination_market"
            )["_market_risk_signal"]
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

        # In very homogeneous batches, avoid auto-flagging all markets.
        if pd.isna(threshold) or np.isclose(grouped.std(ddof=0), 0):
            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        high_risk_markets = grouped[
            grouped >= threshold
        ].index

        return (
            temp_df["destination_market"]
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