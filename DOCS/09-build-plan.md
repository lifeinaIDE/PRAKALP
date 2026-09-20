# 09 — Build Plan

Build in this order. Each milestone should be independently demoable, so
progress is visible even if later milestones run out of time before the
hackathon deadline.

## Milestone 0 — Foundation

- Project scaffold, routing structure per `03-screens-and-navigation.md`
- Load and parse all files in `/mock_data/` via the `mockApi.ts` module
  (`05-mock-api-contract.md`)
- Design tokens/theme from `07-design-system.md` wired into the base
  layout, App Shell (header, sidebar, "Signed in as" strip)
- Dummy login / role picker → routes to the correct dashboard shell

**Demo checkpoint:** can log in as any of the 3 roles and see an empty
but correctly-styled dashboard shell with real navigation.

## Milestone 1 — Steward Flow

- Steward Dashboard with real `dashboard_stats_steward.json` data
- Data Onboarding: plant selector, upload trigger, validation
  success/failure result display (`FieldErrorList`, `StatusBadge`)
- Quality Alerts list + Correct/Enrich form
- Clarification Inbox + Detail
- CNMC Search + Passport view (`PassportCard`)
- New Code Request + Duplicate Prevention Gate result

**Demo checkpoint:** full Flow 1 from `02-user-flows.md` walkable
end-to-end using the two seeded scenarios in `demo_scenario_map.json`.

## Milestone 2 — Reviewer Flow

- Reviewer Dashboard with `dashboard_stats_reviewer.json`
- Pending Match Queue table
- Match Detail: `RecordComparisonTable`, `TrustScoreGauge`,
  `WhyWhyNotPanel`, Approve/Reject actions
- Clarification Request send + Clarification Tracker

**Demo checkpoint:** full Flow 2 walkable — including approving the
high-trust match (MG-0001) and rejecting the mismatched pump/motor pair.

## Milestone 3 — Admin Flow

- Admin Dashboard with `dashboard_stats_admin.json` (charts: records by
  plant, data quality by plant, migration progress)
- CPSE Management table
- CNMC Registry Management table
- Trust Score Thresholds (static control, no real effect)
- Audit Log table (`AuditTrailTable`) with filters
- Dispute Resolution list + detail + override action

**Demo checkpoint:** full Flow 3 walkable, all three roles now complete
end-to-end.

## Milestone 4 — Polish & Demo Safety

- Apply `SecurityBadgeStrip` and reference-number surfacing consistently
  across every screen (per `07-design-system.md`)
- Confirm every action in `demo_scenario_map.json` produces exactly the
  expected result, in order, with no dependency on real typed input
  matching by accident — hardcode the trigger conditions if needed (e.g.
  a specific button/sample selector) rather than relying on fuzzy text
  matching in the demo
- Loading-state delays (300–600ms) added to all simulated write actions
  so nothing feels instantaneous/fake
- Full pass on copy: remove any accidental "AI," "smart," or casual
  language introduced during development
- Responsive check at demo resolution (confirm on the actual screen/
  projector size before presenting, not just desktop dev viewport)
- Dry run of all 3 flows back-to-back, timed

## Explicit Non-Milestones

Do not schedule time for: real backend, real auth, real file parsing,
real matching logic, persistence/database, automated testing infrastructure
beyond what's needed to catch obvious breakage. This is prototype scope —
see `00-overview.md` for the full non-goals list.
