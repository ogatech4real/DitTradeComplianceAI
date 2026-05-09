# backend/api/routes/results.py

from __future__ import annotations

from typing import Any, Dict

from fastapi import (
    APIRouter,
    HTTPException,
)

from backend.orchestration.pipeline_manager import (
    PipelineManager,
)

router = APIRouter()


# =========================================================
# PIPELINE MANAGER
# =========================================================

pipeline_manager = PipelineManager()


# =========================================================
# IN-MEMORY RESULT STORE
# =========================================================

LATEST_RESULTS: Dict[str, Any] = {}


# =========================================================
# STORE RESULTS
# =========================================================

def store_latest_results(
    results: Dict[str, Any],
) -> None:
    """
    Store latest workflow results in memory.

    This is temporary storage for the
    current Streamlit/FastAPI phase.

    Future architecture:
    - Redis
    - PostgreSQL
    - Object storage
    """

    global LATEST_RESULTS

    LATEST_RESULTS = results


# =========================================================
# FETCH RESULTS
# =========================================================

def get_latest_results() -> Dict[str, Any] | None:
    """
    Retrieve latest workflow results.
    """

    return LATEST_RESULTS


# =========================================================
# RESULTS STATUS
# =========================================================

@router.get("/status")
def results_status():

    return {
        "status": "ok",
        "service": "results",
        "version": "2.0.0",
    }


# =========================================================
# RESULTS INFO
# =========================================================

@router.get("/info")
def results_info():

    return {
        "service": "results",
        "description": (
            "Compliance screening result "
            "management subsystem."
        ),
        "supported_exports": [
            "csv",
            "json",
            "xlsx",
        ],
    }


# =========================================================
# GET LATEST RESULTS
# =========================================================

@router.get("/latest")
def latest_results():

    try:

        latest_result = get_latest_results()

        if not latest_result:

            return {
                "status": "empty",
                "message": (
                    "No workflow results available."
                ),
            }

        summary = latest_result.get(
            "screening_summary",
            {},
        )

        records = latest_result.get(
            "records",
            [],
        )

        if hasattr(records, "fillna"):
            records = (
                records
                .fillna("")
                .to_dict(orient="records")
            )

        processing_metadata = latest_result.get(
            "processing_metadata",
            {},
        )

        return {
            "status": "success",
            "screening_summary": summary,
            "processing_metadata":
                processing_metadata,
            "records": records,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )