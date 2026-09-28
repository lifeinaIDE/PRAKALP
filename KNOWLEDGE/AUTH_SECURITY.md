# PRAKALP — Auth & Security

_Last Updated: 2026-09-23_

---

> **This is a prototype.** There is no real authentication, no real tokens, no encryption, no session management, and no server-side security. This document describes the simulated auth model and what a production implementation would look like.

---

## Prototype Auth Model

### Login Flow
1. User navigates to `/login`
2. `LoginPage.tsx` shows a form with email + password inputs
3. On submit, `getUserByCredentials(email, password)` is called from `mockApi.ts`
4. This filters `users.csv` and checks if `password === 'prakalp@2026'` (hardcoded)
5. On success, the `User` object is stored in `AuthContext` via `login(user)`
6. React Router redirects to the user's role-appropriate dashboard

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| CPSE Data Steward (BHEL-HEEP) | `rajesh.kumar@bhel.in` | `prakalp@2026` |
| CPSE Data Steward (NTPC-TPS) | `priya.sharma@ntpc.in` | `prakalp@2026` |
| Technical Reviewer | `anil.verma@nipam.gov.in` | `prakalp@2026` |
| National Admin | `meera.iyer@dpe.gov.in` | `prakalp@2026` |

_(Full user list in `users.csv`)_

### Session Management
- Session is stored only in React context (in-memory)
- Page refresh = logged out (expected prototype behaviour)
- No cookies, no localStorage, no tokens

---

## Role-Based Access Control (RBAC)

### Role Definitions

| Role | Access Section | Route Prefix |
|---|---|---|
| `CPSE Data Steward` | Steward portal | `/app/steward/*` |
| `Technical Reviewer` | Reviewer portal | `/app/reviewer/*` |
| `National Admin` | Admin portal | `/app/admin/*` |

### Route Guard: `RequireAuth.tsx`
- Wraps every `/app/*` route
- If not logged in → redirect to `/login`
- If wrong role for this section → redirect to the user's own dashboard
- Role is determined by `user.role` from `AuthContext`

### Dashboard Redirects by Role

| Role | Dashboard URL |
|---|---|
| CPSE Data Steward | `/app/steward/dashboard` |
| Technical Reviewer | `/app/reviewer/dashboard` |
| National Admin | `/app/admin/dashboard` |

---

## Production Security Design (Future Reference)

### Authentication
- **SSO via NIC / UMANG** (GoI-mandated identity provider)
- JWT tokens with short expiry (15 min access, 24h refresh)
- MFA for National Admin role

### Authorization
- Role claims in JWT payload
- Server-side route guards (not just frontend)
- API-level permission checks per endpoint

### Data Security
- HTTPS enforced (TLS 1.2+)
- All data encrypted at rest (AES-256)
- Audit trail immutable (append-only)
- PII masked in logs (only user_id, not name/email)

### Compliance
- **GIGW 3.0**: Semantic HTML, ARIA roles, keyboard navigation, skip links
- **WCAG 2.1 AA**: Colour contrast ratios, non-colour-dependent indicators
- **NIC hosting**: Deployed on MeitY-approved NIC cloud infrastructure

---

## GIGW 3.0 Compliance Checklist

| Requirement | Status |
|---|---|
| Skip to main content link | ✅ Implemented in AppShell |
| ARIA landmark roles | ✅ `<main>`, `<nav>`, `<header>` |
| Keyboard navigation (Tab, Enter, Space) | ✅ All interactive elements |
| Non-color-only status indicators | ✅ Labels + colors both used |
| Accessible form labels | ✅ All inputs labeled |
| Screen reader live region (`aria-live`) | ✅ `#sr-announce` in AppShell |
| Government color palette | ✅ Navy, Maroon, Green, Amber |
| No AI branding in copy | ✅ Removed |
| No glassmorphism / gradient cards | ✅ Sharp borders, flat design |
