# CNMC Generation Rules

## Overview

The Central National Material Code (CNMC) is a 16-digit hierarchical material coding scheme designed to assign a single standardized code to every unique material record on a national material-harmonization platform. Analogous in purpose to HSN or UNSPSC but extended for engineering specification and identity uniqueness, the CNMC enables precise classification, specification-aware comparison across material classes, and unambiguous identification of materials across all CPSE systems. The code is structured into three functional blocks: Block A (Classification Hierarchy, Digits 1–8) mirrors UNSPSC for direct crosswalk compatibility; Block B (Specification Extension, Digits 9–14) adds material-grade, size, rating, and unit-of-measure detail not covered by UNSPSC; and Block C (Identity & Control, Digits 15–16) provides sequential disambiguation and checksum validation.

## Digit Position Reference

| Digit(s) | Block | Position Name | Description |
|----------|-------|---------------|-------------|
| D1–D2 | Block A | Segment | UNSPSC Segment code (00–99) — defers to published UNSPSC taxonomy |
| D3–D4 | Block A | Family | UNSPSC Family code within Segment (00–99) — defers to published UNSPSC taxonomy |
| D5–D6 | Block A | Class | UNSPSC Class code within Family (00–99) — defers to published UNSPSC taxonomy |
| D7–D8 | Block A | Commodity | UNSPSC Commodity code within Class (00–99) — defers to published UNSPSC taxonomy |
| D9–D10 | Block B | Material / Grade | Base material composition or construction grade (00–99), organized by material family bands |
| D11 | Block B | Macro Size Band | Universal absolute physical-size scale (0–9), same meaning for every material class |
| D12 | Block B | Fine Subdivision | Proportional geometric subdivision (0–9) within the D11 macro band using R10-style progression |
| D13 | Block B | Pressure / Rating Class | Pressure, load, or voltage rating class (0–9); 0 if not applicable |
| D14 | Block B | Unit of Measure Category | Basis on which material is stocked/issued (1–9): Nos, Weight, Length, Volume, Set, Roll, Pair, Box/Pack, Other |
| D15 | Block C | Sequential Identifier | Registry-assigned sequential digit (0–9) to disambiguate distinct materials with identical D1–D14 |
| D16 | Block C | Check Digit | Luhn-style modulus-10 checksum (0–9) computed over digits 1–15 for error detection |

## Non-Negotiable Rule

**Digit 15 (Sequential ID) must never be removed from the scheme — it is the sole mechanism preventing two distinct materials from colliding into an identical code when all other digits match.** This digit ensures that genuinely distinct national material records (e.g., shielded vs. sealed bearing variants with identical classification, grade, size, rating, and UoM) receive unique codes, assigned in order by the issuing registry at the point of governance confirmation.

## Worked Example

**Material:** Deep Groove Ball Bearing, model 6205 ZZ (shielded), bore diameter 25mm, Chrome/Alloy Steel construction, no pressure rating applicable, issued in Numbers (Nos).

| Digit(s) | Position | Value | Derivation |
|----------|----------|-------|------------|
| D1–D2 | Segment | 31 | UNSPSC Segment 31: Manufacturing Components and Supplies |
| D3–D4 | Family | 17 | UNSPSC Family 3117: Bearings, Bushings, Wheels and Gears |
| D5–D6 | Class | 15 | UNSPSC Class 311715: Ball Bearings |
| D7–D8 | Commodity | 01 | UNSPSC Commodity 31171501: Ball Bearings (base entry) |
| D9–D10 | Material/Grade | 02 | Ferrous, Alloy/Chrome Steel band (10–19); 02 mapped per project convention for "Alloy/Chrome Steel" |
| D11 | Macro Band | 2 | 25mm bore falls in the 25–50mm Small-Medium band |
| D12 | Fine Subdiv. | 0 | Within 25–50mm, 25mm sits at the very start of the band → step 0 |
| D13 | Pressure/Rating | 0 | Not Applicable (a bearing carries no pressure rating) |
| D14 | UoM Category | 1 | Numbers (Nos) |
| D15 | Sequential ID | 0 | First confirmed national record in this exact classification+spec bucket |
| D16 | Check Digit | 7 | Luhn-style modulus-10 checksum over digits 1–15 |

**FULL 16-DIGIT CNMC:** `3117150102200107`

**Human-readable alias:** CNMC-BRG-00001 (secondary label only; the 16-digit code is canonical)

## How to Use This Rule Book

The companion file `cnmc_generation_rules.csv` is the literal machine-readable lookup source for automated code generation and validation. To generate or validate a CNMC code:

1. **Determine D1–D8 (Block A):** Look up the material's UNSPSC Segment, Family, Class, and Commodity codes from the published UNSPSC taxonomy. These digits are not enumerated in this rule book — they defer directly to UNSPSC.

2. **Determine D9–D10 (Material/Grade):** Identify the material's base composition or construction grade, then look up the matching row in the CSV where `block_name = 'MaterialGrade'` and the `code_value` range contains your grade.

3. **Determine D11 (Macro Size Band):** Measure the material's key physical dimension (e.g., bore diameter, outer diameter, length — as defined per material class), then look up the matching row where `block_name = 'MacroSizeBand'` and the dimension falls within `numeric_range_from` to `numeric_range_to`.

4. **Determine D12 (Fine Subdivision):** Using the D11 macro band value as the parent, look up the conditional row where `block_name = 'FineSubdivision'`, `parent_value` equals your D11 value, and your exact dimension falls within the geometric subdivision's `numeric_range_from` to `numeric_range_to`.

5. **Determine D13 (Pressure/Rating Class):** If the material has a pressure, load, or voltage rating, look up the matching row where `block_name = 'PressureRatingClass'`; otherwise use 0 (Not Applicable).

6. **Determine D14 (UoM Category):** Identify the unit of measure on which the material is stocked/issued, then look up the matching row where `block_name = 'UoMCategory'`.

7. **Assign D15 (Sequential ID):** For new material records, the issuing registry assigns the next available sequential digit (0–9) for materials with identical D1–D14 values. This is not a lookup — it is assigned at governance confirmation.

8. **Compute D16 (Check Digit):** Always compute this digit via the Luhn-style modulus-10 checksum algorithm over digits 1–15. Never look up D16 — it is algorithmically derived for error detection.

**Important:** All digit lookups (except D15 and D16) should be resolved by matching against rows in `cnmc_generation_rules.csv` rather than computed freehand. The CSV is the authoritative source; this Markdown document provides human-readable context and examples only.
