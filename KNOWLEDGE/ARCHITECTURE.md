# PRAKALP — Architecture

_Last Updated: 2026-09-23_

---

## 1. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript |
| **Routing** | React Router v6 |
| **Build Tool** | Vite 5 |
| **Styling** | Vanilla CSS (`src/styles/global.css`) |
| **Icons** | Lucide React |
| **CSV Parsing** | PapaParse |
| **State** | React Context + useState (in-memory only) |
| **Backend** | None — prototype is entirely frontend |
| **Database** | None — static CSV/JSON files |
| **Auth** | None — context-based role picker |

---

## 2. Folder Structure

```
PRAKALP/
├── public/
│   ├── CSV/               # Static data files served at runtime
│   └── JSON/              # Static JSON responses
├── src/
│   ├── api/
│   │   ├── mockApi.ts     # All "API calls" — reads static files
│   │   └── csvParser.ts   # PapaParse wrapper
│   ├── components/
│   │   ├── AppShell.tsx   # Nav sidebar + header + layout wrapper
│   │   ├── RequireAuth.tsx # Role-based route guard
│   │   └── SharedUI.tsx   # Reusable components: PassportCard, AuditTrailTable, etc.
│   ├── context/
│   │   └── AuthContext.tsx # Stores logged-in user + role in React context
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── WelcomePage.tsx
│   │   ├── steward/       # All CPSE Data Steward screens
│   │   ├── reviewer/      # All Technical Reviewer screens
│   │   ├── admin/         # All National Admin screens
│   │   └── policy/        # Static policy pages (GIGW compliance)
│   └── styles/
│       └── global.css     # Full design system + component styles
├── CSV/                   # Source of truth CSV files (copy to public/CSV for runtime)
├── DOCS/                  # Original internal docs
└── KNOWLEDGE/             # Living documentation (this folder)
```

---

## 3. System Architecture Diagram

```
Browser
  └── React SPA (Vite Build)
        ├── AuthContext (role + user state)
        ├── AppShell (layout, nav sidebar, top bar)
        ├── React Router (role-gated routes)
        │     ├── /app/steward/*
        │     ├── /app/reviewer/*
        │     └── /app/admin/*
        └── mockApi.ts
              ├── parseCsv() → public/CSV/*.csv (via fetch)
              └── fetchJson() → public/JSON/*.json (via fetch)
```

**Key Invariant:** `mockApi.ts` is the ONLY place that reads files. No page/component should directly fetch from `/public`. All data access goes through exported functions in `mockApi.ts`.

---

## 4. Data Flow

1. User selects role and logs in → `AuthContext` stores `User` object.
2. `RequireAuth` enforces role match on every `/app/*` route.
3. Pages call `mockApi.ts` functions (e.g., `getCnmcRegistry()`, `getPassport(cnmcCode)`).
4. `mockApi.ts` parses the corresponding CSV/JSON file and returns typed data.
5. Pages render data using shared UI components from `SharedUI.tsx`.
6. "Write" operations (approvals, alert resolutions) update in-memory `Map` state inside `mockApi.ts`. These are lost on page refresh.

---

## 5. Routing Structure

| Path | Component | Auth Required |
|---|---|---|
| `/login` | LoginPage | Public |
| `/app/steward/dashboard` | StewardDashboardPage | CPSE Data Steward |
| `/app/steward/onboarding` | DataOnboardingPage | CPSE Data Steward |
| `/app/steward/mappings` | CnmcSearchPage | CPSE Data Steward |
| `/app/steward/mappings/:cnmcCode` | NationalMaterialPassportPage | CPSE Data Steward |
| `/app/steward/alerts` | QualityAlertsPage | CPSE Data Steward |
| `/app/steward/clarifications` | ClarificationsInboxPage | CPSE Data Steward |
| `/app/steward/new-request` | NewCodeRequestPage | CPSE Data Steward |
| `/app/reviewer/dashboard` | ReviewerDashboardPage | Technical Reviewer |
| `/app/reviewer/queue` | PendingMatchQueuePage | Technical Reviewer |
| `/app/reviewer/queue/:groupId` | MatchDetailPage | Technical Reviewer |
| `/app/admin/dashboard` | AdminDashboardPage | National Admin |
| `/app/admin/registry` | CnmcRegistryManagementPage | National Admin |
| `/app/admin/registry/:cnmcCode` | NationalMaterialPassportPage | National Admin |
| `/app/admin/analytics` | NationalAnalyticsPage | National Admin |
| `/app/admin/audit` | AuditLogPage | National Admin |
| `/app/admin/disputes` | DisputeResolutionPage | National Admin |
