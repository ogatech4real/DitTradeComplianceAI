# backend/orchestration/workflow_engine.py

from __future__ import annotations

from typing import Dict, Any, Optional

import numpy as np
import pandas as pd

from sklearn.metrics import precision_score

from src.features.preprocessing import (
    ALL_FEATURES,
)

from src.intelligence.batch_analysis import (
    BatchAnalysisEngine,
)

from src.intelligence.fraud_patterns import (
    FraudPatternDetector,
)

from backend.rules.operational_rules import (
    determine_severity_level,
    determine_review_status,
    determine_compliance_issue,
    determine_recommended_action,
    build_operator_explanation,
)


class WorkflowEngine:
    """
    Core inference and operator-oriented
    compliance scoring engine.

    Responsibilities:
    - ML inference
    - anomaly scoring
    - rule integration
    - hybrid risk scoring
    - fraud intelligence
    - batch analytics
    - operator explanations
    """

    def __init__(
        self,
        preprocessor=None,
        isolation_forest=None,
        classifier=None,
        metadata: Optional[
            Dict[str, Any]
        ] = None,
    ) -> None:

        self.preprocessor = preprocessor

        self.isolation_forest = (
            isolation_forest
        )

        self.classifier = classifier

        if metadata is None:
            metadata = {}

        self.metadata = metadata

        # =================================================
        # HYBRID WEIGHTS
        # =================================================

        self.hybrid_weights = metadata.get(
            "hybrid_weights",
            {
                "rf": 0.25,
                "anomaly": 0.20,
                "rules": 0.20,
                "interaction": 0.15,
                "fraud_score": 0.10,
                "batch": 0.10,
            },
        )

        # =================================================
        # HYBRID THRESHOLD
        # =================================================

        self.hybrid_threshold = metadata.get(
            "hybrid_threshold",
            0.40,
        )

    # =====================================================
    # SAFE SCALING
    # =====================================================

    @staticmethod
    def minmax_scale(
        series: pd.Series,
    ) -> pd.Series:

        s = pd.to_numeric(
            series,
            errors="coerce",
        )

        s = s.replace(
            [np.inf, -np.inf],
            np.nan,
        )

        s = s.fillna(0)

        smin = s.min()
        smax = s.max()

        if np.isclose(
            smax - smin,
            0,
        ):

            return pd.Series(
                np.zeros(len(s)),
                index=s.index,
            )

        scaled = (
            (s - smin)
            / (smax - smin)
        )

        return scaled.clip(
            lower=0,
            upper=1,
        )

    # =====================================================
    # RISK LABELS
    # =====================================================

    @staticmethod
    def assign_risk_label(
        score: pd.Series,
    ) -> pd.Series:

        return pd.Series(
            np.where(
                score >= 0.66,
                "high",
                np.where(
                    score >= 0.33,
                    "medium",
                    "low",
                ),
            ),
            index=score.index,
        )

    # =====================================================
    # FEATURE TRANSFORMATION
    # =====================================================

    def transform_features(
        self,
        df: pd.DataFrame,
    ):

        X = df.copy()

        # -------------------------------------------------
        # ENSURE ALL FEATURES
        # -------------------------------------------------

        for col in ALL_FEATURES:

            if col not in X.columns:
                X[col] = 0

        X = X[ALL_FEATURES]

        X = X.replace(
            [np.inf, -np.inf],
            np.nan,
        )

        # -------------------------------------------------
        # FORCE NUMERIC
        # -------------------------------------------------

        for col in X.columns:

            try:

                X[col] = pd.to_numeric(
                    X[col],
                    errors="coerce",
                )

            except Exception:

                pass

        X = X.fillna(0)

        # -------------------------------------------------
        # NO PREPROCESSOR
        # -------------------------------------------------

        if self.preprocessor is None:
            return X

        return self.preprocessor.transform(
            X
        )

    # =====================================================
    # RULE SCORE
    # =====================================================

    @staticmethod
    def compute_rule_score(
        df: pd.DataFrame,
    ) -> pd.Series:

        return (
            1
            - np.exp(
                -pd.to_numeric(
                    df[
                        "rule_flag_count"
                    ],
                    errors="coerce",
                ).fillna(0)
            )
        )

    # =====================================================
    # FRAUD INTELLIGENCE
    # =====================================================

    @staticmethod
    def apply_fraud_detection(
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        out = df.copy()

        try:

            fraud_results = (
                FraudPatternDetector.detect(
                    out
                )
            )

            for col in fraud_results.columns:

                if col not in out.columns:
                    out[col] = fraud_results[
                        col
                    ]

        except Exception as exc:

            print(
                "[WARNING] Fraud detection failed: "
                f"{exc}"
            )

            out[
                "fraud_score"
            ] = 0.0

            out[
                "fraud_patterns"
            ] = ""

        return out

    # =====================================================
    # BATCH INTELLIGENCE
    # =====================================================

    @staticmethod
    def apply_batch_analysis(
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        out = df.copy()

        try:

            batch_results = (
                BatchAnalysisEngine.analyse(
                    out
                )
            )

            for col in batch_results.columns:

                if col not in out.columns:
                    out[col] = batch_results[
                        col
                    ]

        except Exception as exc:

            print(
                "[WARNING] Batch analysis failed: "
                f"{exc}"
            )

        return out

    # =====================================================
    # MAIN SCORING PIPELINE
    # =====================================================

    def score(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        out = df.copy()

        # =================================================
        # REQUIRED COLUMNS
        # =================================================

        if (
            "rule_flag_count"
            not in out.columns
        ):

            out[
                "rule_flag_count"
            ] = 0

        # =================================================
        # FEATURE TRANSFORMATION
        # =================================================

        try:

            X_proc = (
                self.transform_features(
                    out
                )
            )

        except Exception as exc:

            print(
                "[WARNING] Feature transformation failed: "
                f"{exc}"
            )

            X_proc = None

        # =================================================
        # RULE SCORE
        # =================================================

        out["rule_score"] = (
            self.compute_rule_score(
                out
            )
        )

        out["rule_pred"] = (
            out["rule_flag_count"]
            > 0
        ).astype(int)

        # =================================================
        # ISOLATION FOREST
        # =================================================

        if (
            self.isolation_forest
            is not None
            and X_proc is not None
        ):

            try:

                out["if_raw"] = (
                    -self.isolation_forest
                    .decision_function(
                        X_proc
                    )
                )

                out["if_score"] = (
                    self.minmax_scale(
                        out["if_raw"]
                    )
                )

                out["if_pred"] = (
                    out["if_score"]
                    >= 0.50
                ).astype(int)

            except Exception as exc:

                print(
                    "[WARNING] Isolation Forest failed: "
                    f"{exc}"
                )

                out["if_raw"] = 0.0
                out["if_score"] = 0.0
                out["if_pred"] = 0

        else:

            out["if_raw"] = 0.0
            out["if_score"] = 0.0
            out["if_pred"] = 0

        # =================================================
        # CLASSIFIER
        # =================================================

        if (
            self.classifier
            is not None
            and X_proc is not None
        ):

            try:

                probabilities = (
                    self.classifier
                    .predict_proba(
                        X_proc
                    )
                )

                if (
                    probabilities.shape[1]
                    > 1
                ):

                    out[
                        "rf_probability"
                    ] = probabilities[:, 1]

                else:

                    out[
                        "rf_probability"
                    ] = probabilities[:, 0]

                out["rf_pred"] = (
                    out[
                        "rf_probability"
                    ]
                    >= 0.50
                ).astype(int)

            except Exception as exc:

                print(
                    "[WARNING] Classifier inference failed: "
                    f"{exc}"
                )

                out[
                    "rf_probability"
                ] = 0.0

                out[
                    "rf_pred"
                ] = 0

        else:

            out[
                "rf_probability"
            ] = 0.0

            out[
                "rf_pred"
            ] = 0

        # =================================================
        # FRAUD ANALYSIS
        # =================================================

        out = self.apply_fraud_detection(
            out
        )

        # =================================================
        # BATCH ANALYSIS
        # =================================================

        out = self.apply_batch_analysis(
            out
        )

        if (
            "fraud_score"
            not in out.columns
        ):

            out[
                "fraud_score"
            ] = 0.0

        if (
            "batch_risk_score"
            not in out.columns
        ):
            out[
                "batch_risk_score"
            ] = 0.0

        # =================================================
        # HYBRID SCORE
        # =================================================

        weights = {
            "rf": self.hybrid_weights.get("rf", 0.25),
            "anomaly": self.hybrid_weights.get("anomaly", 0.20),
            "rules": self.hybrid_weights.get("rules", 0.20),
            "interaction": self.hybrid_weights.get("interaction", 0.15),
            "fraud_score": self.hybrid_weights.get(
                "fraud_score",
                0.10,
            ),
            "batch": self.hybrid_weights.get("batch", 0.10),
        }

        out["hybrid_score"] = (
            (
                weights["rf"]
                * out[
                    "rf_probability"
                ]
            )
            + (
                weights["anomaly"]
                * out[
                    "if_score"
                ]
            )
            + (
                weights["rules"]
                * out[
                    "rule_score"
                ]
            )
            + (
                weights["interaction"]
                * (
                    out[
                        "rf_probability"
                    ]
                    * out[
                        "rule_score"
                    ]
                )
            )
            + (
                weights["fraud_score"]
                * pd.to_numeric(
                    out[
                        "fraud_score"
                    ],
                    errors="coerce",
                ).fillna(0)
            )
            + (
                    weights["batch"]
                    * pd.to_numeric(
                out[
                    "batch_risk_score"
                ],
                errors="coerce",
            ).fillna(0)
            )
        )

        out["hybrid_score"] = (
            pd.to_numeric(
                out[
                    "hybrid_score"
                ],
                errors="coerce",
            )
            .fillna(0)
            .clip(
                lower=0,
                upper=1,
            )
        )

        out["hybrid_pred"] = (
            out[
                "hybrid_score"
            ]
            >= self.hybrid_threshold
        ).astype(int)

        out["hybrid_risk_label"] = (
            self.assign_risk_label(
                out[
                    "hybrid_score"
                ]
            )
        )

        # =================================================
        # OPERATOR FIELDS
        # =================================================

        out["severity_level"] = (
            out.apply(
                determine_severity_level,
                axis=1,
            )
        )

        out["review_status"] = (
            out[
                "severity_level"
            ].apply(
                determine_review_status
            )
        )

        out["compliance_issue"] = (
            out.apply(
                determine_compliance_issue,
                axis=1,
            )
        )

        out[
            "recommended_action"
        ] = (
            out[
                "severity_level"
            ].apply(
                determine_recommended_action
            )
        )

        out["review_priority"] = (
            out[
                "hybrid_score"
            ]
            .rank(
                ascending=False,
                method="dense",
            )
            .astype(int)
        )

        out["explanation"] = (
            out.apply(
                build_operator_explanation,
                axis=1,
            )
        )

        # =================================================
        # FINAL SANITISATION
        # =================================================

        out.replace(
            [np.inf, -np.inf],
            np.nan,
            inplace=True,
        )

        # -------------------------------------------------
        # NUMERIC COLUMNS
        # -------------------------------------------------

        numeric_cols = (
            out.select_dtypes(
                include=[np.number]
            ).columns
        )

        for col in numeric_cols:

            out[col] = (
                pd.to_numeric(
                    out[col],
                    errors="coerce",
                )
                .fillna(0)
            )

        # -------------------------------------------------
        # OBJECT COLUMNS
        # -------------------------------------------------

        object_cols = (
            out.select_dtypes(
                include=["object"]
            ).columns
        )

        for col in object_cols:

            out[col] = (
                out[col]
                .astype(str)
                .replace(
                    {
                        "nan": "",
                        "None": "",
                    }
                )
            )

        # -------------------------------------------------
        # BOOLEAN COLUMNS
        # -------------------------------------------------

        bool_cols = (
            out.select_dtypes(
                include=["bool"]
            ).columns
        )

        for col in bool_cols:

            out[col] = (
                out[col]
                .fillna(False)
            )

        return out

    # =====================================================
    # SUMMARY GENERATION
    # =====================================================

    def generate_summary(
        self,
        scored_df: pd.DataFrame,
    ) -> Dict[str, Any]:

        total_records = len(
            scored_df
        )

        critical_records = int(
            (
                scored_df[
                    "severity_level"
                ]
                == "critical"
            ).sum()
        )

        high_risk = int(
            (
                scored_df[
                    "severity_level"
                ]
                == "high"
            ).sum()
        )

        medium_risk = int(
            (
                scored_df[
                    "severity_level"
                ]
                == "medium"
            ).sum()
        )

        cleared_records = int(
            (
                scored_df[
                    "severity_level"
                ]
                == "low"
            ).sum()
        )

        flagged_records = int(
            (
                scored_df[
                    "hybrid_pred"
                ]
                == 1
            ).sum()
        )

        avg_score = float(
            pd.to_numeric(
                scored_df[
                    "hybrid_score"
                ],
                errors="coerce",
            )
            .fillna(0)
            .mean()
        )

        summary = {
            "total_records":
                total_records,

            "flagged_records":
                flagged_records,

            "critical_records":
                critical_records,

            "high_risk_records":
                high_risk,

            "medium_risk_records":
                medium_risk,

            "cleared_records":
                cleared_records,

            "average_risk_score":
                round(
                    avg_score,
                    4,
                ),
        }

        # =================================================
        # OPTIONAL PRECISION
        # =================================================

        if (
            "is_problematic"
            in scored_df.columns
        ):

            try:

                precision = (
                    precision_score(
                        scored_df[
                            "is_problematic"
                        ],
                        scored_df[
                            "hybrid_pred"
                        ],
                        zero_division=0,
                    )
                )

                summary[
                    "screening_precision"
                ] = round(
                    float(
                        precision
                    ),
                    4,
                )

            except Exception:

                pass

        # =================================================
        # OPTIONAL FRAUD METRICS
        # =================================================

        if (
            "fraud_score"
            in scored_df.columns
        ):

            summary[
                "average_fraud_risk"
            ] = round(
                float(
                    pd.to_numeric(
                        scored_df[
                            "fraud_score"
                        ],
                        errors="coerce",
                    )
                    .fillna(0)
                    .mean()
                ),
                4,
            )

        return summary