from __future__ import annotations

"""
Central application constants.

Purpose:
- eliminate hardcoded values
- standardise risk labels
- standardise thresholds
- simplify future tuning
"""

# --------------------------------------------------
# Application Metadata
# --------------------------------------------------

APP_NAME = "DigComplianceAI"

APP_VERSION = "2.0.0"

# --------------------------------------------------
# Default Directories
# --------------------------------------------------

DEFAULT_UPLOAD_DIR_NAME = "uploads"

DEFAULT_EXPORT_DIR_NAME = "exports"

DEFAULT_MODEL_DIR_NAME = "models"

# --------------------------------------------------
# Risk Thresholds
# --------------------------------------------------

LOW_RISK_THRESHOLD = 0.33

HIGH_RISK_THRESHOLD = 0.66

DEFAULT_HYBRID_THRESHOLD = 0.40

# --------------------------------------------------
# Risk Labels
# --------------------------------------------------

LOW_RISK_LABEL = "low"

MEDIUM_RISK_LABEL = "medium"

HIGH_RISK_LABEL = "high"

# --------------------------------------------------
# Hybrid Weights
# --------------------------------------------------

DEFAULT_HYBRID_WEIGHTS = {
    "rf": 0.30,
    "anomaly": 0.30,
    "rules": 0.20,
    "interaction": 0.20,
}

# --------------------------------------------------
# Upload Constraints
# --------------------------------------------------

MAX_UPLOAD_SIZE_MB = 50

ALLOWED_FILE_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".xls",
}

# --------------------------------------------------
# Export Formats
# --------------------------------------------------

SUPPORTED_EXPORT_FORMATS = {
    ".csv",
    ".xlsx",
}

# --------------------------------------------------
# UI Constants
# --------------------------------------------------

DEFAULT_PREVIEW_ROWS = 5

DEFAULT_TOP_RISK_ROWS = 10

# --------------------------------------------------
# Task Queue
# --------------------------------------------------

DEFAULT_MAX_WORKERS = 2

# --------------------------------------------------
# Model Metadata Keys
# --------------------------------------------------

METADATA_HYBRID_WEIGHTS_KEY = "hybrid_weights"

METADATA_HYBRID_THRESHOLD_KEY = "hybrid_threshold"