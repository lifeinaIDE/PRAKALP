# 00 — Overview

## Project

**PRAKALP** — National Material Code Harmonization Platform.
Built for Smart India Hackathon (SIH) 2026.

## Problem Statement

Central Public Sector Enterprises (CPSEs) — BHEL, NTPC, SAIL, IOCL, ONGC, BPCL,
etc. — each maintain their own local material master with their own codes,
descriptions, and units of measure. The same physical material (e.g. a 6205 ZZ
ball bearing) can exist under a dozen different local codes across plants,
with no way to tell they are the same item. This causes duplicate
procurement, inconsistent specifications, and no national visibility into
what materials the public sector actually holds.

PRAKALP gives every CPSE material a single **National Material Code (CNMC)**,
mapped back to all of its local codes, with a governed review process before
any code is finalized.

## What This Build Is

A **prototype / demo**, not a production system. It exists to demonstrate the
workflow and UI to hackathon judges — not to run real matching logic.

- No backend service. No database. No trained model.
- All "AI" behavior (matching, trust scoring, quality summaries, duplicate
  detection) is **pre-computed and stored as static CSV/JSON files**, checked
  into the repo, and read directly by the frontend.
- Every screen that looks like it triggered a computation is actually just
  fetching a static file that already has the answer in it.
- This is deliberate — see `05-mock-api-contract.md` for how each "endpoint"
  maps to a static file, and `09-build-plan.md` for the demo-safety
  implications of this approach.

## Explicit Non-Goals

Do **not** build, wire up, or attempt any of the following:

- No real NLP / description-matching logic
- No real ML model, embeddings, or vector search
- No real trust-score computation
- No real backend server, API, or database (Postgres, Mongo, Firebase, etc.)
- No real SSO / OAuth integration — login is a dummy role-picker
- No real SAP connector — "Production Mode" in the upload screen is a
  disabled/greyed-out option with a tooltip, nothing else
- No file storage service — uploaded files are never actually parsed; a
  fixed canned response is shown based on which sample the user picks
  (see `demo_scenario_map.json`)

If a requirement seems to need real computation, the correct fix is always
**"add a static file with the pre-computed answer,"** never "write the logic."

## Visual & Tone Direction

This must look and read like an Indian government portal (e.g. GeM,
DigiLocker, MCA21) — **not** like an AI product or a generic SaaS dashboard.
Full detail is in `07-design-system.md`, but the short version:

- No AI branding anywhere in copy ("AI-powered," "smart," "intelligent")
- No chat bubbles, no streaming text, no gradient cards
- Dense data tables, sharp corners, official color palette, reference-number
  driven copy (every action returns a VAL-/DPC-/LOG- style ID)

## Source of Truth for Data

All mock data files referenced throughout these docs live in `/mock_data/`
and were generated from a real 50-record CPSE tender dataset. See
`04-data-model.md` for full schemas.
