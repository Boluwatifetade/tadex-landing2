# Tadex Platform Technical Debt Report

This document catalogs and prioritizes technical debt identified across the active Web Frontend repository (`tadex-landing2`) and the reference Backend repository (`Tadex`).

---

## Technical Debt Severity Summary

| Severity | Count | Primary Impact Area | Immediate Action Required |
|---|---|---|---|
| **Critical** | 1 | Access Token In-Memory Revocation Nuance | Documented / Accepted behavior |
| **High** | 1 | Backend Bot Controller Refactoring | Ongoing maintenance |
| **Medium** | 3 | Config Duplication, Schema Sync, Error Consistency | Scheduled maintenance |
| **Low** | 1 | Form Schema Extraction | Minor refactoring |

---

## Technical Debt Registry

### 1. Critical Severity Items

#### TD-CRIT-01: Frontend Test Framework Setup [RESOLVED]
- **Location**: `tadex-landing2/` (`vitest.config.ts`, `src/test/`)
- **Description**: Vitest + React Testing Library + jsdom setup implemented. 13 test files (46 tests) covering core auth, security, key management, trading, and billing quote modules.
- **Status**: **RESOLVED** (2026-08-04).

#### TD-CRIT-02: Missing Web API Endpoints & UI for Exchange Credentials [RESOLVED]
- **Location**: Frontend (`src/components/dashboard/ApiKeyManager.tsx`, `/dashboard/keys`), Backend (`app/api/keys.py`)
- **Description**: Implemented AES-256 encrypted exchange key management via FastAPI (`POST /api/v1/keys`, `GET /api/v1/keys`, `DELETE /api/v1/keys`) and built full `ApiKeyManager` UI with masked key display, withdrawal permission rejection gate, and two-step delete confirmation.
- **Status**: **RESOLVED** (2026-08-05).

#### TD-CRIT-03: Hardcoded API Base URL Fallbacks in Client Wrappers [RESOLVED]
- **Location**: `tadex-landing2/src/lib/api-client.ts`, `src/components/auth/ProtectedRoute.tsx`
- **Description**: Consolidated API URL resolution using dynamic origins and environment variables.
- **Status**: **RESOLVED** (2026-08-05).

#### TD-CRIT-04: Session Revocation Lag on Idle Tab Prior to Access Token Expiry [DOCUMENTED / ACCEPTED]
- **Location**: `tadex-landing2/src/lib/auth-store.ts`, `Tadex/app/api/auth.py` (`logout_all`, `change_password`)
- **Description**: `logout-all` and `change-password` revoke all refresh tokens in the database and clear the client's HTTP-only refresh cookie immediately. On refresh, page navigation, or API error, the frontend `ProtectedRoute` and `apiClient` fail to refresh tokens and immediately redirect to `/login`. However, because access tokens live in memory on the client and are valid for up to 15 minutes, an open browser tab left completely idle without firing any API calls or page navigation could theoretically retain access for up to 15 minutes until its in-memory access token naturally expires.
- **Operational Nuance**: Revocation is effectively immediate on any navigation, page refresh, or cookie-based refresh check.
- **Status**: Documented / Accepted behavior for JWT stateless access tokens.

---

### 2. High Severity Items

#### TD-HIGH-01: Single-Page Dashboard Stub Architecture [RESOLVED]
- **Location**: `tadex-landing2/src/app/dashboard/`
- **Description**: Monolithic single page restructured into modular Next.js sub-routes: `/dashboard/keys`, `/dashboard/trading`, `/dashboard/billing`, `/dashboard/providers`, `/dashboard/providers/[id]`, and `/dashboard/settings`.
- **Status**: **RESOLVED** (2026-08-05).

#### TD-HIGH-02: Monolithic Backend Telegram Bot (`telegram_bot.py`) [IN PROGRESS]
- **Location**: `Tadex/bybit-client/bybit_client/telegram_bot.py`
- **Description**: `telegram_bot.py` contains controller logic, callback handlers, and UI keyboard builders.
- **Recommended Action**: Continue extracting shared domain logic into modular service classes (`billing_service.py`, `execution_service.py`) shared by FastAPI and Telegram.
- **Estimated Effort**: Ongoing / Core Refactoring.

#### TD-HIGH-03: Web API Contract Gaps Beyond Authentication [RESOLVED]
- **Location**: Backend (`app/api/`)
- **Description**: Implemented required FastAPI route modules: `app/api/trading.py`, `app/api/billing.py`, `app/api/keys.py`, `app/api/providers.py`, and `app/api/settings.py`.
- **Status**: **RESOLVED** (2026-08-06).

#### TD-HIGH-04: Live End-to-End Verification for Web-Only Checkout Flow [RESOLVED]
- **Location**: `tests/test_web_only_users.py`, `src/components/dashboard/CheckoutQuoteModal.tsx`, `src/app/dashboard/billing/page.tsx`
- **Description**: End-to-end checkout flow live-verified against real Flutterwave gateway on staging backend (`168.144.72.194:8002`): web registration $\rightarrow$ strict email verification $\rightarrow$ quote resolution $\rightarrow$ checkout initiation $\rightarrow$ webhook ingestion $\rightarrow$ bounded polling $\rightarrow$ automatic subscription activation.
- **Status**: **RESOLVED** (2026-08-14).

---

### 3. Medium & Low Severity Items

#### TD-MED-01: Duplicate Configuration Files (`next.config.js` vs `next.config.ts`)
- **Location**: `tadex-landing2/next.config.js` and `next.config.ts`
- **Description**: Both `.js` and `.ts` config files exist in the root directory.
- **Recommended Fix**: Remove `next.config.js` and standardize on `next.config.ts`.
- **Estimated Effort**: 0.1 Days.

#### TD-MED-02: Fragmented Database Migration Repositories
- **Location**: `tadex-landing2/supabase/migrations/` vs `Tadex/supabase/migrations/`
- **Description**: Frontend contains a standalone migration file `20260527000000_create_waitlist_tables.sql`.
- **Recommended Fix**: Copy into backend `supabase/migrations/` to maintain a single canonical database migration history.
- **Estimated Effort**: 0.2 Days.

#### TD-MED-04: Retrofit Telegram Bot Key Submission Flow with Withdrawal Check [RESOLVED]
- **Location**: `bybit_client/telegram_bot.py` (`handle_api_keys`)
- **Description**: Retrofitted `verify_bybit_key_permissions()` into Telegram bot pre-storage gate.
- **Status**: **RESOLVED** (2026-08-03).

#### TD-MED-05: Backend Error-Response Shape Consistency [NEW]
- **Location**: Backend (`app/api/`), Frontend (`src/lib/api-client.ts`)
- **Description**: Only two endpoints currently raise structured dictionary errors (`POST /api/v1/billing/checkout` and `POST /api/v1/keys` using `detail={"message": "...", "code": "EMAIL_VERIFICATION_REQUIRED"}`), while the remainder of the backend returns plain string details (e.g. `detail="Current password is invalid"`). While `apiClient` has been updated to parse both shapes, standardizing all backend error responses on the structured dictionary format (carrying a machine-readable `code` alongside a human-readable `message`) is recommended across all future endpoints to ensure uniform client handling and prevent error-swallowing bugs.
- **Recommended Fix**: Define a standardized Pydantic `ErrorDetail` schema across FastAPI route handlers.
- **Estimated Effort**: 1-2 Days.

#### TD-LOW-01: Inline Zod Validation Schemas
- **Location**: `tadex-landing2/src/app/login/page.tsx`, `src/app/register/page.tsx`
- **Description**: Schema definitions for email and password validation are written inline in page files.
- **Recommended Fix**: Extract to `src/lib/schemas/auth.ts`.
- **Estimated Effort**: 0.2 Days.

#### TD-LOW-02: JPY Subunit Currency Formatting Quirk [RESOLVED]
- **Location**: `Tadex/bybit-client/bybit_client/billing/plan_pricing_service.py`, `app/api/billing.py`, `src/lib/currency.ts`
- **Description**: Zero-decimal currency handling added across backend subunit conversion and frontend currency formatting (`¥1,000` instead of `¥1,000.00`).
- **Status**: **RESOLVED** (2026-08-07).
