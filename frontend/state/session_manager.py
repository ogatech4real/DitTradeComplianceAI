# frontend/state/session_manager.py

from __future__ import annotations

from typing import Any, Dict, List

import streamlit as st


class SessionManager:
    """
    Centralised Streamlit session-state manager.

    Responsibilities:
    - Session initialisation
    - State persistence
    - Typed access helpers
    - Workflow cache management
    """

    DEFAULT_STATE = {
        "input_dataframe": None,
        "results_dataframe": None,
        "summary_metrics": {},
        "api_response": None,
        "screening_results": None,
    }

    # =========================================================
    # INITIALISATION
    # =========================================================

    @classmethod
    def initialize(cls) -> None:
        """
        Initialise default session state values.
        """

        for key, value in cls.DEFAULT_STATE.items():

            if key not in st.session_state:
                st.session_state[key] = value

    # =========================================================
    # SET VALUE
    # =========================================================

    @staticmethod
    def set(
        key: str,
        value: Any,
    ) -> None:
        """
        Store value in session state.
        """

        st.session_state[key] = value

    # =========================================================
    # GET VALUE
    # =========================================================

    @staticmethod
    def get(
        key: str,
        default: Any = None,
    ) -> Any:
        """
        Retrieve value from session state.
        """

        return st.session_state.get(
            key,
            default,
        )

    # =========================================================
    # DELETE VALUE
    # =========================================================

    @staticmethod
    def delete(
        key: str,
    ) -> None:
        """
        Remove key from session state.
        """

        if key in st.session_state:
            del st.session_state[key]

    # =========================================================
    # CLEAR ALL
    # =========================================================

    @classmethod
    def clear(cls) -> None:
        """
        Clear all managed session values.
        """

        for key in list(st.session_state.keys()):

            del st.session_state[key]

        cls.initialize()

    # =========================================================
    # SESSION KEYS
    # =========================================================

    @staticmethod
    def keys() -> List[str]:
        """
        Return all active session keys.
        """

        return list(st.session_state.keys())

    # =========================================================
    # SESSION SNAPSHOT
    # =========================================================

    @staticmethod
    def snapshot() -> Dict[str, Any]:
        """
        Return session-state snapshot.
        """

        return dict(st.session_state)