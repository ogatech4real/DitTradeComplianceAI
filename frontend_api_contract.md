# Digital Trade Compliance AI Platform — Frontend API Contract

**Version:** 1.0 (contractual)  
**Backend reference:** FastAPI app `backend.api.main` — version `2.0.0`  
**Effective date:** 2026-05-10  

This document is the **integration contract** between the production React/Next.js frontend and the **orchestration-preserving** FastAPI backend. It describes the **intended** `/api/v1/` surface, maps it to **currently mounted** routes, and specifies **payload semantics** aligned with `PipelineManager`, `WorkflowEngine`, and operator reporting services — without redesigning orchestration.

---

## Document control

| Item | Policy |
|------|--------|
| Canonical API prefix | `/api/v1/` (contractual; see §3 for legacy mapping) |
| Serialization | JSON for request/response bodies unless noted (multipart for file upload) |
| OpenAPI | Contract is the source for a future aligned OpenAPI 3.x export |
| Breaking changes | Prefer additive fields; deprecate with `Sunset`/`Warning` headers when HTTP surface is versioned |

---

# 1. Platform overview

## 1.1 Purpose

The Digital Trade Compliance AI Platform is an **AI-driven trade compliance intelligence system**. It ingests trade declaration datasets, aligns them to a **canonical ICC-oriented schema**, applies **rules and ML** in a **hybrid scoring** model, enriches outcomes with **fraud** and **batch** intelligence, and produces **operator-ready** summaries, **priority review queues**, and **row-level explanations** suitable for operational review and audit.

## 1.2 Operational compliance intelligence role

The platform supports **pre-clearance screening**, **operational triage**, and **evidence-oriented** review — not a single scalar “anomaly score.” Frontends should present **multi-signal** risk (rules, supervised model, isolation forest, fraud, batch context) and **governance metadata** (mapping confidence, data quality, model version).

## 1.3 Orchestration philosophy

- **PipelineManager** owns the **end-to-end pipeline**: ingestion/canonicalisation, rule validation prep, feature alignment, delegation to **WorkflowEngine** for scoring, aggregation of intelligence quality metrics, priority queue construction, and processing metadata.
- **WorkflowEngine** owns **ML inference**, **hybrid composition**, fraud/batch augmentation, and **operator fields** (severity, review routing, explanations).
- HTTP handlers remain **thin**: validate input, invoke orchestration **off the event loop** for long synchronous runs (today: `asyncio.to_thread` around `PipelineManager.run_pipeline`), return sanitised payloads.

## 1.4 Explainability orientation

Explainability is **operationally grounded**: each scored record exposes a deterministic **`explanation`** string assembled from observable signals (`rule_flag_count`, emissions, traceability, etc.). Enriched drill-down structures (contributor decomposition, triggered rules[]) are specified for **frontend rendering** and a **planned** explanations endpoint — without replacing the orchestration-layer source of truth.

## 1.5 ICC alignment direction

ICC-aligned nesting (`icc` object) is flattened into canonical ML columns via **`enrich_from_icc`**; schema intelligence exposes **mapping confidence**, matched vs required screening fields, and **data_quality_score** derivatives in **`processing_metadata.intelligence_quality`** and related fields. Frontend should treat ICC as **first-class structured input** where present, while continuing to honour flat canonical columns.

---

# 2. Architecture overview

```
Frontend (React/Next.js)
        ↓  HTTPS JSON (+ multipart uploads)
FastAPI API Layer
        ↓  thin controllers; sanitisation
PipelineManager
        ↓  canonicalisation, DQ/schema metrics, rules prep, feature alignment
WorkflowEngine
        ↓  ML + rules composition, fraud/batch engines, operator fields
Intelligence + Governance Modules
        (rule engine, fraud patterns, batch analysis, operational rules)
```

## 2.1 Component responsibilities (concise)

| Layer | Responsibility |
|-------|----------------|
| **Schema intelligence** | Inferred mapping vs `REQUIRED_SCREENING_FIELDS`, mean `mapping_confidence`, completeness/invalid value rates, aggregate `data_quality_score` — surfaced on `processing_metadata`. |
| **ICC transformation** | `canonicalise_dataframe` + `enrich_from_icc` — non-breaking path from nested ICC to flat features. |
| **Rule governance** | `run_rule_engine` produces rule-driven fields (e.g. `rule_flag_count`) feeding **rule_score** and severity logic. |
| **Hybrid scoring** | Weighted combination of `rf_probability`, `if_score`, `rule_score`, interaction term, `fraud_score`, `batch_risk_score` — weights from model `metadata.hybrid_weights` with documented defaults. |
| **Fraud intelligence** | `FraudPatternDetector` adds flags + `fraud_score` / `fraud_risk_label` at row level; aggregate summaries are contract-defined for API packaging. |
| **Batch intelligence** | `BatchAnalysisEngine` adds duplicate/concentration/cluster flags and `batch_risk_score`. |
| **Explainability** | `build_operator_explanation` per row; optional expanded explanation object for UI and audit. |

---

# 3. API base structure

## 3.1 Canonical prefix

All **new** frontend integrations **MUST** target:

```text
/api/v1/
```

## 3.2 Legacy route mapping (backward compatibility)

**v1 surface:** A **mounted** FastAPI sub-application at `/api/v1` (`backend/api/v1_app.py`) reuses the **same** route modules as legacy — only URL prefixes differ (**thin aliases**; no second orchestration stack). **React/Next.js SHOULD call the mounted v1 URLs.**

- **v1 OpenAPI:** `GET /api/v1/openapi.json` — use for codegen aligned to the frontend contract  
- **v1 interactive docs:** `GET /api/v1/docs`, `GET /api/v1/redoc`  

**Legacy:** Paths on the root app are unchanged for existing clients (e.g. Streamlit).

| Contract path (under mount) | Full URL | Equivalent legacy path |
|-------------|----------|-------------------------|
| `GET /health/` | `GET /api/v1/health/` | `GET /health/` |
| `POST /screening/run` | `POST /api/v1/screening/run` | `POST /scoring/run` |
| `POST /datasets/upload/` | `POST /api/v1/datasets/upload/` | `POST /upload/` |
| `GET /results/latest` | `GET /api/v1/results/latest` | `GET /results/latest` |
| `GET /results/status` | `GET /api/v1/results/status` | `GET /results/status` |
| `GET /results/info` | `GET /api/v1/results/info` | `GET /results/info` |

## 3.3 Request conventions

- **Content-Type:** `application/json` for JSON bodies.
- **Charset:** UTF-8.
- **Identifiers:** Stable **`record_id`** per row where present in source/canonicalisation; used for explanations and review correlation.
- **Filenames:** Original filename preserved on upload responses for operator audit.

## 3.4 Response envelope

Responses use a **dual pattern** inherited from current handlers:

1. **Success:** top-level `"status": "success"` plus domain payload (screening endpoints).
2. **Empty resource:** `"status": "empty"` plus human-readable `message` (e.g. no stored results).

Future standardisation MAY introduce a unified `{ "data": ..., "meta": ... }` wrapper — **additive only**.

## 3.5 JSON standards

- Numbers: JSON numbers; IEEE infinities are **not** emitted from sanitised dataframe paths (replaced/zero-filled server-side).
- Booleans: JSON `true`/`false` for `requires_review` where serialised (may appear as strings in legacy pandas dict conversion — frontend SHOULD normalise during migration).
- Objects: Prefer maps for breakdowns (`severity_breakdown`, `compliance_risks`).
- Arrays: Ordered lists for `records`, `priority_review_queue`.

## 3.6 Error standards

- **HTTP 4xx/5xx** with FastAPI/Pydantic **`detail`** (string or structured validation errors).
- Clients **MUST** parse `detail` for user-facing messages; retry only on idempotent GETs or documented transient POST cases.

## 3.7 Timestamps

- **ISO 8601** UTC strings, e.g. `2026-05-10T14:32:01.123456` (see `upload_summary.upload_timestamp`, `processing_metadata.processing_timestamp`).

## 3.8 Workflow IDs

**Today:** synchronous screening does **not** allocate a durable `workflow_id` in HTTP responses.  
**Contract:** when async orchestration is introduced, `POST /api/v1/screening/run` (or a dedicated async variant) returns `workflow_id`; `GET /api/v1/workflows/{workflow_id}` surfaces state without replacing `PipelineManager` semantics.

## 3.9 Pagination strategy

**Current:** full `records` array returned on screening POST — acceptable for bounded operator batches.  
**Future:** cursor-based pagination on `GET /api/v1/results/{workflow_id}/records?cursor=` — additive.

## 3.10 Async readiness

- Server already runs blocking pipeline work in **thread pool** to keep `/health/` responsive under load.
- Client **SHOULD** use long timeouts, exponential backoff on **502/503/504**, and optional pre-flight health checks (existing Streamlit pattern).

---

# 4. Core workflow lifecycle

Intended operational lifecycle (aligned with `PipelineManager.run_pipeline` and `WorkflowEngine.score`):

```text
Upload Dataset
    → Schema Intelligence / canonical alignment
        → ICC transformation (when `icc` or mapped columns present)
    → Rules / validation preparation (rule engine on canonical frame)
    → Feature alignment (ALL_FEATURES)
    → Fraud analysis (row-level fraud signals)
    → Batch analysis (row-level batch risk signals)
    → Hybrid scoring + risk labels
    → Risk classification + review routing + explanations
    → Priority review queue generation
    → Operator report packaging (summaries, metrics, compliance risks)
    → Export & audit (HTTP export planned; server-side export helper exists on PipelineManager)
```

**Note:** Stages are **logical**; some aggregates (e.g. top-level `fraud_analysis` / `batch_analysis` objects) are **contract-defined** for API completeness and MAY be populated when orchestration attaches summarisers — see §7.

---

# 5. Endpoint specifications

Legend: **Implemented** = available in repo; **Planned** = specified for React phase; must not contradict orchestration.

## 5.1 Health

**Implemented**

```http
GET /api/v1/health
```

**Response (200):**

```json
{
  "status": "ok",
  "service": "Digital Trade Compliance AI"
}
```

## 5.2 Run screening

**Implemented** (contract path)

```http
POST /api/v1/screening/run
Content-Type: application/json
```

Runs `PipelineManager.run_pipeline(input_df, return_intermediate=False)` and returns the **full operator payload** (see §7).

## 5.3 Workflow status

**Planned**

```http
GET /api/v1/workflows/{workflow_id}
```

**Semantics:** Non-destructive status projection for async jobs — states **MUST** map to pipeline stages (e.g. `queued`, `running`, `succeeded`, `failed`, `partial_success`). **Does not** replace `PipelineManager`; wraps it.

## 5.4 Latest results

**Implemented** (contract path)

```http
GET /api/v1/results/latest
```

**Persistence:** Each successful **`POST …/screening/run`** (v1 or legacy) calls **`store_latest_results`** with the full response body. **`GET …/latest`** returns that envelope (additive fields vs older three-field subset). **`status": "empty"`** applies only before any successful run or after process restart — still in-memory until Redis/PostgreSQL.

## 5.5 Export results

**Planned**

```http
POST /api/v1/export
Content-Type: application/json
```

Delegates to `PipelineManager.export_results` (CSV/XLSX) or returns a **presigned** download reference when object storage is added. Request model **`ExportRequest`** already exists in `backend.api.models.request_models`.

## 5.6 Review queue

**Implemented (embedded)**; **Planned (resource)**

- Today: `priority_review_queue` is returned **inside** the screening response.
- Contract:

```http
GET /api/v1/review-queue?severity=critical,high&min_hybrid_score=0.65&limit=50
```

**Semantics:** Slice/sort server-side over the **authoritative last workflow result set** — same rows as embedded queue, optionally filtered (`FilterRequest` patterns in code).

## 5.7 Explainability

**Planned**

```http
GET /api/v1/explanations/{record_id}
```

Returns the **Explanation object** (§10), combining row-level scores, contributor breakdown, and narrative. **Must** remain consistent with `build_operator_explanation` lineage.

## 5.8 Dataset upload (supporting lifecycle)

**Implemented**

```http
POST /api/v1/datasets/upload
Content-Type: multipart/form-data
```

Parses tabular uploads via ingestion layer; distinct from screening POST (preview-oriented today).

---

# 6. Request schemas

## 6.1 Screening run (implemented)

```http
POST /api/v1/screening/run
```

**Schema:** `ScoringRequest`

```json
{
  "records": [
    {
      "record_id": "SHP-EU-2026-009821",
      "declared_origin_country": "DE",
      "country_of_last_substantial_transformation": "VN",
      "destination_market": "EU",
      "product_family": "steel_coil",
      "shipment_quantity": 120,
      "shipment_value_usd": 845000,
      "embedded_emissions_tco2e_per_tonne": 1.92,
      "traceability_completeness_score": 0.42,
      "rule_flag_count": 2,
      "supporting_document_count": 1,
      "document_consistency_score": 0.88
    }
  ]
}
```

**Validation:** Empty `records` → **400** with `detail: "Input dataset is empty."`

## 6.2 Screening configuration (reserved)

`ScreeningRequest` (`enable_rules`, `enable_anomaly_detection`, `enable_classification`, `risk_threshold`, `top_k_priority`) is defined in code but **not** bound to the live `/scoring/run` handler. Frontend **MAY** send it once the backend merges options into orchestration **without changing default pipeline behaviour when omitted**.

## 6.3 Export (planned)

```json
{
  "export_format": "csv",
  "include_high_risk_only": false
}
```

Supported formats advertised today via `GET /results/info`: `csv`, `json`, `xlsx`.

## 6.4 Review queue filters (planned query params)

| Parameter | Type | Example |
|-----------|------|---------|
| `severity` | repeated or comma-separated | `critical,high` |
| `min_hybrid_score` | float 0–1 | `0.65` |
| `requires_review` | boolean | `true` |
| `limit` | int | `50` (cap enforced server-side) |

## 6.5 Workflow invocation metadata (planned)

```json
{
  "workflow_name": "EU_CBAM_daily_screening",
  "source_system": "trade_portal_erplive",
  "notes": "Q2 reconciliation batch — operator CGX"
}
```

Aligned with `WorkflowRequest` — passed when async workflows allocate `workflow_id`.

---

# 7. Response schemas

This section is **normative for frontend typing**. Examples are realistic and aligned with **`WorkflowEngine.generate_summary`**, **`OperatorReportService`**, **`ResultService`** (partial overlap by design — see notes).

## 7.1 Primary screening response (implemented shape)

Successful `POST /api/v1/screening/run` returns:

| Field | Type | Source |
|-------|------|--------|
| `status` | string | Constant `success` |
| `upload_summary` | object | `PipelineManager.generate_upload_summary` |
| `screening_summary` | object | `WorkflowEngine.generate_summary` |
| `processing_metadata` | object | `PipelineManager.build_processing_metadata` + intelligence_quality |
| `system_insights` | object | `generate_operational_insights` + IQ fields |
| `severity_breakdown` | map | Counts per `severity_level` |
| `compliance_risks` | object | Operator-calibrated risk buckets |
| `operational_metrics` | object | Review rates, averages, fraud/batch/aux counts |
| `priority_review_queue` | array | Top-k by `hybrid_score` (pipeline) serialized |
| `executive_summary` | string | Operator narrative |
| `fraud_analysis` | object | **Currently often `{}`** until pipeline attaches summariser — see §7.4 |
| `batch_analysis` | object | **Currently often `{}`** — see §7.5 |
| `records` | array | Full scored rows (sanitised) |

### Example (abbreviated)

```json
{
  "status": "success",
  "upload_summary": {
    "upload_timestamp": "2026-05-10T12:03:41.982134",
    "total_records": 240,
    "total_columns": 58,
    "markets_involved": ["EU", "US", "GB"],
    "product_categories": ["steel_coil", "aluminum_ingot"]
  },
  "screening_summary": {
    "total_records": 240,
    "flagged_records": 44,
    "records_requiring_review": 57,
    "critical_records": 6,
    "high_risk_records": 31,
    "medium_risk_records": 20,
    "cleared_records": 183,
    "average_risk_score": 0.3412,
    "screening_precision": 0.7822,
    "average_fraud_risk": 0.2145
  },
  "processing_metadata": {
    "processing_timestamp": "2026-05-10T12:03:47.553210",
    "processing_duration_seconds": 5.571,
    "model_version": "production-v1.0",
    "ml_models_loaded": {
      "preprocessor": true,
      "isolation_forest": true,
      "classifier": true
    },
    "intelligence_quality": {
      "mapping_confidence": 0.8733,
      "matched_schema_fields": 9,
      "required_schema_fields": 7,
      "icc_transformation_coverage": 0.8733,
      "completeness_score": 0.9511,
      "invalid_values_rate": 0.0288,
      "coercion_rate": 0.0288,
      "schema_consistency_score": 0.8733,
      "data_quality_score": 0.892
    },
    "mapping_confidence": 0.8733,
    "matched_schema_fields": 9,
    "required_schema_fields": 7,
    "icc_transformation_coverage": 0.8733,
    "data_quality": {
      "completeness": 0.9511,
      "invalid_values_rate": 0.0288,
      "coercion_rate": 0.0288,
      "schema_consistency_score": 0.8733,
      "overall_quality_score": 0.892
    }
  },
  "system_insights": {
    "most_common_violation_type": "Carbon Disclosure Risk",
    "highest_risk_market": "EU",
    "most_affected_product_category": "steel_coil",
    "mapping_confidence": 0.8733,
    "matched_schema_fields": 9,
    "required_schema_fields": 7,
    "icc_transformation_coverage": 0.8733,
    "data_quality_score": 0.892
  },
  "severity_breakdown": {
    "critical": 6,
    "high": 31,
    "medium": 20,
    "low": 183
  },
  "compliance_risks": {
    "carbon_disclosure_inconsistencies": 58,
    "origin_declaration_conflicts": 17,
    "missing_traceability_data": 74,
    "high_emissions_anomalies": 12,
    "anomalous_trade_patterns": 41
  },
  "operational_metrics": {
    "review_rate_percent": 23.75,
    "average_risk_score": 0.3412,
    "high_risk_rate_percent": 15.42,
    "fraud_alerts": 19,
    "anomaly_records": 36,
    "batch_risk_score": 0.1833,
    "mapping_confidence": 0.8733,
    "data_quality_score": 0.892
  },
  "priority_review_queue": [
    {
      "record_id": "SHP-EU-2026-009821",
      "severity_level": "critical",
      "hybrid_risk_label": "critical",
      "hybrid_score": 0.89,
      "compliance_issue": "Multiple Compliance Violations",
      "recommended_action": "Escalate immediately to compliance leadership",
      "review_status": "Immediate Review",
      "review_priority": 1,
      "explanation": "3 compliance inconsistencies detected; elevated embedded emissions profile; weak supply-chain traceability evidence"
    }
  ],
  "executive_summary": "44 out of 240 uploaded trade records require compliance review. 6 records were classified as critical risk and 0 require priority operational assessment.",
  "fraud_analysis": {},
  "batch_analysis": {},
  "records": []
}
```

> The example shows `"records": []` only for brevity; production responses include **full** record objects per §7.3.

## 7.2 Latest results (implemented)

**Shape:** Same top-level keys as a successful screening response (`upload_summary`, `screening_summary`, `processing_metadata`, `system_insights`, `severity_breakdown`, `compliance_risks`, `operational_metrics`, `priority_review_queue`, `executive_summary`, `fraud_analysis`, `batch_analysis`, `records`). Minimal example:

```json
{
  "status": "success",
  "screening_summary": { },
  "processing_metadata": { },
  "records": []
}
```

or

```json
{
  "status": "empty",
  "message": "No workflow results available."
}
```

## 7.3 Screening record object (`records[]`)

Representative scored row (field availability depends on source columns and model availability):

```json
{
  "record_id": "SHP-EU-2026-009821",
  "rule_flag_count": 3,
  "rule_score": 0.9502,
  "rule_pred": 1,
  "rf_probability": 0.7712,
  "rf_pred": 1,
  "if_raw": 0.18,
  "if_score": 0.62,
  "if_pred": 1,
  "emissions_fraud_flag": 0,
  "traceability_fraud_flag": 1,
  "document_fraud_flag": 0,
  "origin_fraud_flag": 1,
  "fraud_score": 0.5,
  "fraud_risk_label": "medium",
  "duplicate_shipment_flag": 0,
  "supplier_concentration_flag": 1,
  "market_cluster_flag": 0,
  "batch_risk_score": 0.3333,
  "hybrid_score": 0.82,
  "hybrid_pred": 1,
  "hybrid_risk_label": "critical",
  "severity_level": "critical",
  "review_status": "Immediate Review",
  "requires_review": true,
  "compliance_issue": "Multiple Compliance Violations",
  "recommended_action": "Escalate immediately to compliance leadership",
  "review_priority": 14,
  "explanation": "3 compliance inconsistencies detected; elevated embedded emissions profile",
  "destination_market": "EU",
  "product_family": "steel_coil"
}
```

## 7.4 `fraud_analysis` aggregate (contract target)

When populated, SHOULD mirror row-level derivations:

```json
{
  "emissions_fraud_flag": 21,
  "traceability_fraud_flag": 14,
  "document_fraud_flag": 9,
  "origin_fraud_flag": 33,
  "high_fraud_risk_records": 17
}
```

## 7.5 `batch_analysis` aggregate (contract target)

```json
{
  "duplicate_shipment_records": 6,
  "supplier_concentration_records": 28,
  "market_cluster_records": 11,
  "mean_batch_risk_score": 0.1833
}
```

(Server MAY compute these via column sums/means — naming stable for frontend.)

## 7.6 Workflow status (planned)

```json
{
  "workflow_id": "wf_9f4c21b88e764d6a",
  "status": "succeeded",
  "stage": "explainability_generation",
  "execution_time_seconds": 5.57,
  "records_processed": 240,
  "errors": [],
  "partial_warnings": []
}
```

## 7.7 Audit metadata (cross-cutting)

Embed in `processing_metadata` and future export headers:

| Field | Meaning |
|-------|---------|
| `model_version` | Trained artefact lineage (`production-v1.0`) |
| `processing_timestamp` | Completion time |
| `processing_duration_seconds` | SLA / observability |
| `intelligence_quality` | Schema/mapping/DQ envelope |

---

# 8. Intelligence object definitions

| Symbol | Meaning | Scale / range | Operational interpretation |
|--------|---------|----------------|-----------------------------|
| `hybrid_score` | Combined risk signal | Closed interval **[0,1]** after clip | Higher = more aggregate risk contribution across submodels. Compared to **`hybrid_threshold`** (metadata default **0.40**) for **`hybrid_pred`**. |
| `hybrid_pred` | Binary exceedance flag | `{0,1}` | Operational quick filter — not a regulatory determination. |
| `hybrid_risk_label` | Band from hybrid score | `low`/`medium`/`high`/`critical` by thresholds **0.25/0.50/0.75** | UI colour / queue bucketing. |
| `rule_flag_count` | Count of triggered rule conditions | Non-negative integer | Drives **`rule_score`=`1-exp(-rule_flag_count)`** and escalates severity when ≥3 or ≥5. |
| `rule_score` | Transformed rule burden | **[0,1]** | Larger with more numerous rule hits. |
| `fraud_score` | Normalised composite of fraud flags | **[0,1]** when flags present | Feeds hybrid with default weight **0.10**. |
| `batch_risk_score` | Duplicate/concentration/cluster pressure | **[0,1]** mean of available flags | Feeds hybrid with default weight **0.10**. |
| `if_score` | Isolation Forest novelty (min-max scaled within batch) | **[0,1]** | Anomaly component; **`if_pred`≥0.50** flagged. |
| `rf_probability` | Supervised risk probability | **[0,1]** | Principal ML signal in hybrid.default weight **0.25**. |
| `mapping_confidence` | Mean canonical mapping certainty | **[0,1]** | Low values → escalate data stewardship / re-upload guidance. |
| `data_quality_score` | Aggregate DQ score | **[0,1]** | Low values → caveat screening outcomes / request enrichment. |
| `requires_review` | Operator triage boolean | boolean | **`true`** iff severity ∈ `{critical, high, medium}`. |
| `severity_level` | Governance severity | `critical`/`high`/`medium`/`low` hybrid + rule + emission + traceability logic | Determines **`review_status`** + **`recommended_action`**. |
| `compliance_issue` | Dominant thematic label | enumerated strings from `determine_compliance_issue` | For routing to domain reviewers. |
| `explanation` | Deterministic textual rationale | natural language sentence | Drill-down anchor; expandable in UI. |

**Hybrid weights (defaults from `WorkflowEngine` when absent in metadata.joblib):**

```json
{
  "rf": 0.25,
  "anomaly": 0.20,
  "rules": 0.20,
  "interaction": 0.15,
  "fraud_score": 0.10,
  "batch": 0.10
}
```

Interaction term inside hybrid: `interaction * rf_probability * rule_score`.

---

# 9. Review queue contract

## 9.1 Authoritative ordering

Priority review queue ordering **MUST** use descending **`hybrid_score`** then stable tie-breaking by original row order (pandas `sort_values`).

## 9.2 Top-K

Pipeline default **`top_k=25`** in `generate_priority_queue`; Operator report variant uses **`top_k=25`** unless extended via configuration interfaces (future).

## 9.3 Review states

Derived from **`severity_level`** (`determine_review_status`):

| severity_level | review_status |
|----------------|----------------|
| critical | Immediate Review |
| high | Priority Review |
| medium | Secondary Review |
| low | Cleared |

Unknown severity maps to `"Review Required"`.

## 9.4 Escalation semantics

Escalation is **risk- and evidence-aware**:

- Severity **critical**: immediate leadership escalation string.
- Severity **high**: priority manual review string.
- Multi-rule thresholds increase severity independent of hybrid score alone.

## 9.5 Recommended actions

Straight mapping from **`severity_level`** to operator guidance (`determine_recommended_action`).

## 9.6 Explainability drilldown

Every queue row includes **`explanation`**; frontend SHOULD link to **`GET /api/v1/explanations/{record_id}`** when available for richer contributor JSON (§10).

---

# 10. Explainability contract

Row-level **`explanation`** today concatenates deterministic reasons (`build_operator_explanation`).

**Planned enrichment** Example object (consistent with orchestration semantics):

```json
{
  "record_id": "SHP-EU-2026-009821",
  "hybrid_score": 0.82,
  "severity_level": "critical",
  "requires_review": true,
  "top_contributors": {
    "rf_probability": 0.7712,
    "if_score": 0.62,
    "rule_score": 0.9502,
    "fraud_score": 0.5,
    "batch_risk_score": 0.3333,
    "hybrid_weights_applied": {
      "rf": 0.25,
      "anomaly": 0.20,
      "rules": 0.20,
      "interaction": 0.15,
      "fraud_score": 0.10,
      "batch": 0.10
    }
  },
  "triggered_rule_evidence": {
    "rule_flag_count": 3,
    "rules_engine_version_hint": "operational_rules_v1"
  },
  "fraud_evidence": {
    "traceability_fraud_flag": 1,
    "origin_fraud_flag": 1,
    "fraud_risk_label": "medium"
  },
  "batch_evidence": {
    "supplier_concentration_flag": 1,
    "duplicate_shipment_flag": 0,
    "market_cluster_flag": 0
  },
  "operator_summary": "3 compliance inconsistencies detected; elevated embedded emissions profile; weak supply-chain traceability evidence."
}
```

> **Naming note:** Frontend MUST tolerate `triggered_rules` evolving from opaque counts toward explicit rule identifiers when rule engine emits stable codes — **additive fields only**.

---

# 11. Frontend state expectations

| State | Expectation |
|-------|-------------|
| **Loading** | Show long-running acknowledgement for POST screening (minutes on cold infrastructure); disable duplicate submits; show cancelling only if cancellation endpoint added later. |
| **Workflow progress** | Until async `workflow_id` exists, approximate progress via spinner + **`processing_metadata.processing_duration_seconds`** post-hoc; future: poll `/workflows/{id}`. |
| **Success** | Hydrate dashboards from single response envelope; stash `records` client-side responsibly (PII). |
| **Empty** | Differentiate `{status: empty}` latest results vs zero flagged records (valid success). |
| **Error** | Map HTTP + `detail`; distinguish validation (422) vs scoring failure (`Scoring failed: ...`). |
| **Retry** | Exponential backoff for **502/503/504**; optional `GET /health` pre-flight. |
| **Polling** | Needed only for planned async workflows; jittered intervals (e.g. 2s→10s capped). |

---

# 12. Error handling standards

## 12.1 HTTP status codes

| Code | When |
|------|------|
| 200 | Success |
| 400 | Business validation (empty dataset, bad export params) |
| 422 | Pydantic request validation |
| 500 | Unhandled orchestration/runtime failure |
| 502/503/504 | Gateway / cold start / timeout (infra) |

## 12.2 Payload shape

FastAPI **`{"detail": ...}`** standard; MAY be string or list of `{loc, msg, type}` for validation errors.

## 12.3 Orchestration failures

Partial component failure inside `WorkflowEngine` downgrades degraded components (**zeros / empty strings**) while continuing — frontend SHOULD inspect operational metrics & non-zero sentinel fields.

## 12.4 Timeouts

Document client timeout ≥ platform worst-case screening duration; infrastructure timeouts return HTML or gateway errors — client detects non-JSON (existing Streamlit pattern).

## 12.5 Partial intelligence failures

Rows still returned; anomalies in specific engines visible via zeroed scores — optional future `warnings[]` vector at envelope level (**additive**).

---

# 13. Security & governance considerations

- **Auditability:** Persist **`processing_timestamp`**, **`model_version`**, and dataset identifiers (future `workflow_id` + upload fingerprint).
- **Workflow traceability:** Map UI actions to immutable server logs; correlate `record_id` with operator decisions (future persistence).
- **Operator accountability:** Plan signed actions (approve / escalate) stored with actor id (RBAC-ready).
- **RBAC readiness:** Endpoints SHOULD accept JWT / session headers once enabled; contract paths remain stable under auth gateways.
- **Compliance evidence preservation:** Export pipeline MUST bundle summary + DQ + hashes (future enhancement).

---

# 14. Future scalability direction

| Theme | Direction |
|-------|-----------|
| **WebSockets** | Streaming progress events for `/workflows/{id}` stages. |
| **Async orchestration** | Celery/RQ worker consuming `workflow_id`, Redis state store; FastAPI submits + polls. |
| **Redis cache** | Hot latest results + ephemeral queue overlays. |
| **PostgreSQL** | Persist records, audits, approvals, tenancy. |
| **Multi-tenant governance** | Partition datasets + RBAC scopes + jurisdictional configs. |
| **Enterprise workflows** | Webhook callbacks on completion (`succeeded/failed`). |
| **Document intelligence** | OCR + entity linking feeding canonical fields (additive columns). |
| **Regulatory connectors** | Scheduled ingest from customs / CBAM portals — orthogonal API surface (`/integrations/*`). |

---

## Appendix A — Static service references

Root discovery (existing):

```http
GET /
```

Returns `message`, `status`, `version`, `architecture: orchestration-driven`.

---

## Appendix B — Related code modules

- `backend/orchestration/pipeline_manager.py` — orchestration sequencing & intelligence quality.
- `backend/orchestration/workflow_engine.py` — hybrid scoring + fraud/batch + operator fields.
- `backend/services/operator_report_service.py` — executive & operational rollups for API.
- `backend/api/models/response_models.py` — Pydantic typings (subset enforced at handler boundary today).
- `src/intelligence/fraud_patterns.py` — fraud artefacts.
- `src/intelligence/batch_analysis.py` — batch artefacts.

---

_End of contract document._
