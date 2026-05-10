from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import Dict, Any

import numpy as np
import pandas as pd

from fastapi import (
    APIRouter,
    HTTPException,
)

from backend.api.models.request_models import (
    ScoringRequest,
)

from backend.services.operator_report_service import (
    OperatorReportService,
)

from backend.services.result_service import (
    ResultService,
)

from backend.orchestration.pipeline_manager import (
    PipelineManager,
)

from backend.api.routes.results import (
    store_latest_results,
)

from backend.services.scoring_input_normalize import (
    normalize_scoring_request_dataframe,
)

router = APIRouter()

logger = logging.getLogger(__name__)

# =========================================================
# INITIALISE PIPELINE
# =========================================================

ROOT_DIR = Path(__file__).resolve().parents[3]

pipeline_manager = PipelineManager(
    model_dir=ROOT_DIR / "storage" / "models"
)

operator_report_service = (
    OperatorReportService()
)

# =========================================================
# SAFE JSON SERIALISATION
# =========================================================

def sanitise_dataframe(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Convert dataframe into JSON-safe format.
    """

    out = df.copy()

    # -----------------------------------------------------
    # Replace infinities
    # -----------------------------------------------------

    out.replace(
        [np.inf, -np.inf],
        0,
        inplace=True,
    )

    # -----------------------------------------------------
    # NUMERIC COLUMNS
    # -----------------------------------------------------

    numeric_cols = out.select_dtypes(
        include=[np.number]
    ).columns

    out[numeric_cols] = (
        out[numeric_cols]
        .apply(
            pd.to_numeric,
            errors="coerce",
        )
        .fillna(0)
    )

    # -----------------------------------------------------
    # OBJECT COLUMNS
    # -----------------------------------------------------

    object_cols = out.select_dtypes(
        include=["object"]
    ).columns

    out[object_cols] = (
        out[object_cols]
        .fillna("")
        .astype(str)
    )

    return out


# =========================================================
# SCORING ENDPOINT
# =========================================================

@router.post("/run")
async def run_scoring(
    request: ScoringRequest,
) -> Dict[str, Any]:

    try:

        # =================================================
        # INPUT DATAFRAME
        # =================================================

        input_df = normalize_scoring_request_dataframe(
            pd.DataFrame(
                request.records
            )
        )

        if input_df.empty:

            raise HTTPException(
                status_code=400,
                detail="Input dataset is empty.",
            )

        # =================================================
        # RUN PIPELINE
        # =================================================

        # Run synchronous pipeline in a thread pool so the ASGI worker
        # stays responsive (e.g. /health during long scores on Render).
        pipeline_results = await asyncio.to_thread(
            pipeline_manager.run_pipeline,
            input_df,
            False,
        )

        records = pipeline_results.get(
            "records",
            pd.DataFrame(),
        )

        if isinstance(records, list):
            scored_df = pd.DataFrame(records)
        else:
            scored_df = records

        upload_summary = pipeline_results.get(
            "upload_summary",
            {},
        )

        screening_summary = pipeline_results.get(
            "screening_summary",
            {},
        )

        system_insights = pipeline_results.get(
            "system_insights",
            {},
        )

        processing_metadata = pipeline_results.get(
            "processing_metadata",
            {},
        )

        fraud_analysis = pipeline_results.get(
            "fraud_analysis",
            {},
        )

        batch_analysis = pipeline_results.get(
            "batch_analysis",
            {},
        )

        priority_review_queue = pipeline_results.get(
            "priority_review_queue",
            [],
        )

        # =================================================
        # SANITISE OUTPUT
        # =================================================

        scored_df = sanitise_dataframe(
            scored_df
        )

        if isinstance(
                priority_review_queue,
                pd.DataFrame,
        ):
            priority_review_queue = (
                sanitise_dataframe(
                    priority_review_queue
                )
                .to_dict(orient="records")
            )

        # =================================================
        # RESULT SERVICE PAYLOAD
        # =================================================

        api_payload = (
            ResultService
            .build_api_response(
                scored_df=scored_df,
                processing_metadata=processing_metadata,
            )
        )

        # =================================================
        # OPERATOR REPORT
        # =================================================

        operator_report = (
            operator_report_service
            .generate_report(
                scored_df=scored_df,
                upload_summary=upload_summary,
                screening_summary=screening_summary,
                system_insights=system_insights,
                processing_metadata=processing_metadata,
            )
        )

        # =================================================
        # RESPONSE
        # =================================================

        response_body = {
            "status": "success",

            "upload_summary":
                operator_report[
                    "upload_summary"
                ],

            "screening_summary":
                operator_report[
                    "screening_summary"
                ],

            "processing_metadata":
                operator_report[
                    "processing_metadata"
                ],

            "system_insights":
                operator_report[
                    "system_insights"
                ],

            "severity_breakdown":
                operator_report[
                    "severity_breakdown"
                ],

            "compliance_risks":
                operator_report[
                    "compliance_risks"
                ],

            "operational_metrics":
                operator_report[
                    "operational_metrics"
                ],

            "priority_review_queue":
                priority_review_queue,

            "executive_summary":
                operator_report[
                    "executive_summary"
                ],

            "fraud_analysis":
                fraud_analysis,

            "batch_analysis":
                batch_analysis,

            "records":
                api_payload[
                    "records"
                ],
        }

        store_latest_results(
            response_body,
        )

        return response_body

    except HTTPException:

        raise

    except Exception as exc:

        logger.exception(
            "Scoring route failure"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Scoring failed: {exc}"
            ),
        )