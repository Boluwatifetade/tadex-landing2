# Tadex Platform Feature Matrix

This document provides a comprehensive verification matrix mapping every major feature of the Tadex platform across the Frontend application (`tadex-landing2`), API Endpoints, Backend Services (`Tadex`), Database Tables, Documentation, and Test Coverage.

---

## Feature Verification Matrix

| Major Feature | Frontend Component / Page | API Endpoint | Backend Service | Database Tables | Documentation Status | Test Coverage | Classification |
|---|---|---|---|---|---|---|---|
| **User Web Registration** | `/register`<br>(`react-hook-form` + `zod`) | `POST /api/v1/auth/register` | FastAPI (`app/api/auth.py`) | `public.users` | Verified (`docs/API_CONTRACT.md`) | Backend `test_auth.py`<br>(0% Frontend) | **Verified** |
| **User Web Login** | `/login`<br>(`react-hook-form` + `zod`) | `POST /api/v1/auth/login` | FastAPI (`app/api/auth.py`), `security.py` | `public.users`, `public.refresh_tokens` | Verified (`docs/API_CONTRACT.md`) | Backend `test_auth.py`<br>(0% Frontend) | **Verified** |
| **Token Refresh & Session Restoration** | `ProtectedRoute.tsx`, `api-client.ts` | `POST /api/v1/auth/refresh` | FastAPI (`app/api/auth.py`) | `public.refresh_tokens` | Verified (`docs/API_CONTRACT.md`) | Backend `test_auth.py`<br>(0% Frontend) | **Verified** |
| **Session Revocation (Logout)** | `/dashboard`<br>("Log Out" button) | `POST /api/v1/auth/logout` | FastAPI (`app/api/auth.py`) | `public.refresh_tokens` | Verified (`docs/API_CONTRACT.md`) | Backend `test_auth.py`<br>(0% Frontend) | **Verified** |
| **User Identity Verification (`/me`)** | `/dashboard`<br>(`useEffect` fetch) | `GET /api/v1/me` | FastAPI (`app/api/auth.py`) | `public.users` | Verified (`docs/API_CONTRACT.md`) | Backend `test_auth.py`<br>(0% Frontend) | **Verified** |
| **Exchange API Key Management** | **Missing**<br>(Static card placeholder) | **Missing in Web API**<br>(Telegram bot `/api_key` only) | `bybit_client/supabase_client.py` | `public.user_exchange_keys` | Mentioned in PDF Spec & `AGENTS.md` | Backend `test_credential_decryption_hotfix.py` | **Inconsistent** (Telegram bot has backend logic; Web App missing UI & API) |
| **Signal Parsing & Execution Engine** | **Missing**<br>(Static table placeholder) | **Missing in Web API** | `bybit_client/dispatcher.py`, `executor/` | `public.orders`, `public.positions`, `public.execution_logs` | PDF Spec, `AGENTS.md` | Extensive (`test_semantic_execution.py`, `test_phase3n6_execution_verification.py`) | **Partial** (Engine complete in Telegram bot; missing Web integration) |
| **Multi-Currency Billing & Checkout** | `/` (Pricing UI + Waitlist Modal) | **Missing in Web API**<br>(Telegram `bcurr:` callbacks) | `bybit_client/billing/` (`billing_service.py`, `billing_policy.py`) | `public.subscriptions`, `public.billing_transactions`, `public.platform_fee_configs` | Backend `CHANGELOG.md` (`3N.11.8`) | Extensive (`test_buyer_currency_picker_flow.py`, `test_checkout_quote_*`) | **Inconsistent** (Engine complete in Telegram bot; Web missing checkout) |
| **Provider Directory & Subscriptions** | **Missing** | **Missing in Web API** | `bybit_client/telegram_bot.py` (Provider module) | `public.providers`, `public.provider_plans`, `public.subscriptions` | Backend `CHANGELOG.md` (`3N.11.7e`) | `test_provider_application_flow.py`, `test_phase3e_provider_plan_ux.py` | **Missing** (Web Frontend missing provider UI) |
| **Admin & Audit Governance** | **Missing** | **Missing in Web API** | `bybit_client/telegram/handlers/admin_billing.py`, `admin_audit.py` | `public.admin_roles`, `public.audit_logs`, `public.events_log` | Backend `CHANGELOG.md` (`3N.11.7c-phase-b`) | `test_admin_billing_handlers.py`, `test_audit_governance.py` | **Missing** (Web Frontend missing Admin dashboard) |
| **Public Landing Page & Marketing** | `/` (Hero, Pricing, Features, FAQ, Security) | Next.js API `/api/waitlist`, `/api/plan-waitlist` | Next.js Serverless + `@supabase/supabase-js` | `public.waitlist`, `public.plan_waitlist` | `README.md`, `audit/features-mapping.md` | 0% automated tests | **Verified** |
| **Legal & Compliance Pages** | `/privacy`, `/terms`, `/security` | Static content | Next.js static pages | N/A | `docs/compliance-rules.md`, `docs/compliance-specification.md` | N/A | **Verified** |

---

## Detailed Classification Legend

- **Verified**: Fully implemented in code, matching API contracts, documented, and tested (or verified functional).
- **Partial**: Backend engine/logic exists, but Frontend UI or Web API route integration is only partially wired or represented as a stub.
- **Missing**: Functionality completely absent from the Web Frontend application.
- **Inconsistent**: Implemented in Telegram bot / backend reference, but completely disconnected from or misaligned with Web Frontend expectations.
