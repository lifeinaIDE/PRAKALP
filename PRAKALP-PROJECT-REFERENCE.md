# PRAKALP — Comprehensive Project Reference
**National Material Code Harmonization Platform**
Ministry of Heavy Industries, Government of India
SIH 2026 Prototype · Version 1.0

---

## Table of Contents

1. [Project Purpose](#1-project-purpose)
2. [What This Build Is (and Is NOT)](#2-what-this-build-is-and-is-not)
3. [Tech Stack & Architecture](#3-tech-stack--architecture)
4. [Design Philosophy & Visual Rules](#4-design-philosophy--visual-rules)
5. [User Roles & Demo Credentials](#5-user-roles--demo-credentials)
6. [All Screens & Routes](#6-all-screens--routes)
7. [User Flows](#7-user-flows)
8. [Data Model & Static Files](#8-data-model--static-files)
9. [UI Component Conventions](#9-ui-component-conventions)
10. [File Structure](#10-file-structure)
11. [Design System Tokens](#11-design-system-tokens)
12. [UI Change Guidelines](#12-ui-change-guidelines-for-handoff)

---

## 1. Project Purpose

**PRAKALP** solves the problem of material master fragmentation across Central Public Sector Enterprises (CPSEs) under the Ministry of Heavy Industries. Each CPSE — BHEL, NTPC, SAIL, IOCL, ONGC, BPCL — maintains its own local material master with proprietary codes and descriptions. The same physical object (e.g., a 6205 ZZ ball bearing) may appear under a dozen different codes across plants.

**PRAKALP's solution:** Assign every unique material a single **CNMC (Central National Material Code)** that maps back to all local equivalents, with a governed review process before any code is finalized. This eliminates duplicate procurement, enforces consistent specifications, and gives the Ministry national visibility into public-sector material holdings.

---

## 2. What This Build Is (and Is NOT)

This is a **prototype / demo** for Smart India Hackathon 2026. It demonstrates the workflow and UI — not real computation.

### What IS implemented
- Complete multi-role UI (Steward / Reviewer / Admin)
- All screens and navigation flows
- Data loaded from static CSV/JSON files
- Local state management for "writes" (approvals, resolves, etc.)
- Reference IDs on every action (VAL-, DPC-, LOG-, CNMC-, PASS-, CLR-)

### What is NOT implemented (by design)

| Explicitly Excluded | Why |
|---|---|
| Real NLP/matching logic | Pre-computed in static JSON |
| ML model / embeddings | Not needed; results are static |
| Real backend / database | No server; all client-side |
| Real SSO / OAuth | Login matches email to users.csv |
| Real SAP integration | "Production Mode" is a disabled UI element |
| File storage/parsing | Upload triggers a pre-canned response |
| Session persistence | Page refresh resets write-state to static baseline |

> **Rule:** If a feature seems to need real computation, the correct fix is always "add a static file with the pre-computed answer", never "write the logic."

---

## 3. Tech Stack & Architecture

```
Browser (React SPA - no server)
├── AuthContext (in-memory session)
├── React Router v6 (role-gated routes)
├── src/api/mockApi.ts  →  parseCsv() + fetchJson() + 300-600ms fake delay
└── /public/CSV/ + /public/JSON/  ← the only "database"
```

- **No backend.** No Node, no Python, no database.
- **Data layer:** `src/api/mockApi.ts` fetches CSV/JSON from `/public/` with a simulated 300-600ms network delay.
- **State:** React context + component state only. No localStorage persistence (by design).
- **Routing:** React Router v6 with role-based route guards in `App.tsx`.
- **Icons:** Lucide React exclusively — no other icon libraries.
- **CSS:** Vanilla CSS (`src/styles/global.css`) with CSS custom properties (no Tailwind, no CSS-in-JS).

---

## 4. Design Philosophy & Visual Rules

### 4.1 The Core Rule
This must look like an Indian government portal (GeM, DigiLocker, MCA21) — not an AI product or SaaS dashboard. A viewer seeing one screen with no other context should not be able to tell this involves any AI at all.

### 4.2 Explicitly BANNED Patterns
- Chat bubbles, "ask AI" boxes, streaming text
- Gradient backgrounds, glassmorphism, blurred/frosted panels
- Large rounded pill buttons or pill badges
- Decorative drop shadows (1px border is enough)
- Copy containing "AI", "smart", "intelligent", "powered by", "assistant"
- Emoji of any kind in the UI
- Circular confidence-ring gauges (fitness-app style)
- Playful illustrations, mascots, or empty-state cartoons
- Purple, pink, or SaaS blue (#4F46E5-style)

### 4.3 Required Patterns
- Dense data tables for all record lists
- Sharp corners (2-4px radius max) on cards, tables, buttons
- Horizontal rule dividers and bordered sections
- Official reference IDs on every action (VAL-, DPC-, LOG-, etc.)
- Monospace font for all reference IDs and codes
- Forms with labeled field groups, asterisks on required fields
- Circular icon avatars (user profile circles) — NOT square
- Status badges are rectangular, not pill-shaped

### 4.4 Navigation Structure
The app uses a 3-row horizontal top navigation (GeM portal style):

1. **Utility Bar** — #111111 strip: "भारत सरकार | Government of India | Ministry of Heavy Industries"
2. **Masthead** — White bar with PRAKALP logo/emblem left, "Signed in as..." + Logout right
3. **Horizontal Nav Bar** — #111111 bar with role-scoped nav links, mobile hamburger for small screens

---

## 5. User Roles & Demo Credentials

### Login Instructions
1. Go to http://localhost:5173/
2. Enter the email from the table below
3. Enter any password (e.g. Demo@2026) — password is not validated in the prototype
4. Click Sign In Securely

Shortcut: Click "Demo Credentials — Prototype Access" on the login page to auto-fill any credential.

### Role 1 — CPSE Data Steward
Plant-scoped materials officer. Sees only their own plant's data.

| Name | Email | Plant |
|---|---|---|
| Ravi Kumar Sharma | ravi.kumar.sharma@bhel.gov.in | BHEL-HEEP |
| Anjali Deshmukh | anjali.deshmukh@ntpc.gov.in | NTPC-TPS |
| Suresh Patnaik | suresh.patnaik@sail.gov.in | SAIL-RSP |
| Farhan Ahmed | farhan.ahmed@iocl.gov.in | IOCL-BR |
| Meera Iyer | meera.iyer@ongc.gov.in | ONGC-HZR |
| Vikram Nair | vikram.nair@bpcl.gov.in | BPCL-MR |

Can do: Upload material data, view/resolve quality alerts, respond to clarifications, search CNMC registry, submit new code requests.

### Role 2 — Technical Reviewer
National-level subject-matter reviewer. Not tied to a plant.

| Name | Email | Specialty |
|---|---|---|
| Dr. Priya Venkataraman | priya.venkataraman@samaan.gov.in | Bearings & Mechanical |
| Sanjeev Rathi | sanjeev.rathi@samaan.gov.in | Electrical & Cables |
| Kavita Reddy | kavita.reddy@samaan.gov.in | Valves & Piping |

Can do: Approve/reject material matches, send clarification requests to stewards, trigger CNMC generation.

### Role 3 — National Admin
Program-level administrator with full platform access.

| Name | Email |
|---|---|
| Ashok Bhalla | ashok.bhalla@samaan.gov.in |
| Neha Kapoor | neha.kapoor@samaan.gov.in |

Can do: Manage CPSEs, categories/thresholds, CNMC registry, national analytics, full audit trail, dispute resolution.

---

## 6. All Screens & Routes

### Shared
| Screen | Route | Data Source |
|---|---|---|
| Login | /login | users.csv |
| App Shell (nav + header) | Wraps /app/* | Logged-in user context |

### CPSE Data Steward — /app/steward/*
| Screen | Route | Data Source |
|---|---|---|
| Steward Dashboard | /app/steward/dashboard | dashboard_stats_steward.json |
| Data Onboarding | /app/steward/onboarding | cpse_master.csv + validation JSONs |
| Field Mapping / Preview | /app/steward/onboarding/mapping | Last validation result (in-memory) |
| Quality Alerts List | /app/steward/alerts | data_quality_alerts.csv (filtered by user) |
| Alert Detail / Correct Record | /app/steward/alerts/:alertId | data_quality_alerts.csv + raw_material_data.csv |
| Clarification Inbox | /app/steward/clarifications | clarification_requests.csv (filtered by user) |
| Clarification Detail | /app/steward/clarifications/:requestId | One row of clarification_requests.csv |
| CNMC Search | /app/steward/mappings | cnmc_registry.csv |
| National Material Passport | /app/steward/mappings/:cnmcCode | national_material_passports.csv + cnmc_registry.csv |
| New Code Request | /app/steward/new-request | cpse_master.csv (category list) |
| Duplicate Check Result | /app/steward/new-request/check | duplicate_prevention_check_*.json |

### Technical Reviewer — /app/reviewer/*
| Screen | Route | Data Source |
|---|---|---|
| Reviewer Dashboard | /app/reviewer/dashboard | dashboard_stats_reviewer.json |
| Pending Match Queue | /app/reviewer/queue | match_results.csv (status=Pending) |
| Match Detail | /app/reviewer/queue/:groupId | match_results.csv row + CNMC/passport |
| Clarification Request Form | /app/reviewer/queue/:groupId/clarify | Writes to local state |
| Clarification Tracker | /app/reviewer/clarifications | clarification_requests.csv (filtered) |

### National Admin — /app/admin/*
| Screen | Route | Data Source |
|---|---|---|
| Admin Dashboard | /app/admin/dashboard | dashboard_stats_admin.json |
| CPSE Management | /app/admin/cpses | cpse_master.csv |
| Categories & Templates | /app/admin/categories | Static inline data |
| Trust Score Thresholds | /app/admin/thresholds | Local state only |
| CNMC Registry Management | /app/admin/registry | cnmc_registry.csv |
| National Analytics | /app/admin/analytics | dashboard_stats_admin.json |
| Audit Log | /app/admin/audit | audit_logs.csv |
| Dispute Resolution | /app/admin/disputes | match_results.csv (status=Rejected) |
| Dispute Detail | /app/admin/disputes/:groupId | One row match_results.csv |
| National Material Passport (admin) | /app/admin/registry/:cnmcCode | national_material_passports.csv |

---

## 7. User Flows

### Flow 1 — CPSE Data Steward

Login → Steward Dashboard
- Upload Material Data: Data Onboarding → Validate → [pass] Field Mapping → Confirm → Dashboard; [fail] Error table → Correct → Resubmit
- Data Quality Alerts: Alerts List → Alert Detail → Save & Resubmit → status "Resolved" (local state)
- Clarification Inbox: Inbox → Detail → Submit Response → status "Resolved" (local state)
- Approved Mappings (CNMC Search): Search → Results → National Material Passport → Download/Send to ERP (toast only)
- New Material Request: New Code Request → Check for Duplicates → [match] Reuse CNMC (toast) OR Proceed + Justification → Send for Review; [no match] Proceed → Send for Review → toast

### Flow 2 — Technical Reviewer

Login → Reviewer Dashboard
- Pending Match Queue: Queue → Match Detail (side-by-side comparison + trust score)
  - Approve: CNMC Generated + Passport Created → toast → Queue (row removed)
  - Reject: Reason → confirm → toast → Queue (row removed)
  - Clarify: Clarification Request Form → Send → toast
- Clarification Tracker: View steward responses → "Return to Match Detail" when resolved

### Flow 3 — National Admin

Login → Admin Dashboard (summary cards + charts)
- Manage CPSEs: List → Add/Edit (local state)
- Manage Categories: Static list → Add/Edit (local state)
- Trust Score Thresholds: Slider → Save (local state, does not affect live matching)
- CNMC Registry: Searchable/filterable table
- National Analytics: Charts — duplicate trends, quality by CPSE, migration progress
- Audit Trail: Filterable log → hash chain preview
- Disputes: List → Detail → Override Decision → toast (local)

---

## 8. Data Model & Static Files

All static files live in /public/CSV/ and /public/JSON/.

### CSV Files

| File | Key Fields | Used By |
|---|---|---|
| users.csv | user_id, name, email, role, plant_code, designation, status | Login, auth |
| cpse_master.csv | plant_code, cpse_short_code, plant_name, sector, location, status | Onboarding, Admin |
| raw_material_data.csv | local_code, cpse_name, description, uom, specification, category, quality_score | Steward data |
| data_quality_alerts.csv | alert_id, local_code, alert_type, severity, status, assigned_to | Quality Alerts |
| match_results.csv | material_group_id, cpse_1_*, cpse_2_*, trust_score, why_match, why_not, status | Match Queue |
| cnmc_registry.csv | cnmc_code, canonical_description, category, uom, status | CNMC Search |
| clarification_requests.csv | request_id, reviewer_id, steward_id, message, response, status | Clarifications |
| national_material_passports.csv | passport_id, cnmc_code, canonical_description, legacy_codes, lifecycle_status | Passports |
| audit_logs.csv | log_id, timestamp, user_id, role, action, material_code, reference_id, hash_chain | Audit Trail |

### JSON Files

| File | Used By |
|---|---|
| dashboard_stats_steward.json | Steward Dashboard summary cards |
| dashboard_stats_reviewer.json | Reviewer Dashboard stats |
| dashboard_stats_admin.json | Admin Dashboard + Analytics charts |
| validation_result_success.json | Data Onboarding — canned pass result |
| validation_result_failure.json | Data Onboarding — canned fail result with field_errors[] |
| duplicate_prevention_check_match_found.json | New Code Request — duplicate found |
| duplicate_prevention_check_no_match.json | New Code Request — no duplicate |

### Reference ID Conventions

| Prefix | Context |
|---|---|
| VAL-YYYY-##### | Validation reference |
| DPC-YYYY-##### | Duplicate Prevention Check |
| LOG-#### | Audit log entry |
| CNMC-CAT-##### | National Material Code |
| PASS-##### | Passport ID |
| CLR-#### | Clarification request |

---

## 9. UI Component Conventions

### TrustScoreGauge
- Horizontal bar or semicircle with printed numeric value alongside
- >=85 = Green (Exact Match), 70-84 = Amber (Near-Duplicate), <70 = Red (Partial / No Match)
- Label: "Match Trust Score" — never "AI confidence"
- Always show the number — never rely on color alone

### StatusBadge
- Small rectangular badge (NOT pill-shaped)
- Colors: --gov-green (Approved/Active/Resolved), --gov-amber (Pending), --gov-maroon (Rejected/High), --gov-saffron (Medium), --gov-grey-badge (Low/Neutral)

### SummaryStatCard
- Large number + short label beneath
- Flat card, thin 1px border, no drop shadows, no gradient

### PassportCard
- Document/certificate style — bordered, header strip with CNMC code
- CNMC code in monospace, prominent
- Actions "Download" + "Send to ERP" trigger toast only

### RecordComparisonTable
- Two-column side-by-side (cpse_1_* vs cpse_2_*)
- Differing values: bold or underlined (NOT red/green coloring)
- Styled like a tender comparison table

### AuditTrailTable
- Dense table, NOT card grid
- Columns: Timestamp, User, Role, Action, Material/CNMC Code, Reference ID
- hash_chain shown truncated with "view full" expand; use monospace font

### User Avatars / Icons
- MUST be circular (border-radius: 50%), not square
- Lucide User icon inside, role-appropriate background tint

---

## 10. File Structure

```
PRAKALP/
├── PRAKALP-PROJECT-REFERENCE.md   (this file)
├── public/
│   ├── CSV/               All static CSV data files
│   └── JSON/              All static JSON data files
├── src/
│   ├── api/
│   │   ├── csvParser.ts   parseCsv() + fetchJson() utilities
│   │   └── mockApi.ts     All API functions (static file reads + simulated delay)
│   ├── components/
│   │   ├── AppShell.tsx   3-row horizontal nav layout wrapper
│   │   ├── AshokaCrest.tsx
│   │   └── SharedUI.tsx   SecurityBadgeStrip, TrustScoreGauge, etc.
│   ├── context/
│   │   └── AuthContext.tsx   login(), logout(), useAuth() hook
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── (Steward) StewardDashboardPage, DataOnboardingPage, FieldMappingPage
│   │   ├── (Steward) QualityAlertsPage, QualityAlertDetailPage
│   │   ├── (Steward) ClarificationsInboxPage, ClarificationDetailPage
│   │   ├── (Steward) CnmcSearchPage, NationalMaterialPassportPage, NewCodeRequestPage
│   │   ├── (Reviewer) ReviewerDashboardPage, PendingMatchQueuePage, MatchDetailPage
│   │   ├── (Reviewer) ClarificationRequestFormPage, ClarificationTrackerPage
│   │   └── (Admin) AdminDashboardPage, CpseManagementPage, CategoriesPage,
│   │               TrustScoreThresholdsPage, CnmcRegistryManagementPage,
│   │               NationalAnalyticsPage, AuditLogPage,
│   │               DisputeResolutionPage, DisputeDetailPage
│   ├── styles/
│   │   └── global.css     All CSS tokens + utility classes
│   ├── App.tsx            Route definitions + role guards
│   └── main.tsx
├── DOCS/                  Original source-of-truth documentation (11 files)
└── vite.config.ts
```

---

## 11. Design System Tokens

All defined in src/styles/global.css as CSS custom properties on :root.

### Color Tokens

| Token | Value | Use |
|---|---|---|
| --gov-navy | #111111 | Primary text, nav bars, buttons |
| --gov-navy-dark | #000000 | Hover/active states |
| --gov-maroon | #C0001A | Critical alerts, high severity, accent strip |
| --gov-green | #166534 | Success, approved, active |
| --gov-green-light | #f0fdf4 | Green tint backgrounds |
| --gov-saffron | #D97706 | Medium severity, warnings |
| --gov-amber | #92400E | Pending states |
| --gov-grey-badge | #6B7280 | Neutral, low severity |
| --gov-bg | #F5F5F5 | Page background |
| --gov-surface | #FFFFFF | Card/table backgrounds |
| --gov-border | #CCCCCC | All 1px borders |
| --gov-text-primary | #111111 | Body text |
| --gov-text-secondary | #555555 | Labels, meta text |

### Layout Tokens

| Token | Value | Use |
|---|---|---|
| --gov-navbar-height | 44px | Horizontal nav bar height |
| --gov-masthead-height | 76px | Masthead bar height |
| --gov-utility-height | 30px | Top utility strip height |
| --gov-top-total | 150px | Total fixed header height |
| --gov-radius | 3px | Default border radius |

### Typography
- Body: "Noto Sans", "Segoe UI", Arial, sans-serif
- Monospace (codes, IDs, hashes): "Roboto Mono", monospace
- Body text: 14-15px, high contrast, generous line-height

### Key Utility Classes

| Class | Description |
|---|---|
| .card | White surface, 1px border, 3px radius |
| .btn | Base button |
| .btn-primary | Black (#111111) button |
| .btn-secondary | White + border button |
| .status-badge | Rectangular status badge |
| .status-badge.green / .amber / .red / .black / .grey | Color variants |
| .spinner | CSS loading spinner |
| .info-box | Bordered info box |
| .info-box.error / .warning | Color variants |
| .app-layout | Top-nav layout wrapper |
| .utility-bar | Top Gov strip row |
| .masthead | Logo + user info row |
| .gov-navbar | Horizontal nav bar row |
| .page-content | Main content area below nav |

---

## 12. UI Change Guidelines (for Handoff)

Read this before making any UI changes to PRAKALP.

### Safe to Change
- Text sizes within body range (13px-16px)
- Spacing/padding (use multiples of 4px)
- Table column widths
- Card internal layout (field ordering, label placement)
- Adding new table columns or summary cards
- Hover state colors (darken ~10% from base)

### Change With Caution
- Color values: Only use tokens from Section 11. Do not introduce new colors.
- Border radius: Keep at 2-4px max. Only 50% for circular user avatars.
- Font weights: 400 (body), 600 (label/emphasis), 700 (heading). No 800+ outside wordmark.
- Navigation: 3-row structure is fixed. Do not collapse into a sidebar.
- Status badge shape: Must remain rectangular. Do not make pill-shaped.

### Do Not Change
- The color palette — no purple, pink, gradients, or SaaS blue
- Button border-radius beyond 3-4px
- Any AI/smart/intelligent copy in the UI
- The SecurityBadgeStrip placement or content
- Reference ID format — must be PREFIX-#### in monospace font
- Icon library — Lucide React only

### Adding a New Screen
1. Create src/pages/YourNewPage.tsx
2. Add route to App.tsx under the correct role path
3. Add nav link to AppShell.tsx in the matching role nav array: { to, label, icon }
4. Source data from an existing static file or add a new JSON to /public/JSON/
5. Do NOT add computation — encode behavior in the static file
6. Use SecurityBadgeStrip if it's a key governance screen

### Adding a Field to a Form
1. Add label + input pair using existing style pattern from other forms
2. Include * asterisk for required fields
3. Wire to local useState
4. On submit, show toast with a reference ID (e.g., CFG-2026-00045)
5. No persistence needed — in-memory only

### Modifying Navigation
- Nav items defined in AppShell.tsx: STEWARD_NAV, REVIEWER_NAV, ADMIN_NAV
- Each item: { to: '/app/role/path', label: 'Label', icon: LucideIcon size 14 }
- Keep labels to 20 chars max for horizontal nav
- Mobile hamburger collapse is automatic

---

## Quick Reference — Running Locally

```bash
# Recommended (avoids PowerShell execution policy issues)
cmd /c "npm run dev"

# Or in PowerShell:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev

# TypeScript check (should exit code 0)
npx tsc --noEmit
```

Local URL: http://localhost:5173/

Login: Email from Section 5 table + any password → auto-detects role → routes to correct dashboard.

---

Document generated: September 2026
PRAKALP SIH 2026 Prototype — Ministry of Heavy Industries, Government of India

