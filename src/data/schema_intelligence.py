from __future__ import annotations

from dataclasses import dataclass
from difflib import SequenceMatcher
from typing import Dict, List, Optional

import pandas as pd

from src.domain.schema import (
    CANONICAL_FIELDS,
    REQUIRED_SCREENING_FIELDS,
)

from src.data.mapping import (
    ALIASES,
)


# =========================================================
# CONFIGURATION
# =========================================================

FUZZY_MATCH_THRESHOLD = 0.78


# =========================================================
# RESULT CONTAINER
# =========================================================

@dataclass
class SchemaAnalysisResult:

    detected_mapping: Dict[str, str]

    missing_required_fields: List[str]

    unmapped_columns: List[str]

    low_confidence_matches: Dict[
        str,
        float,
    ]

    confidence_score: float

    suggested_manual_review: bool


# =========================================================
# NORMALISATION
# =========================================================

def normalise_column_name(
    value: str,
) -> str:

    return (
        str(value)
        .strip()
        .lower()
        .replace("-", "_")
        .replace(" ", "_")
        .replace(".", "_")
        .replace("/", "_")
    )


# =========================================================
# STRING SIMILARITY
# =========================================================

def similarity_score(
    a: str,
    b: str,
) -> float:

    return SequenceMatcher(
        None,
        normalise_column_name(a),
        normalise_column_name(b),
    ).ratio()


# =========================================================
# FIND BEST MATCH
# =========================================================

def find_best_match(
    column: str,
    aliases: List[str],
) -> tuple[Optional[str], float]:

    best_alias = None

    best_score = 0.0

    for alias in aliases:

        score = similarity_score(
            column,
            alias,
        )

        if score > best_score:

            best_alias = alias
            best_score = score

    return best_alias, best_score


# =========================================================
# SCHEMA ANALYSIS
# =========================================================

def analyse_schema(
    dataframe: pd.DataFrame,
) -> SchemaAnalysisResult:

    columns = list(dataframe.columns)

    detected_mapping = {}

    low_confidence_matches = {}

    matched_source_columns = set()

    # =====================================================
    # DIRECT + FUZZY MATCHING
    # =====================================================

    for canonical_field in CANONICAL_FIELDS:

        aliases = ALIASES.get(
            canonical_field,
            [],
        )

        aliases = aliases + [
            canonical_field
        ]

        best_source = None

        best_score = 0.0

        for column in columns:

            _, score = find_best_match(
                column,
                aliases,
            )

            if score > best_score:

                best_source = column
                best_score = score

        if (
            best_source
            and best_score
            >= FUZZY_MATCH_THRESHOLD
        ):

            detected_mapping[
                canonical_field
            ] = best_source

            matched_source_columns.add(
                best_source
            )

            if best_score < 0.90:

                low_confidence_matches[
                    canonical_field
                ] = round(
                    best_score,
                    3,
                )

    # =====================================================
    # REQUIRED FIELD CHECK
    # =====================================================

    missing_required_fields = [
        field
        for field
        in REQUIRED_SCREENING_FIELDS
        if field
        not in detected_mapping
    ]

    # =====================================================
    # UNMAPPED COLUMNS
    # =====================================================

    unmapped_columns = [
        column
        for column in columns
        if column
        not in matched_source_columns
    ]

    # =====================================================
    # CONFIDENCE SCORE
    # =====================================================

    confidence_score = round(
        len(detected_mapping)
        / max(
            len(REQUIRED_SCREENING_FIELDS),
            1,
        ),
        3,
    )

    suggested_manual_review = (
        len(missing_required_fields) > 0
        or len(low_confidence_matches) > 0
    )

    return SchemaAnalysisResult(
        detected_mapping=detected_mapping,
        missing_required_fields=missing_required_fields,
        unmapped_columns=unmapped_columns,
        low_confidence_matches=low_confidence_matches,
        confidence_score=confidence_score,
        suggested_manual_review=suggested_manual_review,
    )


# =========================================================
# BUILD OPERATOR REPORT
# =========================================================

def build_schema_report(
    dataframe: pd.DataFrame,
) -> Dict:

    analysis = analyse_schema(
        dataframe
    )

    return {
        "schema_confidence_score":
            analysis.confidence_score,

        "detected_mapping":
            analysis.detected_mapping,

        "missing_required_fields":
            analysis.missing_required_fields,

        "unmapped_columns":
            analysis.unmapped_columns,

        "low_confidence_matches":
            analysis.low_confidence_matches,

        "suggested_manual_review":
            analysis.suggested_manual_review,
    }


# =========================================================
# APPLY MAPPING
# =========================================================

def apply_schema_mapping(
    dataframe: pd.DataFrame,
    mapping: Dict[str, str],
) -> pd.DataFrame:

    output = pd.DataFrame()

    for canonical_field in CANONICAL_FIELDS:

        source_column = mapping.get(
            canonical_field
        )

        if (
            source_column
            and source_column
            in dataframe.columns
        ):

            output[
                canonical_field
            ] = dataframe[
                source_column
            ]

        else:

            output[
                canonical_field
            ] = None

    return output