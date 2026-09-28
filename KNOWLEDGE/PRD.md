# PRAKALP — Product Requirements Document (PRD)

_Last Updated: 2026-09-23_

---

## 1. Product Overview

**Product Name:** PRAKALP (National Material Code Harmonization Platform)  
**Event:** Smart India Hackathon (SIH) 2026  
**Problem Statement PS-XXX:** Harmonize material codes across Central Public Sector Enterprises (CPSEs) of India.

### 1.1 Problem

Central Public Sector Enterprises (CPSEs) — BHEL, NTPC, SAIL, IOCL, ONGC, BPCL — each maintain isolated material masters with proprietary local codes, descriptions, and units of measure. The same physical item (e.g., a 6205 ZZ ball bearing) exists under dozens of different local codes across plants with no reconciliation mechanism. This causes:

- Duplicate procurement at a national scale
- Inconsistent specifications and quality failures
- Zero national visibility into CPSE material holdings
- Blocked interoperability between PSU ERP systems

### 1.2 Solution

PRAKALP assigns every CPSE material a single **Central National Material Code (CNMC)** — a 16-digit structured code — mapped back to all local codes across CPSEs, governed by a structured review process before finalization.

---

## 2. Core Roles & Users

| Role | Description |
|---|---|
| **CPSE Data Steward** | CPSE plant official who uploads material data, views quality alerts, searches for CNMC mappings, and requests new codes |
| **Technical Reviewer** | Domain expert who reviews pending match pairs, approves or rejects matches, raises clarifications |
| **National Admin** | GoI-level admin who manages CPSEs, categories, trust-score thresholds, the registry, and views analytics |

---

## 3. Key Features (MVP Scope)

### CPSE Data Steward Portal
- Upload material master CSV
- Data validation against quality schema
- Field mapping interface
- CNMC search and lookup
- View National Material Passport
- New code request flow with duplicate prevention
- Receive and respond to clarification requests

### Technical Reviewer Portal
- Pending match queue with trust scores
- Side-by-side record comparison
- Why Matched / Why Not Matched reasoning panels
- Approve or send for clarification
- Track clarification status

### National Admin Portal
- CPSE management (add/edit CPSE)
- Material category and template management
- Trust score threshold configuration
- Full CNMC Registry view
- National analytics dashboard
- Full audit log
- Dispute resolution interface

---

## 4. Prototype Constraints

> **This is a frontend prototype only.** There is no backend server, no database, no running ML model.

- All "computed" results (match trust scores, quality alerts, match rationale) are pre-stored as static CSV/JSON files
- All "write" operations (approvals, alert resolutions) are in-memory only and reset on page refresh
- Login is a role-picker, not real authentication
- CNMC codes are generated using the 16-digit rule system (see `DATA_MODEL.md`)

---

## 5. Success Metrics (Hackathon Demo)

- A judge can log in as each of the 3 roles and navigate all primary flows
- A match approval successfully generates a CNMC + National Material Passport
- The download button on PassportCard exports a real CSV file
- The 16-digit CNMC codes are structurally valid (correct Luhn checksum)
- No placeholder text, demo notices, or prototype warnings appear anywhere in the UI
