# phases.md — Sequential Build Prompts for Antigravity

## Why this file exists

Antigravity will error out or produce broken/half-wired code if given the
entire PRAKALP spec at once. This file breaks the build into small,
independently-completable phases. **Feed Antigravity ONE phase at a time.**
Wait for it to finish and confirm the phase's "Exit Check" before starting
the next phase. Do not paste multiple phases into one prompt.

Folder structure referenced throughout:
```
/DOCS/   → all 10 .md spec files (00-overview.md ... 09-build-plan.md)
/CSV/    → 9 CSV files (raw_material_data.csv, users.csv, etc.)
/JSON/   → 8 JSON files (dashboard_stats_*.json, validation_result_*.json, etc.)
```

At the start of **every** phase prompt, tell Antigravity to read:
`/DOCS/00-overview.md` and `/DOCS/07-design-system.md` — these two set the
"no real backend, no AI-product look" ground rules and should stay loaded
in context for the whole build, every phase.

---

## Phase 0 — Project Setup & Theme

**Give Antigravity:**
`/DOCS/00-overview.md`, `/DOCS/07-design-system.md`, `/DOCS/08-architecture.md`

**Ask for:**
- Project scaffold (React, routing library, folder structure)
- Global theme/design tokens from `07-design-system.md` (colors, typography,
  spacing) wired into a base stylesheet or theme config
- A placeholder App Shell: header bar (crest placeholder + platform name),
  empty left sidebar, content area
- Nothing functional yet — no routes, no data loading

**Exit check:** App builds and runs, shows the themed empty shell, matches
the government-portal palette (navy/maroon/white, sharp corners, no
gradients).

---

## Phase 1 — Data Layer & Mock API

**Give Antigravity:**
`/DOCS/04-data-model.md`, `/DOCS/05-mock-api-contract.md`, and the actual
files in `/CSV/` and `/JSON/`

**Ask for:**
- A `mockApi.ts` (or equivalent) module implementing every function listed
  in `05-mock-api-contract.md`, reading from `/CSV/` and `/JSON/` (update
  any `/mock_data/...` path mentioned in the docs to the real `/CSV/` and
  `/JSON/` folder paths)
- A CSV parser utility (client-side) — confirm which library it plans to
  use before generating a lot of code
- No UI yet — this phase is pure data-layer plumbing

**Exit check:** Can call each mock API function from a scratch/test
component and log correct parsed data to console for at least: `getUsers()`,
`getRawMaterialsByPlant("BHEL-HEEP")`, `getMatchQueue()`,
`getDashboardStats("admin")`.

---

## Phase 2 — Login & Routing Shell

**Give Antigravity:**
`/DOCS/01-roles-and-permissions.md`, `/DOCS/03-screens-and-navigation.md`

**Ask for:**
- Login screen (dummy SSO button → role picker, per
  `01-roles-and-permissions.md`)
- Full route tree from `03-screens-and-navigation.md` — route stubs are
  fine (each just renders a placeholder heading with the screen name for
  now), but every route must exist and be reachable through role-scoped
  sidebar navigation
- "Signed in as ..." header strip wired to the logged-in user

**Exit check:** Can log in as each of the 3 roles and see that role's
correct sidebar menu and navigate to every stub screen without a 404 or
crash.

---

## Phase 3 — Shared Components

**Give Antigravity:**
`/DOCS/06-ui-components.md`, `/DOCS/07-design-system.md`

**Ask for:**
- Every component listed in `06-ui-components.md`, built in isolation
  (a simple demo/storybook-style page showing each one with sample props
  is fine, or just build them ready to be dropped into screens next)
- `TrustScoreGauge`, `WhyWhyNotPanel`, `PassportCard`, `QualityAlertBadge`,
  `AuditTrailTable`, `StatusBadge`, `SummaryStatCard`, `PlantSelector`,
  `RecordComparisonTable`, `SecurityBadgeStrip`, `FieldErrorList`

**Exit check:** Every component renders correctly with sample data and
matches the design system (no pill shapes, no shadows-as-decoration, status
colors match the table in `07-design-system.md`).

---

## Phase 4 — Steward Flow, Part A (Dashboard + Onboarding)

**Give Antigravity:**
`/DOCS/02-user-flows.md` (Flow 1, steps 1–5b only), relevant rows of
`/DOCS/03-screens-and-navigation.md`

**Ask for:**
- Steward Dashboard wired to `dashboard_stats_steward.json`
- Data Onboarding screen: plant selector, sample selection, validation
  trigger → shows `validation_result_success.json` or
  `validation_result_failure.json` per the trigger rules in
  `/DOCS/../demo_scenario_map.json` (in `/JSON/`)
- Field Mapping/Preview screen for the success path
- Correction form for the failure path

**Exit check:** Can walk both the success and failure validation paths
end-to-end using the two seeded sample triggers.

---

## Phase 5 — Steward Flow, Part B (Alerts, Clarifications, Mappings, New Request)

**Give Antigravity:**
`/DOCS/02-user-flows.md` (Flow 1, steps 6–10b)

**Ask for:**
- Quality Alerts list + Correct/Enrich form
- Clarification Inbox + Detail
- CNMC Search + National Material Passport view (`PassportCard`)
- New Code Request form + Duplicate Prevention Gate result screen

**Exit check:** Full Flow 1 in `02-user-flows.md` is walkable end-to-end,
start to finish, as one continuous demo.

---

## Phase 6 — Reviewer Flow

**Give Antigravity:**
`/DOCS/02-user-flows.md` (Flow 2, all steps)

**Ask for:**
- Reviewer Dashboard wired to `dashboard_stats_reviewer.json`
- Pending Match Queue table
- Match Detail screen: `RecordComparisonTable`, `TrustScoreGauge`,
  `WhyWhyNotPanel`, Approve/Reject actions with confirmation modals
- Clarification Request send + Clarification Tracker screen

**Exit check:** Can open the high-trust match (`MG-0001`) and approve it
(see the corresponding CNMC/Passport appear as "generated"), and can open
the lowest-trust match and reject it. Both actions remove the item from the
pending queue.

---

## Phase 7 — Admin Flow

**Give Antigravity:**
`/DOCS/02-user-flows.md` (Flow 3, all steps)

**Ask for:**
- Admin Dashboard wired to `dashboard_stats_admin.json` (summary cards +
  charts: records by plant, data quality by plant, migration progress)
- CPSE Management table
- Categories & Templates screen (static list)
- Trust Score Thresholds screen (local state only)
- CNMC Registry Management table
- National Analytics screen (expanded charts)
- Audit Log table with filters
- Dispute Resolution list + detail + override action

**Exit check:** Full Flow 3 walkable end-to-end. All three roles (Steward,
Reviewer, Admin) are now fully demoable independently.

---

## Phase 8 — Polish & Demo Safety

**Give Antigravity:**
`/DOCS/07-design-system.md`, `/DOCS/09-build-plan.md` (Milestone 4 section)

**Ask for:**
- `SecurityBadgeStrip` and reference-number surfacing applied consistently
  across every screen
- Loading-state delays (300–600ms) on all simulated write actions
- A full copy pass removing any "AI," "smart," or casual language that
  crept in during earlier phases
- A check against `demo_scenario_map.json` — confirm every listed scenario
  still produces its expected result exactly

**Exit check:** Run all 3 flows back-to-back without stopping. Nothing
looks instantaneous/fake, nothing uses AI-product language or styling,
every action produces a visible reference ID.

---

## Rules to repeat to Antigravity in every phase

- No real backend, no database, no real network calls beyond loading local
  `/CSV/` and `/JSON/` files.
- No AI-product styling or language — government portal look only, per
  `07-design-system.md`.
- If a phase seems to require real computation (matching, scoring,
  validation logic), the fix is always "read the pre-computed answer from
  `/CSV/` or `/JSON/`," never "write the logic."
- Do not start the next phase's screens/features early, even if it seems
  efficient — finish and verify the current phase first.
