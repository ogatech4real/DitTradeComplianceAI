from __future__ import annotations

from pathlib import Path

from backend.config.constants import (
    DEFAULT_UPLOAD_DIR_NAME,
    DEFAULT_EXPORT_DIR_NAME,
    DEFAULT_MODEL_DIR_NAME,
)


class Settings:
    """
    Central application settings.

    Responsibilities:
    - Path management
    - Environment-independent configuration
    - Shared application directories
    """

    ROOT_DIR = Path(__file__).resolve().parents[2]

    BACKEND_DIR = ROOT_DIR / "backend"

    DATA_DIR = ROOT_DIR / "data"

    MODEL_DIR = ROOT_DIR / DEFAULT_MODEL_DIR_NAME

    EXPORT_DIR = ROOT_DIR / DEFAULT_EXPORT_DIR_NAME

    UPLOAD_DIR = ROOT_DIR / DEFAULT_UPLOAD_DIR_NAME

    LOG_DIR = ROOT_DIR / "logs"

    REPORT_DIR = ROOT_DIR / "reports"

    FIGURE_DIR = ROOT_DIR / "figures"

    @classmethod
    def initialise_directories(cls) -> None:

        required_dirs = [
            cls.UPLOAD_DIR,
            cls.EXPORT_DIR,
            cls.LOG_DIR,
            cls.REPORT_DIR,
            cls.FIGURE_DIR,
        ]

        for directory in required_dirs:
            directory.mkdir(
                parents=True,
                exist_ok=True,
            )

    @classmethod
    def as_dict(cls):

        return {
            "ROOT_DIR": cls.ROOT_DIR,
            "BACKEND_DIR": cls.BACKEND_DIR,
            "DATA_DIR": cls.DATA_DIR,
            "MODEL_DIR": cls.MODEL_DIR,
            "EXPORT_DIR": cls.EXPORT_DIR,
            "UPLOAD_DIR": cls.UPLOAD_DIR,
            "LOG_DIR": cls.LOG_DIR,
            "REPORT_DIR": cls.REPORT_DIR,
            "FIGURE_DIR": cls.FIGURE_DIR,
        }


Settings.initialise_directories()