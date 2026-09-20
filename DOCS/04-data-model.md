# 04 — Data Model

All files live in `/mock_data/`. CSVs are the system of record for the demo;
JSONs are pre-computed "API responses" derived from the CSVs (see
`05-mock-api-contract.md`). Nothing here is generated at runtime.

---

## cpse_master.csv (6 rows)

| Field | Type | Notes |
|---|---|---|
| plant_code | string | PK. e.g. `BHEL-HEEP`. Used as the dropdown value everywhere. |
| cpse_short_code | string | e.g. `BHEL` |
| plant_name | string | Full plant name |
| sector | string | e.g. `Heavy Engineering`, `Oil & Gas Refining` |
| location | string | City, State |
| onboarded_date | date | `YYYY-MM-DD` |
| status | string | `Active` |

## users.csv (11 rows)

| Field | Type | Notes |
|---|---|---|
| user_id | string | PK, e.g. `USR-001` |
| name | string | |
| email | string | dummy |
| role | string | `CPSE Data Steward` \| `Technical Reviewer` \| `National Admin` |
| plant_code | string | FK → cpse_master.plant_code. Blank for reviewers/admins. |
| designation | string | |
| status | string | `Active` |
| last_login | datetime | |

## raw_material_data.csv (71 rows)

| Field | Type | Notes |
|---|---|---|
| local_code | string | PK. CPSE-internal material code. |
| cpse_name | string | FK → cpse_master.plant_code |
| description | string | Local free-text description |
| uom | string | May be blank for incomplete records |
| specification | string | May be blank for incomplete records |
| category | string | `Bearings & Bushings` \| `Fasteners` \| `Valves` \| `Electrical & Cables` \| `Motors & Pumps` \| `General` |
| material_ref | string | The "true" canonical material name this record maps to conceptually — used only for generating other files, not shown in raw form to users |
| is_complete | boolean | `True` / `False` |
| validation_status | string | `Passed` \| `Failed` \| `Flagged` |
| quality_score | int | 0–100 |

## data_quality_alerts.csv (6 rows)

| Field | Type | Notes |
|---|---|---|
| alert_id | string | PK, e.g. `ALT-001` |
| local_code | string | FK → raw_material_data.local_code |
| alert_type | string | `Missing UOM` \| `Missing Specs` \| `Ambiguous Description` \| `Obsolete Codes` \| `Internal Duplicates` |
| severity | string | `High` \| `Medium` \| `Low` |
| status | string | `Open` \| `In Progress` \| `Resolved` |
| assigned_to | string | FK → users.user_id (a steward) |

## match_results.csv (16 rows)

| Field | Type | Notes |
|---|---|---|
| material_group_id | string | PK, e.g. `MG-0001` |
| cpse_1_code | string | FK → raw_material_data.local_code |
| cpse_1_desc | string | denormalized for convenience |
| cpse_1_plant | string | FK → cpse_master.plant_code |
| cpse_2_code | string | FK → raw_material_data.local_code |
| cpse_2_desc | string | denormalized |
| cpse_2_plant | string | FK → cpse_master.plant_code |
| trust_score | int | 0–100 |
| match_type | string | `Exact Match` \| `Near-Duplicate` \| `Partial Match` \| `Not a Match` |
| review_type | string | `Auto-Flagged / Manual Confirm` \| `Manual Review Required` |
| why_match | string | explanation text for the Why panel |
| why_not | string | counter-explanation text for the Why-Not panel |
| status | string | `Pending` \| `Approved` \| `Rejected` |
| assigned_reviewer | string | FK → users.user_id (a reviewer) |

## cnmc_registry.csv (30 rows)

| Field | Type | Notes |
|---|---|---|
| cnmc_code | string | PK, e.g. `CNMC-BRG-00001` |
| canonical_description | string | |
| standardized_uom | string | |
| standardized_specs | string | |
| material_fingerprint | string | Fake hash, e.g. `FP-9C3A1B2E4F0D` |
| legacy_codes | string | Semicolon-separated `code (plant)` pairs |
| created_date | date | |
| version | string | `v1.0` |
| approval_status | string | `Approved` |

## national_material_passports.csv (30 rows)

| Field | Type | Notes |
|---|---|---|
| passport_id | string | PK, e.g. `PASS-00001` |
| cnmc_code | string | FK → cnmc_registry.cnmc_code |
| canonical_description | string | |
| technical_specifications | string | |
| manufacturer_info | string | |
| lifecycle_status | string | `Active` \| `Under Review` |
| functional_equivalents | string | Another `cnmc_code` or `None` |
| audit_trail_reference | string | FK-ish → audit_logs.log_id |

## clarification_requests.csv (6 rows)

| Field | Type | Notes |
|---|---|---|
| request_id | string | PK, e.g. `CLR-0001` |
| material_group_id | string | FK → match_results.material_group_id |
| local_code | string | FK → raw_material_data.local_code |
| reviewer_id | string | FK → users.user_id |
| steward_id | string | FK → users.user_id |
| message | string | Reviewer's request text |
| response | string | Steward's response text, blank if unanswered |
| status | string | `Resolved` \| `Awaiting Response` |
| requested_date | date | |
| responded_date | date | blank if unanswered |

## audit_logs.csv (87 rows)

| Field | Type | Notes |
|---|---|---|
| log_id | string | PK, e.g. `LOG-1001` |
| timestamp | datetime | |
| user_id | string | FK → users.user_id |
| user_role | string | denormalized |
| action | string | e.g. `Login`, `Upload & Validate Material Record`, `Approve Canonical Match`, `Generate CNMC & Create Passport` |
| material_code | string | FK → raw_material_data.local_code, blank if N/A |
| cnmc_code | string | FK → cnmc_registry.cnmc_code, blank if N/A |
| ip_address | string | fake |
| hash_chain | string | fake SHA-256 hex string |

---

## Pre-computed JSON "API responses"

These are not separate data — they are formatted views over the CSVs above,
computed once and saved as static files.

| File | Derived from |
|---|---|
| `validation_result_success.json` | canned; not derived, fixed demo scenario |
| `validation_result_failure.json` | canned; references `FAST-XX-001`, `VLV-UNK-01` from raw_material_data.csv |
| `duplicate_prevention_check_match_found.json` | references `CNMC-BRG-00001` from cnmc_registry.csv |
| `duplicate_prevention_check_no_match.json` | canned |
| `dashboard_stats_steward.json` | aggregates raw_material_data.csv + data_quality_alerts.csv + clarification_requests.csv, scoped to plant `BHEL-HEEP` |
| `dashboard_stats_reviewer.json` | aggregates match_results.csv + clarification_requests.csv |
| `dashboard_stats_admin.json` | aggregates raw_material_data.csv + cnmc_registry.csv + match_results.csv + data_quality_alerts.csv + cpse_master.csv |
| `demo_scenario_map.json` | reference only — not consumed by the UI, used by the presenter |

## Relationships (ER summary)

```
cpse_master (1) ──< raw_material_data (many, via cpse_name)
cpse_master (1) ──< users (many, via plant_code, stewards only)
raw_material_data (2) ──< match_results (1 pair, via cpse_1_code/cpse_2_code)
match_results (1) ──> cnmc_registry (1, on approval)
cnmc_registry (1) ──< national_material_passports (1)
raw_material_data (1) ──< data_quality_alerts (many)
match_results (1) ──< clarification_requests (many)
users (1) ──< audit_logs (many)
```
