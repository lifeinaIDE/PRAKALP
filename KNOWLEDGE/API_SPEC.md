# PRAKALP — API Specification (Mock API Contract)

_Last Updated: 2026-09-23_

---

> All functions are exported from `src/api/mockApi.ts`.  
> There is no real HTTP server. These are async functions that read static files from `public/CSV/` or `public/JSON/` using `fetch`.

---

## Helpers

### `parseCsv<T>(filename: string): Promise<T[]>`
Fetches and parses a CSV file from `public/CSV/<filename>`. Returns typed rows.

### `fetchJson(filename: string): Promise<unknown>`
Fetches a JSON file from `public/JSON/<filename>`.

---

## Auth / Users

### `getUsers(): Promise<User[]>`
Returns all rows from `users.csv`.  
Used by LoginPage to populate the role-picker.

### `getUserByCredentials(email, password): Promise<User | null>`  
Matches email + password against `users.csv`.  
Password for all accounts is `prakalp@2026`.

---

## CPSE Master

### `getCpseMaster(): Promise<CpseMaster[]>`
Returns all rows from `cpse_master.csv`.  
Used in Admin → CPSE Management page.

---

## Raw Material Data

### `getRawMaterialsByPlant(plantCode: string): Promise<RawMaterial[]>`
Filters `raw_material_data.csv` where `cpse_name === plantCode`.  
Used in Data Onboarding and Field Mapping pages.

---

## Validation

### `validateUpload(sampleId: string): Promise<unknown>`
Simulates a file validation call.  
- If `sampleId` contains `bhel` or `bhel-heep` → returns `validation_result_success.json`  
- If `sampleId` contains `sail` or `sail-rsp` → returns `validation_result_failure.json`  
- Default → success

---

## Quality Alerts

### `getAlertsForSteward(userId: string): Promise<DataQualityAlert[]>`
Filters `data_quality_alerts.csv` where `assigned_to === userId`.  
Also reflects any in-memory resolutions from `resolveAlert()`.

### `resolveAlert(alertId: string): Promise<{ success: true; ref: string }>`
Simulated write — updates in-memory `Map`. Returns a reference ID.

---

## CNMC Registry / Search

### `getCnmcRegistry(): Promise<CnmcRegistry[]>`
Returns all rows from `cnmc_registry.csv`.

### `searchCnmcRegistry(query: string): Promise<CnmcRegistry[]>`
Client-side filter on `cnmc_registry.csv` by `cnmc_code` or `canonical_description`.

### `getPassport(cnmcCode: string): Promise<{ passport: NationalPassport; cnmc: CnmcRegistry } | null>`
Joins `national_material_passports.csv` with `cnmc_registry.csv` on `cnmc_code`.  
Returns `null` if not found.

---

## Match Queue (Reviewer)

### `getMatchQueue(): Promise<MatchResult[]>`
Returns all rows from `match_results.csv` where `status === 'Pending'`.  
Reflects in-memory status updates.

### `getMatchDetail(groupId: string): Promise<MatchResult | null>`
Returns single row from `match_results.csv` by `material_group_id`.

### `approveMatch(groupId: string): Promise<{ approved: true; cnmc: CnmcRegistry | null; passport: NationalPassport | null; ref: string }>`
Simulated write. Updates in-memory status to `Approved`.  
Finds a matching CNMC row using `legacy_codes` field (cpse_1_code or cpse_2_code).  
Returns the CNMC + passport row alongside the approval confirmation.

### `rejectMatch(groupId: string): Promise<{ rejected: true; ref: string }>`
Updates in-memory status to `Rejected`.

---

## Clarifications

### `getClarificationsForSteward(userId: string): Promise<ClarificationRequest[]>`
Filters `clarification_requests.csv` where `assigned_to === userId`.

### `getClarificationsByReviewer(userId: string): Promise<ClarificationRequest[]>`
Filters `clarification_requests.csv` where `raised_by === userId`.

### `submitClarificationResponse(requestId: string, response: string): Promise<{ success: true; ref: string }>`
Simulated write. Updates in-memory response + status to `Resolved`.

---

## Duplicate Prevention

### `checkDuplicate(description: string): Promise<unknown>`
- If description contains `ball bearing 6205` or `6205` → returns `duplicate_prevention_check_match_found.json`  
- Otherwise → returns `duplicate_prevention_check_no_match.json`

---

## National Analytics

### `getNationalAnalytics(): Promise<unknown>`
Returns `national_analytics_summary.json` (pre-computed summary statistics).

---

## Admin Functions

### `getAuditLogs(): Promise<AuditLog[]>`
Returns all rows from `audit_logs.csv`.

### `getMatchesForDispute(): Promise<MatchResult[]>`
Returns `match_results.csv` filtered for `status === 'Rejected'` or contested matches.

---

## TypeScript Interfaces

```typescript
interface User { user_id, name, email, role, plant_code, designation, status, last_login }
interface CpseMaster { plant_code, cpse_short_code, plant_name, sector, location, onboarded_date, status }
interface RawMaterial { local_code, cpse_name, description, uom, specification, category, material_ref, is_complete, validation_status, quality_score }
interface DataQualityAlert { alert_id, local_code, alert_type, severity, status, assigned_to }
interface MatchResult { material_group_id, cpse_1_code, cpse_1_desc, cpse_1_plant, cpse_2_code, cpse_2_desc, cpse_2_plant, trust_score, match_type, review_type, why_match, why_not, status, assigned_reviewer }
interface CnmcRegistry { cnmc_code, canonical_description, standardized_uom, standardized_specs, material_fingerprint, legacy_codes, category?, created_date, version, approval_status }
interface NationalPassport { passport_id, cnmc_code, canonical_description, technical_specifications, manufacturer_info, lifecycle_status, functional_equivalents, audit_trail_reference }
interface AuditLog { log_id, timestamp, user_id, user_name, role, action, material_id, reference_id, ip_address }
interface ClarificationRequest { request_id, group_id, raised_by, assigned_to, question, response, status, raised_date, resolved_date }
```
