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

        upload_result = (
            upload_service.process_upload(
                file
            )
        )

        return {
            "status": "success",
            "filename": file.filename,
            "rows": upload_result["row_count"],
            "columns": upload_result["columns"],
            "preview": (
                upload_result["dataframe"]
                .head(5)
                .to_dict(orient="records")
            ),
        }

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )