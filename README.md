<div align="center">

# PRAKALP

---

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## Overview

PRAKALP addresses a critical inefficiency in India's public sector procurement ecosystem. Central Public Sector Enterprises (CPSEs) — BHEL, NTPC, SAIL, IOCL, ONGC, BPCL — each maintain isolated material masters with proprietary local codes, descriptions, and units of measure. The same physical item can exist under dozens of different codes across plants with no reconciliation mechanism.

**PRAKALP solves this by assigning every CPSE material a single Central National Material Code (CNMC)** — a formally structured 16-digit identifier — mapped back to all local codes across CPSEs, governed by a structured review and approval process.

---

## Key Features

| Feature | Description |
|---|---|
| **Role-Based Portal** | Three distinct portals for CPSE Data Stewards, Technical Reviewers, and National Admins |
| **Match Review Workflow** | Side-by-side material comparison with trust scoring and structured approval |
| **16-Digit CNMC Codes** | Formally generated codes following UNSPSC + material grade + size band + Luhn checksum rules |
| **National Material Passport** | Authoritative record for each approved material with full specification and legacy code mapping |
| **Data Quality Alerts** | Automated flagging of missing UOM, ambiguous descriptions, internal duplicates |
| **Duplicate Prevention Gate** | Screens new code requests against existing registry before routing for review |
| **Audit Trail** | Immutable log of all system actions with user, timestamp, and reference ID |
| **GIGW 3.0 Compliant** | Semantic HTML, ARIA roles, keyboard navigation, screen reader support |

---

## Roles

```
CPSE Data Steward
  └── Uploads material master data
  └── Reviews quality alerts
  └── Searches CNMC registry and views Material Passports
  └── Requests new material codes

Technical Reviewer
  └── Reviews pending match pairs with trust scores
  └── Approves or sends clarification requests
  └── Generates CNMC and National Material Passport on approval

National Admin
  └── Manages CPSEs, categories, and trust score thresholds
  └── Views full CNMC Registry and Analytics
  └── Monitors audit trail and resolves disputes
```

---

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build:** Vite 5
- **Routing:** React Router v6
- **Styling:** Vanilla CSS (Government design system — no Tailwind)
- **Icons:** Lucide React
- **CSV Parsing:** PapaParse
- **Data Layer:** Static CSV/JSON files (no backend required)

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd PRAKALP

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at **http://localhost:5173**

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| CPSE Data Steward | `rajesh.kumar@bhel.in` | `prakalp@2026` |
| Technical Reviewer | `anil.verma@nipam.gov.in` | `prakalp@2026` |
| National Admin | `meera.iyer@dpe.gov.in` | `prakalp@2026` |

---

## CNMC Code Structure

Each National Material Code is a **16-digit numeric identifier** structured as:

```
D1-D8   UNSPSC Segment / Family / Class / Commodity
D9-D10  Material Grade (Carbon Steel, Stainless, Non-ferrous, Polymer, etc.)
D11     Macro Size Band (1mm–>10m scale)
D12     Fine Subdivision (geometric progression within band)
D13     Pressure / Load / Voltage Rating Class
D14     Unit of Measure Category (Nos, Weight, Length, Volume, etc.)
D15     Sequential Identifier (disambiguates identical D1-D14)
D16     Check Digit (Luhn modulus-10 checksum)
```

**Example:** `3117150400000110`
- `31171504` → UNSPSC: Deep Groove Ball Bearing
- `00` → Material Grade: N/A
- `0` → Size Band: 1–10 mm
- `0` → Fine Subdivision: step 0
- `1` → Pressure Class: Low
- `1` → UOM: Numbers (Nos)
- `0` → Sequential ID
- `0` → Luhn Check Digit

---

## Project Structure

```
PRAKALP/
├── public/
│   ├── CSV/               # Static CSV data (served at runtime)
│   └── JSON/              # Static JSON responses
├── src/
│   ├── api/               # mockApi.ts — all data access functions
│   ├── components/        # AppShell, SharedUI, RequireAuth
│   ├── context/           # AuthContext (role-based session)
│   ├── pages/
│   │   ├── steward/       # CPSE Data Steward screens
│   │   ├── reviewer/      # Technical Reviewer screens
│   │   ├── admin/         # National Admin screens
│   │   └── policy/        # GIGW-compliant policy pages
│   └── styles/
│       └── global.css     # Full design system
├── CSV/                   # Source of truth data files
└── KNOWLEDGE/             # Living project documentation
    ├── PRD.md
    ├── ARCHITECTURE.md
    ├── DATA_MODEL.md
    ├── API_SPEC.md
    ├── DESIGN.md
    └── ...
```

---

## Documentation

Full documentation is in the [`KNOWLEDGE/`](./KNOWLEDGE/) folder:

| Document | Contents |
|---|---|
| [`PRD.md`](./KNOWLEDGE/PRD.md) | Product requirements and feature scope |
| [`ARCHITECTURE.md`](./KNOWLEDGE/ARCHITECTURE.md) | System design and routing |
| [`DATA_MODEL.md`](./KNOWLEDGE/DATA_MODEL.md) | All CSV schemas and CNMC code structure |
| [`API_SPEC.md`](./KNOWLEDGE/API_SPEC.md) | Mock API function reference |
| [`MATCHING_ENGINE.md`](./KNOWLEDGE/MATCHING_ENGINE.md) | Trust score logic and demo triggers |
| [`AUTH_SECURITY.md`](./KNOWLEDGE/AUTH_SECURITY.md) | Role-based access and GIGW compliance |
| [`DESIGN.md`](./KNOWLEDGE/DESIGN.md) | Design system, color palette, banned patterns |
| [`PHASES.md`](./KNOWLEDGE/PHASES.md) | Build phases and completion status |
| [`PROGRESS.md`](./KNOWLEDGE/PROGRESS.md) | Running log of all changes |

---

## Design Philosophy

PRAKALP follows the Government of India digital portal design language:

- **Navy · Maroon · Green · Amber** — official GoI color palette
- **Dense data tables** over card grids for lists
- **Sharp 3px corners, 1px borders** — no glassmorphism or gradients
- **Monospace reference IDs** on every action (VAL-YYYY-####, LOG-####)
- **GIGW 3.0** accessibility: ARIA landmarks, keyboard navigation, screen reader live regions

---

<div align="center">

*Built with a commitment to transparency, efficiency, and governance in public sector procurement.*

</div>
