# Tadex Platform Technical Debt Report

This document cataloging and prioritizes technical debt identified across the active Web Frontend repository (`tadex-landing2`) and the reference Backend repository (`Tadex`).

---

## Technical Debt Severity Summary

| Severity | Count | Primary Impact Area | Immediate Action Required |
|---|---|---|---|
| **Critical** | 3 | Auth Security, API Key Integration, Test Automation | Yes (Before feature development) |
| **High** | 3 | Web API Coverage, Dashboard Architecture, Backend Refactoring | Yes (Phase 1 Development) |
| **Medium** | 4 | Migration Synchronization, Config Duplication, Schema Cleanup, Bot Key Parity | Scheduled maintenance |
| **Low** | 2 | Form Schema Sharing, Documentation Alignment | Minor refactoring |

---

## Technical Debt Registry

### 1. Critical Severity Items

#### TD-CRIT-01: Frontend Test Framework Setup [RESOLVED - Core Modules Covered]
- **Location**: `tadex-landing2/` (`vitest.config.ts`, `src/test/`)
- **Description**: Vitest + React Testing Library + jsdom setup implemented. Core security, authentication, and credential management modules fully covered with unit and integration test suites:
  - `auth-store.test.ts`: Zustand state setting, clearing, and `isAuthenticated` derivation.
  - `api-client.test.ts`: 401 $\rightarrow$ refresh $\rightarrow$ retry flow, single-in-flight refresh promise locking, and session expiry error handling.
  - `ProtectedRoute.test.tsx`: In-memory session check, silent refresh restoration, and delayed login redirection.
  - `ApiKeyManager.test.tsx`: Empty state, masked key rendering, 400 withdrawal security rejection alert, and 2-step disconnect confirmation.
  - `PositionsTable.test.tsx` & `OrdersTable.test.tsx`: Active positions, PnL formatting, order history status filtering, and error retries.
  - `SubscriptionCard.test.tsx`, `PricingGrid.test.tsx`, & `CheckoutQuoteModal.test.tsx`: Free/active subscription states, multi-currency grid switching, and transparent itemized fee breakdown assertions.
- **Status**: **RESOLVED** (2026-08-04 - 100% coverage on core auth, security, key management, trading, and billing quote modules).

#### TD-CRIT-02: Missing Web API Endpoints & UI for Exchange Credentials
- **Location**: Frontend (`src/app/dashboard/page.tsx`), Backend (`app/api/`)
- **Description**: Backend trading execution requires user exchange API keys stored in `public.user_exchange_keys` (AES-256 encrypted). Currently, API keys can only be linked via Telegram bot (`/api_key`). FastAPI (`app/`) exposes zero endpoints for key management, and the Web Dashboard displays a static "Connected" card placeholder.
- **Risk**: Users registered via the Web App cannot execute trades without opening Telegram to link keys.
- **Recommended Fix**: Add FastAPI endpoints (`POST /api/v1/keys`, `GET /api/v1/keys`, `DELETE /api/v1/keys`) and build an API Key Management component in the Web Dashboard.
- **Estimated Effort**: 3-4 Days.

#### TD-CRIT-03: Hardcoded API Base URL Fallbacks in Client Wrappers
- **Location**: `tadex-landing2/src/lib/api-client.ts`, `src/components/auth/ProtectedRoute.tsx`
- **Description**: `api-client.ts` hardcodes a fallback production URL (`https://api.tadexapp.com/api/v1`) when `NEXT_PUBLIC_API_BASE_URL` is undefined, whereas `ProtectedRoute.tsx` leaves `API_BASE_URL` undefined without a fallback, causing fetch calls to `/auth/refresh` to hit relative `/auth/refresh` on the Next.js server instead of FastAPI.
- **Risk**: Environment misconfiguration in staging/dev could silently hit production endpoints or trigger 404 HTML responses during session restoration.
- **Recommended Fix**: Consolidate `API_BASE_URL` resolution into `src/lib/config.ts` with strict environment variable validation.
- **Estimated Effort**: 0.5 Days.

---

### 2. High Severity Items

#### TD-HIGH-01: Single-Page Dashboard Stub Architecture
- **Location**: `tadex-landing2/src/app/dashboard/page.tsx` (161 lines)
- **Description**: `/dashboard` is a single monolithic client component containing a header, static metric cards, and a placeholder table. There are no sub-routes (e.g. `/dashboard/signals`, `/dashboard/positions`, `/dashboard/settings`, `/dashboard/billing`).
- **Risk**: Monolithic page layout prevents deep linking, tabular navigation, and modular state management for trading UI.
- **Recommended Fix**: Restructure `/dashboard` into a Next.js nested layout (`src/app/dashboard/layout.tsx`) with dedicated sub-routes and Zustand/React Query state hooks.
- **Estimated Effort**: 4-5 Days.

#### TD-HIGH-02: Monolithic Backend Telegram Bot (`telegram_bot.py`)
- **Location**: `Tadex/bybit-client/bybit_client/telegram_bot.py` (1.13 MB, 30,000+ lines)
- **Description**: `telegram_bot.py` contains the entire Telegram bot controller, callback handlers, UI keyboard builders, billing integrations, and admin menus in one file.
- **Risk**: Extremely hard to maintain or refactor. Business logic (e.g. subscription pricing resolution, execution checks) embedded inside bot callbacks cannot be reused easily by the FastAPI web service without extraction.
- **Recommended Fix**: Continue extracting core domain logic into modular service classes (e.g. `billing_service.py`, `execution_service.py`) shared by both FastAPI and Telegram interfaces.
- **Estimated Effort**: Ongoing / Core Refactoring.

#### TD-HIGH-03: Web API Contract Gaps Beyond Authentication
- **Location**: Backend (`app/api/`)
- **Description**: FastAPI currently only implements `/api/v1/auth/` (`register`, `login`, `refresh`, `logout`, `me`). It lacks routes for position monitoring, active orders, signal history, plan subscriptions, and user settings.
- **Risk**: Frontend cannot render real-time trading metrics or billing status.
- **Recommended Fix**: Implement FastAPI route modules: `app/api/trading.py`, `app/api/billing.py`, `app/api/keys.py`, `app/api/settings.py`.
- **Estimated Effort**: 5-7 Days.

---

### 3. Medium & Low Severity Items

#### TD-MED-01: Duplicate Configuration Files (`next.config.js` vs `next.config.ts`)
- **Location**: `tadex-landing2/next.config.js` and `next.config.ts`
- **Description**: Both `.js` and `.ts` config files exist in the root directory. Next.js might resolve one unpredictably depending on build options.
- **Recommended Fix**: Remove `next.config.js` and standardize on `next.config.ts`.
- **Estimated Effort**: 0.1 Days.

#### TD-MED-02: Fragmented Database Migration Repositories
- **Location**: `tadex-landing2/supabase/migrations/` (1 file) vs `Tadex/supabase/migrations/` (54 files)
- **Description**: Frontend contains a standalone migration file `20260527000000_create_waitlist_tables.sql`.
- **Recommended Fix**: Copy `20260527000000_create_waitlist_tables.sql` into backend `supabase/migrations/` to maintain a single canonical database migration history.
- **Estimated Effort**: 0.2 Days.

#### TD-LOW-01: Inline Zod Validation Schemas
- **Location**: `tadex-landing2/src/app/login/page.tsx`, `src/app/register/page.tsx`
- **Description**: Schema definitions for email and password validation are written inline in page files.
- **Recommended Fix**: Extract to `src/lib/schemas/auth.ts`.
- **Estimated Effort**: 0.2 Days.

#### TD-MED-04: Retrofit Telegram Bot Key Submission Flow with Withdrawal Check [RESOLVED]
- **Location**: `bybit_client/telegram_bot.py` (`handle_api_keys`)
- **Description**: Retrofitted `SharedUtils.verify_bybit_key_permissions()` into the Telegram bot's `handle_api_keys` handler pre-storage gate. Mandates rejection of withdrawal-enabled keys with user-facing security messages, matching the `/api/v1/keys` web behavior.
- **Status**: **RESOLVED** (2026-08-03).

#### TD-LOW-02: JPY Subunit Currency Formatting Quirk in PlanPricingService
- **Location**: `Tadex/bybit-client/bybit_client/billing/plan_pricing_service.py`, `app/api/billing.py` (`_cents_to_amount`)
- **Description**: Amount minor unit conversion assumes 2 decimal subunits for all currencies (`amount_cents / 100.0`), resulting in `amount_cents: 12` converting to `0.12` for JPY. Japanese Yen has no fractional subunit in ISO 4217 (100 JPY is written as `100`, not `1.00`).
- **Recommended Fix**: Add a currency-aware exponent lookup (e.g. exponent = 0 for JPY, 2 for NGN/USD/EUR/USDT) in price formatting helpers so JPY minor amounts display accurately to Japanese users.
- **Estimated Effort**: 0.2 Days.

