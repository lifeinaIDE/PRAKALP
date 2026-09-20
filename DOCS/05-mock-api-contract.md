# 05 — Mock "API" Contract

**There is no backend.** Every "endpoint" below is a static file fetch (or an
in-memory filter/computation over an already-loaded static file). Do not
create an Express/FastAPI/Node server, do not create a database, do not add
real network calls beyond loading local static assets. If a screen needs data
not covered here, add a new static file to `/mock_data/` and document it —
never write logic to compute it live.

Implement this as a thin `mockApi.ts`-style module with functions that
`fetch()` the local JSON/CSV (parsed client-side) and return promises, so the
component code reads exactly like it would against a real API — that's what
sells the demo without any real backend risk.

| Function | "Method" | Reads | Used by |
|---|---|---|---|
| `getUsers()` | GET | `users.csv` | Login screen |
| `getCpseMaster()` | GET | `cpse_master.csv` | Onboarding plant dropdown, Admin CPSE screen |
| `getRawMaterialsByPlant(plantCode)` | GET | `raw_material_data.csv` filtered | Steward screens |
| `validateUpload(sampleId)` | POST (simulated) | `validation_result_success.json` or `validation_result_failure.json` per `demo_scenario_map.json` | Data Onboarding |
| `getAlertsForSteward(userId)` | GET | `data_quality_alerts.csv` filtered by `assigned_to` | Quality Alerts screen |
| `resolveAlert(alertId)` | PATCH (simulated) | updates local state only; no file write | Correct/Enrich form |
| `getClarificationsForSteward(userId)` | GET | `clarification_requests.csv` filtered by `steward_id` | Clarification Inbox |
| `getClarificationsForReviewer(userId)` | GET | `clarification_requests.csv` filtered by `reviewer_id` | Clarification Tracker |
| `respondToClarification(requestId, text)` | PATCH (simulated) | updates local state only | Clarification Detail |
| `searchCnmcRegistry(query)` | GET | `cnmc_registry.csv` filtered client-side | CNMC Search |
| `getPassport(cnmcCode)` | GET | `national_material_passports.csv` + `cnmc_registry.csv` joined | Passport view |
| `checkDuplicate(description)` | POST (simulated) | `duplicate_prevention_check_match_found.json` or `_no_match.json` per `demo_scenario_map.json` | New Code Request |
| `getMatchQueue()` | GET | `match_results.csv` where `status == "Pending"` | Reviewer queue |
| `getMatchDetail(groupId)` | GET | one row of `match_results.csv` | Match Detail |
| `approveMatch(groupId)` | POST (simulated) | looks up related `cnmc_registry.csv` + `national_material_passports.csv` row; updates local state | Match Detail |
| `rejectMatch(groupId, reason)` | POST (simulated) | updates local state only | Match Detail |
| `sendClarificationRequest(groupId, stewardId, message)` | POST (simulated) | updates local state, mirrors clarification_requests.csv shape | Match Detail |
| `getDashboardStats(role)` | GET | `dashboard_stats_steward.json` / `_reviewer.json` / `_admin.json` | All dashboards |
| `getAuditLogs(filters)` | GET | `audit_logs.csv` filtered client-side | Audit Log screen |
| `getDisputes()` | GET | `match_results.csv` where `status == "Rejected"` | Dispute Resolution |

## Response Shape Notes

- All list-returning functions return the underlying CSV rows parsed to JSON
  objects — keep field names identical to the CSV headers (see
  `04-data-model.md`) so components can bind directly without a remapping
  layer.
- All "simulated" write functions (`resolveAlert`, `respondToClarification`,
  `approveMatch`, `rejectMatch`, `sendClarificationRequest`) should:
  1. Resolve after a short artificial delay (300–600ms) so the UI shows a
     loading state — this reads as "processing," not as a static swap.
  2. Update an in-memory store (React context or a simple state manager) so
     the UI reflects the change for the rest of the session.
  3. Never actually persist anywhere. A page refresh resetting the demo data
     is expected and fine.

## Error States

Two error/failure states are already modeled as real data, not exceptions:
`validation_result_failure.json` and the `Rejected` / `Not a Match` rows in
`match_results.csv`. Do not build a generic error-handling framework beyond
what's needed to display these — this is a prototype, not a resilience demo.
