from __future__ import annotations

import pandas as pd
import numpy as np
from typing import Dict


def infer_column_types(df: pd.DataFrame) -> Dict[str, str]:
    """
    Infer data types for each column.
    Returns a dictionary mapping column_name -> inferred_type.
    """
    inferred = {}
    for col in df.columns:
        series = df[col].dropna()

        if series.empty:
            inferred[col] = "unknown"
            continue

        if pd.api.types.is_numeric_dtype(series):
            inferred[col] = "numeric"
        elif pd.api.types.is_bool_dtype(series):
            inferred[col] = "boolean"
        elif pd.api.types.is_datetime64_any_dtype(series):
            inferred[col] = "datetime"
        elif series.nunique() / len(series) < 0.1:
            inferred[col] = "categorical"
        else:
            inferred[col] = "text"

    return inferred