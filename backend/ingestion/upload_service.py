from __future__ import annotations

import shutil
import uuid

from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

import pandas as pd

from src.data.io import load_tabular_file


class UploadService:
    """
    Centralised upload management service.

    Responsibilities:
    - File validation
    - File persistence
    - Upload metadata generation
    - Dataset preview generation
    - Unified ingestion interface

    Compatible with:
    - Streamlit UploadedFile
    - FastAPI UploadFile
    """

    ALLOWED_EXTENSIONS = {
        ".csv",
        ".xlsx",
        ".xls",
    }

    MAX_FILE_SIZE_MB = 50

    def __init__(
        self,
        upload_dir: Optional[str | Path] = None,
    ) -> None:

        if upload_dir is None:

            root_dir = (
                Path(__file__)
                .resolve()
                .parents[2]
            )

            upload_dir = (
                root_dir
                / "storage"
                / "uploads"
            )

        self.upload_dir = Path(upload_dir)

        self.upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    # =========================================================
    # VALIDATION
    # =========================================================

    @staticmethod
    def validate_extension(
        file_name: str,
    ) -> None:

        suffix = (
            Path(file_name)
            .suffix
            .lower()
        )

        if suffix not in UploadService.ALLOWED_EXTENSIONS:

            raise ValueError(
                f"Unsupported file format: {suffix}. "
                f"Allowed formats: "
                f"{', '.join(UploadService.ALLOWED_EXTENSIONS)}"
            )

    @staticmethod
    def validate_file_size(
        file_size_bytes: int,
    ) -> None:

        max_bytes = (
            UploadService.MAX_FILE_SIZE_MB
            * 1024
            * 1024
        )

        if file_size_bytes > max_bytes:

            raise ValueError(
                f"File exceeds maximum allowed size "
                f"of {UploadService.MAX_FILE_SIZE_MB} MB."
            )

    # =========================================================
    # METADATA HELPERS
    # =========================================================

    @staticmethod
    def generate_upload_id() -> str:

        return str(uuid.uuid4())

    @staticmethod
    def generate_timestamp() -> str:

        return datetime.utcnow().strftime(
            "%Y%m%d_%H%M%S"
        )

    def generate_storage_name(
        self,
        original_name: str,
        upload_id: str,
    ) -> str:

        suffix = Path(
            original_name
        ).suffix

        timestamp = (
            self.generate_timestamp()
        )

        return (
            f"{timestamp}_"
            f"{upload_id}"
            f"{suffix}"
        )

    # =========================================================
    # FILE SAVE
    # =========================================================

    def save_uploaded_file(
        self,
        uploaded_file,
    ) -> Dict[str, Any]:
        """
        Save uploaded file to storage.

        Supports:
        - Streamlit UploadedFile
        - FastAPI UploadFile
        """

        original_name = getattr(
            uploaded_file,
            "name",
            None,
        )

        if original_name is None:

            original_name = getattr(
                uploaded_file,
                "filename",
                None,
            )

        if original_name is None:

            raise ValueError(
                "Unable to determine uploaded filename."
            )

        self.validate_extension(
            original_name
        )

        # =====================================================
        # READ CONTENTS
        # =====================================================

        uploaded_file.file.seek(0)

        contents = (
            uploaded_file.file.read()
        )

        file_size = len(contents)

        self.validate_file_size(
            file_size
        )

        upload_id = (
            self.generate_upload_id()
        )

        storage_name = (
            self.generate_storage_name(
                original_name,
                upload_id,
            )
        )

        saved_path = (
            self.upload_dir
            / storage_name
        )

        with open(
            saved_path,
            "wb",
        ) as out_file:

            out_file.write(contents)

        metadata = {
            "upload_id": upload_id,
            "original_name": original_name,
            "stored_name": storage_name,
            "saved_path": str(saved_path),
            "file_size_bytes": file_size,
            "uploaded_at": (
                datetime.utcnow()
                .isoformat()
            ),
        }

        return metadata

    # =========================================================
    # DATAFRAME LOADING
    # =========================================================

    def load_dataframe(
        self,
        file_path: str | Path,
    ) -> pd.DataFrame:

        file_path = Path(file_path)

        if not file_path.exists():

            raise FileNotFoundError(
                f"Uploaded file not found: {file_path}"
            )

        return load_tabular_file(
            file_path
        )

    # =========================================================
    # DATA PREVIEW
    # =========================================================

    @staticmethod
    def generate_preview(
        df: pd.DataFrame,
        rows: int = 5,
    ) -> Dict[str, Any]:

        preview = {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "sample_records": (
                df.head(rows)
                .fillna("")
                .to_dict(
                    orient="records"
                )
            ),
        }

        return preview

    # =========================================================
    # FULL INGESTION
    # =========================================================

    def ingest_upload(
        self,
        uploaded_file,
        generate_preview: bool = True,
    ) -> Dict[str, Any]:

        metadata = (
            self.save_uploaded_file(
                uploaded_file
            )
        )

        df = self.load_dataframe(
            metadata["saved_path"]
        )

        result = {
            "metadata": metadata,
            "dataframe": df,
        }

        if generate_preview:

            result["preview"] = (
                self.generate_preview(df)
            )

        return result

    # =========================================================
    # DELETE FILE
    # =========================================================

    def delete_upload(
        self,
        file_path: str | Path,
    ) -> bool:

        file_path = Path(file_path)

        if file_path.exists():

            file_path.unlink()

            return True

        return False


# =============================================================
# LOCAL TEST
# =============================================================

if __name__ == "__main__":

    upload_service = UploadService()

    print(
        "\nUploadService initialised successfully."
    )

    print(
        f"Upload directory: "
        f"{upload_service.upload_dir}"
    )