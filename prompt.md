# prompt.md — PRAKALP Build Prompts for Antigravity

> **How to use this file:**
> Copy and paste **one prompt at a time** into Antigravity.
> Wait for it to finish and pass the Exit Check before moving to the next.
> Do NOT send multiple prompts together.
>
> Every prompt already includes the standing ground rules so you do not have to add them manually.
>
> **File paths in all prompts assume this workspace structure:**
> ```
> /DOCS/   → 11 .md spec files (00-overview.md … 10-phases.md)
> /CSV/    → 9 CSV files (raw_material_data.csv, users.csv, etc.)
> /JSON/   → 8 JSON files (dashboard_stats_*.json, validation_result_*.json, etc.)
> ```

---

## Prompt 0 — Project Setup & Theme

```
Read these files before doing anything else — they set the non-negotiable ground rules for the entire build:
  /DOCS/00-overview.md
  /DOCS/07-design-system.md
  /DOCS/08-architecture.md

Now scaffold the PRAKALP project with the following:

1. Tech stack: React (TypeScript preferred). React Router v6. Vite as the build tool.

2. Folder structure:
   /src/components/    → shared UI components (built in Phase 3)
   /src/pages/         → one file per screen/route
   /src/api/           → mockApi.ts (built in Phase 1)
   /src/context/       → auth/session context (logged-in user)
   /src/styles/        → global CSS / theme tokens
   /public/CSV/        → the 9 CSV data files
   /public/JSON/       → the 8 JSON data files

3. Design tokens / global CSS from /DOCS/07-design-system.md.
   Wire in every CSS custom property from the Color Palette table:
     --gov-navy: #0B3763
     --gov-navy-dark: #062442
     --gov-maroon: #8B1E2B
     --gov-saffron: #E58E26
     --gov-green: #1F7A3D
     --gov-bg: #F4F5F7
     --gov-surface: #FFFFFF
     --gov-border: #D0D5DD
     --gov-text-primary: #1A1A1A
     --gov-text-secondary: #5B6472
     --gov-amber: #B7791F
     --gov-grey-badge: #6B7280
   Font stack: "Noto Sans", "Segoe UI", Arial, sans-serif.
   Monospace for IDs/hashes: "Roboto Mono", monospace.

4. Placeholder App Shell:
   - Top header bar: Ashoka-emblem-style crest placeholder (SVG or styled div) + "PRAKALP" platform name on the left. "Signed in as: —" placeholder + disabled Logout button on the right.
   - Fixed left sidebar: empty for now, styled in navy background with white text.
   - Content area: white background, placeholder heading "Welcome to PRAKALP".
   - No functional routes or data yet — layout only.

5. Design constraints (non-negotiable):
   - No gradient backgrounds, glassmorphism, or blurred panels.
   - Sharp/minimally-rounded corners (2–4px radius max).
   - No AI-product language anywhere in copy or code comments.
   - No real backend, no database, no real API calls.

Exit check: App builds and runs (npm run dev) without errors and renders the styled shell in the browser with the correct government-portal palette — navy header, white surface, no gradients.
```

---

## Prompt 1 — Data Layer & Mock API

```
Ground rules (apply for every phase):
- No real backend, no database, no real network calls beyond loading local /CSV/ and /JSON/ files.
- No AI-product styling or language — government-portal look only, per /DOCS/07-design-system.md.
- If something seems to require computation, read the pre-computed answer from /CSV/ or /JSON/ instead.

Read these spec files now:
  /DOCS/04-data-model.md
  /DOCS/05-mock-api-contract.md

Also inspect all files in /CSV/ and /JSON/ so you understand the exact field names and data shapes:
  /CSV/users.csv                        (11 rows — 6 stewards, 3 reviewers, 2 admins)
  /CSV/cpse_master.csv                  (6 rows — BHEL-HEEP, NTPC-TPS, SAIL-RSP, IOCL-BR, ONGC-HZR, BPCL-MR)
  /CSV/raw_material_data.csv            (71 rows — local material records per plant)
  /CSV/data_quality_alerts.csv          (6 rows — quality alerts assigned to stewards)
  /CSV/match_results.csv                (16 rows — cross-plant material match candidates)
  /CSV/cnmc_registry.csv                (30 rows — approved National Material Codes)
  /CSV/national_material_passports.csv  (30 rows — one passport per CNMC)
  /CSV/clarification_requests.csv       (6 rows — reviewer-to-steward clarifications)
  /CSV/audit_logs.csv                   (87 rows — tamper-evident audit trail)
  /JSON/dashboard_stats_steward.json
  /JSON/dashboard_stats_reviewer.json
  /JSON/dashboard_stats_admin.json
  /JSON/validation_result_success.json
  /JSON/validation_result_failure.json
  /JSON/duplicate_prevention_check_match_found.json
  /JSON/duplicate_prevention_check_no_match.json
  /JSON/demo_scenario_map.json

Build the following — nothing else this phase:

1. CSV parser utility: a lightweight client-side CSV-to-JSON-array parser.
   You may use the papaparse npm package. Field names must match CSV headers exactly
   (schemas are in /DOCS/04-data-model.md).

2. mockApi.ts module implementing every function from /DOCS/05-mock-api-contract.md:
     getUsers()
     getCpseMaster()
     getRawMaterialsByPlant(plantCode)
     validateUpload(sampleId)              — success or failure per demo_scenario_map.json trigger rules
     getAlertsForSteward(userId)
     resolveAlert(alertId)                 — 300–600ms delay, local state update only
     getClarificationsForSteward(userId)
     getClarificationsForReviewer(userId)
     respondToClarification(requestId, text)  — 300–600ms delay, local state only
     searchCnmcRegistry(query)
     getPassport(cnmcCode)
     checkDuplicate(description)           — match_found or no_match per demo_scenario_map.json
     getMatchQueue()
     getMatchDetail(groupId)
     approveMatch(groupId)                 — 300–600ms delay, looks up cnmc_registry + passports row
     rejectMatch(groupId, reason)          — 300–600ms delay, local state only
     sendClarificationRequest(groupId, stewardId, message)  — 300–600ms delay
     getDashboardStats(role)               — role: "steward" | "reviewer" | "admin"
     getAuditLogs(filters)
     getDisputes()

3. All simulated write functions must resolve after a 300–600ms artificial delay so the UI can show a loading state.

4. No UI components this phase — pure data layer only.

Exit check: Call each of the following from a scratch/test component and log results to the browser console:
  getUsers()                              → expect 11 user objects
  getRawMaterialsByPlant("BHEL-HEEP")     → expect 15 records
  getMatchQueue()                         → expect rows with status "Pending"
  getDashboardStats("admin")              → expect the dashboard_stats_admin.json shape
  checkDuplicate("Ball Bearing 6205")     → expect duplicate_prevention_check_match_found.json result
```

---

## Prompt 2 — Login & Routing Shell

```
Ground rules:
- No real backend, no database, no real network calls.
- No AI-product styling or language — government-portal look only, per /DOCS/07-design-system.md.

Read these spec files now:
  /DOCS/01-roles-and-permissions.md
  /DOCS/03-screens-and-navigation.md

Build the following:

1. Login screen (route: /login):
   - Single "Login with Government SSO" button styled like a real SSO button:
     navy background (#0B3763), white text, sharp corners — no pill shape, no gradient.
   - Clicking it opens an inline role-picker showing the 11 demo users from users.csv
     (call getUsers() from mockApi.ts).
     Display each user as: "Name — Designation (Plant)" where plant is blank for reviewers/admins.
   - On selection, store the user object in React context (AuthContext) and redirect:
       CPSE Data Steward   → /app/steward/dashboard
       Technical Reviewer  → /app/reviewer/dashboard
       National Admin      → /app/admin/dashboard

2. Full route tree (every route must exist and render a placeholder heading until wired in later phases):
     /login
     /app/steward/dashboard
     /app/steward/onboarding
     /app/steward/onboarding/mapping
     /app/steward/alerts
     /app/steward/alerts/:alertId
     /app/steward/clarifications
     /app/steward/clarifications/:requestId
     /app/steward/mappings
     /app/steward/mappings/:cnmcCode
     /app/steward/new-request
     /app/steward/new-request/check
     /app/reviewer/dashboard
     /app/reviewer/queue
     /app/reviewer/queue/:groupId
     /app/reviewer/queue/:groupId/clarify
     /app/reviewer/clarifications
     /app/admin/dashboard
     /app/admin/cpses
     /app/admin/categories
     /app/admin/thresholds
     /app/admin/registry
     /app/admin/analytics
     /app/admin/audit
     /app/admin/disputes
     /app/admin/disputes/:groupId

3. App Shell (wraps all /app/* routes):
   - Top header: Ashoka-crest placeholder + "PRAKALP" left.
     "Signed in as: [Name], [Designation], [Plant]" (from AuthContext) + Logout button right.
     Logout clears context and redirects to /login.
   - Left sidebar — role-scoped navigation (only show current role's links, no greyed-out other-role links):
       Steward:  Dashboard | Data Onboarding | Quality Alerts | Clarification Inbox | Approved Mappings | New Material Request
       Reviewer: Dashboard | Pending Match Queue | Clarification Requests
       Admin:    Dashboard | Manage CPSEs | Categories & Templates | Trust Score Thresholds | CNMC Registry | National Analytics | Audit Trail | Dispute Resolution
   - Route guards: /app/steward/* only for Stewards, /app/reviewer/* for Reviewers, /app/admin/* for Admins.
     Wrong-role access redirects to their own dashboard.

4. Sidebar styling: --gov-navy background, white text. Active nav item: left-border accent in --gov-saffron or --gov-maroon, slightly darker background.

Exit check: Can log in as each of the 3 roles and see the correct sidebar menu. Every sidebar link reaches the correct stub screen without a 404 or crash. Logout returns to /login.
```

---

## Prompt 3 — Shared UI Components

```
Ground rules:
- No real backend, no database, no real network calls.
- No AI-product styling or language — government-portal look only, per /DOCS/07-design-system.md.

Read these spec files now:
  /DOCS/06-ui-components.md
  /DOCS/07-design-system.md

Build all 11 reusable components below with typed props. A /dev/components preview page showing each with sample data is acceptable. Components must be ready to import into screen pages:

1. TrustScoreGauge  (props: trust_score: number)
   - Horizontal bar or semicircular gauge with printed numeric value next to it.
   - Color bands: >=85 → --gov-green ("Exact Match"), 70–84 → --gov-amber ("Near-Duplicate"), <70 → --gov-maroon.
   - Always show the number — never color alone.
   - Label: "Match Trust Score". No circular AI-confidence ring styling.

2. WhyWhyNotPanel  (props: why_match: string, why_not: string)
   - Two bordered blocks: "Why Matched" and "Why Not Matched".
   - Plain paragraph text. No bullet-icon lists with checkmarks/crosses.
   - If why_not is empty: show "No conflicting attributes identified."

3. PassportCard  (props: passport row + cnmc_registry row, joined)
   - Fields: CNMC code (prominent, monospace), canonical description, standardized UOM/specs,
     lifecycle_status (StatusBadge), legacy codes list, functional_equivalents link.
   - Actions: "Download Mapping (CSV/Excel)" and "Send to ERP" — both show a toast only, no real export.
   - Style as a document/certificate card: bordered, header strip with CNMC code. Not a product card.

4. QualityAlertBadge  (props: alert_type: string, severity: "High"|"Medium"|"Low")
   - Small inline rectangular badge showing alert_type + severity.
   - Severity → color: High → --gov-maroon, Medium → --gov-saffron, Low → --gov-grey-badge.

5. AuditTrailTable  (props: rows: AuditLog[])
   - Dense table. Columns: Timestamp, User, Role, Action, Material/CNMC Code, Reference (log_id).
   - hash_chain: truncated, "view full hash" tooltip or expand affordance.
   - Client-side sortable by timestamp.

6. StatusBadge  (props: status: string)
   - Small rectangular badge — not pill-shaped.
   - Color map (from /DOCS/07-design-system.md):
       Passed / Approved / Active / Resolved        → --gov-green
       Pending / Awaiting Response / Under Review   → --gov-amber
       Failed / Rejected / High severity            → --gov-maroon
       Flagged / Medium severity                    → --gov-saffron
       Low severity / Neutral / Inactive            → --gov-grey-badge

7. SummaryStatCard  (props: label: string, value: string|number, subtext?: string)
   - Large number, short label beneath, optional small subtext line.
   - Flat card, 1px --gov-border border. No drop shadows, no gradient.

8. PlantSelector  (props: value: string, onChange: fn)
   - Dropdown sourced from getCpseMaster() — displays "plant_code — plant_name".

9. RecordComparisonTable  (props: match row from match_results.csv)
   - Two-column side-by-side comparison of cpse_1_* vs cpse_2_* fields.
   - Differing values flagged with bold or underline — not red/green color diff.

10. SecurityBadgeStrip  (no props — static)
    - Small strip: lock icon + "AES-256 Encrypted" | check icon + "SHA-256 Verified" | shield icon + "Government of India Compliant".
    - Use SVG line icons, not emoji. Small, positioned like a compliance footer.

11. FieldErrorList  (props: field_errors[] from validation_result_failure.json)
    - Table with columns: Row No., Local Code, Field, Error Type, Message.
    - Not toasts, not inline bubbles — a dense table only.

Exit check: /dev/components renders all 11 components with sample data. Status colors match the table in /DOCS/07-design-system.md exactly. No pill shapes, no decorative shadows, no gradient backgrounds.
```

---

## Prompt 4 — Steward Flow, Part A (Dashboard + Data Onboarding)

```
Ground rules:
- No real backend, no database, no real network calls.
- No AI-product styling or language — government-portal look only, per /DOCS/07-design-system.md.
- All data comes from /CSV/ and /JSON/ via mockApi.ts. Never write computation logic.

Read these spec files now:
  /DOCS/00-overview.md
  /DOCS/02-user-flows.md  (Flow 1, steps 1–5b only)
  /DOCS/03-screens-and-navigation.md  (Steward rows only)
  /JSON/demo_scenario_map.json

Wire up the following screens under /app/steward/:

1. Steward Dashboard  (/app/steward/dashboard)
   - getDashboardStats("steward") → reads dashboard_stats_steward.json.
   - SummaryStatCards:
       total_records_submitted: 15
       records_pending_correction: 1
       records_flagged_for_review: 0
       approved_cnmc_mappings: 9
       open_clarification_requests: 1
   - Recent activity list from the recent_activity[] array in the JSON.
   - Navigation cards or sidebar links to all steward screens.

2. Data Onboarding  (/app/steward/onboarding)
   - PlantSelector dropdown (from getCpseMaster()).
   - Ingestion Method selector:
       "Prototype Mode" — enabled
       "Production Mode / SAP Connector" — disabled, with tooltip "Available in production deployment"
   - Two selectable demo samples:
       "BHEL-HEEP Clean Sample"  → validateUpload("success") → returns validation_result_success.json
       "SAIL-RSP Error Sample"   → validateUpload("failure") → returns validation_result_failure.json
     (Per demo_scenario_map.json: BHEL-HEEP → success, SAIL-RSP → failure. Hardcode these triggers.)
   - "Validate" button → 300–600ms loading state → inline Validation Result panel:
       Success: green StatusBadge "VALIDATION_PASSED", summary (15 of 15 passed), validation_id "VAL-2026-04711", "Proceed to Mapping" button.
       Failure: amber/maroon StatusBadge "VALIDATION_FAILED", summary (3 of 12 failed),
         FieldErrorList for FAST-XX-001 (missing UOM, missing specification) and VLV-UNK-01 (ambiguous description).
         Inline correction form for each failed row.

3. Field Mapping / Preview  (/app/steward/onboarding/mapping)
   - Shown after "Proceed to Mapping" on the success path.
   - Table previewing validated records (in-memory from previous step).
   - "Confirm Submission" → 300–600ms delay → toast "Submitted for national schema mapping. Reference: VAL-2026-04711." → redirect to Steward Dashboard.

4. Correction form (inline on /app/steward/onboarding — failure path)
   - Click a failed row in FieldErrorList → inline edit form for that record.
   - "Resubmit" → 300–600ms delay → re-shows success validation result → same path as step 3.

Exit check: Walk both paths end-to-end without stopping:
  Path A (success): Select BHEL-HEEP sample → Validate → green success panel → Proceed to Mapping → Confirm Submission → back to Dashboard.
  Path B (failure): Select SAIL-RSP sample → Validate → failure panel with FieldErrorList → click failed row → correct inline → Resubmit → success → Proceed to Mapping → Confirm Submission.
```

---

## Prompt 5 — Steward Flow, Part B (Alerts, Clarifications, Mappings, New Request)

```
Ground rules:
- No real backend, no database, no real network calls.
- No AI-product styling or language — government-portal look only, per /DOCS/07-design-system.md.
- All data from /CSV/ and /JSON/ via mockApi.ts.

Read these spec files now:
  /DOCS/00-overview.md
  /DOCS/02-user-flows.md  (Flow 1, steps 6–10b)
  /DOCS/03-screens-and-navigation.md  (Steward rows)
  /JSON/demo_scenario_map.json

Wire up the following screens:

1. Quality Alerts list  (/app/steward/alerts)
   - getAlertsForSteward(userId) → data_quality_alerts.csv filtered by assigned_to == logged-in user.
   - Dense table: alert_id (monospace), local_code, alert_type (QualityAlertBadge), severity, status (StatusBadge).
   - Click a row → /app/steward/alerts/:alertId

2. Correct/Enrich Record form  (/app/steward/alerts/:alertId)
   - Load alert row + the corresponding raw_material_data.csv row.
   - Editable form for the flagged fields relevant to the alert_type.
   - "Save & Resubmit" → resolveAlert(alertId) → 300–600ms delay → toast "Record resubmitted. Alert [alert_id] marked Resolved." → back to Alerts list, row status updates to "Resolved" in local state.

3. Clarification Inbox  (/app/steward/clarifications)
   - getClarificationsForSteward(userId) → clarification_requests.csv filtered by steward_id.
   - Table: request_id (monospace), material_group_id, reviewer message preview, status (StatusBadge), requested_date.
   - Click a row → /app/steward/clarifications/:requestId

4. Clarification Detail  (/app/steward/clarifications/:requestId)
   - Shows reviewer message (message field) in a bordered block.
   - Textarea for steward's reply.
   - "Submit Response" → respondToClarification(requestId, text) → 300–600ms delay → toast → status updates to "Resolved" in local state → back to Inbox.

5. CNMC Search  (/app/steward/mappings)
   - Search input → searchCnmcRegistry(query) → filters cnmc_registry.csv client-side on cnmc_code + canonical_description.
   - Results table: cnmc_code (monospace), canonical_description, standardized_uom, approval_status (StatusBadge).
   - Click a row → /app/steward/mappings/:cnmcCode

6. National Material Passport view  (/app/steward/mappings/:cnmcCode)
   - getPassport(cnmcCode) → joins national_material_passports.csv + cnmc_registry.csv.
   - Render PassportCard with all fields.
   - "Download Mapping (CSV/Excel)" and "Send to ERP" buttons → toast only, no real action.

7. New Code Request form  (/app/steward/new-request)
   - Fields: Description (text), Category (dropdown from cpse_master categories), UOM, Technical Specifications.
   - "Check for Duplicates" → checkDuplicate(description) → 300–600ms delay → Duplicate Check Result panel:
       If description contains "Ball Bearing 6205":
         Returns duplicate_prevention_check_match_found.json.
         Show: check_id "DPC-2026-01187", matched CNMC-BRG-00001 "Deep Groove Ball Bearing 6205 ZZ",
               Trust Score 94, two action buttons:
               "Reuse Existing CNMC" → toast "CNMC reused. Reference: DPC-2026-01187." → back to Dashboard.
               "Proceed with New Request + Justification" → justification textarea.
       Any other description:
         Returns duplicate_prevention_check_no_match.json.
         Show: check_id "DPC-2026-01188", "No Match Found", single "Proceed" button.
   - "Send for Review" (after either path) → 300–600ms delay → toast "Sent to Technical Review. Reference: [check_id]." → back to Steward Dashboard.

Exit check: Full Flow 1 from /DOCS/02-user-flows.md walkable end-to-end as one continuous demo, all 10 steps.
```

---

## Prompt 6 — Reviewer Flow

```
Ground rules:
- No real backend, no database, no real network calls.
- No AI-product styling or language — government-portal look only, per /DOCS/07-design-system.md.
- All data from /CSV/ and /JSON/ via mockApi.ts.

Read these spec files now:
  /DOCS/00-overview.md
  /DOCS/02-user-flows.md  (Flow 2 — all steps)
  /DOCS/03-screens-and-navigation.md  (Reviewer rows)
  /JSON/demo_scenario_map.json

Wire up the following screens:

1. Reviewer Dashboard  (/app/reviewer/dashboard)
   - getDashboardStats("reviewer") → reads dashboard_stats_reviewer.json.
   - SummaryStatCards:
       pending_matches_in_queue: 8
       approved_this_quarter: 7
       rejected_this_quarter: 1
       clarifications_awaiting_steward_response: 1
       average_trust_score_reviewed: 83.2
   - Navigation links: Pending Match Queue, Clarification Requests.

2. Pending Match Queue  (/app/reviewer/queue)
   - getMatchQueue() → match_results.csv filtered to status == "Pending".
   - Dense table: material_group_id (monospace), cpse_1_plant, cpse_2_plant, match_type, trust_score (TrustScoreGauge inline small), status (StatusBadge).
   - Click a row → /app/reviewer/queue/:groupId

3. Match Detail  (/app/reviewer/queue/:groupId)
   - getMatchDetail(groupId) → one row from match_results.csv.
   - Top section: material_group_id reference, match_type, assigned_reviewer.
   - RecordComparisonTable: side-by-side cpse_1_* vs cpse_2_* fields, differing values bolded.
   - TrustScoreGauge (full size).
   - WhyWhyNotPanel with why_match and why_not from the row.
   - Action buttons:
       "Approve" → confirmation modal "Confirm approval of [material_group_id]?" → on confirm:
         approveMatch(groupId) → 300–600ms delay → show inline:
           "CNMC Generated: [cnmc_code]" and "National Material Passport Created: [passport_id]"
           (look up the matching cnmc_registry.csv + national_material_passports.csv row)
           toast → back to Match Queue, row removed from Pending list (local state).
       "Reject / Mark Near-Duplicate" → reason dropdown:
           Specifications do not match | Insufficient data | Vendor-specific code | Other
         + optional freetext → confirmation modal → rejectMatch(groupId, reason) → 300–600ms delay → toast → row removed from Pending queue (local state).
       "Request Clarification" → navigates to /app/reviewer/queue/:groupId/clarify

4. Clarification Request form  (/app/reviewer/queue/:groupId/clarify)
   - Steward selector (dropdown from getUsers() filtered to plant matching the match record).
   - Message textarea.
   - "Send" → sendClarificationRequest(groupId, stewardId, message) → 300–600ms delay → toast "Sent to steward. Reference: CLR-XXXX." → back to Match Detail.

5. Clarification Tracker  (/app/reviewer/clarifications)
   - getClarificationsForReviewer(userId) → clarification_requests.csv filtered by reviewer_id.
   - Table: request_id, material_group_id, steward name, status (StatusBadge), requested_date, responded_date.
   - If status == "Resolved": show "Return to Match Detail" link → /app/reviewer/queue/:groupId.

Exit check:
  1. Open MG-0001 (Ball Bearing 6205 ZZ, BHEL-HEEP vs NTPC-TPS, Trust Score 94, Exact Match).
     Approve it. See CNMC-BRG-00001 and its passport appear as generated. Row disappears from queue.
  2. Open the lowest trust-score match (Trust Score 22, Not a Match).
     Reject it with a reason. Row disappears from queue.
```

---

## Prompt 7 — Admin Flow

```
Ground rules:
- No real backend, no database, no real network calls.
- No AI-product styling or language — government-portal look only, per /DOCS/07-design-system.md.
- All data from /CSV/ and /JSON/ via mockApi.ts.

Read these spec files now:
  /DOCS/00-overview.md
  /DOCS/02-user-flows.md  (Flow 3 — all steps)
  /DOCS/03-screens-and-navigation.md  (Admin rows)
  /JSON/dashboard_stats_admin.json

Wire up the following screens:

1. Admin Dashboard  (/app/admin/dashboard)
   - getDashboardStats("admin") → reads dashboard_stats_admin.json.
   - SummaryStatCards for all 6 values:
       total_cpse_plants_onboarded: 6
       total_records_in_system: 71
       total_cnmc_entries_approved: 30
       pending_technical_reviews: 8
       open_data_quality_alerts: 4
       open_disputes: 1
   - Bar chart — records_by_plant:
       BHEL-HEEP: 15, NTPC-TPS: 16, SAIL-RSP: 14, IOCL-BR: 11, ONGC-HZR: 11, BPCL-MR: 4
   - Bar chart — data_quality_by_plant (alerts per plant, from the same JSON).
   - Migration progress bar: 60 of 71 records mapped (42.3%).

2. CPSE Management  (/app/admin/cpses)
   - getCpseMaster() → cpse_master.csv.
   - Table: plant_code, cpse_short_code, plant_name, sector, location, onboarded_date, status.
   - "Add Plant" and row-level "Edit" buttons — forms update local state only, no persistence.

3. Categories & Templates  (/app/admin/categories)
   - Static list of categories (define inline):
     Bearings & Bushings | Fasteners | Valves | Electrical & Cables | Motors & Pumps | General
   - "Add Category" / "Edit" → local state only.

4. Trust Score Thresholds  (/app/admin/thresholds)
   - Three sliders/inputs:
       Auto-Approve threshold (default 85)
       Manual Review threshold (default 70)
       Auto-Reject below (default 50)
   - "Save Thresholds" → toast "Thresholds updated. Reference: CFG-2026-NNNNN." → local state only.

5. CNMC Registry Management  (/app/admin/registry)
   - searchCnmcRegistry("") → full cnmc_registry.csv.
   - Searchable table: cnmc_code (monospace), canonical_description, standardized_uom, approval_status (StatusBadge), created_date, version.
   - Click a row → PassportCard view (same as steward side).

6. National Analytics  (/app/admin/analytics)
   - Expanded charts from dashboard_stats_admin.json:
     Records by plant (bar chart)
     Data quality alerts by plant (bar chart)
     Pending technical reviews (number card)
     Migration progress (bar or progress gauge)

7. Audit Log  (/app/admin/audit)
   - getAuditLogs({}) → audit_logs.csv (87 rows).
   - AuditTrailTable with filter controls: User (text), Role (dropdown), Action (text), Date range.
   - All filters are client-side over the loaded CSV data.

8. Dispute Resolution  (/app/admin/disputes)
   - getDisputes() → match_results.csv where status == "Rejected".
   - Table: material_group_id, cpse_1_plant, cpse_2_plant, match_type, trust_score, status.
   - Click a row → /app/admin/disputes/:groupId

9. Dispute Detail  (/app/admin/disputes/:groupId)
   - Same RecordComparisonTable + TrustScoreGauge + WhyWhyNotPanel as Match Detail.
   - "Override Decision" → confirmation modal → 300–600ms delay → toast "Decision overridden. Reference: LOG-XXXX." → local state update only.

Exit check: Full Flow 3 from /DOCS/02-user-flows.md walkable end-to-end.
All three roles (Steward, Reviewer, Admin) now fully demoable independently without any crashes.
```

---

## Prompt 8 — Polish & Demo Safety

```
Ground rules:
- No real backend, no database, no real network calls.
- No AI-product styling or language — government-portal look only, per /DOCS/07-design-system.md.

Read these spec files now:
  /DOCS/07-design-system.md
  /DOCS/09-build-plan.md  (Milestone 4 section)
  /JSON/demo_scenario_map.json

This phase is polish only — no new screens or features. Apply the following across the entire app:

1. SecurityBadgeStrip on every screen:
   Apply the SecurityBadgeStrip component to every single screen (all 20+ routes) — either as a compact footer or adjacent to the header. Audit every page file and confirm none are missing it.

2. Reference IDs on every action (from /DOCS/07-design-system.md — Reference Number Convention):
   Every toast and confirmation modal must surface a visible reference ID:
     Validation actions      → VAL-2026-#####  (already in validation_result_*.json)
     Duplicate checks        → DPC-2026-#####  (already in duplicate_prevention_check_*.json)
     Audit-related actions   → LOG-####         (from audit_logs.csv)
     CNMC operations         → CNMC-<CAT>-##### (from cnmc_registry.csv)
     Passport operations     → PASS-#####       (from national_material_passports.csv)
     Clarification actions   → CLR-####         (from clarification_requests.csv)
   Audit every toast/modal — if a reference ID is missing, add it.

3. Loading states on all simulated writes:
   Confirm every simulated write (resolveAlert, respondToClarification, approveMatch, rejectMatch, sendClarificationRequest, validateUpload, checkDuplicate) shows a visible loading/spinner state for 300–600ms. Nothing should feel instantaneous.

4. Demo scenario hardening (verify against demo_scenario_map.json):
   - BHEL-HEEP plant selection ALWAYS triggers validation_result_success.json.
   - SAIL-RSP plant selection ALWAYS triggers validation_result_failure.json.
   - Description containing "Ball Bearing 6205" ALWAYS triggers duplicate_prevention_check_match_found.json (CNMC-BRG-00001, Trust Score 94).
   - Any other description ALWAYS triggers duplicate_prevention_check_no_match.json.
   - MG-0001 must open with Trust Score 94, Exact Match, Approve action available.
   - Lowest trust-score match must open with Trust Score 22, Not a Match, Reject indicated.
   Hardcode these triggers if needed — do not rely on fuzzy string matching.

5. Full copy audit — remove AI-product language:
   Search all component and page files for: "AI", "smart", "intelligent", "powered by", "assistant",
   "confidence", "predict", "automat" (partial).
   Replace with government-neutral alternatives:
     "AI Match"         → "Canonical Match Result"
     "Smart Validation" → "Schema Validation"
     "Confidence Score" → "Match Trust Score"
   No exclamation marks in system messages. No emoji (SecurityBadgeStrip uses SVG icons only).

6. Visual consistency pass:
   - No pill-shaped badges or buttons anywhere.
   - No decorative drop shadows (1px border only).
   - No gradient backgrounds anywhere.
   - All status colors match the mapping table in /DOCS/07-design-system.md — single source is StatusBadge.
   - Monospace font on all: CNMC codes, passport IDs, log IDs, local_codes, hash_chain values.

Exit check: Run all 3 flows back-to-back without stopping. Verify:
  - Every action shows a loading state (not instant).
  - Every action returns a visible reference ID in the toast/confirmation.
  - SecurityBadgeStrip is visible on every screen.
  - No screen contains "AI", "smart", "intelligent", or gradient styling.
  - All scenarios in demo_scenario_map.json produce exactly the expected UI state.
```

---

## Standing Rules — Paste These if Antigravity Drifts

```
REMINDER — non-negotiable constraints for PRAKALP:

1. No real backend, no database, no API server.
   Load data only from /CSV/ and /JSON/ via mockApi.ts (static file fetches only).

2. No AI-product styling:
   No gradient backgrounds, glassmorphism, pill badges, floating shadows,
   circular confidence rings, chat bubbles, or streaming text.

3. No AI-product language:
   No "AI", "smart", "intelligent", "powered by", "assistant", or exclamation marks in system messages.

4. Government-portal design only — must look like GeM, DigiLocker, or MCA21.
   Color palette: navy (#0B3763), maroon (#8B1E2B), white (#FFFFFF), grey background (#F4F5F7).
   Sharp corners (2–4px max radius).

5. If a screen seems to need computation (matching, scoring, validation):
   The answer is always — read the pre-computed answer from the relevant /CSV/ or /JSON/ file.
   Never write the logic.

6. Finish and verify the current phase fully before starting the next one.
```
