from __future__ import annotations

import pandas as pd

from src.utils.config import (
    load_all_configs,
)

# =========================================================
# LOAD CONFIGURATION
# =========================================================

PRODUCTS = (
    load_all_configs()
    ["product"]
    ["products"]
)


# =========================================================
# EMISSIONS PLAUSIBILITY
# =========================================================

def get_emissions_bounds(
    product_family: str,
):

    if (
        not product_family
        or product_family
        not in PRODUCTS
    ):

        return None, None

    return PRODUCTS[
        product_family
    ][
        "emissions_range"
    ]


# =========================================================
# SAFE ICC ACCESSOR
# =========================================================

def _get_icc(
    row: pd.Series,
) -> dict:

    icc = row.get(
        "icc"
    )

    return (
        icc
        if isinstance(
            icc,
            dict,
        )
        else {}
    )


# =========================================================
# SAFE VALUE EXTRACTION
# =========================================================

def _safe_get(
    data: dict,
    path: list,
    default=None,
):

    current = data

    for key in path:

        if not isinstance(
            current,
            dict,
        ):

            return default

        current = current.get(
            key
        )

    return (
        current
        if current is not None
        else default
    )


# =========================================================
# CORE RULE EVALUATION
# =========================================================

def evaluate_rules(
    row: pd.Series,
) -> list:

    flags = []

    icc = _get_icc(
        row
    )

    # =====================================================
    # ICC-FIRST EXTRACTION
    # =====================================================

    quantity = _safe_get(
        icc,
        ["trade", "quantity"],
        row.get(
            "shipment_quantity"
        ),
    )

    value = _safe_get(
        icc,
        ["trade", "value"],
        row.get(
            "shipment_value_usd"
        ),
    )

    origin = _safe_get(
        icc,
        ["origin", "country"],
        row.get(
            "declared_origin_country"
        ),
    )

    emissions = _safe_get(
        icc,
        ["emissions", "value"],
        row.get(
            "embedded_emissions_tco2e_per_tonne"
        ),
    )

    traceability = _safe_get(
        icc,
        ["traceability", "traceability_score"],
        row.get(
            "traceability_completeness_score"
        ),
    )

    recycled = _safe_get(
        icc,
        [
            "emissions",
            "recycled_content_percent",
        ],
        row.get(
            "recycled_content_percent"
        ),
    )

    # =====================================================
    # NUMERIC NORMALISATION
    # =====================================================

    quantity = pd.to_numeric(
        quantity,
        errors="coerce",
    )

    value = pd.to_numeric(
        value,
        errors="coerce",
    )

    emissions = pd.to_numeric(
        emissions,
        errors="coerce",
    )

    traceability = pd.to_numeric(
        traceability,
        errors="coerce",
    )

    recycled = pd.to_numeric(
        recycled,
        errors="coerce",
    )

    # =====================================================
    # CORE VALIDATION RULES
    # =====================================================

    if (
        pd.isna(quantity)
        or quantity <= 0
    ):

        flags.append(
            "invalid_shipment_quantity"
        )

    if (
        pd.isna(value)
        or value <= 0
    ):

        flags.append(
            "invalid_shipment_value"
        )

    if (
        pd.isna(origin)
        or str(origin).strip() == ""
    ):

        flags.append(
            "missing_declared_origin"
        )

    if pd.isna(emissions):

        flags.append(
            "missing_emissions_value"
        )

    if pd.isna(traceability):

        flags.append(
            "missing_traceability_score"
        )

    elif (
        traceability < 0
        or traceability > 1
    ):

        flags.append(
            "invalid_traceability_score"
        )

    if (
        not pd.isna(recycled)
        and (
            recycled < 0
            or recycled > 100
        )
    ):

        flags.append(
            "invalid_recycled_content"
        )

    # =====================================================
    # RECYCLED METHOD CONSISTENCY
    # =====================================================

    if (
        row.get(
            "production_method_tag"
        )
        == "recycled"
        and (
            pd.isna(recycled)
            or recycled < 50
        )
    ):

        flags.append(
            "recycled_method_conflict"
        )

    # =====================================================
    # ORIGIN CERTIFICATE VALIDATION
    # =====================================================

    origin_match_score = pd.to_numeric(
        row.get(
            "origin_certificate_match_score"
        ),
        errors="coerce",
    )

    if (
        row.get(
            "origin_certificate_available"
        )
        == 0
        and not pd.isna(
            origin_match_score
        )
        and origin_match_score > 0.2
    ):

        flags.append(
            "origin_certificate_conflict"
        )

    # =====================================================
    # SUPPLIER TRACEABILITY
    # =====================================================

    supplier_depth = pd.to_numeric(
        row.get(
            "supplier_chain_depth"
        ),
        errors="coerce",
    )

    if (
        not pd.isna(
            supplier_depth
        )
        and supplier_depth >= 3
        and row.get(
            "supplier_traceability_metadata_available"
        )
        == 0
    ):

        flags.append(
            "missing_supplier_traceability_metadata"
        )

    # =====================================================
    # DOCUMENT CONSISTENCY
    # =====================================================

    document_count = pd.to_numeric(
        row.get(
            "supporting_document_count"
        ),
        errors="coerce",
    )

    document_score = pd.to_numeric(
        row.get(
            "document_consistency_score"
        ),
        errors="coerce",
    )

    if (
        document_count == 0
        and not pd.isna(
            document_score
        )
        and document_score > 0.2
    ):

        flags.append(
            "document_count_consistency_conflict"
        )

    # =====================================================
    # EMISSIONS PLAUSIBILITY
    # =====================================================

    product_family = _safe_get(
        icc,
        ["product", "category"],
        row.get(
            "product_family"
        ),
    )

    low, high = (
        get_emissions_bounds(
            product_family
        )
    )

    if (
        not pd.isna(emissions)
        and low is not None
        and (
            emissions < low
            or emissions > high
        )
    ):

        flags.append(
            "emissions_outside_plausibility_band"
        )

    # =====================================================
    # ORIGIN CONSISTENCY
    # =====================================================

    transformation = _safe_get(
        icc,
        [
            "origin",
            "last_transformation_country",
        ],
        row.get(
            "country_of_last_substantial_transformation"
        ),
    )

    if (
        not pd.isna(origin)
        and not pd.isna(
            transformation
        )
        and str(origin).strip().lower()
        != str(
            transformation
        ).strip().lower()
    ):

        flags.append(
            "origin_transformation_mismatch"
        )

    # =====================================================
    # DUPLICATE CLEANUP
    # =====================================================

    flags = list(
        dict.fromkeys(
            flags
        )
    )

    return flags


# =========================================================
# RULE ENGINE EXECUTION
# =========================================================

def run_rule_engine(
    df: pd.DataFrame,
) -> pd.DataFrame:

    out = df.copy()

    # =====================================================
    # APPLY RULES
    # =====================================================

    out[
        "rule_flags"
    ] = out.apply(
        evaluate_rules,
        axis=1,
    )

    out[
        "rule_flag_count"
    ] = out[
        "rule_flags"
    ].apply(
        len
    )

    # =====================================================
    # COMPLIANCE ISSUE SUMMARY
    # =====================================================

    out[
        "compliance_issue"
    ] = out[
        "rule_flags"
    ].apply(
        lambda x:
        ", ".join(x)
        if len(x) > 0
        else "none"
    )

    # =====================================================
    # RULE-BASED RISK CLASSIFICATION
    # =====================================================

    out[
        "rule_based_risk"
    ] = out[
        "rule_flag_count"
    ].apply(
        lambda x:
        "low"
        if x == 0
        else (
            "medium"
            if x <= 2
            else "high"
        )
    )

    # =====================================================
    # REVIEW PRIORITY
    # =====================================================

    out[
        "review_priority"
    ] = out[
        "rule_flag_count"
    ].rank(
        ascending=False,
        method="dense",
    )

    # =====================================================
    # OPERATOR RECOMMENDATION
    # =====================================================

    def recommendation(
        risk: str,
    ) -> str:

        if risk == "high":

            return (
                "Immediate compliance investigation"
            )

        if risk == "medium":

            return (
                "Manual compliance review"
            )

        return "Monitor"

    out[
        "recommended_action"
    ] = out[
        "rule_based_risk"
    ].apply(
        recommendation
    )

    return out