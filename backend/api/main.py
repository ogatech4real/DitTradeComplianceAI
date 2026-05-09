# backend/api/main.py

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.health import (
    router as health_router,
)

from backend.api.routes.upload import (
    router as upload_router,
)

from backend.api.routes.scoring import (
    router as scoring_router,
)

from backend.api.routes.results import (
    router as results_router,
)

app = FastAPI(
    title="Digital Trade Compliance AI",
    version="2.0.0",
    description=(
        "Hybrid AI framework for digital trade "
        "compliance pre-screening."
    ),
)

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# ROUTES
# =========================================================

app.include_router(
    health_router,
    prefix="/health",
    tags=["Health"],
)

app.include_router(
    upload_router,
    prefix="/upload",
    tags=["Upload"],
)

app.include_router(
    scoring_router,
    prefix="/scoring",
    tags=["Scoring"],
)

app.include_router(
    results_router,
    prefix="/results",
    tags=["Results"],
)

# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def root():

    return {
        "message": (
            "Digital Trade Compliance AI API"
        ),
        "status": "running",
        "version": "2.0.0",
        "architecture": (
            "orchestration-driven"
        ),
    }