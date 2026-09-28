# PRAKALP — Data Ingestion Pipeline

_Last Updated: 2026-09-23_

---

> **Prototype note:** No real ingestion pipeline exists. This document describes the simulated ingestion UX in the prototype and the production design that would back a real system.

---

## Prototype: Simulated Upload Flow

The `DataOnboardingPage` (`/app/steward/onboarding`) simulates a multi-step ingestion process:

### Step 1 — Upload Material Master
- User selects a sample file from a predefined dropdown (BHEL-HEEP, SAIL-RSP, etc.)
- "Upload" button triggers `validateUpload(sampleId)` from `mockApi.ts`
- The response is a pre-computed JSON file: `validation_result_success.json` or `validation_result_failure.json`

### Step 2 — Validation Result Display
The JSON response contains:
- Overall pass/fail status
- Row count, error count, warning count
- Field-level validation errors (missing UOM, ambiguous description, etc.)
- A quality score (0–100)

### Step 3 — Field Mapping
- `FieldMappingPage` (`/app/steward/onboarding/mapping`) shows a mapping interface
- Columns from the uploaded file are mapped to the PRAKALP canonical schema
- In the prototype this is a display-only UI; no real mapping is performed

### Step 4 — Quality Alerts
- After mapping, quality alerts are shown in `QualityAlertsPage`
- Alerts are pre-loaded from `data_quality_alerts.csv` filtered by the steward's `user_id`
- A steward can resolve alerts; this updates in-memory state only

---

## Data Quality Rules (Conceptual)

| Rule ID | Field | Issue Type | Severity |
|---|---|---|---|
| QR-001 | `uom` | Missing UOM | High |
| QR-002 | `specification` | Missing Specifications | High |
| QR-003 | `description` | Ambiguous / Short Description | Medium |
| QR-004 | `local_code` | Obsolete Code Format | Low |
| QR-005 | All | Internal Duplicates within CPSE | High |

---

## Validation Response Schema

### `validation_result_success.json`
```json
{
  "status": "passed",
  "total_rows": 45,
  "passed": 38,
  "warnings": 5,
  "errors": 2,
  "quality_score": 84,
  "issues": [
    { "row": 12, "field": "uom", "message": "UOM is missing", "severity": "High" },
    { "row": 27, "field": "specification", "message": "Specification is blank", "severity": "Medium" }
  ]
}
```

### `validation_result_failure.json`
```json
{
  "status": "failed",
  "total_rows": 32,
  "passed": 14,
  "warnings": 8,
  "errors": 10,
  "quality_score": 43,
  "issues": [
    { "row": 3, "field": "description", "message": "Description too short (<5 chars)", "severity": "High" },
    ...
  ]
}
```

---

## Production Ingestion Architecture (Future Reference)

```
CPSE System (SAP / Oracle)
      │
      ▼
FTP / API Upload (SFTP or REST)
      │
      ▼
Ingestion Service (Python / FastAPI)
  ├── Schema Validation (Pydantic)
  ├── Encoding normalization (UTF-8)
  ├── UOM Standardization
  └── Quality Scoring (rules engine)
      │
      ▼
Staging Database (PostgreSQL)
      │
      ▼
Matching Engine (async job queue)
      │
      ▼
match_results → Reviewer Queue
```

### Key Production Considerations
- Support for SAP IDOC / RFC format exports
- Scheduled batch ingestion (nightly) or event-driven push
- Idempotent ingestion (same file uploaded twice = no duplicates)
- Full ingestion audit trail (file hash, row counts, timestamps)
- Rejection notifications sent to CPSE steward via email / portal message
