# CHANGELOG — Tadex Web Frontend

All notable changes to the Tadex Web Frontend (`tadex-landing2`) will be documented in this file.

---

## [Account Settings Page: Password Change & Logout-All] - 2026-08-14

### Added & Wired
- **Account Settings Page (`src/app/dashboard/settings/page.tsx`, `AccountSettings.tsx`)**:
  - Added new `/dashboard/settings` route nested in dashboard layout with `ProtectedRoute` and `ErrorBoundary`.
  - Added `Settings` link to `DashboardHeader` nav items across both desktop navigation and responsive mobile menu drawer.
- **Password Change Form (`AccountSettings.tsx`)**:
  - React Hook Form + Zod schema validation requiring current password, new password (min 8 chars), and confirm password match.
  - Wired to `POST /auth/change-password`. On 204 success, displays clear confirmation: `"Your password has been changed successfully. You've been logged out of all other devices."`.
  - Handled invalid current password error message (`"Current password is invalid"`).
- **Log Out of All Devices (`AccountSettings.tsx`)**:
  - Deliberately separated security section with an inline confirmation gate before executing destructive action.
  - Wired to `POST /auth/logout-all`. On 204 success, clears local auth state (`useAuthStore.clear()`) and redirects user to `/login`.
- **Automated Tests & Backend Verification (`src/test/AccountSettings.test.tsx`, `tests/test_password_change_revokes_all_existing_sessions.py`, `tests/test_logout_all_devices.py`)**:
  - Added Vitest unit test suite covering password change success, wrong current password error, password mismatch validation, logout-all confirmation gate, and logout-all redirect to `/login`.
  - Verified against backend contract: `POST /auth/change-password` revokes all active refresh tokens in DB and deletes refresh cookie while keeping in-memory access token valid; `POST /auth/logout-all` revokes all refresh tokens and terminates current session.
  - **Operational Revocation Nuance**: `logout-all` is immediate on refresh, page navigation, or cookie-based token refresh check; a tab left open and completely idle could theoretically retain access for up to 15 minutes until its access token naturally expires.

---

## [Mobile Responsiveness Overhaul] - 2026-08-13

### Fixed & Enhanced
- **Priority 1: Checkout Quote Modal Scroll Container (`CheckoutQuoteModal.tsx`)**:
  - Added `max-h-[90vh] overflow-y-auto` to the modal content card container.
  - Resolved revenue-blocking mobile bug where the primary CTA button (`Proceed to Payment`) and security disclaimer clipped offscreen on short viewports (375x667).
- **Priority 2: Dashboard Navigation Drawer (`DashboardHeader.tsx`)**:
  - Implemented responsive mobile hamburger toggle button (`md:hidden`).
  - Added collapsible slide-down mobile navigation drawer providing access to all 6 destinations (`Overview`, `API Keys`, `Trading`, `Browse Providers`, `All Plans`, `Log Out`) and user session badges on 375px/390px viewports without horizontal clipping.
- **Priority 3: Responsive Mobile Trade Card Views (`OrdersTable.tsx`, `PositionsTable.tsx`)**:
  - Replaced horizontal-scroll table layouts on `< sm:` viewports with stacked, high-readability key-value card views.
  - Added mobile `<select>` dropdown for order status filtering, replacing overcrowded filter buttons on mobile viewports.
  - Preserved standard multi-column desktop tables on `sm:` viewports and above.
- **Priority 4: Connected Key Card Header Flex Layout (`ApiKeyManager.tsx`)**:
  - Applied `flex-wrap` and gap spacing to connected exchange key card headers, ensuring exchange title, `Mainnet/Testnet` badges, `Active` status badges, and `Disconnect` buttons wrap cleanly on 375px viewports.
- **Automated Tests (`src/test/DashboardHeader.test.tsx`, `CheckoutQuoteModal.test.tsx`, `OrdersTable.test.tsx`, `PositionsTable.test.tsx`)**:
  - Added unit tests covering hamburger menu drawer toggle, modal container overflow attributes, mobile select filters, and mobile card view elements.

---

## [Currency Selector & Zero-Decimal JPY Subunit Fixes] - 2026-08-07

### Fixed & Tested
- **Currency Selector Resolution (`src/lib/currency.ts`, `PricingGrid.tsx`, `ProviderDetailView.tsx`)**:
  - Fixed fallback bug where selecting an unpriced currency (e.g. USD) on a single-currency plan (e.g. NGN only) fabricated a converted price using raw numbers (e.g. `$15,000.00`).
  - Added `resolvePlanPrice` helper: if a plan does not support the selected currency, it renders the plan's native base price alongside an explicit pill badge (`Only available in NGN`) rather than fabricating converted figures.
- **Zero-Decimal Currency Subunit Support (JPY, KRW, etc.)**:
  - Updated backend `_cents_to_amount(cents, currency)` in `app/api/billing.py` and `app/api/providers.py` to recognize zero-decimal currencies (`JPY`, `KRW`, `UGX`, `VND`, etc.), mapping 1 subunit = 1 unit (e.g. `1000` cents $\rightarrow$ `1000.0` JPY).
  - Updated frontend `formatCurrencyAmount` in `src/lib/currency.ts` to format zero-decimal currencies without decimal places (`¥1,000` rather than `¥1,000.00`).
- **Regression Tests (`src/test/PricingGrid.test.tsx`, `src/test/ProviderDetailView.test.tsx`, `tests/test_billing_api.py`)**:
  - Added tests verifying unsupported currency selection displays the native currency pill badge without fabricating converted prices.
  - Added tests verifying JPY plans render correctly without decimal places.

---

## [Provider Directory & Provider-First Pricing Restructure] - 2026-08-05

### Added & Restructured
- **ProviderDirectory Component (`src/components/dashboard/ProviderDirectory.tsx`)**:
  - Consumes `GET /api/v1/providers`.
  - Displays signal provider cards with provider name, description, verified badge (`is_verified`), win rate %, total signals executed, subscriber count, and last active timestamp.
  - Added dedicated route `src/app/dashboard/providers/page.tsx` rendering `ProviderDirectory` inside `ProtectedRoute` + `ErrorBoundary`.
- **Provider Detail View (`src/components/dashboard/ProviderDetailView.tsx`)**:
  - Consumes `GET /api/v1/providers/{id}` and `GET /api/v1/providers/{id}/plans`.
  - Displays full provider profile metrics header alongside provider-scoped active execution plans.
  - Action buttons open `CheckoutQuoteModal` with that plan pre-selected.
  - Added nested route `src/app/dashboard/providers/[id]/page.tsx`.
- **Provider Identity Header on Plan Cards (`src/components/dashboard/PricingGrid.tsx`)**:
  - Rendered a prominent provider badge header (icon/avatar + `provider_name` + verified badge) at the top of every card in flat view (`/dashboard/billing`), clarifying provider identity prior to plan selection.
- **Honest Suspended Provider Status Alert (`src/components/dashboard/SubscriptionCard.tsx`)**:
  - Updated `SubscriptionOut` interface to parse `provider_status`.
  - Added high-visibility warning state (`Signal Execution Paused`) when `sub.provider_status === "suspended"`, directly displaying backend notification strings.
- **Dashboard Navigation (`src/components/dashboard/DashboardHeader.tsx`)**:
  - Updated navigation items to frame provider-first browsing vs flat plan browsing intentionally: `"Browse Providers"` (`/dashboard/providers`) vs `"All Plans"` (`/dashboard/billing`).
- **Test Automation (`src/test/`)**:
  - Added `ProviderDirectory.test.tsx` and `ProviderDetailView.test.tsx` verifying provider list rendering, win rate formatting, subscriber counts, scoped plan selection, empty states, and error handling.
  - Updated `PricingGrid.test.tsx` to assert provider identity header rendering.
  - Updated `SubscriptionCard.test.tsx` to assert suspended provider warning state rendering.

---

## [Checkout Payment Integration & Transaction Polling] - 2026-08-05

### Added & Wired
- **Active Checkout Initiation (`src/components/dashboard/CheckoutQuoteModal.tsx`)**:
  - Wired "Proceed to Payment" button to `POST /api/v1/billing/checkout` via `apiClient`.
  - Added full loading state (`isInitiatingPayment` with spinner) while payment initiation is in flight.
  - Redirects browser via `window.location.href = res.authorization_url` to Flutterwave hosted checkout.
- **Return Redirect & Polling Handler (`src/app/dashboard/billing/page.tsx`)**:
  - Parses return query parameters (`status` and `ref`).
  - Displays dynamic status return banners (Verifying, Success, Cancelled, Failed).
  - Polls `GET /api/v1/billing/transactions/{reference}` every 2 seconds (up to 8 attempts / ~16s) to verify payment status against active backend polling sync.
  - Automatically triggers a refresh on `SubscriptionCard` (`refreshTrigger`) upon transaction resolution to `"success"`, updating the UI seamlessly without requiring a full manual page reload.
- **Test Suite Updates (`src/test/CheckoutQuoteModal.test.tsx`) & Schema Fixes**:
  - Added tests asserting active "Proceed to Payment" click triggers `POST /api/v1/billing/checkout` payload and renders loading spinner state.
  - Updated backend `User.telegram_id` model to `Optional[int] = None` and added `tests/test_web_only_users.py` regression suite.
  - **Outstanding Verification Note**: The `telegram_id` nullability fix and web-only-user regression tests are implemented and unit-tested, but not yet live-verified end-to-end against a real web-only test account (no Telegram history) completing an actual payment through the real frontend button. This must be confirmed before considering web-only-user checkout production-safe — outstanding until a test account is available.

---

## [Billing Dashboard View & Transparent Checkout Quote] - 2026-08-04

### Added
- **SubscriptionCard Component (`src/components/dashboard/SubscriptionCard.tsx`)**:
  - Consumes `GET /api/v1/billing/subscription` via `apiClient`.
  - Displays current subscription tier, status badges (`active`, `past_due`, `canceled`), renewal/expiry dates, and system notification alerts.
  - Handles free / demo tier state with a clean *"No active subscription"* prompt.
- **PricingGrid Component (`src/components/dashboard/PricingGrid.tsx`)**:
  - Consumes `GET /api/v1/billing/plans` via `apiClient`.
  - Displays active execution plans, plan descriptions, provider base prices, and multi-currency selector (`NGN`, `USD`, `USDT`, `KES`, `GHS`).
- **CheckoutQuoteModal Component (`src/components/dashboard/CheckoutQuoteModal.tsx`)**:
  - Consumes `POST /api/v1/billing/checkout-quote` via `apiClient`.
  - Provides duration (1, 3, 6, 12 months) and currency selectors.
  - Renders a **trust-critical, transparent itemized cost breakdown**: displays Provider Base Price, Platform Service & Automation Fee as a separate clearly-labeled line item equal in visibility, and Total Checkout Quote.
  - Action button rendered as informational disabled placeholder (*"Proceed to Payment (Integration Coming Soon)"*).
- **Dashboard Navigation**:
  - Added `Billing` tab (`/dashboard/billing`) to `DashboardHeader.tsx`.
  - Built `src/app/dashboard/billing/page.tsx` route rendering `SubscriptionCard` and `PricingGrid` inside `ProtectedRoute` + `ErrorBoundary`.
- **Test Suites (`src/test/`)**:
  - Added `SubscriptionCard.test.tsx`, `PricingGrid.test.tsx`, and `CheckoutQuoteModal.test.tsx` verifying empty/active subscription states, multi-currency grid switching, and asserting the platform fee line item is present and visibly separate from total quote.

---

## [Trading Dashboard & Positions/Orders View] - 2026-08-03

### Added
- **PositionsTable Component (`src/components/dashboard/PositionsTable.tsx`)**:
  - Consumes `GET /api/v1/trading/positions` via `apiClient`.
  - Displays symbol, side badge ("Buy/Long" vs "Sell/Short"), size, entry price, leverage multiplier, and color-coded unrealized PnL (`text-emerald-500` vs `text-destructive`).
  - Empty state *"No active positions."* and error retry state.
- **OrdersTable Component (`src/components/dashboard/OrdersTable.tsx`)**:
  - Consumes `GET /api/v1/trading/orders` via `apiClient` with status filtering (`all`, `filled`, `pending`, `cancelled`, `failed`).
  - Displays timestamp, symbol, side badge, order type, size, price, status badges, and SL/TP limits.
  - Empty state *"No orders yet."* and error retry state.
- **Dashboard Layout & Navigation**:
  - Added `DashboardHeader.tsx` providing active navigation tabs: `Overview` (`/dashboard`), `API Keys` (`/dashboard/keys`), and `Trading` (`/dashboard/trading`).
  - Added dedicated route `src/app/dashboard/trading/page.tsx` rendering `PositionsTable` and `OrdersTable` inside `ProtectedRoute` + `ErrorBoundary`.
- **Test Suites (`src/test/`)**:
  - Added `PositionsTable.test.tsx` and `OrdersTable.test.tsx` verifying empty states, populated data rendering with color-coded PnL/status badges, and error state retries.

---

## [Frontend Test Framework & Core Test Suite] - 2026-08-03

### Added & Resolved (TD-CRIT-01)
- **Vitest & React Testing Library Infrastructure**:
  - Added `vitest.config.ts` and `src/test/setup.ts` configured for `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and v8 coverage.
  - Added `"test": "vitest run"` and `"test:coverage": "vitest run --coverage"` scripts to `package.json`.
- **Core Security & Auth Module Test Suites (`src/test/`)**:
  - `auth-store.test.ts`: 100% coverage on Zustand store token setting, clearing, and `isAuthenticated` derivation.
  - `api-client.test.ts`: Tests 401 $\rightarrow$ refresh $\rightarrow$ retry flow, single-in-flight refresh promise locking, and session expiry error handling.
  - `ProtectedRoute.test.tsx`: Tests in-memory token rendering, silent session restoration, and delayed login redirection timing.
  - `ApiKeyManager.test.tsx`: Tests empty state rendering, masked key card display, 400 withdrawal security policy rejection alert, and 2-step disconnect confirmation.
- **Technical Debt Resolved**: Updated `audit/TECHNICAL_DEBT.md` marking `TD-CRIT-01` resolved for core security, authentication, and key management modules.

---

## [ApiKeyManager UI] - 2026-08-03

### Added
- **Exchange API Key Management Component (`src/components/dashboard/ApiKeyManager.tsx`)**:
  - Consumes `GET /api/v1/keys`, `POST /api/v1/keys`, and `DELETE /api/v1/keys/{id}` endpoints via `apiClient`.
  - Displays loading skeleton on fetch and empty state when no keys are connected (*"No exchange connected yet — connect Bybit to start trading"*).
  - Displays connected key cards with masked key representation (`...a1b2`), environment badge ("Testnet" / "Mainnet"), status, and formatted creation date. Zero code path assumes full key/secret returned by backend.
  - Security Explainer Panel explicitly instructing users to create trade-only API keys on Bybit with **Withdrawal DISABLED**.
  - Form connects Bybit keys with multi-second verification loading state (*"Verifying Bybit Permissions..."*).
  - Handles 400 withdrawal-rejection error specifically: displays a prominent security policy rejection alert box with actionable instructions on how to disable withdrawal on Bybit.
  - 2-step confirmation step for key revocation (`DELETE /api/v1/keys/{id}`).
  - Built strictly using semantic design tokens (`bg-card`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-destructive`, `bg-secondary`).
- **Dashboard Integration**:
  - Integrated `ApiKeyManager` into `src/app/dashboard/page.tsx`, updating the "Exchange API Keys" quick metric card with live connected key count.
  - Added dedicated route `src/app/dashboard/keys/page.tsx` wrapped with `ProtectedRoute` and `ErrorBoundary`.

---

## [Audit & Reconciliation] - 2026-08-02

### Added & Reconciled
- **Comprehensive Platform Engineering Audit**:
  - Reconstructed complete platform state across active Web Frontend (`tadex-landing2`) and reference Backend (`C:\Users\user\Documents\Tadex`).
  - Generated 7 specialized audit deliverables inside `audit/`:
    - [`TADEX_PLATFORM_AUDIT_REPORT.md`](file:///C:/Users/user/Documents/tadex-landing2/audit/TADEX_PLATFORM_AUDIT_REPORT.md): Master 18-section engineering audit report.
    - [`ARCHITECTURE_READINESS.md`](file:///C:/Users/user/Documents/tadex-landing2/audit/ARCHITECTURE_READINESS.md): Backend module reusability, Telegram coupling, and FastAPI refactoring needs.
    - [`API_GAP_ANALYSIS.md`](file:///C:/Users/user/Documents/tadex-landing2/audit/API_GAP_ANALYSIS.md): Existing backend capabilities mapped against missing FastAPI endpoints and Web UI.
    - [`FEATURE_MATRIX.md`](file:///C:/Users/user/Documents/tadex-landing2/audit/FEATURE_MATRIX.md): Cross-verification matrix (Frontend $\rightarrow$ API $\rightarrow$ Backend $\rightarrow$ DB $\rightarrow$ Tests).
    - [`TECHNICAL_DEBT.md`](file:///C:/Users/user/Documents/tadex-landing2/audit/TECHNICAL_DEBT.md): Prioritized debt registry (Critical, High, Medium, Low).
    - [`DOCUMENTATION_STATUS.md`](file:///C:/Users/user/Documents/tadex-landing2/audit/DOCUMENTATION_STATUS.md): Documentation inventory, classifications (`Current`, `Outdated`, `Historical`), and discrepancy logs.
    - [`NEXT_STEPS.md`](file:///C:/Users/user/Documents/tadex-landing2/audit/NEXT_STEPS.md): Dependency-ordered implementation roadmap for Phase 1 through Phase 4.
  - Reconciled `README.md` and `docs/API_CONTRACT.md` with backend reference paths (`C:\Users\user\Documents\Tadex`).

---

## [Unreleased] - 2026-07-26

### Added
- **Backend API Contract Specification**: Added canonical `/docs/API_CONTRACT.md` detailing all OpenAPI 3.1 auth endpoints (`/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`, `/me`).
- **Core Auth Utilities (`src/lib/`)**:
  - `auth-store.ts`: Zustand store for in-memory access token management (`accessToken`, `isAuthenticated`, `setAccessToken`, `clear`). Deliberately not persisted in `localStorage`/`sessionStorage`.
  - `api-client.ts`: Central fetch wrapper supporting automatic 401 token refresh (`/auth/refresh`), single in-flight refresh promise locking, envelope parsing, and FastAPI exception detail extraction.
- **Authentication Pages**:
  - `/login`: Form using `react-hook-form` + `zod` validation, calling `POST /auth/login`, setting access token in memory, and redirecting to `/dashboard`. Styled strictly using semantic design tokens (`bg-background`, `bg-card`, `bg-primary`, `border-input`, etc.) with zero hardcoded hex colors.
  - `/register`: Registration form using `react-hook-form` + `zod` (email validation, password min 8 chars). Implements auto-login flow by chaining `POST /auth/register` and `POST /auth/login` to seamlessly store access token and redirect to `/dashboard`.
- **Protected Trading Shell**:
  - `ProtectedRoute.tsx`: Client-side route wrapper enforcing strict session restoration ordering on mount: (1) Check in-memory `accessToken` -> (2) If null, attempt `POST /auth/refresh` using httpOnly cookie -> (3) If successful, set token in store & render -> (4) If refresh fails, clear state & redirect to `/login`.
  - `/dashboard`: Protected trading app shell displaying user session status fetched via `GET /me` and a **Log Out** button wired to `POST /auth/logout` + `useAuthStore.clear()`.
- **Landing Page Navigation**:
  - Updated `/` navbar with direct links to "Log In" (`/login`) and "Register" (`/register`).

---

### Verification Note & Manual Testing Status

#### Verified Locally (Compilation & Contract Safety)
- Type safety verified via `npx tsc --noEmit`.
- Next.js build verification succeeded.
- `.env.local` configured with `NEXT_PUBLIC_API_BASE_URL=https://api.tadexapp.com/api/v1` and confirmed gitignored under `.env*`.
- Form validation rules for email and password constraints tested.

#### Required Live Staging Testing (Manual Verification Checklist)
Before pushing to production, execute the following manual test flow against the live backend (`https://api.tadexapp.com`):
1. **Login & Register Flow**:
   - Register a test user at `/register` -> Confirm auto-login receives `access_token` and sets httpOnly `tadex_refresh` cookie on `https://api.tadexapp.com`.
   - Confirm immediate redirect to `/dashboard`.
2. **Page Reload Session Restoration**:
   - Hard refresh (`F5` / `Ctrl+R`) on `/dashboard`.
   - Verify `ProtectedRoute` intercepts null in-memory token, fires `POST /auth/refresh`, recovers access token via cookie, and renders `/dashboard` without prompting for login.
3. **Silent Token Expiration Refresh**:
   - Wait for access token to expire (or force a 401 response on an API call).
   - Perform an action on `/dashboard` -> Confirm `apiClient` triggers background `refreshAccessToken()`, retries the failed request once silently, and completes the action without interrupting the user.
4. **Logout Action**:
   - Click "Log Out" on `/dashboard` -> Confirm `POST /auth/logout` revokes token and clears the `tadex_refresh` cookie.
   - Confirm navigation to `/login` and verify visiting `/dashboard` subsequently redirects to `/login`.
