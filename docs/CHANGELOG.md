# CHANGELOG — Tadex Web Frontend

All notable changes to the Tadex Web Frontend (`tadex-landing2`) will be documented in this file.

---

## [Session Consolidation: Mobile Responsiveness, Account Settings, Checkout Bug Chain & Lifecycle Hardening] - 2026-08-14

### 1. Mobile Responsiveness Overhaul
- **Checkout Quote Modal Scroll Fix (`CheckoutQuoteModal.tsx`)**:
  - Added `max-h-[90vh] overflow-y-auto` to the modal card container, resolving a revenue-blocking bug where the "Proceed to Payment" CTA button and disclaimer were clipped offscreen on short mobile viewports (375x667, 390x844).
- **DashboardHeader Navigation Drawer (`DashboardHeader.tsx`)**:
  - Built a responsive hamburger menu drawer for `< md:` viewports. Ensures all 6 destinations (`Overview`, `API Keys`, `Trading`, `Browse Providers`, `All Plans`, `Settings`) and `Log Out` are fully reachable at 375px with zero horizontal clipping.
- **Responsive Trade Tables Card-Views (`OrdersTable.tsx`, `PositionsTable.tsx`)**:
  - Replaced wide desktop table layouts on narrow viewports (`< sm:`) with clean key-value card views.
  - Added mobile `<select>` dropdown for order status filtering, preventing button wrapping.
- **Key Manager Flex Layout (`ApiKeyManager.tsx`)**:
  - Added `flex-wrap` and gap spacing to connected API key card headers to ensure badges, key masks, and disconnect buttons wrap cleanly on mobile screens.

### 2. Account Settings Page (Password Change & Logout-All)
- **Account Settings Route (`src/app/dashboard/settings/page.tsx`, `AccountSettings.tsx`)**:
  - Created `/dashboard/settings` route nested in the dashboard layout with `ProtectedRoute` and `ErrorBoundary`. Added to desktop and mobile navigation menus.
- **Password Change Form (`AccountSettings.tsx`)**:
  - React Hook Form + Zod validation (current password, new password min 8 chars, confirm match).
  - Wired to `POST /api/v1/auth/change-password`. On success (204), displays explicit confirmation: `"Your password has been changed successfully. You've been logged out of all other devices."`.
- **Log Out Everywhere Security Action (`AccountSettings.tsx`)**:
  - Built a dedicated security card with an inline confirmation dialog.
  - Wired to `POST /api/v1/auth/logout-all`. On 204 success, clears client state (`useAuthStore.clear()`) and redirects to `/login`.
  - Documented operational nuance: access tokens live in memory for up to 15m; revocation is immediate upon page navigation, refresh, or token refresh attempt.

### 3. Web-Only-User Checkout Bug Chain (Discovered & Resolved in Sequence)
- **(a) Checkout Quote 400 Error Surfacing (`CheckoutQuoteModal.tsx`)**:
  - Confirmed `GET /api/v1/billing/checkout-quote` 400 responses were valid backend plan validation (e.g. single-currency `NGN` plan requested in `USD` or unsupported duration).
  - Fixed frontend bug where modal retained stale/cached calculations on 400 instead of displaying a clear error state and disabling the payment CTA.
- **(b) Checkout 403 Email-Verification Gate (`CheckoutQuoteModal.tsx`, `app/api/billing.py`)**:
  - Confirmed `POST /api/v1/billing/checkout` 403 Forbidden was the backend's email verification gate working as designed (`EMAIL_VERIFICATION_REQUIRED`).
  - Added a prominent email-verification-required alert banner to `CheckoutQuoteModal` directing unverified users to verify their email before proceeding.
- **(c) Root Cause: Structured Error Detail Swallowing (`src/lib/api-client.ts`)**:
  - Discovered `apiClient` was dropping dictionary error responses (`detail: { message: "...", code: "EMAIL_VERIFICATION_REQUIRED" }`), collapsing them to `"Request failed with status 403"`.
  - Patched `apiClient` to extract `detail.message || detail.code || JSON.stringify(detail)`, restoring human-readable errors across `CheckoutQuoteModal` and `ApiKeyManager`.
- **(d) Telegram-Origin Email Verification Persistence Fix (`src/app/verify-email/page.tsx`)**:
  - Fixed a data-integrity false-positive where `/verify-email` displayed a green success message even when `email_verified` remained `False` in the database.
  - Enforced strict `if (data?.email_verified === true)` gate before showing success.
- **(e) Payment Reference Interpolation & Polling Loop Deduplication (`billing/page.tsx`, `CheckoutQuoteModal.tsx`)**:
  - Removed leftover Paystack-style `{reference}` template placeholder from `success_url` in `CheckoutQuoteModal.tsx`, which was never substituted by Flutterwave and caused polling to hit `%7Breference%7D`.
  - Updated `billing/page.tsx` to extract real transaction references from `tx_ref`, `ref`, `reference`, or `trxref` while ignoring raw `{reference}` text.
  - Added `useRef` guard to eliminate multiple concurrent polling loops spawned during React re-renders, capped polling at 8 attempts (16s), and wired confirmed payment to `setRefreshTrigger` to auto-activate `SubscriptionCard` without manual refresh.

### 4. Provider Directory & Lifecycle-State Filtering
- **Provider Browsing & Detail Routes (`ProviderDirectory.tsx`, `ProviderDetailView.tsx`)**:
  - Built `/dashboard/providers` and `/dashboard/providers/[id]` displaying verified badges, win rate, subscriber count, and scoped execution plans.
  - Added honest suspended provider status alerts (`Signal Execution Paused`) to `SubscriptionCard`.
- **Live Catalog Hotfix**:
  - Filtered out suspended provider plans from the public pricing catalog in the backend database.

### 5. Currency Display & Subunit Handling
- **Unsupported Currency Fallback (`src/lib/currency.ts`, `PricingGrid.tsx`)**:
  - Fixed pricing display so selecting an unsupported currency renders the plan's native currency base price with an explicit pill badge (`Only available in NGN`) rather than fabricating converted prices.
- **Zero-Decimal Subunit Formatting (`src/lib/currency.ts`, `app/api/billing.py`)**:
  - Added zero-decimal currency support for `JPY`, `KRW`, `UGX`, `VND` (mapping 1 subunit = 1 unit, e.g. `¥1,000` instead of `¥1,000.00`).

---
