# 07 — Design System

**Governing rule: this must read as an official Government of India digital
platform, not as an AI product.** If in doubt, ask "would this appear on
GeM, DigiLocker, MCA21, or a state e-governance portal?" — if not, don't use
it. A viewer looking at one screen, with no other context, should not be
able to tell this involves AI at all.

## Explicitly Banned Patterns

- Chat bubbles, chat-style side panels, "ask AI" boxes
- Streaming/typing text animation
- Gradient backgrounds, glassmorphism, blurred/frosted panels
- Large rounded pill buttons and pill badges
- Soft drop shadows used decoratively (a 1px border is enough)
- Copy containing "AI," "smart," "intelligent," "powered by," "assistant,"
  emoji of any kind, exclamation marks in system messages
- Circular "confidence ring" gauges that look like a fitness app
- Playful illustrations, mascots, or empty-state cartoons

## Color Palette

Primary reference: Indian government portal conventions (navy, maroon/
saffron accent, white, muted greys).

| Token | Hex | Use |
|---|---|---|
| `--gov-navy` | `#0B3763` | Primary header bar, primary buttons, links |
| `--gov-navy-dark` | `#062442` | Hover/active states |
| `--gov-maroon` | `#8B1E2B` | Accent strip, critical alerts, high severity |
| `--gov-saffron` | `#E58E26` | Secondary accent (tricolor nod), medium severity |
| `--gov-green` | `#1F7A3D` | Success / Approved / Passed states |
| `--gov-bg` | `#F4F5F7` | Page background |
| `--gov-surface` | `#FFFFFF` | Card/table backgrounds |
| `--gov-border` | `#D0D5DD` | All borders (1px, no shadows) |
| `--gov-text-primary` | `#1A1A1A` | Body text |
| `--gov-text-secondary` | `#5B6472` | Meta text, labels |
| `--gov-amber` | `#B7791F` | Pending / warning states |
| `--gov-grey-badge` | `#6B7280` | Low severity / neutral badges |

Do not introduce purple, pink, or bright SaaS blue (#4F46E5-style) anywhere.

## Typography

- Use a plain, high-legibility system sans: **"Noto Sans", "Segoe UI",
  Arial, sans-serif** stack. No display/decorative fonts, no variable
  weights used for "personality."
- Headers: bold, navy, modest size increases (no huge 48px hero text — this
  is a workflow tool, not a landing page).
- Body text: 14–15px, high contrast, generous line height for dense tables.
- Monospace (e.g. "Roboto Mono", `monospace`) for all reference IDs (CNMC
  codes, log IDs, hash chains) — this is a strong "official system" signal.

## Layout Conventions

- Fixed left sidebar navigation + top header bar (Ashoka-emblem-style crest
  placeholder + platform name left; "Signed in as ..." + logout right).
- Sharp or minimally-rounded corners (2–4px radius max) on cards, tables,
  buttons — never fully rounded/pill.
- Tables are the default way to show any list of records — not card grids.
  Card grids only for dashboard summary stats and the Passport view.
- Generous use of horizontal rule dividers and bordered sections instead of
  whitespace-only separation — reads more "form/document" than "app."
- Forms styled like official form sections: numbered/labeled field groups,
  visible required-field asterisks, explicit "Submit" buttons (not icon-only
  actions for primary actions).

## Status & Severity Color Mapping (must stay consistent everywhere)

| State | Color |
|---|---|
| Passed / Approved / Active / Resolved | `--gov-green` |
| Pending / Awaiting Response / Under Review | `--gov-amber` |
| Failed / Rejected / High severity | `--gov-maroon` |
| Flagged / Medium severity | `--gov-saffron` |
| Low severity / Neutral / Inactive | `--gov-grey-badge` |

## Security Badge Strip

Static footer or header-adjacent strip, small text + icon, e.g.:

```
🔒 AES-256 Encrypted   ✓ SHA-256 Verified   🛡 Government of India Compliant
```

(Use simple line-icon glyphs, not emoji, in the actual build — emoji above
is illustrative only.) Keep these small, greyscale-with-one-accent-color,
positioned like a compliance footer — never a flashy trust-badge carousel.

## Reference Number Convention

Every system action should surface a reference-style ID somewhere in the
response/UI — this is the single strongest "real government system" signal
available and costs nothing to fake consistently:

- Validation: `VAL-YYYY-#####`
- Duplicate check: `DPC-YYYY-#####`
- Audit log: `LOG-####`
- CNMC: `CNMC-<CAT>-#####`
- Passport: `PASS-#####`
- Clarification: `CLR-####`

All of these already exist in the mock data files — just make sure every
screen that shows a record surfaces its ID, not just its description.
