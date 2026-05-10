# backend/api/routes/upload.py

from __future__ import annotations

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)

from backend.ingestion.upload_service import (
    UploadService,
)

router = APIRouter()

upload_service = UploadService()


@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
):

    try:

        ingest = upload_service.ingest_upload(file)
        dataframe = ingest["dataframe"]

        return {
            "status": "success",
            "filename": file.filename or "",
            "rows": len(dataframe),
            "columns": [str(column) for column in dataframe.columns.tolist()],
            "preview": dataframe.head(5).fillna("").to_dict(orient="records"),
        }

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )