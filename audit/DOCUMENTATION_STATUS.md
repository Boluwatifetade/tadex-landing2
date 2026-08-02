# Tadex Platform Documentation Audit & Status Report

This document cataloging the current status of all documentation across `tadex-landing2` and `Tadex`, logging identified discrepancies between documentation and implementation, and classifying each document according to strict validation rules.

---

## Documentation Classification Inventory

| Document Path | Scope | Status Classification | Verified Against Code | Notes / Last Updated |
|---|---|---|---|---|
| `tadex-landing2/AGENTS.md` | Frontend Agent Rules | **Current** | Verified | Governs frontend dev rules & tokens |
| `tadex-landing2/GEMINI.md` | Antigravity Operational Rules | **Current** | Verified | Mandates test verification & DB migration rules |
| `tadex-landing2/README.md` | Frontend Project Guide | **Outdated** | Conflict Identified | Contains boilerplate Next.js text |
| `tadex-landing2/docs/API_CONTRACT.md` | Web API Contract Spec | **Partial** | Verified (Auth only) | Covers Auth `/api/v1/auth/*`; missing Trading/Billing |
| `tadex-landing2/docs/CHANGELOG.md` | Frontend Changelog | **Current** | Verified | Updated up to 2026-07-26 (`1.0.0-auth` integration) |
| `tadex-landing2/docs/compliance-rules.md` | Legal & Regulatory Spec | **Current** | Verified | Non-custodial rules for NG/KE/GH |
| `tadex-landing2/docs/compliance-specification.md` | Technical Compliance Spec | **Current** | Verified | Trade-only key requirements & risk disclosure |
| `tadex-landing2/Tadex_Frontend_Production_Checklist.md` | Production Release Checklist | **Incomplete** | Needs Reconcile | Contains unverified items |
| `tadex-landing2/audit/features-mapping.md` | Early Landing Features Map | **Historical** | Verified | Initial landing page mapping |
| `tadex-landing2/audit/compliance-risk-report.md` | Risk Audit Report | **Historical** | Verified | Compliance audit document |
| `Tadex/docs/API_CONTRACT.md` | Backend API Contract | **Current** | Verified | OpenAPI 3.1 auth specification |
| `Tadex/docs/CHANGELOG.md` | Backend Changelog | **Current** | Verified | Updated to version `3N.11.8-currency-picker-fix` |
| `Tadex/bybit-client/COMMANDS_AND_ENV_REFERENCE.md` | Engine & Bot Commands | **Current** | Verified | Complete reference for Telegram bot & env vars |
| `Tadex/Tadex_Web_Implementation_Design_Specification.pdf` | Master Product Spec | **Historical** | Verified | Original product design specification |

---

## Logged Documentation Discrepancies

### Discrepancy 1: `README.md` Boilerplate vs. Actual Application
- **Document**: `tadex-landing2/README.md`
- **Issue**: File contains default `create-next-app` template text without describing Tadex trading architecture, environment variable requirements (`NEXT_PUBLIC_API_BASE_URL`), or backend reference path (`C:\Users\user\Documents\Tadex`).
- **Action**: Update `README.md` with complete project context, tech stack, configuration guide, and backend reference instructions while preserving historical context.

### Discrepancy 2: Scope of `API_CONTRACT.md`
- **Document**: `tadex-landing2/docs/API_CONTRACT.md`
- **Issue**: Contract documents authentication endpoints (`/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`, `/me`), but omits endpoints required for API Key Management, Trading Signals, Positions, and Billing.
- **Action**: Add explicit contract extension section detailing planned OpenAPI definitions for `/api/v1/keys`, `/api/v1/trading/*`, and `/api/v1/billing/*`.

### Discrepancy 3: Backend Location Path References
- **Document**: Various frontend docs referencing legacy backend repositories.
- **Issue**: Frontend documentation should point strictly to `C:\Users\user\Documents\Tadex`.
- **Action**: Standardize all backend references to `C:\Users\user\Documents\Tadex`.
