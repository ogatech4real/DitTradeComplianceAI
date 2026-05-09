from __future__ import annotations
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import pandas as pd


# 🔹 EXISTING FEATURE DEFINITIONS (UNCHANGED)
NUMERICAL_FEATURES = [
    "shipment_quantity",
    "shipment_value_usd",
    "supplier_chain_depth",
    "embedded_emissions_tco2e_per_tonne",
    "recycled_content_percent",
    "traceability_completeness_score",
    "supporting_document_count",
    "document_consistency_score",
    "origin_certificate_match_score",
    "rule_flag_count",
]

BINARY_FEATURES = [
    "origin_certificate_available",
    "supplier_traceability_metadata_available",
    "batch_lot_reference_available",
    "production_site_identifier_available",
    "plant_emissions_disclosure_available",
]

CATEGORICAL_FEATURES = [
    "product_family",
    "destination_market",
    "country_of_export",
    "declared_origin_country",
    "country_of_last_substantial_transformation",
    "production_method_tag",
    "electricity_source_tag",
    "emissions_estimation_method",
    "transport_mode",
    "incoterm",
]

ALL_FEATURES = NUMERICAL_FEATURES + BINARY_FEATURES + CATEGORICAL_FEATURES


# 🔴 NEW: ICC → FLAT FEATURE EXTRACTION (NON-BREAKING)
def enrich_from_icc(df: pd.DataFrame) -> pd.DataFrame:
    """
    Flatten ICC nested structure into canonical ML columns.
    Only fills missing values in primary columns.
    """
    if "icc" not in df.columns:
        return df

    df = df.copy()

    def safe_get(d, path, default=None):
        for key in path:
            if not isinstance(d, dict):
                return default
            d = d.get(key)
        return d if d is not None else default

    # 🔹 Map ICC values into expected ML columns
    mapping = {
        "shipment_quantity": ["trade", "quantity"],
        "shipment_value_usd": ["trade", "value"],
        "embedded_emissions_tco2e_per_tonne": ["emissions", "value"],
        "recycled_content_percent": ["emissions", "recycled_content_percent"],
        "traceability_completeness_score": ["traceability", "traceability_score"],
        "product_family": ["product", "category"],
        "declared_origin_country": ["origin", "country"],
        "country_of_last_substantial_transformation": ["origin", "last_transformation_country"],
    }

    for col, path in mapping.items():
        if col in df.columns:
            df[col] = df[col].fillna(df["icc"].apply(lambda x: safe_get(x, path)))

    return df


# 🔴 UPDATED: PREPROCESSOR BUILDER (ICC-aware entry point)
def build_preprocessor():
    """
    Construct ColumnTransformer preprocessor for ML pipeline.
    Includes numerical scaling, categorical encoding, and binary passthrough.
    """
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ("bin", "passthrough", BINARY_FEATURES),
        ]
    )