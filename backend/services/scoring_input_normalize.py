from __future__ import annotations

import numpy as np
import pandas as pd

# Mirrors Streamlit `frontend/app.py` `sanitise_dataframe`, plus coercion for
# JSON payloads where CSV-derived numbers arrive as strings (browser/Papa Parse).


def _try_coerce_numeric_object_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    JSON record batches often carry numbers as strings. `pandas.read_csv` would
    promote digit-only columns; apply the same inference when building the
    initial frame from dict records.
    """

    out = df.copy()

    for col in out.columns:

        series = out[col]

        if pd.api.types.is_numeric_dtype(series):
            continue

        if pd.api.types.is_bool_dtype(series):
            continue

        def to_parseable(v: object) -> object:

            if v is None:

                return np.nan

            if isinstance(v, bool):

                return np.nan

            if isinstance(v, (int, np.integer)):

                return int(v)

            if isinstance(v, (float, np.floating)):

                if pd.isna(v):

                    return np.nan

                return float(v)

            s = str(v).strip()

            if s == "" or s.lower() in {"nan", "none", "null"}:

                return np.nan

            return s

        candidate = series.map(
            to_parseable,
        )

        meaningful = candidate.notna()

        if not bool(
            meaningful.any(),
        ):

            continue

        parsed = pd.to_numeric(
            candidate,
            errors="coerce",
        )

        if not bool(
            (
                parsed[
                    meaningful
                ]
                .notna()
            ).all(),
        ):

            continue

        out[col] = parsed

    return out


def sanitise_dataframe_for_scoring(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Ensure dataframe is safe for scoring and matches Streamlit pre-POST cleanup.
    """

    out = df.copy()

    out = out.loc[
        :,
        ~out.columns.duplicated(),
    ]

    out = _try_coerce_numeric_object_columns(
        out,
    )

    numeric_cols = out.select_dtypes(
        include=[np.number],
    ).columns

    if len(numeric_cols) > 0:

        out[numeric_cols] = (
            out[numeric_cols]
            .replace(
                [np.inf, -np.inf],
                np.nan,
            )
            .apply(
                pd.to_numeric,
                errors="coerce",
            )
            .fillna(0)
        )

    bool_cols = out.select_dtypes(
        include=["bool", "boolean"],
    ).columns

    if len(bool_cols) > 0:

        out[bool_cols] = (
            out[bool_cols]
            .fillna(False)
        )

    other_cols = (
        out.columns
        .difference(numeric_cols)
        .difference(bool_cols)
    )

    if len(other_cols) > 0:

        for col in other_cols:

            series = out[col]

            if pd.api.types.is_datetime64_any_dtype(
                series,
            ):

                out[col] = np.where(
                    series.isna(),
                    "",
                    series.dt.strftime("%Y-%m-%d"),
                )

            else:

                out[col] = series.map(
                    lambda cell: ""
                    if pd.isna(cell)
                    else str(cell),
                )

    return out


def normalize_scoring_request_dataframe(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Full ingress path for `POST /scoring/run` JSON `records` bodies.
    """

    return sanitise_dataframe_for_scoring(
        df,
    )
