# PRAKALP — UI/UX Update Roadmap
### Phase-wise Plan for Structuring the Interface Update
Grounded in `PRAKALP-PROJECT-REFERENCE.md` (project source of truth) and GIGW 3.0
(Guidelines for Indian Government Websites and Apps, NIC/MeitY)

---

## 0. How This Document Works

This roadmap breaks the UI/UX update into **4 phases**. Each phase has:

- **Objective** — what the phase accomplishes.
- **Scope** — exact screens/components touched (using the routes and file paths already defined in
  `PRAKALP-PROJECT-REFERENCE.md` Sections 6 and 10).
- **Non-negotiable rules** — pulled directly from the reference doc's Section 4 (Design Philosophy), Section 9
  (Component Conventions), Section 11 (Design Tokens) and Section 12 (Change Guidelines). These are restated in
  each phase deliberately, so no phase can silently drift from them.
- **Compliance alignment** — how the phase's output maps to GIGW 3.0's four domains (Quality, Accessibility,
  Cybersecurity, Lifecycle Management), so the interface direction stays consistent with how a real government
  portal would eventually be evaluated — without claiming certification the prototype doesn't have.
- **Exit criteria** — what must be true before moving to the next phase.
- **Build Prompt** — a ready-to-paste instruction block for an AI coding assistant working directly in the
  repository, written against the actual file structure in Section 10.

Work through the phases in order. Do not start Phase 2 styling work until Phase 1's token/pattern audit is
closed — every later phase inherits Phase 1's decisions.

---

## Phase 1 — Foundation Audit & Design-System Lock

### Objective
Freeze the design system before touching individual screens. Confirm every token, banned pattern, and
required pattern from the reference doc is actually enforced in `global.css` and shared components, and close
any drift that already exists. Establish the accessibility and content baseline every later phase will build
on.

### Scope
- `src/styles/global.css` (Section 11 tokens)
- `src/components/AppShell.tsx`, `SharedUI.tsx`, `AshokaCrest.tsx`
- The 3-row navigation structure (utility bar → masthead → horizontal nav)
- Footer / policy-page shell (Accessibility Statement, Privacy Policy, Terms and Conditions, Sitemap, Help)
- Skip-to-content link, landmark regions, focus-visible styles

### Non-negotiable rules (carried from the reference doc)
- No purple, pink, gradients, glassmorphism, or SaaS-blue (`#4F46E5`-style) — Section 4.2, Section 12.
- Border radius stays at 2–4px on cards/tables/buttons; only user avatars are circular (50%) — Section 4.3,
  Section 12.
- Status badges remain rectangular, never pill-shaped — Section 4.3, Section 9.
- Navigation stays a 3-row horizontal structure; do not collapse into a sidebar — Section 4.4, Section 12.
- Reference IDs (`VAL-`, `DPC-`, `LOG-`, `CNMC-`, `PASS-`, `CLR-`) render in monospace everywhere — Section
  4.3, Section 11 (Typography).
- No copy containing "AI", "smart", "intelligent", "powered by", "assistant" — Section 4.2.
- Icon library stays Lucide React exclusively — Section 12.

### Compliance alignment (GIGW 3.0)
- **Accessibility domain:** confirm skip-links, landmark regions (`header`, `nav`, `main`, `footer`), visible
  keyboard focus states, and color-independent status communication are present at the shell level — the
  baseline WCAG 2.1 AA expects, before any individual screen is touched.
- **Quality domain:** confirm one canonical page-title pattern, consistent heading hierarchy (one H1 per
  page), and a working Sitemap route.
- **Lifecycle Management domain:** confirm every policy footer page (Accessibility Statement, Privacy Policy,
  Terms and Conditions, Copyright Policy, Hyperlink Policy) exists with a "last updated" date, even if content
  is placeholder-marked as demonstration content.

### Exit criteria
- `global.css` tokens match Section 11 exactly; no undocumented color values exist anywhere in `src/`.
- Every route in Section 6 resolves to a page using `AppShell` with the 3-row nav intact.
- Skip-to-content link and focus-visible outline are present and keyboard-tested on at least 3 representative
  pages (Login, a Dashboard, a data table page).
- All 6 footer policy pages exist and render inside the standard shell.

### Build Prompt (Phase 1)
```
You are updating the PRAKALP React SPA prototype. Do not change functionality, only audit and correct the
design-system layer.

1. Open src/styles/global.css and list every color value used anywhere in src/. Flag any hex value not in
   this exact token set: --gov-navy #111111, --gov-navy-dark #000000, --gov-maroon #C0001A,
   --gov-green #166534, --gov-green-light #f0fdf4, --gov-saffron #D97706, --gov-amber #92400E,
   --gov-grey-badge #6B7280, --gov-bg #F5F5F5, --gov-surface #FFFFFF, --gov-border #CCCCCC,
   --gov-text-primary #111111, --gov-text-secondary #555555. Replace any non-token color with the nearest
   correct token — do not introduce a new color.
2. Audit AppShell.tsx: confirm the 3-row structure (utility bar #111111 strip, masthead, horizontal nav bar)
   is intact and has not been collapsed into a sidebar. Confirm a mobile hamburger exists for the nav row only.
3. Confirm border-radius is 2-4px on .card, .btn, .status-badge, and table elements, and exactly 50% only on
   user avatar circles. Fix any pill-shaped button or badge.
4. Add (if missing): a skip-to-content link as the first focusable element on every page, semantic
   <header>/<nav>/<main>/<footer> landmarks in AppShell, and a visible :focus-visible outline style using
   --gov-navy on all interactive elements.
5. Confirm all reference IDs (VAL-, DPC-, LOG-, CNMC-, PASS-, CLR- prefixed strings) render in the monospace
   font token, not the body font, wherever they appear.
6. Scan all copy strings in src/pages and src/components for "AI", "smart", "intelligent", "powered by",
   "assistant" (case-insensitive) and report every match — do not auto-rewrite without listing them first.
7. Confirm all 6 footer policy pages exist (Accessibility Statement, Privacy Policy, Terms and Conditions,
   Copyright Policy, Hyperlink Policy, Sitemap) using the standard AppShell and a single-column document
   layout with a "last updated" date field.

Report findings as a checklist before making any file changes.
```

---

## Phase 2 — Core Data-Entry & Review Workflows

### Objective
Bring the CPSE Data Steward and Technical Reviewer flows (the highest-frequency screens) into full alignment
with the locked design system from Phase 1 — this is where most users spend their time, so it carries the
heaviest UX weight.

### Scope (from Section 6)
- Steward: Dashboard, Data Onboarding, Field Mapping/Preview, Quality Alerts List + Detail, Clarification
  Inbox + Detail, CNMC Search, New Code Request, Duplicate Check Result
- Reviewer: Dashboard, Pending Match Queue, Match Detail, Clarification Request Form, Clarification Tracker
- Components in scope: `TrustScoreGauge`, `StatusBadge`, `SummaryStatCard`, `RecordComparisonTable`

### Non-negotiable rules (carried from the reference doc)
- `TrustScoreGauge` always prints the numeric value alongside the visual bar; label reads "Match Trust Score,"
  never "AI confidence" — Section 9.
- `RecordComparisonTable` differences are shown bold/underlined, never red/green coloring — Section 9.
- `SummaryStatCard` stays a flat card: thin 1px border, no drop shadow, no gradient — Section 9.
- Record lists render as dense data tables, not card grids — Section 4.3, Section 9 (AuditTrailTable pattern
  applies to any list-style screen).
- Forms use labeled field groups with asterisks on required fields — Section 4.3.
- Every write action (resolve alert, submit clarification, approve/reject match) shows a toast with a
  reference ID and does not persist beyond the session — Section 2, Section 7.

### Compliance alignment (GIGW 3.0)
- **Accessibility domain:** every form field has a visible `<label>`, inline validation messages are announced
  (not color-only), and error summaries appear at the top of forms on submit failure — this is the block of
  WCAG 2.1 AA criteria GIGW 3.0 weights most heavily for transactional government forms.
- **Quality domain:** consistent field ordering and terminology across Onboarding, Alert Detail, and
  Clarification forms, so a Steward moving between screens isn't relearning a pattern each time.
- **Cybersecurity domain (presentation only):** session-expiry and re-authentication messaging patterns should
  be visually defined now, even though session logic itself is prototype-level, so Phase 4 doesn't have to
  retrofit them.

### Exit criteria
- All Steward and Reviewer screens use only components audited in Phase 1.
- Every form in this phase has: labeled fields, required-field asterisks, an error summary pattern, and a
  toast-with-reference-ID on successful submit.
- `TrustScoreGauge` and `RecordComparisonTable` conventions verified on every screen that uses them (Match
  Detail, Duplicate Check Result).
- Keyboard-only walkthrough completed for: Data Onboarding → Field Mapping → Confirm, and Pending Match Queue
  → Match Detail → Approve/Reject/Clarify.

### Build Prompt (Phase 2)
```
Working inside the PRAKALP repository, update the CPSE Data Steward and Technical Reviewer screens only.
Follow the tokens and patterns already locked in Phase 1 — do not introduce new colors, radii, or icons.

1. StewardDashboardPage, ReviewerDashboardPage: rebuild summary cards using the SummaryStatCard pattern
   (flat, 1px border, no shadow, no gradient) sourced from dashboard_stats_steward.json /
   dashboard_stats_reviewer.json. Each card must show number + short label + link to the relevant screen.
2. DataOnboardingPage + FieldMappingPage: implement as a labeled stepper (Select CPSE → Select Dataset →
   Validate → Field Mapping → Confirm). All fields need visible labels and asterisks for required fields.
   On validation failure, render an error summary block above the form listing every field_errors[] entry
   from validation_result_failure.json, each linking to its field.
3. QualityAlertsPage + QualityAlertDetailPage, ClarificationsInboxPage + ClarificationDetailPage: render as
   dense tables (not cards) with StatusBadge (rectangular) for status. Detail pages use the same field-group
   form pattern as Onboarding.
4. PendingMatchQueuePage + MatchDetailPage: implement TrustScoreGauge showing the printed numeric value plus
   the bar, labeled "Match Trust Score." Implement RecordComparisonTable as a two-column side-by-side layout
   with differing values shown bold/underlined, not colored. Wire Approve/Reject/Clarify to local state only,
   each producing a toast with a DPC- or CLR- reference ID and removing the row from the queue.
5. CnmcSearchPage, NewCodeRequestPage, DuplicateCheckResultPage: dense searchable/filterable tables, filter
   chips for applied filters, empty-state and loading-state variants for each table.

Every write action must show a confirmation step before submission and a toast with a reference ID after.
Do not persist any write beyond the current session — refresh must reset to static baseline, per project rule.
```

---

## Phase 3 — Registry, Passport & Governance Screens

### Objective
Bring the national-level, registry-facing screens — the ones that represent the platform's authority and
record-of-truth — to the same standard, with particular attention to document-like presentation since these
are the screens most likely to be shown to Ministry-level or audit stakeholders.

### Scope (from Section 6)
- National Material Passport (Steward and Admin views)
- CNMC Registry Management, National Analytics, Audit Log
- CPSE Management, Categories & Templates, Trust Score Thresholds
- Dispute Resolution + Dispute Detail
- Components: `PassportCard`, `AuditTrailTable`

### Non-negotiable rules (carried from the reference doc)
- `PassportCard` is document/certificate-styled: bordered, header strip with the CNMC code prominent in
  monospace; "Download" and "Send to ERP" actions trigger a toast only, never a real file/network operation —
  Section 9, Section 2.
- `AuditTrailTable` is a dense table, never a card grid; `hash_chain` shows truncated with a "view full"
  expand, monospace font — Section 9.
- Analytics/charts present real static aggregates only — no fake live-update indicators, no animated counters
  — Section 4 governing philosophy carried over from the platform's static-data rule.
- Admin write actions (CPSE add/edit, threshold changes, dispute override) are local-state only and clearly
  labeled as such — Section 7 (Flow 3), Section 2.

### Compliance alignment (GIGW 3.0)
- **Quality domain:** registry and passport screens should read as authoritative reference documents —
  consistent metadata (last reviewed date, source dataset, governance decision reference) on every record,
  the same discipline GIGW expects of any government record-of-truth page.
- **Cybersecurity domain (presentation only):** Audit Log and hash-chain display should visually communicate
  tamper-evidence without overstating it — label it clearly as prototype/demonstration audit data, not a
  production-grade cryptographic audit trail, so the interface never implies a security guarantee the build
  doesn't have.
- **Lifecycle Management domain:** Categories & Templates and Trust Score Thresholds screens should visually
  separate "current configuration" from "pending change," since GIGW expects clear versioning/change-tracking
  presentation on governance-configuration screens.

### Exit criteria
- Every Passport view (Steward and Admin) uses the identical `PassportCard` component — no divergent styling
  between the two role contexts.
- Audit Log table is keyboard-navigable, sortable, and filterable; hash-chain expand/collapse is
  keyboard-operable.
- Admin-only write screens (CPSE Management, Thresholds, Disputes) are clearly marked as local-state changes
  in their confirmation dialogs.
- National Analytics screen contains no chart or indicator implying live/real-time computation.

### Build Prompt (Phase 3)
```
Working inside the PRAKALP repository, update the National Material Passport, Registry, Analytics, Audit Log,
and Admin-management screens only. Reuse the tokens and component conventions locked in Phases 1 and 2.

1. NationalMaterialPassportPage (both steward and admin routes): implement PassportCard as a bordered,
   certificate-style panel with a header strip containing the CNMC code in monospace, prominent. "Download"
   and "Send to ERP" buttons must trigger a toast confirmation only — do not implement real file generation
   or network calls.
2. AuditLogPage: implement AuditTrailTable as a dense table (Timestamp, User, Role, Action, Material/CNMC
   Code, Reference ID columns), with hash_chain values truncated and an accessible "view full" expand toggle.
   Add filters for date range, role, and action type. Add a visible note that this reflects the available
   platform dataset, not a production audit trail.
3. CnmcRegistryManagementPage, NationalAnalyticsPage: build from cnmc_registry.csv and
   dashboard_stats_admin.json only. Charts must be static renderings of the JSON values — no animation, no
   auto-refresh, no live-update styling.
4. CpseManagementPage, CategoriesPage, TrustScoreThresholdsPage: implement as list + add/edit forms writing
   to local state only. Every save action must show a confirmation dialog stating the change is local-session
   only, then a toast with a reference ID (e.g. CFG-2026-#####).
5. DisputeResolutionPage + DisputeDetailPage: dense table listing match_results.csv rows with status=Rejected;
   Detail page shows the full RecordComparisonTable pattern from Phase 2 plus an "Override Decision" action
   requiring a confirmation dialog and comment field before producing a toast + reference ID.

Keep StatusBadge rectangular and token-colored throughout; do not introduce any new visual pattern not already
defined in Sections 9 and 11 of the project reference document.
```

---

## Phase 4 — Cross-Cutting Accessibility, Responsiveness & Compliance Hardening

### Objective
Close the loop across the entire application: verify every screen built in Phases 1–3 against a single
consistent accessibility, responsiveness, and content-completeness checklist, so the finished interface reads
as one coherent government platform rather than three independently built role sections.

### Scope
All screens listed in Section 6, plus the footer policy pages from Phase 1, tested as a whole.

### Non-negotiable rules (carried from the reference doc)
- Status is never communicated by color alone anywhere in the app — Section 4, Section 9 (`TrustScoreGauge`,
  `StatusBadge` rules apply platform-wide).
- Mobile hamburger collapse of the horizontal nav is the only permitted responsive change to navigation — the
  3-row structure itself does not change shape — Section 4.4, Section 12.
- No screen implies session persistence beyond the current browser session — Section 2.
- No screen implies a real backend write, real file upload/parsing, or real SSO — Section 2.

### Compliance alignment (GIGW 3.0)
- **Accessibility domain (full pass):** WCAG 2.1 AA checks across every screen — keyboard operability, focus
  order, form labels, error identification, text resizing without loss of content, color contrast on all
  token combinations, and non-color status communication. This is the closest the prototype can responsibly
  get to "audit-ready" without an actual STQC engagement.
- **Quality domain:** page-title uniqueness per route, consistent heading hierarchy audit across all 20+
  screens, descriptive link text (no bare "click here").
- **Cybersecurity domain (presentation only):** confirm no screen makes an unsupported security claim (no
  fake certificates, no "STQC certified" badge, no "government audited" language) anywhere in copy.
- **Lifecycle Management domain:** confirm every static dataset referenced in the UI is labeled where it
  appears (e.g. "Static dataset" tags on dashboard cards), and that all reference-ID prefixes match Section 8
  exactly across every screen that generates one.

### Exit criteria
- A full keyboard-only pass (no mouse) completes every user flow in Section 7 without a dead end.
- A full screen-reader spot-check (at least Dashboard, one form, one data table, one modal) passes without
  unlabeled or ambiguous elements.
- Responsive check at 3 breakpoints (desktop, tablet, mobile) confirms tables scroll horizontally with
  headers intact, and the nav collapses to the hamburger drawer without layout breakage.
- A final content audit confirms zero instances of banned copy ("AI", "smart", "intelligent," "powered by,"
  "assistant," unsupported certification claims) across the entire `src/pages` and `src/components` tree.

### Build Prompt (Phase 4)
```
Perform a full cross-cutting QA and hardening pass across the entire PRAKALP application. Do not add new
screens or features — only verify and correct against the following checklist, screen by screen, using the
route list in Section 6 of PRAKALP-PROJECT-REFERENCE.md as your checklist source.

1. Keyboard-only pass: tab through every screen in each of the three user flows (Steward, Reviewer, Admin)
   defined in Section 7. Confirm every interactive element is reachable and operable via keyboard, focus
   order is logical, and modals return focus to the triggering element on close.
2. Screen-reader spot-check: verify Dashboard, one onboarding form, one data table screen, and one
   confirmation modal have correct landmark roles, labeled form controls, and announced status changes
   (e.g. toast messages) via appropriate ARIA live regions.
3. Responsive pass: test at desktop (1440px), tablet (768px), and mobile (375px) widths. Confirm the 3-row
   nav collapses to a hamburger drawer at mobile width without changing its structure at desktop/tablet width,
   and that every dense table scrolls horizontally with sticky headers rather than breaking layout.
4. Color-only status check: for every StatusBadge and TrustScoreGauge instance, confirm status is also
   communicated via text label or icon, not color alone.
5. Content audit: grep the full src/ tree for "AI", "smart", "intelligent", "powered by", "assistant",
   "certified", "STQC", "government audited", "live" (in reference to data). Report every match for manual
   review — do not claim any compliance certification the prototype has not received.
6. Reference-ID audit: confirm every generated reference ID across every screen matches the exact prefix
   table in Section 8 (VAL-, DPC-, LOG-, CNMC-CAT-, PASS-, CLR-) with no ad hoc or inconsistent prefixes.
7. Static-data labeling audit: confirm every dashboard card, report, and analytics view carries a visible
   "Static dataset" or "Pre-computed result" label where the project reference doc requires it.

Produce a single checklist report of pass/fail per item per screen before making any further code changes.
```

---

## Summary Table

| Phase | Focus | Primary GIGW Domain Alignment |
|---|---|---|
| 1 — Foundation Audit & Design-System Lock | Tokens, shell, navigation, footer, base accessibility | Quality, Accessibility, Lifecycle Management |
| 2 — Core Data-Entry & Review Workflows | Steward + Reviewer screens, forms, trust score, comparison tables | Accessibility, Quality, Cybersecurity (presentation) |
| 3 — Registry, Passport & Governance Screens | Passport, Registry, Analytics, Audit Log, Admin management | Quality, Cybersecurity (presentation), Lifecycle Management |
| 4 — Cross-Cutting Hardening | Full keyboard/screen-reader/responsive/content QA across all screens | Accessibility (full pass), Quality, Cybersecurity, Lifecycle Management |

---

## Note on Scope

This roadmap governs **UI/UX structure only**, against the existing PRAKALP frontend prototype described in
`PRAKALP-PROJECT-REFERENCE.md`. It does not introduce backend work, real authentication, real file parsing, or
any of the items explicitly excluded in that document's Section 2. References to GIGW 3.0, STQC certification,
S3WaaS, and MeghRaj hosting throughout this roadmap are **compliance-direction context** for how a production
version of this platform would eventually be evaluated — they are not claims that this prototype currently
holds any such certification or connects to any such infrastructure.
