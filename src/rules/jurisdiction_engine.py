from __future__ import annotations
from typing import Dict, Optional, List


class JurisdictionEngine:
    """
    Evaluates trade compliance rules against jurisdiction-specific regulations.

    Responsibilities:
    - Map rules to countries or trade zones
    - Apply local thresholds
    - Support dynamic jurisdiction updates
    """

    def __init__(self) -> None:
        self.jurisdictions: Dict[str, Dict[str, Dict[str, any]]] = {}

    def add_jurisdiction(
        self,
        country_code: str,
        rule_name: str,
        min_threshold: Optional[float] = None,
        max_threshold: Optional[float] = None,
        enforcement: str = "standard",
    ) -> None:
        """Register a jurisdiction-specific rule."""
        if country_code not in self.jurisdictions:
            self.jurisdictions[country_code] = {}
        self.jurisdictions[country_code][rule_name] = {
            "min_threshold": min_threshold,
            "max_threshold": max_threshold,
            "enforcement": enforcement,
        }

    def get_rule_for_jurisdiction(
        self, country_code: str, rule_name: str
    ) -> Optional[Dict[str, any]]:
        """Retrieve a jurisdiction-specific rule configuration."""
        return self.jurisdictions.get(country_code, {}).get(rule_name)

    def list_jurisdiction_rules(
        self, country_code: str
    ) -> Dict[str, Dict[str, any]]:
        """List all rules applicable for a given jurisdiction."""
        return self.jurisdictions.get(country_code, {})

    def validate_value(
        self, country_code: str, rule_name: str, value: float
    ) -> bool:
        """Validate a value against jurisdiction thresholds."""
        rule = self.get_rule_for_jurisdiction(country_code, rule_name)
        if rule is None:
            return True  # No specific jurisdiction rule; treat as valid
        min_th = rule.get("min_threshold")
        max_th = rule.get("max_threshold")
        if min_th is not None and value < min_th:
            return False
        if max_th is not None and value > max_th:
            return False
        return True