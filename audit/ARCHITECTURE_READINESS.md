# Tadex Backend Architecture Readiness Report

This document evaluates the architectural readiness of backend modules in `C:\Users\user\Documents\Tadex\bybit-client\bybit_client\` for direct consumption by the FastAPI Web Application (`app/api/`) during Phase 2 development.

---

## 1. Backend Subsystem Reusability Matrix

| Backend Module | Telegram Coupled | Web Ready | Refactor Needed | Reusability Summary |
|---|---|---|---|---|
| **`BillingService`** (`billing/billing_service.py`) | **No** | **✅ Yes** | **None** | Fully decoupled service class. Resolves multi-currency quotes, platform fee policies, and stale transaction reconciliation via Supabase DB. Directly callable from FastAPI routes. |
| **`PlanPricingService`** (`billing/pricing_service.py`) | **No** | **✅ Yes** | **None** | Handles ISO currency pricing lookups (`NGN`, `USDT`, `USD`, `EUR`, `GBP`, `KES`, `GHS`, `JPY`). 100% decoupled from Telegram UI. |
| **`PositionSizer` & Trade Params** (`trade_params.py`) | **No** | **✅ Yes** | **None** | Pure python calculations for position sizing, margin constraints, risk caps, leverage bounds, and order payloads. |
| **`SignalParser`** (`signal_parser.py`) | **Low** | **✅ Yes** | **Minor** | Text & regex parser converting signal strings into structured trade JSON targets. Fully interface-agnostic. |
| **`AISignalBuilder`** (`ai_signal_builder.py`) | **Low** | **✅ Yes** | **Minor** | LLM/NLP candidate extractor converting unstructured provider signals into validated candidates. Decoupled from bot views. |
| **`SubscriptionEnforcement`** (`subscription_enforcement.py`) | **Low** | **✅ Yes** | **Minor** | Checks user active subscriptions, plan expiry, and tier limits against database tables. Can be wrapped as a FastAPI dependency. |
| **`SupabaseClient`** (`supabase_client.py`) | **No** | **✅ Yes** | **None** | Comprehensive database client handling user CRUD, AES-256 exchange key encryption/decryption, orders, positions, and logs. |
| **`Dispatcher`** (`dispatcher.py`) | **Medium** | **Partial** | **Moderate** | Orchestrates signal distribution and trade placement. Refactoring needed to decouple direct `telegram_sdk` message pushes into an abstract notification bus (supporting WebSockets / Web Push). |
| **`BybitClient` / Execution Engine** (`client.py`, `executor/`) | **Low** | **✅ Yes** | **Minor** | REST/WebSocket wrapper for Bybit V5 API (order placement, position closing, leverage adjustment). Independent of Telegram UI. |
| **`TelegramBotController`** (`telegram_bot.py`) | **Yes** | **❌ No** | **High** | Monolithic 1.13 MB bot controller containing inline keyboard builders, callback query routers, and view text renders. Cannot be used directly by FastAPI. |

---

## 2. Interface-Agnostic Core Subsystems

The backend contains several **interface-agnostic core subsystems** that require zero architectural modification before being exposed via FastAPI:

1. **Multi-Currency Billing & Pricing Engine**:
   - `BillingService.resolve_checkout_quote(user_id, plan_id, chosen_currency)`
   - `BillingService.calculate_platform_fee_for_currency(amount, currency)`
   - Fully unit-tested (e.g. `test_checkout_quote_ngn.py`, `test_checkout_quote_usdt.py`).
2. **Exchange Key Security & Encryption**:
   - `supabase_client.store_user_api_keys(user_id, api_key, api_secret)`
   - Handles AES-256 vault encryption at rest. Fully compatible with web HTTP POST payload ingestion.
3. **Position Sizing & Risk Management**:
   - Computes margin requirements, max leverage caps, and position sizes according to user risk preferences (`user_settings`).
4. **Subscription Lifecycle & Gating**:
   - Validates active subscriber status, handles trial periods, and gates signal execution according to provider plan permissions.

---

## 3. High-Coupling Refactoring Targets

To ensure seamless operation under FastAPI without breaking the existing Telegram bot:

1. **Notification Abstraction (`dispatcher.py`)**:
   - **Current State**: `dispatcher.py` invokes `telegram_sdk.py` directly to send trade execution notifications to users via Telegram chat.
   - **Target State**: Introduce an `EventPublisher` or `NotificationService` interface. When a trade executes, publish an event that dispatches both to Telegram (via bot API) and Web clients (via WebSocket / Server-Sent Events).
2. **Bot Handler Logic Extraction (`telegram_bot.py`)**:
   - **Current State**: Some inline callback handlers in `telegram_bot.py` contain business logic (e.g. validating provider application states or processing refund approvals).
   - **Target State**: Ensure 100% of business validation logic resides in `bybit_client/core/` or `bybit_client/billing/` services, leaving `telegram_bot.py` strictly as a view/routing layer.
