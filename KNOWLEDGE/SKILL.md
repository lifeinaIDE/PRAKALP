# PRAKALP — Skill Guide

_Last Updated: 2026-09-23_

> This file is a quick orientation guide for any AI assistant (or new developer) starting work on PRAKALP. Read this first before making any changes.

---

## What is PRAKALP?

PRAKALP is a **React + TypeScript + Vite** single-page application that simulates a national material code harmonization platform for Indian Central Public Sector Enterprises (CPSEs). It was built for Smart India Hackathon 2026.

It is a **frontend prototype only** — no backend, no database, no running AI/ML model.

---

## Critical Rules (Never Break These)

1. **No real backend.** Never add a server, API route, or database connection.
2. **All data via `mockApi.ts`.** Never fetch data directly from a component. Always use a function exported from `src/api/mockApi.ts`.
3. **Government design only.** Navy + Maroon + Green + Amber + White. No gradients. No glassmorphism. No pill buttons. No emoji. No AI branding.
4. **No placeholder text.** No "demo purpose", "prototype mode", "static data", "AI-powered" labels anywhere in the UI.
5. **Both CSV directories must stay in sync.** When you edit `CSV/*.csv`, also copy the updated file to `public/CSV/*.csv` — the app reads from `public/CSV/` at runtime.
6. **GIGW 3.0 accessibility.** Every interactive element needs `aria-label`, `tabIndex`, `onKeyDown`. Every color status needs a text label too.

---

## File Map

| What you want to do | File to edit |
|---|---|
| Add/change a route | `src/App.tsx` |
| Add/change sidebar nav link | `src/components/AppShell.tsx` |
| Add a new API function | `src/api/mockApi.ts` |
| Add a new shared UI component | `src/components/SharedUI.tsx` |
| Change a color/spacing | `src/styles/global.css` (`:root`) |
| Add a new CSS class | `src/styles/global.css` |
| Edit data | `CSV/[filename].csv` → then copy to `public/CSV/` |
| Add a new static JSON response | `public/JSON/[filename].json` |
| Understand schemas | `KNOWLEDGE/DATA_MODEL.md` |
| Understand all API functions | `KNOWLEDGE/API_SPEC.md` |
| Understand the design | `KNOWLEDGE/DESIGN.md` |
| See what's been built | `KNOWLEDGE/PHASES.md` |

---

## Key Decisions Made

| Decision | Reason |
|---|---|
| PapaParse for CSV | Lightweight, browser-compatible, typed |
| Vanilla CSS (no Tailwind) | Maximum control over government aesthetics |
| Lucide React for icons | Lightweight, consistent icon set |
| React Context for auth | No token needed for a prototype |
| Static CSV/JSON as "database" | Zero backend setup, demo-safe, fully auditable |
| 16-digit CNMC codes | Follows the formal generation rules in `cnmc_generation_rules.csv` |

---

## Three-Role Demo Flow (for judges)

### Role 1: CPSE Data Steward
Login → Dashboard → Data Onboarding (upload sample) → Field Mapping → Quality Alerts → CNMC Search → View Material Passport → Download CSV

### Role 2: Technical Reviewer
Login → Dashboard → Pending Queue → Open MG-0001 → Review Trust Score + Side-by-Side → Click Approve → See CNMC + Passport Generated

### Role 3: National Admin
Login → Dashboard → CNMC Registry → Click View on any entry → See Passport → Analytics → Audit Log

---

## Common TypeScript Gotchas

- `CnmcRegistry` has `category?` (optional) — don't rely on it always being present
- `getPassport()` returns `{ passport, cnmc }` NOT `{ passport, registry }` — this was corrected
- `approveMatch()` returns `{ approved, cnmc, passport, ref }` — check if `cnmc` and `passport` are null before using
- All `trust_score` values in `match_results.csv` are **strings** (CSV row) — use `parseInt(match.trust_score, 10)` for numeric comparisons

---

## How to Run

```bash
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build
```

---

## How to Regenerate CNMC Codes

```bash
node C:/Users/pooki/.gemini/antigravity-ide/brain/[conv-id]/scratch/generate_cnmc_codes.js
```

Or re-create from `scratch/generate_cnmc_codes.js` in the artifacts directory. The script reads from `CSV/` and writes to both `CSV/` and `public/CSV/`.
