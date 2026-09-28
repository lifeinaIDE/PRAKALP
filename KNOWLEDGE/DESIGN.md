# PRAKALP — Design System

_Last Updated: 2026-09-23_

---

## Core Design Philosophy

**This must look and read like an official Government of India digital platform** — GeM, DigiLocker, MCA21, or an NIC-hosted state portal. If in doubt, ask: "Would this appear on a GoI portal?" If not, don't use it.

A viewer looking at one screen with no other context should not be able to tell this involves AI at all.

---

## Explicitly Banned Patterns

- ❌ Chat bubbles, chat-style panels, "ask AI" boxes
- ❌ Streaming / typing text animations
- ❌ Gradient backgrounds, glassmorphism, frosted/blurred panels
- ❌ Pill buttons or pill badges (fully rounded)
- ❌ Soft drop shadows (use 1px border instead)
- ❌ Copy containing: "AI," "smart," "intelligent," "powered by," "assistant"
- ❌ Emoji anywhere in the UI
- ❌ Circular "confidence ring" gauges (fitness-app look)
- ❌ Playful illustrations, mascots, empty-state cartoons
- ❌ Purple, pink, or SaaS blue (#4F46E5-style)
- ❌ Exclamation marks in system messages

---

## Color Palette

| CSS Variable | Hex | Use |
|---|---|---|
| `--gov-navy` | `#0B3763` | Primary header, buttons, links |
| `--gov-navy-dark` | `#062442` | Hover/active on navy elements |
| `--gov-maroon` | `#8B1E2B` | Accent strip, critical alerts, high severity |
| `--gov-saffron` | `#E58E26` | Medium severity, tricolor accent |
| `--gov-green` | `#1F7A3D` | Success, Approved, Passed, Active |
| `--gov-bg` | `#F4F5F7` | Page background |
| `--gov-surface` | `#FFFFFF` | Card / table backgrounds |
| `--gov-border` | `#D0D5DD` | All borders (1px solid) |
| `--gov-text-primary` | `#1A1A1A` | Body text |
| `--gov-text-secondary` | `#5B6472` | Meta text, labels, secondary info |
| `--gov-amber` | `#B7791F` | Pending / warning states |
| `--gov-grey-badge` | `#6B7280` | Low severity / neutral badges |

---

## Typography

| Use | Font | Size | Weight |
|---|---|---|---|
| Body text | "Noto Sans", "Segoe UI", Arial, sans-serif | 14–15px | 400 |
| Page titles (h1) | Same | 1.4rem | 700, Navy |
| Section headers (h2, h3) | Same | 1.1–1.2rem | 600–700 |
| Table headers (th) | Same | 0.8rem | 700, uppercase, letter-spacing |
| Reference IDs (CNMC, LOG-, etc.) | "Roboto Mono", monospace | 0.8125rem | 600–700 |
| Status badges | Same as body | 0.72–0.75rem | 700, uppercase |

---

## Layout

- **Sidebar** (fixed left, 200–220px) + **Top header bar** + **Main content** area
- Ashoka emblem / crest placeholder + platform name (left) in header
- "Signed in as [Name] · [Role]" + Logout (right) in header
- **Cards**: sharp corners (2–4px radius max), 1px solid `--gov-border`, no shadows
- **Tables**: default for all data lists. Card grids only for dashboard stat blocks and Passport view
- **Forms**: visible labels, required-field asterisks, explicit Submit buttons
- **Dividers**: `<hr>` or `border-bottom: 1px solid var(--gov-border)` for section separation
- **No whitespace-only** separation between sections (use visible dividers)

---

## Status & Severity Color Mapping

| State | Badge Class | Color |
|---|---|---|
| Passed / Approved / Active / Resolved / Exact Match | `status-badge green` | `--gov-green` |
| Pending / Awaiting / Under Review / Probable Match | `status-badge amber` | `--gov-amber` |
| Failed / Rejected / High Severity / No Match | `status-badge maroon` | `--gov-maroon` |
| Flagged / Medium Severity | `status-badge saffron` | `--gov-saffron` |
| Low Severity / Inactive / Neutral | `status-badge grey` | `--gov-grey-badge` |

> **Rule:** Never use color alone to convey status. Every status badge must also have a text label.

---

## Component Classes (from global.css)

| Class | Purpose |
|---|---|
| `.card` | White surface card with 1px border |
| `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger` | Button variants |
| `.status-badge`, `.status-badge.green`, `.status-badge.maroon`, etc. | Status pills |
| `.page-header` | Flex row for page title + subtitle |
| `.page-title` | `h1` styling |
| `.page-subtitle` | Secondary subtitle text |
| `.table-container` | Wrapper with border for tables |
| `.clickable-row` | `tr` that acts as a link row |
| `.info-box`, `.info-box.error`, `.info-box.success` | Inline info banners |
| `.toast`, `.toast.success`, `.toast.error` | Toast notification |
| `.mono` | Monospace text for IDs |
| `.text-sm`, `.text-secondary`, `.text-bold` | Utility text classes |
| `.validation-panel`, `.validation-panel-body` | Match approval panels |
| `.spinner` | CSS loading spinner |

---

## Reference Number Convention

Every system action must surface a reference-style ID:

| Action | Format |
|---|---|
| Validation upload | `VAL-YYYY-#####` |
| Duplicate check | `DPC-YYYY-#####` |
| Audit log entries | `LOG-####` |
| CNMC code | 16-digit numeric (see DATA_MODEL.md) |
| National Passport | `PASS-#####` |
| Clarification | `CLR-####` |
| Alert | `ALT-###` |
| Match group | `MG-####` |

---

## Accessibility (GIGW 3.0)

- Skip-to-content link in `AppShell` (`#main-content`)
- All interactive elements: `tabIndex`, `aria-label`, `onKeyDown` for Enter/Space
- ARIA landmark roles: `<main>`, `<nav>`, `<header>`, `role="region"` on key sections
- Screen reader live region: `<div id="sr-announce" aria-live="polite" aria-atomic="true">` in AppShell
- `srAnnounce(msg)` utility in `SharedUI.tsx` for announcing actions to screen readers
- Non-color-only indicators: every color state has a text label too
- Colour contrast: minimum 4.5:1 (AA) for normal text
