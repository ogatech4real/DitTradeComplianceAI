from __future__ import annotations

import pandas as pd
import numpy as np
from typing import Dict, Any


class DataQualityProfiler:
    """
    Comprehensive data quality assessment for uploaded datasets.

    Responsibilities:
    - Missing value detection
    - Outlier detection
    - Consistency checks
    - Column completeness scoring
    """

    @staticmethod
    def profile_missing_values(df: pd.DataFrame) -> Dict[str, Any]:
        """Compute missing value percentages per column."""
        missing_pct = df.isna().mean() * 100
        return missing_pct.to_dict()

    @staticmethod
    def profile_numeric_outliers(df: pd.DataFrame, z_threshold: float = 3.0) -> Dict[str, int]:
        """Detect numeric columns with extreme outliers using Z-score method."""
        outlier_counts = {}
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            series = df[col].dropna()
            if len(series) == 0:
                outlier_counts[col] = 0
                continue
            z_scores = (series - series.mean()) / series.std(ddof=0)
            outliers = np.abs(z_scores) > z_threshold
            outlier_counts[col] = int(outliers.sum())
        return outlier_counts

    @staticmethod
    def profile_column_completeness(df: pd.DataFrame) -> Dict[str, float]:
        """Return completeness percentage per column."""
        completeness = df.notna().mean() * 100
        return completeness.to_dict()

    @staticmethod
    def generate_quality_report(df: pd.DataFrame) -> Dict[str, Any]:
        """Aggregate data quality metrics."""
        report = {
            "missing_values_pct": DataQualityProfiler.profile_missing_values(df),
            "numeric_outliers_count": DataQualityProfiler.profile_numeric_outliers(df),
            "column_completeness_pct": DataQualityProfiler.profile_column_completeness(df),
        }
        return report