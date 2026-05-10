# backend/api/v1_app.py
#
# Mounted at /api/v1 — thin alias layer for contract-stable URLs.
# Handlers are the same APIRouter instances as legacy routes on the root app.

from __future__ import annotations

from fastapi import FastAPI

from backend.api.routes.health import (
    router as health_router,
)
from backend.api.routes.results import (
    router as results_router,
)
from backend.api.routes.scoring import (
    router as scoring_router,
)
from backend.api.routes.upload import (
    router as upload_router,
)


def create_v1_app() -> FastAPI:
    """
    Contract surface for React/Next.js — no duplicate orchestration logic.
    Paths here are relative to the mount (/api/v1).
    """

    sub = FastAPI(
        title="Digital Trade Compliance AI — API v1",
        version="2.0.0",
        description=(
            "Stable prefixed API for production frontends; "
            "same handlers as legacy paths on the root app."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    sub.include_router(
        health_router,
        prefix="/health",
        tags=["Health"],
    )

    sub.include_router(
        upload_router,
        prefix="/datasets/upload",
        tags=["Upload"],
    )

    sub.include_router(
        scoring_router,
        prefix="/screening",
        tags=["Screening"],
    )

    sub.include_router(
        results_router,
        prefix="/results",
        tags=["Results"],
    )

    return sub


v1_app = create_v1_app()
