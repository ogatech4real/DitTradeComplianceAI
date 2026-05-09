from __future__ import annotations

from pathlib import Path
from typing import Dict, Any, Optional
import time
from datetime import datetime

import joblib
import pandas as pd
import numpy as np

from src.data.io import load_tabular_file
from src.data.mapping import canonicalise_dataframe
from src.data.mapping import infer_mapping
from src.domain.schema import REQUIRED_SCREENING_FIELDS
from src.data.data_quality import DataQualityProfiler
from src.features.preprocessing import enrich_from_icc, ALL_FEATURES
from src.rules.rule_engine import run_rule_engine
from backend.orchestration.workflow_engine import WorkflowEngine
from backend.rules.operational_rules import generate_operational_insights


class PipelineManager:
    """
    Production-grade orchestration layer.

    Responsibilities:
    - file ingestion
    - schema canonicalisation
    - compliance validation
    - ML scoring
    - operator reporting
    - business insights generation
    """

    def __init__(self, model_dir: Optional[str | Path] = None) -> None:

        # Default model directory
        if model_dir is None:
            root_dir = Path(__file__).resolve().parents[2]
            model_dir = root_dir / "storage" / "models"

        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(parents=True, exist_ok=True)

        # Model version
        self.model_version = "production-v1.0"

        # Load models
        self.preprocessor = self._safe_load("preprocessor.joblib")
        self.isolation_forest = self._safe_load("isolation_forest.joblib")
        self.classifier = self._safe_load("classifier.joblib")
        self.metadata = self._safe_load("metadata.joblib")

        # Workflow engine
        self.workflow_engine = WorkflowEngine(
            preprocessor=self.preprocessor,
            isolation_forest=self.isolation_forest,
            classifier=self.classifier,
            metadata=self.metadata,
        )

    # ---------------------------------------------------------
    # Safe model loader
    # ---------------------------------------------------------
    def _safe_load(self, filename: str):
        file_path = self.model_dir / filename
        if not file_path.exists():
            print(f"[WARNING] Missing model file: {file_path}")
            return None
        try:
            return joblib.load(file_path)
        except Exception as exc:
            print(f"[WARNING] Failed loading {filename}: {exc}")
            return None

    # ---------------------------------------------------------
    # Ingestion
    # ---------------------------------------------------------
    def ingest_file(self, file_path: str | Path) -> pd.DataFrame:
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"Input file not found: {file_path}")
        return load_tabular_file(file_path)

    # ---------------------------------------------------------
    # Canonicalisation
    # ---------------------------------------------------------
    def canonicalise(self, df: pd.DataFrame) -> pd.DataFrame:
        canonical_df, _ = canonicalise_dataframe(df)
        canonical_df = enrich_from_icc(canonical_df)
        return canonical_df

    # ---------------------------------------------------------
    # Validation
    # ---------------------------------------------------------
    def validate(self, df: pd.DataFrame) -> pd.DataFrame:
        return run_rule_engine(df.copy())

    # ---------------------------------------------------------
    # Feature alignment
    # ---------------------------------------------------------
    def ensure_required_features(self, df: pd.DataFrame) -> pd.DataFrame:
        out = df.copy()
        for col in ALL_FEATURES:
            if col not in out.columns:
                out[col] = 0
        return out

    # ---------------------------------------------------------
    # Upload summary
    # ---------------------------------------------------------
    @staticmethod
    def generate_upload_summary(df: pd.DataFrame) -> Dict[str, Any]:
        markets = []
        for col in ["destination_country", "destination_market", "market"]:
            if col in df.columns:
                markets = df[col].dropna().astype(str).unique().tolist()
                break

        categories = []
        for col in ["product_category", "commodity_category", "hs_category"]:
            if col in df.columns:
                categories = df[col].dropna().astype(str).unique().tolist()
                break

        return {
            "upload_timestamp": datetime.utcnow().isoformat(),
            "total_records": int(len(df)),
            "total_columns": int(len(df.columns)),
            "markets_involved": markets[:10],
            "product_categories": categories[:10],
        }

    # ---------------------------------------------------------
    # Priority review queue
    # ---------------------------------------------------------
    @staticmethod
    def generate_priority_queue(scored_df: pd.DataFrame, top_k: int = 25) -> pd.DataFrame:
        if scored_df.empty:
            return scored_df
        return scored_df.sort_values(by=["hybrid_score"], ascending=False).head(top_k).copy()

    # ---------------------------------------------------------
    # Processing metadata
    # ---------------------------------------------------------
    def build_processing_metadata(self, execution_seconds: float) -> Dict[str, Any]:
        return {
            "processing_timestamp": datetime.utcnow().isoformat(),
            "processing_duration_seconds": round(execution_seconds, 3),
            "model_version": self.model_version,
            "ml_models_loaded": {
                "preprocessor": self.preprocessor is not None,
                "isolation_forest": self.isolation_forest is not None,
                "classifier": self.classifier is not None,
            },
        }

    @staticmethod
    def build_intelligence_quality_metrics(
        raw_df: pd.DataFrame,
        canonical_df: pd.DataFrame,
    ) -> Dict[str, Any]:
        mapping_confidence = float(
            pd.to_numeric(
                canonical_df.get("mapping_confidence", 0.0),
                errors="coerce",
            )
            .fillna(0)
            .mean()
            if len(canonical_df) > 0
            else 0.0
        )
        mapping_confidence = float(
            np.clip(
                mapping_confidence,
                0,
                1,
            )
        )

        inferred_mapping = infer_mapping(list(raw_df.columns))
        matched_schema_fields = int(len(inferred_mapping.mapping))
        required_schema_fields = int(len(REQUIRED_SCREENING_FIELDS))

        completeness_pct = DataQualityProfiler.profile_column_completeness(raw_df)
        missing_pct = DataQualityProfiler.profile_missing_values(raw_df)
        completeness_score = float(
            np.mean(list(completeness_pct.values())) / 100
        ) if completeness_pct else 0.0

        invalid_values = float(
            np.mean(list(missing_pct.values())) / 100
        ) if missing_pct else 0.0

        quality_score = float(
            np.clip(
                (0.70 * completeness_score)
                + (0.30 * (1 - invalid_values)),
                0,
                1,
            )
        )

        return {
            "mapping_confidence": round(mapping_confidence, 4),
            "matched_schema_fields": matched_schema_fields,
            "required_schema_fields": required_schema_fields,
            "icc_transformation_coverage": round(mapping_confidence, 4),
            "completeness_score": round(completeness_score, 4),
            "invalid_values_rate": round(invalid_values, 4),
            "coercion_rate": round(invalid_values, 4),
            "schema_consistency_score": round(mapping_confidence, 4),
            "data_quality_score": round(quality_score, 4),
        }

    # ---------------------------------------------------------
    # Main pipeline
    # ---------------------------------------------------------
    def run_pipeline(
        self, input_data: str | Path | pd.DataFrame, return_intermediate: bool = False
    ) -> Dict[str, Any]:

        start_time = time.time()

        # Ingest
        raw_df = self.ingest_file(input_data) if isinstance(input_data, (str, Path)) else input_data.copy()

        # Upload summary
        upload_summary = self.generate_upload_summary(raw_df)

        # Canonicalise
        canonical_df = self.canonicalise(raw_df)

        intelligence_quality = self.build_intelligence_quality_metrics(
            raw_df=raw_df,
            canonical_df=canonical_df,
        )

        # Validate
        validated_df = self.validate(canonical_df)

        # Feature prep
        prepared_df = self.ensure_required_features(validated_df)

        # ML scoring
        scored_df = self.workflow_engine.score(prepared_df)

        # Screening summary
        screening_summary = self.workflow_engine.generate_summary(scored_df)

        # Operational insights
        system_insights = generate_operational_insights(scored_df)
        system_insights.update(
            {
                "mapping_confidence": intelligence_quality.get("mapping_confidence", 0.0),
                "matched_schema_fields": intelligence_quality.get("matched_schema_fields", 0),
                "required_schema_fields": intelligence_quality.get("required_schema_fields", 0),
                "icc_transformation_coverage": intelligence_quality.get("icc_transformation_coverage", 0.0),
                "data_quality_score": intelligence_quality.get("data_quality_score", 0.0),
            }
        )

        # Priority queue
        priority_queue = self.generate_priority_queue(scored_df)

        # Processing metadata
        processing_metadata = self.build_processing_metadata(execution_seconds=time.time() - start_time)
        processing_metadata.update(
            {
                "intelligence_quality": intelligence_quality,
                "mapping_confidence": intelligence_quality.get("mapping_confidence", 0.0),
                "matched_schema_fields": intelligence_quality.get("matched_schema_fields", 0),
                "required_schema_fields": intelligence_quality.get("required_schema_fields", 0),
                "icc_transformation_coverage": intelligence_quality.get("icc_transformation_coverage", 0.0),
                "data_quality": {
                    "completeness": intelligence_quality.get("completeness_score", 0.0),
                    "invalid_values_rate": intelligence_quality.get("invalid_values_rate", 0.0),
                    "coercion_rate": intelligence_quality.get("coercion_rate", 0.0),
                    "schema_consistency_score": intelligence_quality.get("schema_consistency_score", 0.0),
                    "overall_quality_score": intelligence_quality.get("data_quality_score", 0.0),
                },
            }
        )

        # Result package
        result = {
            "upload_summary": upload_summary,
            "screening_summary": screening_summary,
            "system_insights": system_insights,
            "priority_review_queue": (
                priority_queue.to_dict(orient="records")
            ),
            "processing_metadata": processing_metadata,
            "records": (
                scored_df.to_dict(orient="records")
            ),
        }

        # Optional intermediate outputs
        if return_intermediate:
            result["raw_df"] = raw_df
            result["canonical_df"] = canonical_df
            result["validated_df"] = validated_df

        return result

    # ---------------------------------------------------------
    # Export results
    # ---------------------------------------------------------
    def export_results(self, scored_df: pd.DataFrame, output_path: str | Path) -> Path:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        suffix = output_path.suffix.lower()

        if suffix == ".csv":
            scored_df.to_csv(output_path, index=False)
        elif suffix in [".xlsx", ".xls"]:
            scored_df.to_excel(output_path, index=False)
        else:
            raise ValueError("Unsupported export format. Use CSV or XLSX.")

        return output_path


# =============================================================
# Local test
# =============================================================
if __name__ == "__main__":
    manager = PipelineManager()
    print("\nPipelineManager initialised.")
    print(f"Model directory: {manager.model_dir}")