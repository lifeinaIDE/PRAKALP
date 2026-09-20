# 03 — Screens & Navigation

Route convention: `/app/<role>/<screen>`. Role is resolved from the logged-in
user and gates route access (see `01-roles-and-permissions.md`).

## Shared

| Screen | Route | Reads |
|---|---|---|
| Login | `/login` | `users.csv` (role picker) |
| App Shell (header, role badge, nav) | wraps all `/app/*` routes | logged-in user object |

## CPSE Data Steward — `/app/steward/*`

| Screen | Route | Reads |
|---|---|---|
| Steward Dashboard | `/app/steward/dashboard` | `dashboard_stats_steward.json` |
| Data Onboarding (upload + validate) | `/app/steward/onboarding` | `cpse_master.csv`; `validation_result_success.json` / `validation_result_failure.json` |
| Field Mapping / Preview | `/app/steward/onboarding/mapping` | last validation result (in-memory) |
| Quality Alerts list | `/app/steward/alerts` | `data_quality_alerts.csv` filtered by `assigned_to` |
| Correct/Enrich Record form | `/app/steward/alerts/:alertId` | `data_quality_alerts.csv` + `raw_material_data.csv` row |
| Clarification Inbox | `/app/steward/clarifications` | `clarification_requests.csv` filtered by `steward_id` |
| Clarification Detail | `/app/steward/clarifications/:requestId` | one row of `clarification_requests.csv` |
| CNMC Search | `/app/steward/mappings` | `cnmc_registry.csv` |
| National Material Passport view | `/app/steward/mappings/:cnmcCode` | `national_material_passports.csv` + `cnmc_registry.csv` |
| New Code Request form | `/app/steward/new-request` | `cpse_master.csv` (category list) |
| Duplicate Check Result | `/app/steward/new-request/check` | `duplicate_prevention_check_match_found.json` / `duplicate_prevention_check_no_match.json` |

## Technical Reviewer — `/app/reviewer/*`

| Screen | Route | Reads |
|---|---|---|
| Reviewer Dashboard | `/app/reviewer/dashboard` | `dashboard_stats_reviewer.json` |
| Pending Match Queue | `/app/reviewer/queue` | `match_results.csv` where `status == "Pending"` |
| Match Detail | `/app/reviewer/queue/:groupId` | one row of `match_results.csv`; on approve, related row of `cnmc_registry.csv` + `national_material_passports.csv` |
| Clarification Request form | `/app/reviewer/queue/:groupId/clarify` | writes to local state, mirrors `clarification_requests.csv` shape |
| Clarification Tracker | `/app/reviewer/clarifications` | `clarification_requests.csv` filtered by `reviewer_id` |

## National Admin — `/app/admin/*`

| Screen | Route | Reads |
|---|---|---|
| Admin Dashboard | `/app/admin/dashboard` | `dashboard_stats_admin.json` |
| CPSE Management | `/app/admin/cpses` | `cpse_master.csv` |
| Categories & Templates | `/app/admin/categories` | static list (define inline; no CSV needed) |
| Trust Score Thresholds | `/app/admin/thresholds` | local state only |
| CNMC Registry Management | `/app/admin/registry` | `cnmc_registry.csv` |
| National Analytics | `/app/admin/analytics` | `dashboard_stats_admin.json` |
| Audit Log | `/app/admin/audit` | `audit_logs.csv` |
| Dispute Resolution | `/app/admin/disputes` | `match_results.csv` where `status == "Rejected"` (treated as disputes for demo purposes) |
| Dispute Detail | `/app/admin/disputes/:groupId` | one row of `match_results.csv` |

## Navigation Structure

- Left sidebar, fixed, role-scoped menu (do not show other roles' menu items
  even greyed out — keep it clean per the government-portal reference)
- Top header bar: Ministry/emblem-style branding left, "Signed in as ..."
  and logout right
- No bottom tab bar, no floating action buttons, no chat-style side panel —
  see `07-design-system.md`
