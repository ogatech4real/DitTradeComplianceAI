# backend/services/export_service.py

from __future__ import annotations

import io
import json
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd


class ExportService:
    """
    Export and serialisation service.

    Responsibilities:
    - CSV export
    - JSON export
    - Excel export
    - API-safe serialisation
    """

    def __init__(
        self,
        export_dir: Optional[str | Path] = None,
    ) -> None:

        if export_dir is not None:

            self.export_dir = Path(export_dir)

            self.export_dir.mkdir(
                parents=True,
                exist_ok=True,
            )

        else:

            self.export_dir = None

    # =========================================================
    # DATAFRAME CLEANING
    # =========================================================

    @staticmethod
    def sanitise_dataframe(
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:
        """
        Ensure dataframe is export-safe.
        """

        df = dataframe.copy()

        df.replace(
            [np.inf, -np.inf],
            0,
            inplace=True,
        )

        df.fillna(
            "",
            inplace=True,
        )

        return df

    # =========================================================
    # CSV BYTES EXPORT
    # =========================================================

    def export_dataframe_to_csv_bytes(
        self,
        dataframe: pd.DataFrame,
    ) -> bytes:
        """
        Export dataframe as CSV bytes.
        """

        df = self.sanitise_dataframe(
            dataframe
        )

        csv_buffer = io.StringIO()

        df.to_csv(
            csv_buffer,
            index=False,
        )

        return csv_buffer.getvalue().encode(
            "utf-8"
        )

    # =========================================================
    # JSON BYTES EXPORT
    # =========================================================

    def export_dataframe_to_json_bytes(
        self,
        dataframe: pd.DataFrame,
    ) -> bytes:
        """
        Export dataframe as JSON bytes.
        """

        df = self.sanitise_dataframe(
            dataframe
        )

        records = df.to_dict(
            orient="records"
        )

        json_string = json.dumps(
            records,
            indent=2,
            default=str,
            allow_nan=False,
        )

        return json_string.encode(
            "utf-8"
        )

    # =========================================================
    # CSV FILE EXPORT
    # =========================================================

    def export_to_csv_file(
        self,
        dataframe: pd.DataFrame,
        output_path: str | Path,
    ) -> Path:
        """
        Export dataframe to CSV file.
        """

        df = self.sanitise_dataframe(
            dataframe
        )

        output_path = Path(output_path)

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        df.to_csv(
            output_path,
            index=False,
        )

        return output_path

    # =========================================================
    # JSON FILE EXPORT
    # =========================================================

    def export_to_json_file(
        self,
        dataframe: pd.DataFrame,
        output_path: str | Path,
    ) -> Path:
        """
        Export dataframe to JSON file.
        """

        df = self.sanitise_dataframe(
            dataframe
        )

        output_path = Path(output_path)

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        records = df.to_dict(
            orient="records"
        )

        with open(
            output_path,
            "w",
            encoding="utf-8",
        ) as f:

            json.dump(
                records,
                f,
                indent=2,
                default=str,
                allow_nan=False,
            )

        return output_path

    # =========================================================
    # EXCEL EXPORT
    # =========================================================

    def export_to_excel_file(
        self,
        dataframe: pd.DataFrame,
        output_path: str | Path,
    ) -> Path:
        """
        Export dataframe to Excel file.
        """

        df = self.sanitise_dataframe(
            dataframe
        )

        output_path = Path(output_path)

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        df.to_excel(
            output_path,
            index=False,
        )

        return output_path