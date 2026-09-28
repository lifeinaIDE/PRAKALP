# PRAKALP — AI Prompts Reference

_Last Updated: 2026-09-23_

> This file contains useful reference prompts for continuing work on PRAKALP using an AI coding assistant. Always start a new session by pointing the assistant to the relevant KNOWLEDGE files.

---

## Session Starter Prompt (Copy-Paste)

```
You are working on PRAKALP, a National Material Code Harmonization Platform
built for Smart India Hackathon 2026. This is a React + TypeScript + Vite frontend
prototype with no backend. All data is in static CSV/JSON files served from /public/CSV/.

Please read the following knowledge files before proceeding:
- KNOWLEDGE/PRD.md
- KNOWLEDGE/ARCHITECTURE.md
- KNOWLEDGE/DATA_MODEL.md
- KNOWLEDGE/DESIGN.md
- KNOWLEDGE/PHASES.md

Key constraints:
- No real backend, no database, no ML model
- All data reads via mockApi.ts
- Government design: Navy/Maroon/Green/Amber palette, sharp 3px corners, 1px borders
- No glassmorphism, no gradient cards, no AI branding in copy
- GIGW 3.0 accessibility compliance (ARIA, keyboard nav)
- CNMC codes are 16-digit numeric (see DATA_MODEL.md)
```

---

## Phase-Specific Prompts

### Add a New Page (Steward)
```
Add a new page to the CPSE Data Steward portal at route /app/steward/[name].
- Register the route in App.tsx
- Add the nav link in AppShell.tsx under the steward nav section
- Follow the design system from KNOWLEDGE/DESIGN.md
- Use mockApi.ts for all data; do not hardcode any data in the component
- The page must be accessible: ARIA roles, keyboard navigation, no color-only indicators
```

### Fix a Visual Bug
```
The [component] on [page] has the following issue: [describe issue].
Please fix it while strictly following the design principles in KNOWLEDGE/DESIGN.md.
Do not introduce gradients, glassmorphism, or colors outside the defined palette.
```

### Add Data to CSV
```
I need to add [N] new rows to [filename].csv.
The schema is defined in KNOWLEDGE/DATA_MODEL.md under the [section] section.
After editing the CSV in CSV/, also copy the updated file to public/CSV/.
Ensure all foreign keys are consistent with related CSV files.
```

### Update CNMC Codes
```
I need to regenerate CNMC codes. The generation rules are in CSV/cnmc_generation_rules.csv.
The script to regenerate is at scratch/generate_cnmc_codes.js.
After regenerating, update both CSV/cnmc_registry.csv and public/CSV/cnmc_registry.csv,
and the same for national_material_passports.csv.
```

### Debug a Route / Auth Issue
```
When a [role] user clicks [button/link], they are being redirected to [unexpected page].
Check:
1. The route definition in App.tsx
2. The RequireAuth section prop for that route
3. The navigate() call in the triggering component
The expected behaviour is: [describe expected].
```

---

## Useful Reference Lookups

### "Where is X defined?"

| Thing | Location |
|---|---|
| All routes | `src/App.tsx` |
| Role-based nav links | `src/components/AppShell.tsx` |
| All API functions | `src/api/mockApi.ts` |
| Shared UI components | `src/components/SharedUI.tsx` |
| Global CSS variables | `src/styles/global.css` (`:root` block) |
| CNMC generation rules | `CSV/cnmc_generation_rules.csv` |
| Demo credentials | `KNOWLEDGE/AUTH_SECURITY.md` |
| Data schemas | `KNOWLEDGE/DATA_MODEL.md` |

---

## Common Mistakes to Avoid

1. **Don't hardcode data in components** — always go through `mockApi.ts`
2. **Don't use Tailwind** — use the existing class names from `global.css`
3. **Don't add emoji** to any UI text (government portal tone)
4. **Don't navigate admins to steward routes** — check the role prefix (`/app/admin/` vs `/app/steward/`)
5. **Don't forget to update `public/CSV/`** when editing `CSV/` files — both copies must stay in sync
6. **Don't add "prototype", "demo", "static data", or "AI-powered"** labels to any page
