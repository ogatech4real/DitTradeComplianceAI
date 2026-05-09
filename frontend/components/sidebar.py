# frontend/components/sidebar.py

from __future__ import annotations

import streamlit as st


def render_sidebar() -> str:
    """
    Render the main application sidebar navigation.

    Returns
    -------
    str
        Selected navigation page.
    """

    st.sidebar.title("Navigation")

    selected_page = st.sidebar.radio(
        label="Go to",
        options=[
            "Home",
            "Upload & Screening",
            "Results Dashboard",
            "Export Results",
            "System Status",
        ],
        index=0,
    )

    st.sidebar.divider()

    st.sidebar.markdown("### Platform")

    st.sidebar.info(
        """
Hybrid AI-powered compliance screening platform
for digital trade records.
"""
    )

    st.sidebar.markdown("### Capabilities")

    st.sidebar.markdown(
        """
- Rule-based validation
- ML anomaly detection
- Hybrid risk scoring
- Compliance triage
- Explainable outputs
"""
    )

    st.sidebar.divider()

    st.sidebar.caption(
        "Digital Trade Compliance AI v2.0"
    )

    return selected_page