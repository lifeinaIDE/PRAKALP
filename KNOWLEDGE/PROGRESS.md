# PRAKALP — Progress Log

_Last Updated: 2026-09-23_

> Running log of all significant changes made to the project. Updated after each major session.

---

## 2026-09-23 — KNOWLEDGE Folder Created
- Created `KNOWLEDGE/` folder with 12 structured documentation files
- Files: PRD, ARCHITECTURE, DATA_MODEL, API_SPEC, MATCHING_ENGINE, AUTH_SECURITY, INGESTION, PHASES, PROMPTS, PROGRESS, SKILL, DESIGN

## 2026-09-23 — CNMC Code Generation (16-Digit Formal Codes)
- Wrote `scratch/generate_cnmc_codes.js` Node.js script
- Mapped all 30 materials to real UNSPSC 8-digit codes
- Applied Material Grade, Macro Size Band, Fine Subdivision, Pressure Rating, UOM Category, Sequential ID, Luhn Checksum rules
- Updated `cnmc_registry.csv` and `national_material_passports.csv` in both `CSV/` and `public/CSV/`
- Old placeholder codes (`CNMC-BRG-00001`) replaced with formal 16-digit codes (e.g., `3117150400000110`)

## 2026-09-23 — Material Passport Routing Fix
- Fixed: Admin "View →" in `CnmcRegistryManagementPage.tsx` was routing to `/app/steward/mappings/...`
- Fixed: Admin role guard prevented access; updated to correct route `/app/admin/registry/...`
- Fixed: `getPassport()` in `mockApi.ts` was returning `{ registry }` instead of `{ cnmc }` — caused "Passport not found" error
- Fixed: Functional equivalents link in `SharedUI.tsx` `PassportCard` now dynamically uses admin or steward base path

## 2026-09-15 — Download Mapping Button Made Functional
- `PassportCard` "Download Mapping (CSV/Excel)" button was showing a fake toast only
- Replaced with actual CSV file generation using `Blob` + `URL.createObjectURL`
- File downloads as `Material_Passport_[CNMC_CODE].csv` with all passport + registry fields
- Toast now shows "Download complete" with reference ID

## 2026-09-15 — Phase 4 Cleanup (Demo/Prototype Notices Removed)
- Removed `DemoNotice` component from all `PolicyPages.tsx`
- Removed `SecurityBadgeStrip` (AES-256/SHA-3/GoI compliance badges) from `AppShell.tsx`, `WelcomePage.tsx`, `ComponentsPreviewPage.tsx`
- Removed "Static dataset" badges from `StewardDashboardPage`, `ReviewerDashboardPage`, `NationalAnalyticsPage`, `CnmcRegistryManagementPage`
- Replaced crypto/hash audit trail columns with IP address tracking in `AuditTrailTable`
- Removed "prototype mode" labels from `DataOnboardingPage`, `LoginPage`
- Removed demo-credential hints from `LoginPage`
- Fixed TypeScript errors: added `category?` to `CnmcRegistry` interface

## 2026-09-01 — UI/UX Phase 3 Complete
- Applied government design system across all pages
- Sharp 3px-corner cards, 1px borders, navy/maroon/green/amber palette
- Dense data tables replacing card-grid layouts where appropriate
- Status badges using CSS class `status-badge` + color variants (green, maroon, amber, saffron, grey)
- `TrustScoreGauge` component: horizontal bar with numeric value + label
- `RecordComparisonTable`: side-by-side diff with bolded differing fields
- `WhyWhyNotPanel`: collapsible panels for match rationale

## 2026-09-01 — UI/UX Phase 2 Complete
- `AppShell.tsx`: full sidebar nav, role label, logout button, skip-to-content link
- `SharedUI.tsx`: `PassportCard`, `AuditTrailTable`, `QualityAlertBadge` components
- All forms: labeled inputs, ARIA attributes, keyboard navigation
- Screen reader live region (`#sr-announce`) wired in `AppShell`

## 2026-09-01 — Initial Build Complete (Phases 0–5)
- Project scaffold: React 18 + TypeScript + Vite
- All routes wired: steward, reviewer, admin portals
- `mockApi.ts` implementing all 20+ functions
- CSV + JSON static data files in `public/CSV/` and `public/JSON/`
- Full CPSE Data Steward, Technical Reviewer, National Admin portals
