from __future__ import annotations
from typing import Dict, Any, List, Optional


class PolicyRegistry:
    """
    Centralised rule registry for trade compliance.

    Responsibilities:
    - Store enterprise policies
    - Provide rule metadata and thresholds
    - Support dynamic policy updates
    - Interface with workflow engine and rule engine
    """

    def __init__(self) -> None:
        self.policies: Dict[str, Dict[str, Any]] = {}

    def add_policy(
        self,
        rule_name: str,
        description: str,
        severity: str = "medium",
        threshold: Optional[Any] = None,
        category: str = "general",
    ) -> None:
        """Register a new policy."""
        self.policies[rule_name] = {
            "description": description,
            "severity": severity,
            "threshold": threshold,
            "category": category,
        }

    def get_policy(self, rule_name: str) -> Optional[Dict[str, Any]]:
        """Retrieve policy by rule name."""
        return self.policies.get(rule_name)

    def list_policies(
        self, severity_filter: Optional[List[str]] = None
    ) -> Dict[str, Dict[str, Any]]:
        """Return all policies, optionally filtered by severity."""
        if severity_filter is None:
            return self.policies
        return {
            k: v
            for k, v in self.policies.items()
            if v.get("severity") in severity_filter
        }

    def remove_policy(self, rule_name: str) -> bool:
        """Remove a policy by name, return True if deleted."""
        if rule_name in self.policies:
            del self.policies[rule_name]
            return True
        return False

    def update_policy(
        self,
        rule_name: str,
        description: Optional[str] = None,
        severity: Optional[str] = None,
        threshold: Optional[Any] = None,
        category: Optional[str] = None,
    ) -> bool:
        """Update policy attributes if exists."""
        if rule_name not in self.policies:
            return False
        policy = self.policies[rule_name]
        if description is not None:
            policy["description"] = description
        if severity is not None:
            policy["severity"] = severity
        if threshold is not None:
            policy["threshold"] = threshold
        if category is not None:
            policy["category"] = category
        return True