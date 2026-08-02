# Tadex Web API & Frontend Gap Analysis

This document provides a precise mapping between existing backend engine capabilities (`Tadex`) and the missing Web API endpoints (`FastAPI`) and Web Frontend components (`tadex-landing2`) required for full platform parity.

---

## 1. Backend Capability vs. Web API & Frontend Parity Matrix

| Existing Backend Capability | FastAPI Web API Exists | Web Frontend Exists | Target FastAPI Route | Target Frontend Component | Priority |
|---|---|---|---|---|---|
| **User Registration** | **✅ Yes** (`POST /api/v1/auth/register`) | **✅ Yes** (`/register`) | `/api/v1/auth/register` | `src/app/register/page.tsx` | Complete |
| **User Login** | **✅ Yes** (`POST /api/v1/auth/login`) | **✅ Yes** (`/login`) | `/api/v1/auth/login` | `src/app/login/page.tsx` | Complete |
| **Token Refresh** | **✅ Yes** (`POST /api/v1/auth/refresh`) | **✅ Yes** (`ProtectedRoute`) | `/api/v1/auth/refresh` | `src/lib/api-client.ts` | Complete |
| **Logout & Revocation** | **✅ Yes** (`POST /api/v1/auth/logout`) | **✅ Yes** (`/dashboard`) | `/api/v1/auth/logout` | `src/app/dashboard/page.tsx` | Complete |
| **User Profile Verification** | **✅ Yes** (`GET /api/v1/me`) | **✅ Yes** (`/dashboard`) | `/api/v1/me` | `src/app/dashboard/page.tsx` | Complete |
| **Exchange API Keys Management** | **❌ No** | **❌ No** | `/api/v1/keys` | `ApiKeyManager.tsx` | **Critical (P1)** |
| **Active Positions Feed** | **❌ No** | **❌ No** | `/api/v1/trading/positions` | `PositionsTable.tsx` | **Critical (P1)** |
| **Orders & Execution History** | **❌ No** | **❌ No** | `/api/v1/trading/orders` | `OrdersTable.tsx` | **High (P2)** |
| **Signal Feed & Logs** | **❌ No** | **❌ No** | `/api/v1/trading/signals` | `SignalsFeed.tsx` | **High (P2)** |
| **Billing Plans Directory** | **❌ No** | **❌ No** | `/api/v1/billing/plans` | `PricingGrid.tsx` | **High (P2)** |
| **Multi-Currency Checkout Quote** | **❌ No** | **❌ No** | `/api/v1/billing/checkout-quote` | `CheckoutModal.tsx` | **High (P2)** |
| **User Subscription Status** | **❌ No** | **❌ No** | `/api/v1/billing/subscription` | `SubscriptionCard.tsx` | **High (P2)** |
| **User Execution Settings** | **❌ No** | **❌ No** | `/api/v1/settings/execution` | `ExecutionSettings.tsx` | **Medium (P3)** |
| **Provider Directory & Profiles** | **❌ No** | **❌ No** | `/api/v1/providers` | `ProviderDirectory.tsx` | **Medium (P3)** |
| **Admin & Audit Governance** | **❌ No** | **❌ No** | `/api/v1/admin/*` | `AdminDashboard.tsx` | **Low (P4)** |

---

## 2. API Endpoint Specification Requirements for Phase 2

### 2.1 Exchange API Keys (`app/api/keys.py`)
- `GET /api/v1/keys`: List active exchange credentials (returns masked API key, exchange name, permission scope, and connection health status).
- `POST /api/v1/keys`: Submit Bybit API Key + Secret. Validates trade-only permissions, encrypts payload via AES-256 (`supabase_client.store_user_api_keys`), and persists record in `public.user_exchange_keys`.
- `DELETE /api/v1/keys/{key_id}`: Revoke and remove saved exchange API key.

### 2.2 Trading & Position Monitoring (`app/api/trading.py`)
- `GET /api/v1/trading/positions`: Query active positions from `public.positions` for authenticated user (returns symbol, side, size, entry price, unrealized PnL, leverage, stop-loss, take-profit).
- `GET /api/v1/trading/orders`: Query recent order execution history from `public.orders` with status filters (`pending`, `filled`, `cancelled`).
- `GET /api/v1/trading/signals`: Query signal execution logs from `public.execution_logs`.

### 2.3 Multi-Currency Billing (`app/api/billing.py`)
- `GET /api/v1/billing/plans`: Query active provider plans from `public.provider_plans` with multi-currency pricing configurations.
- `POST /api/v1/billing/checkout-quote`: Accept `{ plan_id, currency, duration_months }`, invoke `BillingService.resolve_checkout_quote`, and return explicit itemized price breakdown (base price, platform fee, total due).
- `GET /api/v1/billing/subscription`: Retrieve active user subscription details and pending renewal notifications from `public.subscriptions`.

### 2.4 Execution Settings (`app/api/settings.py`)
- `GET /api/v1/settings/execution`: Query user risk settings from `public.user_settings` (`margin_usdt_per_trade`, `execution_mode`, `max_leverage`).
- `PUT /api/v1/settings/execution`: Update user risk parameters with strict preflight validation.
