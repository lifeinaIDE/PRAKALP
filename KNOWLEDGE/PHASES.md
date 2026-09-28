# PRAKALP — Build Phases & Progress

_Last Updated: 2026-09-23_

---

## Build Philosophy

The project is built incrementally using an AI coding assistant (Antigravity IDE). Each phase is small and independently completable with its own exit check before moving to the next phase.

---

## Phase 0 — Project Setup & Theme ✅ COMPLETE
- React + TypeScript + Vite scaffold
- Global CSS design system (`src/styles/global.css`)
- `AppShell.tsx` with sidebar, header, and content area
- Government-portal palette (Navy, Maroon, Green, Amber, White)
- Sharp corners, 1px borders, dense data tables, no glassmorphism

## Phase 1 — Data Layer & Mock API ✅ COMPLETE
- `src/api/mockApi.ts` with all functions
- `src/api/csvParser.ts` using PapaParse
- CSV + JSON static files in `public/CSV/` and `public/JSON/`
- Typed TypeScript interfaces for all entities

## Phase 2 — Login & Routing Shell ✅ COMPLETE
- `LoginPage.tsx` with email + password form
- `AuthContext.tsx` storing logged-in `User`
- Full route tree (`App.tsx`) with all role-gated routes
- `RequireAuth.tsx` enforcing role-based access
- `AppShell.tsx` sidebar navigation per role

## Phase 3 — CPSE Data Steward Portal ✅ COMPLETE
- `StewardDashboardPage` — stats cards + quick links
- `DataOnboardingPage` — multi-step upload simulation
- `FieldMappingPage` — column mapping interface
- `QualityAlertsPage` + `QualityAlertDetailPage`
- `ClarificationsInboxPage` + `ClarificationDetailPage`
- `CnmcSearchPage` — CNMC registry search
- `NationalMaterialPassportPage` — PassportCard display
- `NewCodeRequestPage` — duplicate prevention gate

## Phase 4 — Technical Reviewer Portal ✅ COMPLETE
- `ReviewerDashboardPage` — pending queue summary
- `PendingMatchQueuePage` — sortable/filterable match queue
- `MatchDetailPage` — full match review: trust score, side-by-side comparison, Why/WhyNot panels, approve/reject actions
- `ClarificationRequestFormPage` — raise clarification form
- `ClarificationTrackerPage` — track sent clarifications

## Phase 5 — National Admin Portal ✅ COMPLETE
- `AdminDashboardPage` — system health summary
- `CpseManagementPage` — add/edit/view CPSEs
- `CategoriesPage` — manage material categories
- `TrustScoreThresholdsPage` — configure thresholds
- `CnmcRegistryManagementPage` — view full CNMC registry
- `NationalAnalyticsPage` — cross-CPSE analytics charts
- `AuditLogPage` — full audit trail table
- `DisputeResolutionPage` + `DisputeDetailPage`

## Phase 6 — UI/UX Refinement ✅ COMPLETE
- Unified design system applied across all pages
- Government design principles enforced (no SaaS look)
- Shared component library consolidated in `SharedUI.tsx`
- `TrustScoreGauge`, `PassportCard`, `AuditTrailTable`, `RecordComparisonTable` implemented
- GIGW 3.0 accessibility: ARIA, keyboard navigation, skip links, screen reader announcements

## Phase 7 — Cleanup & Hardening ✅ COMPLETE
- Removed all "Demo Purpose", "prototype", "static data" notices
- Removed `DemoNotice` component from policy pages
- Removed `SecurityBadgeStrip` (AES/SHA/GoI badges) from all pages
- Removed hash/encryption audit trail displays; replaced with IP tracking
- Fixed TypeScript type errors from cleanup (added `category?` to `CnmcRegistry` interface)
- `PassportCard` "Download Mapping" now generates a real CSV file on click

## Phase 8 — CNMC Code Generation ✅ COMPLETE
- Analyzed `cnmc_generation_rules.csv` (146 rules, 16-digit code structure)
- Looked up real UNSPSC codes for all 30 material items
- Wrote `scratch/generate_cnmc_codes.js` to generate valid codes with Luhn checksum
- Updated `cnmc_registry.csv` and `national_material_passports.csv` in both `CSV/` and `public/CSV/`
- All cross-references (functional_equivalents) updated consistently

## Phase 9 — View / Passport Routing Fix ✅ COMPLETE
- Fixed: Admin "View →" button was routing to steward path (role guard blocked)
- Fixed: `getPassport()` returned `{ registry }` but page expected `{ cnmc }`
- Fixed: Functional equivalents link in `PassportCard` now uses correct path per role

---

## Pending / Future Work

| Item | Priority | Status |
|---|---|---|
| Export full registry as Excel (XLSX) | Medium | Not started |
| Print-optimized CSS for Passport | Low | Not started |
| Mobile responsive layout | Low | Not started |
| Add more CPSE raw material data (beyond 71 rows) | Medium | Not started |
| Add more match pairs to queue | Low | Not started |
| Policy pages (Accessibility, Privacy, etc.) | ✅ Done | Complete |
