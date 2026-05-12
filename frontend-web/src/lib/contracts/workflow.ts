/**
 * Frontend workflow taxonomy — mirrors screening lifecycle semantics in `frontend_api_contract.md`.
 * Durable workflow identifiers may arrive from the API later; this drives UI clarity today.
 */

export const WORKFLOW_PHASES = [
  "idle",
  "upload_dataset",
  "schema_intelligence",
  "icc_transformation",
  "data_quality_validation",
  "fraud_analysis",
  "batch_analysis",
  "hybrid_scoring",
  "risk_classification",
  "review_queue",
  "explainability",
  "export_audit",
] as const;

export type WorkflowPhaseId = (typeof WORKFLOW_PHASES)[number];

export interface WorkflowPhaseMeta {
  id: WorkflowPhaseId;
  label: string;
  /** Short context for hover / screen readers — keep minimal */
  description: string;
}

export const WORKFLOW_PHASE_METADATA: WorkflowPhaseMeta[] = [
  { id: "idle", label: "Ready", description: "Awaiting import or reset." },
  { id: "upload_dataset", label: "Secure intake", description: "File accepted and bound to session." },
  { id: "schema_intelligence", label: "Field alignment", description: "Column mapping vs schema expectations." },
  { id: "icc_transformation", label: "Trade alignment", description: "ICC-canonical enrichment." },
  { id: "data_quality_validation", label: "Data fitness", description: "Types, completeness, contradictions." },
  { id: "fraud_analysis", label: "Fraud intelligence", description: "Per-record fraud overlays." },
  { id: "batch_analysis", label: "Batch analytics", description: "Cohort anomalies and concentration." },
  { id: "hybrid_scoring", label: "Calibrated scoring", description: "Models and rules converge." },
  { id: "risk_classification", label: "Severity disposition", description: "Tiers and routing cues." },
  { id: "review_queue", label: "Review preparation", description: "Queue hydrated for operators." },
  { id: "explainability", label: "Narratives & rationale", description: "Consolidated explanations." },
  { id: "export_audit", label: "Release & audit", description: "Dashboards and escalation trace." },
];

export type WorkflowRunStatus =
  | "idle"
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "partial";

export interface WorkflowSessionSnapshot {
  /** Future server-issued orchestration identifier */
  workflowId: string | null;
  status: WorkflowRunStatus;
  /** Highest visible phase for timeline presentation */
  activePhaseId: WorkflowPhaseId;
  /** Client tick driving subtle motion */
  updatedAt: number;
}
