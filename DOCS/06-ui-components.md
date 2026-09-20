# 06 — UI Components

Reusable components used across screens. Visual treatment follows
`07-design-system.md` — government-portal register, not SaaS/AI product
register: no gradients, no floating shadows-as-decoration, no rounded pill
badges that look like a chat app.

## TrustScoreGauge

- Input: `trust_score` (0–100)
- Renders as a **horizontal bar or semicircular gauge with a printed
  numeric value**, not an abstract circular "AI confidence" ring.
- Color bands: ≥85 → green (`Exact Match` territory), 70–84 → amber
  (`Near-Duplicate`), <70 → red (`Partial Match` / `Not a Match`).
- Always show the numeric score next to the gauge — never rely on color
  alone.
- Label it "Match Trust Score" (matches the brief's terminology exactly).

## WhyWhyNotPanel

- Two-column or two-stacked-block layout: "Why Matched" (`why_match`) and
  "Why Not Matched" (`why_not`).
- Plain paragraph text, not bullet-icon lists with checkmarks/crosses that
  read as a consumer app. A simple bordered box with a small header label
  per side is enough.
- If `why_not` is empty, show "No conflicting attributes identified."
  rather than hiding the box.

## PassportCard

- Used for `national_material_passports.csv` records.
- Fields shown: CNMC code (prominent, monospace-style), canonical
  description, standardized UOM/specs, lifecycle status (badge), legacy
  codes list, functional equivalents (link to another passport if present).
- Actions: "Download Mapping (CSV/Excel)", "Send to ERP" — both simulated,
  show a toast on click.
- Style as a document/certificate-like card (bordered, header strip with
  the CNMC code) rather than a product card.

## QualityAlertBadge

- Small inline badge showing `alert_type` + `severity`.
- Severity maps to color: High → red/maroon, Medium → amber, Low → grey/blue
  — consistent with the palette in `07-design-system.md`, not bright
  SaaS red/yellow/green.
- Used in the Quality Alerts list and inline on raw material rows.

## AuditTrailTable

- Dense table, not cards. Columns: Timestamp, User, Role, Action, Material/
  CNMC Code, Reference (log_id).
- Include a monospace-styled `hash_chain` value, truncated with a
  "view full hash" affordance (tooltip or expand) — this is the detail that
  sells "tamper-evident audit trail" without needing real cryptography.
- Sortable by timestamp (client-side sort over the static CSV is fine).

## StatusBadge (generic)

- Used for `validation_status`, `approval_status`, match `status`,
  `alert.status`, `clarification.status`, `lifecycle_status`.
- Consistent small rectangular badge (not pill-shaped) with status text and
  a color per the palette — keep a single shared component so status colors
  never drift between screens.

## SummaryStatCard

- Used on all three dashboards for the `summary_cards` values in the
  `dashboard_stats_*.json` files.
- Large number, short label beneath, optional small trend/comparison line.
  Flat card with a thin border — no drop shadows, no gradient background.

## PlantSelector

- Dropdown sourced from `cpse_master.csv` — shows `plant_code` +
  `plant_name`. Used in Onboarding and Admin CPSE screens.

## RecordComparisonTable

- Used in Match Detail — two-column side-by-side comparison of
  `cpse_1_*` vs `cpse_2_*` fields from a `match_results.csv` row, with
  differing values visually flagged (bold or underlined), not colored red/
  green like a diff tool — keep it closer to a tender-comparison table.

## SecurityBadgeStrip

- Small footer/header strip showing "AES-256 Encrypted" / "SHA-256
  Verified" / "Government of India Compliant" style badges. Static, no
  functionality. See `07-design-system.md` for exact styling.

## FieldErrorList

- Used on `validation_result_failure.json` — renders `field_errors[]` as a
  table (Row No., Local Code, Field, Error Type, Message), not as toast
  notifications or inline chat-style error bubbles.
