# PRAKALP — Data Model

_Last Updated: 2026-09-23_

---

## Overview

All data files live in `CSV/` (source of truth) and `public/CSV/` (served at runtime). JSON files in `public/JSON/` are pre-computed API-response payloads. Nothing is generated at runtime — all data is static and checked into the repo.

---

## 1. `users.csv` — 11 rows

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | PK, e.g. `USR-001` |
| `name` | string | Full name |
| `email` | string | Dummy email |
| `role` | string | `CPSE Data Steward` \| `Technical Reviewer` \| `National Admin` |
| `plant_code` | string | FK → cpse_master.plant_code. Blank for reviewers/admins |
| `designation` | string | Official job title |
| `status` | string | `Active` |
| `last_login` | datetime | `YYYY-MM-DD HH:MM` |

---

## 2. `cpse_master.csv` — 6 rows

| Field | Type | Notes |
|---|---|---|
| `plant_code` | string | PK, e.g. `BHEL-HEEP` |
| `cpse_short_code` | string | e.g. `BHEL` |
| `plant_name` | string | Full plant name |
| `sector` | string | e.g. `Heavy Engineering`, `Oil & Gas Refining` |
| `location` | string | City, State |
| `onboarded_date` | date | `YYYY-MM-DD` |
| `status` | string | `Active` |

---

## 3. `raw_material_data.csv` — 71 rows

| Field | Type | Notes |
|---|---|---|
| `local_code` | string | PK. CPSE-internal code |
| `cpse_name` | string | FK → cpse_master.plant_code |
| `description` | string | Local free-text description |
| `uom` | string | May be blank for incomplete records |
| `specification` | string | May be blank for incomplete records |
| `category` | string | `Bearings & Bushings`, `Fasteners`, `Valves`, `Electrical & Cables`, `Motors & Pumps`, `General` |
| `material_ref` | string | Canonical material this record maps to (internal use) |
| `is_complete` | boolean | `True` / `False` |
| `validation_status` | string | `Passed` \| `Failed` \| `Flagged` |
| `quality_score` | int | 0–100 |

---

## 4. `data_quality_alerts.csv` — 6 rows

| Field | Type | Notes |
|---|---|---|
| `alert_id` | string | PK, e.g. `ALT-001` |
| `local_code` | string | FK → raw_material_data.local_code |
| `alert_type` | string | `Missing UOM`, `Missing Specs`, `Ambiguous Description`, `Obsolete Codes`, `Internal Duplicates` |
| `severity` | string | `High` \| `Medium` \| `Low` |
| `status` | string | `Open` \| `In Progress` \| `Resolved` |
| `assigned_to` | string | FK → users.user_id |

---

## 5. `match_results.csv` — 16 rows

| Field | Type | Notes |
|---|---|---|
| `material_group_id` | string | PK, e.g. `MG-0001` |
| `cpse_1_code` | string | FK → raw_material_data.local_code |
| `cpse_1_desc` | string | Denormalized description |
| `cpse_1_plant` | string | FK → cpse_master.plant_code |
| `cpse_2_code` | string | FK → raw_material_data.local_code |
| `cpse_2_desc` | string | Denormalized description |
| `cpse_2_plant` | string | FK → cpse_master.plant_code |
| `trust_score` | int | 0–100 |
| `match_type` | string | `Exact Match`, `Near-Duplicate`, `Partial Match`, `Not a Match` |
| `review_type` | string | `Auto-Flagged / Manual Confirm`, `Manual Review Required` |
| `why_match` | string | Reason text shown in Why Match panel |
| `why_not` | string | Reason text shown in Why Not Match panel |
| `status` | string | `Pending` \| `Approved` \| `Rejected` |
| `assigned_reviewer` | string | FK → users.user_id |

---

## 6. `cnmc_registry.csv` — 30 rows

| Field | Type | Notes |
|---|---|---|
| `cnmc_code` | string | PK. **16-digit numeric** code (see CNMC Code Structure below) |
| `canonical_description` | string | Standardized official description |
| `standardized_uom` | string | `NOS`, `KGS`, `MTR`, `PCS`, `SET`, etc. |
| `standardized_specs` | string | Canonical technical specification string |
| `material_fingerprint` | string | FP-XXXX hash for deduplication |
| `legacy_codes` | string | Pipe-separated list of CPSE legacy codes |
| `category` | string | Material category |
| `created_date` | date | `YYYY-MM-DD` |
| `version` | string | e.g. `v1.0` |
| `approval_status` | string | `Approved` \| `Pending` \| `Rejected` |

---

## 7. `national_material_passports.csv` — 30 rows

| Field | Type | Notes |
|---|---|---|
| `passport_id` | string | PK, e.g. `PASS-00001` |
| `cnmc_code` | string | FK → cnmc_registry.cnmc_code (16-digit) |
| `canonical_description` | string | Mirrors registry description |
| `technical_specifications` | string | Full spec string |
| `manufacturer_info` | string | Vendor/OEM notes |
| `lifecycle_status` | string | `Active` \| `Under Review` \| `Superseded` |
| `functional_equivalents` | string | FK → cnmc_registry.cnmc_code for equivalent items |
| `audit_trail_reference` | string | FK → audit_logs.log_id |

---

## 8. `audit_logs.csv`

| Field | Type | Notes |
|---|---|---|
| `log_id` | string | PK, e.g. `LOG-1001` |
| `timestamp` | datetime | ISO datetime |
| `user_id` | string | FK → users.user_id |
| `user_name` | string | Denormalized |
| `role` | string | Denormalized role |
| `action` | string | Action description |
| `material_id` | string | Related material/CNMC code |
| `reference_id` | string | e.g. `MG-0001`, `ALT-001` |
| `ip_address` | string | Simulated IP address |

---

## 9. `clarification_requests.csv`

| Field | Type | Notes |
|---|---|---|
| `request_id` | string | PK, e.g. `CLR-001` |
| `group_id` | string | FK → match_results.material_group_id |
| `raised_by` | string | FK → users.user_id |
| `assigned_to` | string | FK → users.user_id (steward) |
| `question` | string | Clarification question text |
| `response` | string | Steward's response (may be blank) |
| `status` | string | `Open` \| `Resolved` |
| `raised_date` | date | `YYYY-MM-DD` |
| `resolved_date` | date | `YYYY-MM-DD` or blank |

---

## 10. CNMC Code Structure (16 Digits)

> Rules file: `CSV/cnmc_generation_rules.csv`

```
D1-D2   Segment       (UNSPSC Segment)
D3-D4   Family        (UNSPSC Family)
D5-D6   Class         (UNSPSC Class)
D7-D8   Commodity     (UNSPSC Commodity)
D9-D10  MaterialGrade (00=N/A, 01-09=Carbon Steel, 20-29=Stainless, 30-39=Non-ferrous, ...)
D11     MacroSizeBand (0=1-10mm, 1=10-25mm, ... 9=Non-dimensional/>10m)
D12     FineSubdivision (geometric progression within macro band)
D13     PressureRatingClass (0=N/A, 1=Low, 2=Medium, 3=High, 4=Very High)
D14     UoMCategory   (1=Nos, 2=Weight, 3=Length, 4=Volume, 5=Set, ...)
D15     SequentialID  (disambiguates same D1-D14)
D16     CheckDigit    (Luhn modulus-10 over D1-D15)
```

**Example:** `3117150400000110`  
→ `31171504` (UNSPSC Ball Bearing) + `00` (Grade N/A) + `0` (Size 1-10mm) + `0` (Fine 0) + `1` (Low Press) + `1` (NOS) + `0` (Seq) + `0` (Luhn)
