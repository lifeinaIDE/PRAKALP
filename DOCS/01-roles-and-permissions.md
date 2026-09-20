# 01 — Roles & Permissions

## Login Behavior (Dummy SSO)

- Login screen presents a single "Login with Government SSO" button styled
  like a real SSO redirect button — but it does **not** redirect anywhere.
- Clicking it opens a simple role-picker (or reads a `?role=` query param) and
  logs the user in as one of the fixed demo users in `users.csv`.
- No password validation, no token, no session expiry logic needed. Store the
  logged-in user in local component state / context for the session only.
- Once "logged in," the app routes to the dashboard for that user's `role`
  field from `users.csv`.
- A visible "Signed in as: `<name>`, `<designation>`, `<plant_code>`" strip
  should appear in the header at all times — this sells the multi-role demo
  without needing a real auth flow.

Reference: `mock_data/users.csv` (11 demo users — 6 stewards, one per plant;
3 reviewers; 2 admins).

## Role 1 — CPSE Data Steward

**Who they are:** A materials officer at one CPSE plant (e.g. BHEL-HEEP).
Scoped to their own plant's data only.

**Can see:**
- Only their own plant's records in `raw_material_data.csv`
  (filter by `cpse_name == <their plant_code>`)
- Only alerts assigned to them in `data_quality_alerts.csv`
- Only clarification requests where `steward_id` matches them
- The full national `cnmc_registry.csv` (read-only, for search/reuse) and
  `national_material_passports.csv`

**Can do:**
- Upload / select a sample CSV for validation
- Correct and resubmit flagged records
- Respond to clarification requests
- Search and view approved CNMC mappings, download or "send to ERP" (dummy
  button — no real export needed, a toast confirmation is enough)
- Submit a New Code Request, which runs the Duplicate Prevention Gate

**Cannot do:** Approve/reject matches, see other plants' pending review
queues, access admin governance screens.

## Role 2 — Technical Reviewer

**Who they are:** A national-level subject-matter reviewer (not tied to a
single plant). `plant_code` is blank for these users in `users.csv`.

**Can see:**
- The full pending match queue in `match_results.csv` across all plants
- Full record detail for any material on either side of a match
- Clarification threads they've opened, in `clarification_requests.csv`

**Can do:**
- Approve or reject a match
- Send a clarification request to a steward
- Trigger CNMC generation + passport creation (writes a new row's worth of
  data conceptually — for the prototype this just means: on "Approve," show
  the corresponding `cnmc_registry.csv` / `national_material_passports.csv`
  row that already exists for that `material_group_id`, as if it were just
  created)

**Cannot do:** Upload plant data, access governance/admin settings.

## Role 3 — National Admin

**Who they are:** Program-level administrator. Not tied to a plant.

**Can see:** Everything, aggregated nationally — all plants, all queues, all
audit logs (`audit_logs.csv`), all disputes.

**Can do:**
- View/manage CPSE list (`cpse_master.csv`) — add/edit forms can be
  non-functional or locally-stateful only, no persistence needed
- View/manage categories & templates — static list is fine
- Set Trust Score thresholds — a slider/input that doesn't need to actually
  affect matching (there is no live matching to affect)
- View national analytics dashboard (`dashboard_stats_admin.json`)
- View audit trail, resolve disputes, override a reviewer decision (locally
  update UI state; no persistence required)

## Permission Matrix (Quick Reference)

| Capability | Steward | Reviewer | Admin |
|---|---|---|---|
| Upload/validate material data | Own plant only | — | — |
| View data quality alerts | Own plant only | — | All plants |
| Respond to clarifications | Own plant only | — | — |
| View pending match queue | — | All plants | All plants (read-only) |
| Approve/reject matches | — | Yes | Override only |
| Send clarification requests | — | Yes | — |
| Search/view CNMC registry | Yes (read-only) | Yes (read-only) | Yes (manage) |
| View national analytics | — | — | Yes |
| Manage CPSEs/roles/thresholds | — | — | Yes |
| View audit trail | Own actions only | Own actions only | Full trail |
