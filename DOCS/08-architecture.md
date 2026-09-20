# 08 — Architecture

## Tech Stack

- **Frontend only.** React (with your standard routing/state setup).
- **No backend service** — no Node/Express/FastAPI server, no database.
- **Data layer:** static CSV and JSON files under `/mock_data/`, loaded
  client-side (CSV parsed with a lightweight parser, JSON loaded directly)
  through the `mockApi.ts` module described in `05-mock-api-contract.md`.
- **State:** in-memory only (React state/context). No persistence layer.
  A page refresh may reset any "write" actions (approvals, resolved alerts,
  etc.) back to the static baseline — that's expected for a prototype.
- **Hosting:** static build, deployable anywhere that serves static files.

## System Diagram

```mermaid
flowchart TD

    A[Open PRAKALP Platform] --> B[Login Page]
    B --> C[Role-Based Access Control]

    C -->|CPSE Data Steward| D[CPSE Data Dashboard]
    C -->|Technical Reviewer| F[Match Review Dashboard]
    C -->|National Admin| G[National Governance Dashboard]

    %% CPSE DATA STEWARD
    D --> D1[Upload Material Master CSV]
    D1 --> D2[Data Validation]
    D2 --> D3[Matching Result Lookup]
    D3 --> D4[View Duplicate / Equivalent Results]

    D4 --> D5[View Approved CNMC Mapping]
    D5 --> D6[Open National Material Passport]

    D --> D7[Create New Material Request]
    D7 --> D8[Duplicate Prevention Gate]
    D8 --> D9{Existing Equivalent Found?}

    D9 -->|Yes| D10[Show Existing CNMC and Passport]
    D9 -->|No| D11[Send New Material for Technical Review]

    %% TECHNICAL REVIEWER
    F --> F1[Open Pending Match Queue]
    F1 --> F2[Compare Material Records]
    F2 --> F3[View Match Trust Score]
    F3 --> F4[View Why Matched / Why Not Matched]
    F4 --> F5[Check Critical Technical Specifications]

    F5 --> F6{Technical Match Safe?}

    F6 -->|Yes| F7[Approve Canonical Material]
    F6 -->|No| F8[Mark Near-Duplicate / Reject]

    F7 --> F9[Generate CNMC]
    F9 --> F10[Create National Material Passport]
    F10 --> F11[Save Audit Trail]

    F8 --> F11
    D11 --> F1

    %% NATIONAL ADMIN
    G --> G1[Manage CPSEs and User Roles]
    G --> G2[Manage Categories and Technical Templates]
    G --> G3[Set Trust Score Thresholds]
    G --> G4[Manage CNMC Registry]

    G --> G5[National Analytics Dashboard]
    G5 --> G6[View Duplicate Trends]
    G5 --> G7[View Data Quality by CPSE]
    G5 --> G8[View Pending Reviews]
    G5 --> G9[View Migration Progress]

    G --> G10[View Audit Trail and Resolve Disputes]

    %% SHARED STATIC DATA LAYER (replaces the "AI engine" of the original concept)
    D3 --> H[Static Mock Data Layer]
    H --> H1[Pre-computed Match Results]
    H --> H2[Pre-computed Trust Scores]
    H --> H3[Pre-computed Quality Alerts]
    H --> H4[Pre-computed Why / Why-Not Text]

    H1 --> F1
    H2 --> F1
    H3 --> F1
    H4 --> F1

    %% COMMON DATA LAYER
    F10 --> I[Static National Material Master Files]
    F8 --> I

    I --> I1[cnmc_registry.csv]
    I --> I2[national_material_passports.csv]
    I --> I3[raw_material_data.csv]
    I --> I4[match_results.csv]
    I --> I5[audit_logs.csv]

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#e1f5ff
    style D fill:#fff4e1
    style F fill:#fff4e1
    style G fill:#fff4e1
    style H fill:#e8f5e9
    style I fill:#f3e5f5
```

Note: box `H` ("Static Mock Data Layer") replaces what the original concept
brief called the "AI Material Intelligence Engine." For this build, it is
**only** a set of static files being read — nothing in the shaded `H` block
should be implemented as running code beyond a file read + filter.

## Deployment Note

Since there's no backend, there's no environment-variable/secrets
configuration to manage. The entire app is a static bundle plus the
`/mock_data/` directory served alongside it.
