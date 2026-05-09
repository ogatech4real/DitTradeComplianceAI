from __future__ import annotations

from fastapi import APIRouter


router = APIRouter()


@router.get("/")
def health_check():

    return {
        "status": "ok",
        "service": (
            "Digital Trade Compliance AI"
        ),
    }