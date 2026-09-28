# PRAKALP — Matching Engine

_Last Updated: 2026-09-23_

---

> **Important:** There is no live matching engine. All match results are pre-computed static data stored in `match_results.csv`. This document describes the *conceptual* logic that the engine would implement in a production system, and how the static data represents those concepts for the prototype demo.

---

## Conceptual Overview (Production Design)

In a real production system, the matching engine would:

1. Ingest raw material records from all CPSEs
2. Pre-process and normalize descriptions (tokenization, unit standardization)
3. Compute pairwise similarity using multiple signals:
   - Semantic similarity (NLP embeddings on descriptions)
   - Specification field matching (UOM, grade, size, standard codes)
   - Material fingerprint comparison
4. Assign a **Trust Score** (0–100) and **Match Type** to each pair
5. Route high-confidence matches for auto-approval or manual review

---

## Trust Score Bands (Static Mapping)

| Score Range | Match Type | Review Type | Action |
|---|---|---|---|
| 90–100 | Exact Match | Auto-Flagged / Manual Confirm | Reviewer confirms |
| 75–89 | Near-Duplicate | Manual Review Required | Full side-by-side review |
| 50–74 | Partial Match | Manual Review Required | Reviewer judges |
| 0–49 | Not a Match | Manual Review Required | Likely reject |

### Trust Score Display (UI Rules)
- ≥ 85 → **green** label "Exact Match"
- 65–84 → **amber** label "Probable Match"
- < 65 → **maroon** label "Partial / No Match"

---

## Why Match / Why Not Match Panels

Each `match_results.csv` row contains two explanation fields:

- **`why_match`**: Plain-text reasoning for why these two records were matched (e.g., "Both records describe a deep groove ball bearing of type 6205 ZZ with identical shielding specifications.")
- **`why_not`**: Plain-text counter-reasoning (e.g., "Minor discrepancy in UOM — one record uses NOS, the other PCS. Could indicate pack-size difference.")

These are pre-written strings. They are displayed as-is in the `WhyWhyNotPanel` component in `SharedUI.tsx`.

---

## CNMC Assignment (On Approval)

When a reviewer clicks **Approve Match**, the frontend calls `approveMatch(groupId)` from `mockApi.ts`:

1. The function looks up the match row to find `cpse_1_code` and `cpse_2_code`
2. It scans `cnmc_registry.csv` for a row whose `legacy_codes` field contains either code
3. It returns the matched `CnmcRegistry` row + the corresponding `NationalPassport` row
4. If no match is found in legacy codes, it falls back to `registry[0]` (first row)

> **Note:** In production, this step would actually *create* a new CNMC row. In the prototype, we simply surface a pre-existing registry entry.

---

## Duplicate Prevention Gate

Used in the **New Code Request** flow (`NewCodeRequestPage`):

- The steward enters a description for a new material
- Frontend calls `checkDuplicate(description)`
- If description contains `ball bearing 6205` or `6205` → returns match-found response
- Otherwise → returns no-match response
- The response JSON is in `public/JSON/duplicate_prevention_check_match_found.json` or `..._no_match.json`

---

## Prototype Demo Scenarios

| Trigger | Outcome |
|---|---|
| Upload with plant `BHEL-HEEP` | Validation success |
| Upload with plant `SAIL-RSP` | Validation failure |
| New code request with "ball bearing 6205" in description | Duplicate found |
| New code request with any other description | No duplicate |
| Approve match `MG-0001` | Assigns `CNMC-BRG-00001` (now: `3117150400000110`) |
