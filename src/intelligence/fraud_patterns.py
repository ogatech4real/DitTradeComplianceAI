from __future__ import annotations

from typing import Dict, Any

import numpy as np
import pandas as pd


class FraudPatternDetector:
    """
    Fraud pattern intelligence engine.

    Responsibilities:
    - suspicious trade pattern detection
    - emissions fraud indicators
    - document manipulation indicators
    - supplier fraud heuristics
    - synthetic anomaly scoring
    """

    # =====================================================
    # EMISSIONS FRAUD
    # =====================================================

    @staticmethod
    def detect_emissions_fraud(
        df: pd.DataFrame,
    ) -> pd.Series:

        if (
            "embedded_emissions_tco2e_per_tonne"
            not in df.columns
        ):

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        emissions = pd.to_numeric(
            df[
                "embedded_emissions_tco2e_per_tonne"
            ],
            errors="coerce",
        ).fillna(0)

        threshold = (
            emissions.mean()
            + (
                2
                * emissions.std(ddof=0)
            )
        )

        return (
            emissions >= threshold
        ).astype(int)

    # =====================================================
    # TRACEABILITY FRAUD
    # =====================================================

    @staticmethod
    def detect_traceability_fraud(
        df: pd.DataFrame,
    ) -> pd.Series:

        required_cols = [
            "traceability_completeness_score",
            "supplier_traceability_metadata_available",
        ]

        if not all(
            col in df.columns
            for col in required_cols
        ):

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        score = pd.to_numeric(
            df[
                "traceability_completeness_score"
            ],
            errors="coerce",
        ).fillna(0)

        metadata = pd.to_numeric(
            df[
                "supplier_traceability_metadata_available"
            ],
            errors="coerce",
        ).fillna(0)

        suspicious = (
            (score >= 0.8)
            & (metadata == 0)
        )

        return suspicious.astype(int)

    # =====================================================
    # DOCUMENT FRAUD
    # =====================================================

    @staticmethod
    def detect_document_fraud(
        df: pd.DataFrame,
    ) -> pd.Series:

        required_cols = [
            "supporting_document_count",
            "document_consistency_score",
        ]

        if not all(
            col in df.columns
            for col in required_cols
        ):

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        doc_count = pd.to_numeric(
            df[
                "supporting_document_count"
            ],
            errors="coerce",
        ).fillna(0)

        consistency = pd.to_numeric(
            df[
                "document_consistency_score"
            ],
            errors="coerce",
        ).fillna(0)

        suspicious = (
            (doc_count == 0)
            & (consistency >= 0.75)
        )

        return suspicious.astype(int)

    # =====================================================
    # ORIGIN FRAUD
    # =====================================================

    @staticmethod
    def detect_origin_fraud(
        df: pd.DataFrame,
    ) -> pd.Series:

        required_cols = [
            "declared_origin_country",
            "country_of_last_substantial_transformation",
        ]

        if not all(
            col in df.columns
            for col in required_cols
        ):

            return pd.Series(
                [0] * len(df),
                index=df.index,
            )

        declared = (
            df[
                "declared_origin_country"
            ]
            .astype(str)
            .str.lower()
        )

        transformed = (
            df[
                "country_of_last_substantial_transformation"
            ]
            .astype(str)
            .str.lower()
        )

        suspicious = (
            declared != transformed
        )

        return suspicious.astype(int)

    # =====================================================
    # FRAUD SCORE
    # =====================================================

    @staticmethod
    def compute_fraud_score(
        df: pd.DataFrame,
    ) -> pd.Series:

        fraud_cols = [
            col for col in [
                "emissions_fraud_flag",
                "traceability_fraud_flag",
                "document_fraud_flag",
                "origin_fraud_flag",
            ]
            if col in df.columns
        ]

        if not fraud_cols:

            return pd.Series(
                [0.0] * len(df),
                index=df.index,
            )

        score = (
            df[fraud_cols]
            .sum(axis=1)
            / len(fraud_cols)
        )

        return score.clip(
            lower=0,
            upper=1,
        )

    # =====================================================
    # MAIN DETECTION
    # =====================================================

    @staticmethod
    def detect(
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        out = df.copy()

        out[
            "emissions_fraud_flag"
        ] = (
            FraudPatternDetector
            .detect_emissions_fraud(
                out
            )
        )

        out[
            "traceability_fraud_flag"
        ] = (
            FraudPatternDetector
            .detect_traceability_fraud(
                out
            )
        )

        out[
            "document_fraud_flag"
        ] = (
            FraudPatternDetector
            .detect_document_fraud(
                out
            )
        )

        out[
            "origin_fraud_flag"
        ] = (
            FraudPatternDetector
            .detect_origin_fraud(
                out
            )
        )

        out[
            "fraud_score"
        ] = (
            FraudPatternDetector
            .compute_fraud_score(
                out
            )
        )

        out[
            "fraud_risk_label"
        ] = np.where(
            out[
                "fraud_score"
            ] >= 0.66,
            "high",
            np.where(
                out[
                    "fraud_score"
                ] >= 0.33,
                "medium",
                "low",
            ),
        )

        return out

    # =====================================================
    # FRAUD SUMMARY
    # =====================================================

    @staticmethod
    def generate_summary(
        df: pd.DataFrame,
    ) -> Dict[str, Any]:

        summary = {}

        for col in [
            "emissions_fraud_flag",
            "traceability_fraud_flag",
            "document_fraud_flag",
            "origin_fraud_flag",
        ]:

            if col in df.columns:

                summary[col] = int(
                    df[col].sum()
                )

        if (
            "fraud_risk_label"
            in df.columns
        ):

            summary[
                "high_fraud_risk_records"
            ] = int(
                (
                    df[
                        "fraud_risk_label"
                    ]
                    == "high"
                ).sum()
            )

        return summary