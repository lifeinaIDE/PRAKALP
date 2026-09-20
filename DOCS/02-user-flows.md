# 02 — User Flows

Each step below is written as `Screen → Action → Next Screen` so it maps
directly to a route in `03-screens-and-navigation.md`. Every "system
response" cited here is a static file read, not a computation — see
`05-mock-api-contract.md`.

---

## Flow 1 — CPSE Data Steward

1. **Login** → select/authenticate as a Steward user → **Steward Dashboard**
2. **Steward Dashboard** → click "Upload Material Data" → **Data Onboarding
   screen**
3. **Data Onboarding** → select Source Plant (dropdown, from
   `cpse_master.csv`) → select Ingestion Method (Prototype Mode = enabled;
   Production Mode/SAP = disabled with tooltip "Available in production
   deployment") → **still on Data Onboarding**
4. **Data Onboarding** → select/upload a sample file → click "Validate" →
   system shows either `validation_result_success.json` or
   `validation_result_failure.json` depending on which sample was chosen
   (see `demo_scenario_map.json` for exact triggers) → **Validation Result
   panel** (same screen, result shown inline)
5a. **If passed:** → click "Proceed to Mapping" → **Field Mapping / Preview
    screen** → click "Confirm Submission" → toast "Submitted for national
    schema mapping" → back to **Steward Dashboard**
5b. **If failed:** → field-level error table shown → click a failed row →
    **Correction form** (inline edit) → click "Resubmit" → re-shows success
    result → same as 5a
6. **Steward Dashboard** → click "Data Quality Alerts" → **Quality Alerts
   screen** (reads `data_quality_alerts.csv` filtered to this steward) →
   click an alert → **Correct/Enrich Record form** → click "Save & Resubmit"
   → toast confirmation → back to **Quality Alerts screen**, alert status
   updates to "Resolved" (local state only)
7. **Steward Dashboard** → click "Clarification Inbox" → **Clarification
   Inbox screen** (reads `clarification_requests.csv` filtered to this
   steward) → open a request → **Clarification Detail** → type a response →
   click "Submit Response" → status updates to "Resolved" (local state)
8. **Steward Dashboard** → click "Approved Mappings" → **CNMC Search
   screen** → search by local code/description → **Search Results** → click
   a result → **National Material Passport view** (reads
   `national_material_passports.csv` + `cnmc_registry.csv`) → buttons
   "Download Mapping (CSV/Excel)" and "Send to ERP" (both trigger a toast
   only — no real export/integration)
9. **Steward Dashboard** → click "New Material Request" → **New Code
   Request form** → fill description/category/UOM/specs → click "Check for
   Duplicates" → system shows `duplicate_prevention_check_match_found.json`
   or `duplicate_prevention_check_no_match.json` depending on the entered
   description (see `demo_scenario_map.json`) → **Duplicate Check Result
   panel**
10a. **If match found:** → choose "Reuse Existing CNMC" (ends flow, toast
     confirmation) or "Proceed with New Request + Justification" → text box
     for justification → click "Send for Review" → toast "Sent to Technical
     Review" → back to **Steward Dashboard**
10b. **If no match:** → click "Proceed" → same "Send for Review" step as
     above

---

## Flow 2 — Technical Reviewer

1. **Login** → select/authenticate as a Reviewer user → **Reviewer
   Dashboard**
2. **Reviewer Dashboard** → click "Pending Match Queue" → **Match Queue
   screen** (reads `match_results.csv` where `status == "Pending"`)
3. **Match Queue** → click a queue row → **Match Detail screen**: side-by-side
   record comparison (`cpse_1_*` vs `cpse_2_*` fields), Trust Score gauge
   (`trust_score`), "Why Matched / Why Not Matched" panel (`why_match` /
   `why_not`), critical spec fields highlighted
4. **Match Detail** → reviewer decides:
   - **Approve** → confirmation modal → on confirm: show the matching
     `cnmc_registry.csv` row as "CNMC Generated" + the matching
     `national_material_passports.csv` row as "Passport Created" → toast →
     back to **Match Queue**, row removed from pending list (local state)
   - **Reject / Mark Near-Duplicate** → reason dropdown/text → confirm →
     toast → back to **Match Queue**, row removed from pending list
5. **Match Detail** → alternately, click "Request Clarification" →
   **Clarification Request form** → select steward, type message → click
   "Send" → toast "Sent to steward" → request appears (read-only) in
   `clarification_requests.csv`-backed list
6. **Reviewer Dashboard** → click "Clarification Requests" → **Clarification
   Tracker screen** (reads `clarification_requests.csv` where `reviewer_id`
   matches) → view responses from stewards → if `status == "Resolved"`,
   button "Return to Match Detail" → back to step 4 to finalize decision

---

## Flow 3 — National Admin

1. **Login** → select/authenticate as an Admin user → **Admin Dashboard**
   (reads `dashboard_stats_admin.json`)
2. **Admin Dashboard** → summary cards + charts render immediately (records
   by plant, data quality by plant, migration progress)
3. **Admin Dashboard** → click "Manage CPSEs" → **CPSE Management screen**
   (reads `cpse_master.csv`) → view/add/edit plant entries (local state only)
4. **Admin Dashboard** → click "Manage Categories & Templates" →
   **Categories screen** — static list, add/edit is local state only
5. **Admin Dashboard** → click "Trust Score Thresholds" → **Threshold
   Settings screen** — slider/input, saves to local state, does not affect
   any live matching (there isn't any)
6. **Admin Dashboard** → click "CNMC Registry" → **Registry Management
   screen** (reads `cnmc_registry.csv`) — searchable/filterable table
7. **Admin Dashboard** → click "National Analytics" → **Analytics screen** —
   expanded charts from `dashboard_stats_admin.json`: duplicate trends, data
   quality by CPSE, pending reviews, migration progress
8. **Admin Dashboard** → click "Audit Trail" → **Audit Log screen** (reads
   `audit_logs.csv`) — filterable by user/role/action/date
9. **Audit Log screen** → click "Disputes" tab → **Dispute Resolution
   screen** — list of flagged/rejected matches → click one → **Dispute
   Detail** → "Override Decision" button → confirmation modal → toast →
   local state update only
