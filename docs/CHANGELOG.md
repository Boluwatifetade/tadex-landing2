# CHANGELOG — Tadex Web Frontend

All notable changes to the Tadex Web Frontend (`tadex-landing2`) will be documented in this file.

---

## [Phase Admin-4b: Web Admin Dashboard (System Controls & Execution Engine)] - 2026-08-25

### 1. Navigation & Sub-Navigation (`AdminHeader.tsx`, `AdminExecutionNav.tsx`)
- Promoted `"System Controls"` (formerly "Execution Engine") in `AdminHeader` desktop and mobile drawer navigation from "Coming Soon" stub to active link `/admin/execution`.
- Built shared tabbed sub-navigation `AdminExecutionNav.tsx` providing fast switching across `System Controls & Kill Switch`, `Pipeline Health & Telemetry`, and `Position Reconciliation`.

### 2. High-Gravity Global Emergency Kill Switch (`AdminKillSwitchCard.tsx`, `AdminKillSwitchModal.tsx`)
- Centerpiece of the execution dashboard with permanently visible, heavy-duty visual treatment and pulsing status indicators.
- Displays runtime status (`ACTIVE / NORMAL` vs `EMERGENCY STOP ACTIVE`), source attribution (`Database Override` vs `Default Fallback`), last modified timestamp, and enabled_by actor.
- **Emergency Halt Modal (2-Step Safety Gate)**:
  - *Step 1*: Consequence impact breakdown (instant halt of all new Bybit order dispatches, signal ingestion pause, order placement locking).
  - *Step 2*: Exact uppercase typed phrase `"HALT TRADING"` strictly enforced + mandatory audit reason ($\ge 3$ characters). Submit button is disabled until exact match. Dispatches `POST /api/v1/admin/execution/kill-switch` with `{ enable: true, reason, confirmation_phrase: "HALT TRADING", expected_updated_at }`.
- **Resume Trading Modal (Live Pre-Flight Ping)**:
  - Consumes live Bybit exchange connectivity check (`GET /api/v1/admin/execution/connectivity`, querying Bybit public `/v5/market/time`), displaying real-time exchange status (`online` / `degraded`), latency in ms, server time, verified timestamp, and manual "Re-check Ping" trigger.
  - Re-activation consequences disclosure + mandatory audit reason ($\ge 3$ characters). Dispatches `POST /api/v1/admin/execution/kill-switch` with `{ enable: false, reason, expected_updated_at }`.
- **Optimistic Locking & 409 Conflict Handling**: Passes `expected_updated_at`; when 409 Conflict is returned, surfaces specialized *"State changed since you loaded this page"* banner with a forced state refresh action.

### 3. Spatially Isolated Monitoring Controls (`AdminMonitoringControlsCard.tsx`, `AdminMonitoringModal.tsx`)
- Positioned in a dedicated, visually and spatially separate container per audit guardrail requirements.
- Governs `monitoring_enabled` (WebSocket telemetry stream) and `monitoring_actions_kill_switch` (Automated SL/TP closes).
- Modal with impact disclosures, reason validation ($\ge 3$ characters), optimistic locking, and 409 conflict handling. Dispatches `POST /api/v1/admin/execution/monitoring`.

### 4. Rollout Cohort Distribution Control (`AdminCohortControlCard.tsx`, `AdminCohortModal.tsx`)
- Consumes `GET /api/v1/admin/execution/cohort`.
- Displays real user counts: Total Platform Users, In-Cohort Accounts, Excluded Accounts, and visual progress gauge.
- Modal enabling target rollout percentage adjustment (0–100%) via slider and numeric presets, reason validation ($\ge 3$ characters), optimistic locking, and 409 conflict handling. Dispatches `POST /api/v1/admin/execution/cohort`.

### 5. Read-Only System Controls Matrix (`AdminReadOnlyControlsGrid.tsx`)
- Dynamically loads and renders non-operational controls directly from `ExecutionOverviewResponse.controls` without hardcoding: `beta_mode`, `allow_new_providers`, `allow_new_subscribers`, `max_beta_providers`, `max_beta_subscribers`, `beta_whitelist_enabled`.
- Displays effective values, source badges (`DB Override` vs `Default`), metadata descriptions, and numeric limits.

### 6. Front-and-Center Execution Audit Feed (`AdminExecutionAuditFeed.tsx`)
- Prominently positioned on `/admin/execution`, fetching recent system control and emergency stop actions from `admin_audit_logs`.

### 7. Telemetry & Reconciliation Views
- `/admin/execution/health`: Consumes `GET /api/v1/admin/execution/health` with window selector (6h, 24h, 72h, 7d), rendering signaling ingest rates, dispatch queue rates, and Bybit order success percentages.
- `/admin/execution/reconciliation`: Consumes `GET /api/v1/admin/execution/reconciliation`, rendering open positions vs active monitors alignment, drift status (`CLEAN`), and autonomous corrective action history.

### 8. Automated Tests & Production Build
- Full Vitest suite: 34 test files, 121 tests passing (100%).
- Dedicated Phase Admin-4b test suites:
  - `src/test/AdminKillSwitch.test.tsx` (5 tests passed)
  - `src/test/AdminMonitoringControls.test.tsx` (3 tests passed)
  - `src/test/AdminCohortControl.test.tsx` (3 tests passed)
  - `src/test/AdminExecutionOverview.test.tsx` (3 tests passed)
- Next.js Turbopack build (`next build --turbopack`) completed with zero errors across all 34 routes.
- Live staging backend verification (`168.144.72.194`) passed 100%. Production deployment verified on `https://app.tadexapp.com`.

---

## [Phase Admin-3: Web Admin Dashboard (Billing & Revenue)] - 2026-08-23

### 1. Navigation & Subnavigation (`AdminHeader.tsx`, `AdminBillingNav.tsx`)
- Promoted `"Billing & Revenue"` in `AdminHeader` desktop and mobile drawer navigation from "Coming Soon" stub to active link `/admin/billing/transactions`.
- Built shared tabbed sub-navigation `AdminBillingNav.tsx` providing quick switching across `Transaction Ledger`, `Subscription Ledger`, and `Platform Fees & Splits`.

### 2. Transaction Ledger (`AdminTransactionsTable.tsx`, `src/app/admin/billing/transactions/page.tsx`)
- Consumes `GET /api/v1/admin/billing/transactions` with server-side pagination.
- **Search & Filters**: Debounced search box `q` (Tx ID, Gateway Ref, Email, Username), status filter (`All`, `Success`, `Pending`, `Failed`), gateway filter (`All`, `Flutterwave`, `Paystack`, `Crypto Manual`), currency filter (`All`, `NGN`, `USDT`, `USD`).
- Responsive tabular format on desktop and card layout on mobile with gross amount, platform fee deduction chip, and direct `Diagnostics` link.

### 3. Transaction 360° Diagnostics & Reconcile (`AdminTransactionDetailView.tsx`, `AdminReconcileModal.tsx`)
- Consumes `GET /api/v1/admin/billing/transactions/{id}`.
- 360° Financial Diagnostics: Gross Paid, Platform Retained Fee, Provider Net Payout, and Failure callout banner with `error_message` and `manual_review_status`.
- **Linked Context Cards**: Customer Account (deep link to `/admin/users/[id]`), Signal Provider (deep link to `/admin/providers`), and Associated Subscription.
- **Raw Webhook Payload & Diagnostics Viewer**: Collapsible JSON inspector with syntax styling and one-click "Copy JSON" action.
- **Payment Reconciliation Action Modal (`AdminReconcileModal.tsx`)**: Reconcile action with prominent manual override warning callout and mandatory compliance audit reason ($\ge 3$ characters), dispatching `POST /api/v1/admin/billing/transactions/{id}/reconcile`.

### 4. Cross-User Subscription Ledger & Governance (`AdminSubscriptionLedgerTable.tsx`, `AdminCancelSubscriptionModal.tsx`, `AdminSetSubscriptionStatusModal.tsx`)
- Consumes `GET /api/v1/admin/billing/subscriptions` across all platform users with status, tier, and access state filters.
- **Cancel Subscription Modal**: Mode selection (`immediate` vs `period_end`) with mandatory audit reason ($\ge 3$ characters), dispatching `POST /api/v1/admin/billing/subscriptions/{id}/cancel`.
- **Override Status Modal**: Target status dropdown (`trialing`, `active`, `past_due`, `paused`, `canceled`, `expired`) with mandatory audit reason ($\ge 3$ characters), dispatching `POST /api/v1/admin/billing/subscriptions/{id}/set-status`.

### 5. Platform Fee Configuration & Audit Trail (`AdminPlatformFeesView.tsx`, `AdminUpdateFeeModal.tsx`)
- Consumes `GET /api/v1/admin/billing/fees`.
- Active Fee Cards: Prominently renders **NGN (₦1,500)** and **USDT ($10.00)** with settlement methods and last modified dates.
- Revenue Split Explanation Card: Clarifies automated split formula between Tadex treasury and provider payouts.
- Fee Revision Change History Table: Historical audit log table showing effective dates, currency, fee amounts, and admin IDs.
- **Update Global Fee Modal (High-Consequence Dialog)**: Deliberately designed with extra visual gravity (bold red/amber danger ring, critical badge, immediate revenue split consequence warning callout, major/minor unit conversion, mandatory rationale, and double-confirmation acknowledgment checkmark). Dispatches `POST /api/v1/admin/billing/fees`.

### 6. Automated Tests & Build Verification
- Full Vitest suite: 30 test files, 107 tests passing (100%).
- Dedicated Phase Admin-3 test suites:
  - `src/test/AdminTransactionsTable.test.tsx` (3 tests passed)
  - `src/test/AdminTransactionDetailView.test.tsx` (2 tests passed)
  - `src/test/AdminSubscriptionLedger.test.tsx` (3 tests passed)
  - `src/test/AdminPlatformFees.test.tsx` (2 tests passed)
- Next.js Turbopack build (`next build --turbopack`) completed with zero errors and generated all static and dynamic billing routes.

### 7. Live Backend End-to-End Verification
- Verified all flows on staging backend (`168.144.72.194`):
  - `GET /admin/billing/transactions` $\rightarrow$ 200 OK (55 items, NGN/USDT filtering).
  - `GET /admin/billing/transactions/{id}` $\rightarrow$ 200 OK with payload diagnostics.
  - `POST /admin/billing/transactions/{id}/reconcile` validation check ($<3$ chars rejected with 422).
  - `GET /admin/billing/subscriptions` $\rightarrow$ 200 OK (18 items).
  - Throwaway user & subscription lifecycle $\rightarrow$ `POST /admin/billing/subscriptions/{id}/set-status` $\rightarrow$ 200 OK $\rightarrow$ `POST /admin/billing/subscriptions/{id}/cancel` $\rightarrow$ 200 OK $\rightarrow$ clean database purge.
  - `GET /admin/billing/fees` $\rightarrow$ 200 OK (verified active fees: NGN ₦1,500 / USDT $10.00) $\rightarrow$ `POST /admin/billing/fees` validation check ($<3$ chars rejected with 422).
- Production deployment verified on `https://app.tadexapp.com` (HTTP 200 on all billing routes).

---

## [Phase Admin-2: Web Admin Dashboard (User Management & 360° Profile)] - 2026-08-23

### 1. Navigation Promotion (`AdminHeader.tsx`)
- Promoted `"Users"` in `AdminHeader` desktop navigation from disabled "Coming Soon" stub to active link pointing to `/admin/users`.
- Updated mobile drawer navigation with active "Users" link and updated future stubs label.

### 2. User Directory & 5-Dimension Search (`AdminUserTable.tsx`, `src/app/admin/users/page.tsx`)
- Consumes `GET /api/v1/admin/users` with real-time server pagination (`page`, `per_page`, `total_pages`).
- **5-Dimension Search (`q` query param)**: Single debounced search box hitting backend index across Email, Telegram Username, Telegram ID, User UUID, and Exchange UID.
- **Filtering Controls**: Status dropdown (`All`, `Active`, `Suspended`, `Banned`, `Deleted`), Email Verification dropdown (`All`, `Verified`, `Unverified`), Role dropdown (`All`, `User`, `Admin`), and Auth Origin dropdown (`All`, `Web`, `Telegram`, `Bot`).
- Responsive layout: Full data table on desktop with badge chips and clickable `View 360°` links; streamlined card view on mobile breakpoints.
- Clear error, skeleton loading, and empty state treatments.

### 3. User 360° Detail View (`AdminUserDetailView.tsx`, `src/app/admin/users/[id]/page.tsx`)
- Consumes `GET /api/v1/admin/users/{id}` to assemble comprehensive 360° profile across 6 key modules:
  - **Header Card & Quick Toolbar**: User initial avatar, email, UUID, status badge, role badge, beta tester chip, and contextual action buttons.
  - **Section 1: Identity & Authentication**: Email, verification state, Telegram username (@handle), Telegram User ID, phone number, terms acceptance timestamp, and last seen timestamp.
  - **Section 2: Connected Exchange Accounts (Masked Keys Only)**: Table/cards showing exchange, account name, account type, trading mode, leverage, and `api_key_masked` (e.g. `key_****7890`). Hardened DOM-level security guarantee that no raw API secret or private key is ever requested, transmitted, or rendered.
  - **Section 3: Signal Subscriptions**: Plan name, provider name, tier badge, period start/end dates, and status pill.
  - **Section 4: Signal Provider Profile**: Displays provider brand name, verification tier badge, subscriber count, total signals sent, and deep link to Provider Governance (`/admin/providers`).
  - **Section 5: Billing & Payment Transactions**: Transaction ID, formatted currency amounts, payment method, provider, and status badges.
  - **Section 6: Administrative Audit History**: Timeline of compliance and security audit logs affecting this user account, with action types, admin actor IDs, reasons, and timestamps.

### 4. Administrative Action Modals (`AdminBanUserModal.tsx`, `AdminUnbanUserModal.tsx`, `AdminForceLogoutModal.tsx`, `AdminForceVerifyModal.tsx`)
- **Ban User Modal**: Destructive dialog requiring mandatory justification reason (min 3 characters) before firing `POST /api/v1/admin/users/{id}/ban`.
- **Unban User Modal**: Confirm dialog with optional note firing `POST /api/v1/admin/users/{id}/unban`.
- **Admin Force Logout-All Modal**: Distinct administrative revocation notice (separated from user self-service logout) requiring mandatory justification reason before firing `POST /api/v1/admin/users/{id}/logout-all`.
- **Force Verify Email Modal**: Administrative override modal (only enabled for unverified users) requiring mandatory audit reason before firing `POST /api/v1/admin/users/{id}/force-verify-email`.
- **Resend Verification Button**: One-click action button (only enabled for unverified users) dispatching `POST /api/v1/admin/users/{id}/resend-verification`.

### 5. Automated Tests & Build Verification
- 100% test pass rate across entire repository (26/26 test files, 97/97 tests passing).
- Dedicated test suites:
  - `src/test/AdminUserTable.test.tsx` (4 tests)
  - `src/test/AdminUserDetailView.test.tsx` (5 tests) — includes DOM-level secret leak assertions.
- Next.js production build (`next build --turbopack`) completed with zero errors and generated both `/admin/users` and `/admin/users/[id]` static/dynamic routes.

### 6. Live Backend End-to-End Verification
- Verified all flows live on staging backend (`http://127.0.0.1:8002/api/v1`):
  - Admin login & token generation.
  - Directory listing & pagination (26 users).
  - 5-dimension search by email and UUID snippet.
  - Filtering by status (`active`), verification (`email_verified=true`), and role (`admin`).
  - Throwaway user registration $\rightarrow$ 360° detail view $\rightarrow$ resend verification $\rightarrow$ force verify email $\rightarrow$ admin force logout-all $\rightarrow$ ban user $\rightarrow$ unban user $\rightarrow$ audit logs inspection $\rightarrow$ clean database purge of throwaway fixture and 5 audit logs.
- Deployed to production (`https://app.tadexapp.com`) via `origin/main` commit `4c42ab3`.

---

## [Phase Admin-1: Web Admin Dashboard (Overview & Provider Governance)] - 2026-08-18

### 1. Admin Route Guard & Dedicated Layout (`AdminRoute.tsx`, `AdminHeader.tsx`, `layout.tsx`)
- Created `/admin` route tree with strict client-side role guard `AdminRoute.tsx`:
  - Fetches `/me`; redirects non-admin users (`role === 'user'`) directly to `/dashboard`.
  - Redirects unauthenticated sessions directly to `/login`.
- Built `AdminHeader.tsx` featuring brand shield badge, active navigation links (`Overview`, `Providers`, `Applications`, `Verification Queue`), and clearly labeled "Coming Soon" stubs for future phases (`Users`, `Billing & Revenue`, `Execution Engine`, `Audit Logs`).
- Added full mobile drawer navigation supporting all destinations and exit to trading app.

### 2. Platform Overview & Needs Attention Queues (`AdminOverview.tsx`, `src/app/admin/page.tsx`)
- Real-time aggregate KPI metrics fetched from `GET /api/v1/admin/overview`:
  - Registered Users breakdown (Active, Suspended, Banned).
  - Signal Providers count (Active, Verified, Suspended).
  - Connected Exchange API accounts (Bybit active, Revoked).
  - Active Subscriptions breakdown (Total, Trialing, Cancelled).
  - Payment Volume & Transactions (Completed, Pending, Failed).
  - Execution Engine health (24h trade dispatch volume, success rate %, task queue depth).
- Prominent kill switch global alert banner when `kill_switch_enabled` is active.
- **"Needs Attention" Action Cards**: Clickable summary cards deep-linking to pending applications, verification queue dossiers, and suspended providers.

### 3. Provider Directory & Governance (`AdminProviderTable.tsx`, `AdminProviderDetailModal.tsx`, `AdminSuspendModal.tsx`, `src/app/admin/providers/page.tsx`)
- Full provider table with search (name, email, slug), status filtering tabs (`All`, `Active`, `Suspended`, `Verified`, `Deleted`), and pagination.
- Displays identity, owner email, status badge, verification tier badge, subscriber count, signals sent, and win rate %.
- **Admin Provider Detail Drawer**: Extends public provider view with internal owner email, owner user UUID, Telegram channel ID, and suspension/verification approval timestamps.
- **Suspend Provider Modal**: Enforces mandatory justification reason (min 3 characters) for audit trail compliance before firing `POST /api/v1/admin/providers/{id}/suspend`.
- **Unsuspend Action**: Single-confirm dialog before calling `POST /api/v1/admin/providers/{id}/unsuspend`.

### 4. Provider Applications Queue (`AdminApplicationsQueue.tsx`, `src/app/admin/providers/applications/page.tsx`)
- Lists incoming applicant registration submissions with status badges, trading focus chips, experience level, bio, and referral source.
- Status filter tabs (`Pending Review`, `Approved`, `Rejected`, `All Applications`).
- **Approve Action**: Modal with optional provider display name override and optional approval notes, calling `POST /api/v1/admin/providers/{id}/approve`.
- **Reject Action**: Modal enforcing mandatory rejection reason (min 3 characters) visible to applicant for re-application, calling `POST /api/v1/admin/providers/{id}/reject`.

### 5. Verification Review Queue & 5-Section Dossiers (`AdminVerificationQueue.tsx`, `src/app/admin/providers/verification-queue/page.tsx`)
- Full interactive evidence dossier review with collapsible panels for 5 structured sections:
  - **Section 1: Operator Identity** (Legal name, Telegram username, channel link, email, region, methodology).
  - **Section 2: Signal Operation** (Subscriber count, experience duration, execution mode, signal frequency).
  - **Section 3: Trading Evidence** (Exchange UID, clickable public leaderboard/profile links, audit PDF reports).
  - **Section 4: Historical Signals Table** (Structured table with Symbol, Entry, SL, TP, date, outcome, and Telegram post link).
  - **Section 5: Affirmations & Declarations** (5 verified declaration checkmarks).
- **Verify Action**: Modal with tier selection (`basic`, `intermediate`, `advanced`, `premium`, `verified`), review notes, and risk flags calling `POST /api/v1/admin/providers/{id}/verify`.
- **Reject Verification Action**: Modal enforcing mandatory justification reason calling `POST /api/v1/admin/providers/{id}/reject-verification`.

### 6. Automated Tests & Build Verification
- 5 comprehensive test suites with 100% pass rate (18/18 tests passing):
  - `src/test/AdminRoute.test.tsx` (3 tests)
  - `src/test/AdminOverview.test.tsx` (3 tests)
  - `src/test/AdminProviderTable.test.tsx` (5 tests)
  - `src/test/AdminApplicationsQueue.test.tsx` (4 tests)
  - `src/test/AdminVerificationQueue.test.tsx` (3 tests)
- Full production `next build` static page generation passed with exit code 0 across all `/admin/*` routes.

### 7. Live Backend End-to-End Verification
- Verified all flows live on staging backend (`http://127.0.0.1:8002/api/v1`):
  - `GET /admin/overview` $\rightarrow$ 200 OK with real DB metrics.
  - `GET /admin/providers` $\rightarrow$ 200 OK with active/suspended status filtering.
  - `POST /admin/providers/{id}/suspend` $\rightarrow$ 200 OK $\rightarrow$ status flipped to `suspended`.
  - `POST /admin/providers/{id}/unsuspend` $\rightarrow$ 200 OK $\rightarrow$ status restored to `active`.
  - `POST /provider/apply` $\rightarrow$ 201 Created $\rightarrow$ `GET /admin/providers/applications?status=pending` $\rightarrow$ 200 OK $\rightarrow$ `POST /admin/providers/applications/{id}/approve` $\rightarrow$ 200 OK.
  - `POST /admin/providers/{id}/verify` $\rightarrow$ 200 OK with tier level `advanced` $\rightarrow$ `is_verified: true`.

---

## [Provider Portal: Application, Verification, and Plan Management (Phases A & B)] - 2026-08-15

### 1. Provider Portal Router (`src/app/dashboard/provider/page.tsx`)
- Created `/dashboard/provider` route protected with `ProtectedRoute` and `ErrorBoundary`.
- Added `"Provider Portal"` navigation link with `Radio` icon to `DashboardHeader` desktop menu and mobile drawer.
- Implemented 4-state lifecycle router based on `GET /api/v1/provider/me`:
  - **404 Unregistered**: Renders "Become a Signal Provider" value proposition hero with 3 highlight cards (Non-Custodial, Multi-Currency, Verified Trader) and CTA to open `ProviderApplyForm`.
  - **Applicant (Pending Review)**: Renders "Provider Application Under Review" status card with submitted metadata, contact email, experience, and turnaround expectations (24–48h).
  - **Applicant (Rejected / Needs Attention)**: Renders non-approval card displaying `rejection_reason` and an "Update & Re-apply" button opening `ProviderApplyForm` pre-filled.
  - **Provider (Active / Suspended)**: Renders full `ProviderDashboard` with metrics header, plan manager, and verification card.

### 2. Provider Application Flow (`ProviderApplyForm.tsx`)
- Built with React Hook Form and Zod validation schema matching `ProviderApplyRequest`.
- Collects `display_name`, `contact_email`, `experience_level`, `trading_focus` (multi-select chip selector), `bio`, `referral_source`, and mandatory `terms_accepted` checkbox.
- Explicit `409 Conflict` duplicate handling surfacing clear guidance rather than a generic failure.
- Confirmed live backend behavior: rejected applicants can successfully re-apply via `POST /api/v1/provider/apply` (backend filters active duplicates by `.in_("status", ["pending", "approved"])`).

### 3. Provider Plan Management (`ProviderPlanManager.tsx`, `ProviderPlanModal.tsx`)
- Fetches all owned plans (`GET /api/v1/provider/plans`) including active, paused, draft, and archived.
- **3-Active-Plan Limit UI Enforcement**: Proactively disables "Create Plan" button with an informative badge/tooltip when 3 active plans are reached, preventing unexpected 400s.
- **Duplicate Name Prevention**: Proactively checks plan name against existing plan list before API submission, showing an inline warning.
- **Confirm-Before-Destructive Pattern**: Deactivating a plan opens an explicit confirmation dialog before firing soft-delete (`DELETE /api/v1/provider/plans/{id}`).
- **Suspended Provider Guard**: Disables all plan creation and mutation actions when provider account `status === "suspended"` with prominent warning banner.

### 4. Provider Verification Flow (`ProviderVerificationForm.tsx`, `ProviderVerificationCard.tsx`)
- Multi-section verification request modal structured into 5 sections:
  - **Section 1: Operator Identity** (Full name, Telegram handle/channel, email, region, bio).
  - **Section 2: Signal Operation** (Subscriber count, duration providing signals, markets traded, exchanges, execution mode, frequency).
  - **Section 3: Trading Evidence (Optional)** (Exchange UID, profile links, statement/PDF URLs).
  - **Section 4: Historical Signals** (Dynamic repeatable array enforcing min 3 / max 10 entries with symbol, entry, SL, TP, date, result, and message link).
  - **Section 5: Affirmations & Declarations** (5 mandatory checkboxes with full disclosure text, all strictly required).
- Submits structured payload to `POST /api/v1/provider/request-verification`.
- Updates UI to display pending review card with submission timestamp.

### 5. Automated Tests & Build Verification
- Added 4 test suites with 100% pass rate (61/61 total tests passing across 17 files):
  - `src/test/ProviderPortalRouter.test.tsx` (4 tests): 404 hero, applicant pending, applicant rejected with re-apply, provider dashboard.
  - `src/test/ProviderApplyForm.test.tsx` (4 tests): Validation, payload structure, 409 conflict alert.
  - `src/test/ProviderPlanManager.test.tsx` (4 tests): Plan list, 3-plan cap, duplicate name validation, creation, deactivation.
  - `src/test/ProviderVerificationForm.test.tsx` (3 tests): 5 sections, 3-signal min, all 5 declarations required.
- Full `next build` static page generation and TypeScript type check verified (exit code 0).

### 6. Live Backend Verification
- Verified all flows live against VPS staging backend (`http://127.0.0.1:8002/api/v1`):
  - Fresh registration $\rightarrow$ 404 $\rightarrow$ Apply (201) $\rightarrow$ Pending $\rightarrow$ Reject $\rightarrow$ Re-apply (201).
  - Suspended account (`boluwatifewisdom23@gmail.com`) $\rightarrow$ Suspended header $\rightarrow$ Plan creation blocked with 403 Forbidden $\rightarrow$ Existing plans loaded.
  - Active provider $\rightarrow$ Plan 1, 2, 3 created (201) $\rightarrow$ 4th plan blocked with 400 Bad Request $\rightarrow$ Duplicate name blocked with 409 Conflict $\rightarrow$ Plan 1 edited (200) $\rightarrow$ Plan 1 deactivated/archived (200).
  - Verification submission with 3 signals & 5 declarations $\rightarrow$ 200 OK $\rightarrow$ duplicate blocked with 400 Bad Request.

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
