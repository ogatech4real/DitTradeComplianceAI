from __future__ import annotations

import pandas as pd
from typing import Dict, Any


class UnitNormalizer:
    """
    Standardises units and scales numeric fields for model consumption.

    Responsibilities:
    - Convert quantities to tonnes
    - Standardise monetary values
    - Normalize percentages
    - Ensure consistent measurement units across uploaded datasets
    """

    @staticmethod
    def normalise_quantity(df: pd.DataFrame, col: str = "shipment_quantity", unit_col: str = "quantity_unit") -> pd.DataFrame:
        """Convert quantities to tonnes if necessary."""
        df = df.copy()
        for idx, row in df.iterrows():
            unit = row.get(unit_col, "tonnes")
            val = row.get(col, 0)
            if pd.isna(val):
                continue
            if unit == "kg":
                df.at[idx, col] = val / 1000.0
                df.at[idx, unit_col] = "tonnes"
            elif unit == "lb":
                df.at[idx, col] = val * 0.000453592
                df.at[idx, unit_col] = "tonnes"
            else:
                df.at[idx, col] = val
        return df

    @staticmethod
    def normalise_percentage(df: pd.DataFrame, col: str) -> pd.DataFrame:
        """Ensure percentages are in 0-100 scale."""
        df = df.copy()
        df[col] = df[col].apply(lambda x: x if pd.isna(x) else max(0, min(x, 100)))
        return df

    @staticmethod
    def normalise_monetary(df: pd.DataFrame, col: str = "shipment_value_usd") -> pd.DataFrame:
        """Ensure numeric monetary values are floats and non-negative."""
        df = df.copy()
        df[col] = df[col].apply(lambda x: float(x) if pd.notna(x) else 0.0)
        df[col] = df[col].clip(lower=0)
        return df

    @staticmethod
    def normalise_dataframe(df: pd.DataFrame) -> pd.DataFrame:
        """Run all unit normalisations."""
        df = UnitNormalizer.normalise_quantity(df)
        df = UnitNormalizer.normalise_monetary(df)
        for col in ["recycled_content_percent", "traceability_completeness_score", "document_consistency_score", "origin_certificate_match_score"]:
            if col in df.columns:
                df = UnitNormalizer.normalise_percentage(df, col)
        return df