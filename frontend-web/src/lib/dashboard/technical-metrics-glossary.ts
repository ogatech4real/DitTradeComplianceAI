export interface GlossaryEntry {
  id: string;
  /** Short menu label */
  label: string;
  /** Operational definition for analysts */
  body: string;
}

export const TECHNICAL_METRICS_GLOSSARY: GlossaryEntry[] = [
  {
    id: "icc_normalisation",
    label: "ICC-normalised payload",
    body:
      "When source files carry ICC Trade Toolkit nesting, orchestration may retain a nested ICC object on a row before flattening it into canonical ML columns. Rows without an icc field were already flattened; mapping and quality scores still reflect that ingest path.",
  },
  {
    id: "mapping_confidence",
    label: "Mapping confidence",
    body:
      "Mean certainty that headings and values lined up with the platform’s canonical screening schema. Low scores suggest re-upload with clearer columns or stewardship review—not a waiver of supervisory duty.",
  },
  {
    id: "icc_transformation_coverage",
    label: "ICC / trade alignment coverage",
    body:
      "Share of ingest fields successfully carried through ICC-oriented enrichment paths (where configured). Tracks interoperability depth, distinct from downstream model accuracy.",
  },
  {
    id: "data_quality_score",
    label: "Data quality score",
    body:
      "Aggregate signal from completeness, invalid-value rates, and structural consistency after parsing. Poor scores caveat screening outcomes until data is enriched or corrected.",
  },
  {
    id: "completeness_score",
    label: "Completeness (schema)",
    body:
      "How fully required declaration attributes are populated post-canonicalisation, before disposition logic runs.",
  },
  {
    id: "schema_consistency_score",
    label: "Structural consistency",
    body:
      "Internal coherence of dtypes, ranges, and cross-field sanity checks on the hydrated frame—not a customs classification judgement.",
  },
  {
    id: "hybrid_score",
    label: "Hybrid score",
    body:
      "Governance-weighted composite of supervised probability, anomaly, rules burden, fraud, and cohort batch pressure. Bounded 0–1; higher denotes more aggregate screening concern, not legal liability by itself.",
  },
  {
    id: "hybrid_risk_label",
    label: "Hybrid risk band",
    body:
      "Discrete band derived from thresholds on hybrid score (`low`/`medium`/`high`/`critical`). Used for colour coding and routing alongside severity rules—not a lone regulatory verdict.",
  },
  {
    id: "severity_level",
    label: "Severity level",
    body:
      "Operator-facing escalation tier blending hybrid output, triggered rules, emission/traceability cues, and policy hooks. Determines default review posture and suggested actions.",
  },
  {
    id: "fraud_score",
    label: "Fraud composite",
    body:
      "Normalised amalgam of behavioural fraud-pattern indicators at row level—distinct from tariff misclassification.",
  },
  {
    id: "batch_risk_score",
    label: "Batch / cohort pressure",
    body:
      "Signals duplicate shipments, corridor concentration, and clustering anomalies at batch scope; feeds hybrid with default low weight.",
  },
  {
    id: "rule_flag_count",
    label: "Rule flag count",
    body:
      "Count of deterministic rule predicates fired for the declaration. Larger counts raise rule-derived scores independent of supervised models.",
  },
  {
    id: "compliance_risks_buckets",
    label: "Compliance risk buckets",
    body:
      "Thematic prevalence counts surfaced by orchestration (e.g., traceability gaps, carbon disclosure inconsistencies). Interpret as cohort-level themes, then validate in case sheets.",
  },
];
