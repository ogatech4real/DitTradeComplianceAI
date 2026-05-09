# frontend/components/upload_widget.py

from __future__ import annotations

from typing import Optional

import streamlit as st


def render_upload_widget():
    """
    Render dataset upload widget.

    Returns
    -------
    UploadedFile | None
        Uploaded CSV file object.
    """

    st.markdown("### Upload Trade Compliance Dataset")

    st.markdown(
        """
Upload a structured CSV dataset containing digital trade
compliance records for screening and risk analysis.
"""
    )

    uploaded_file = st.file_uploader(
        label="Select CSV File",
        type=["csv"],
        accept_multiple_files=False,
        help=(
            "Upload a CSV file containing trade records "
            "with carbon, origin, and traceability attributes."
        ),
    )

    if uploaded_file is not None:

        st.success(
            f"Loaded file: {uploaded_file.name}"
        )

        st.caption(
            f"File size: {round(uploaded_file.size / 1024, 2)} KB"
        )

    else:

        st.info(
            "Awaiting dataset upload."
        )

    return uploaded_file