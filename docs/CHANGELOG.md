# CHANGELOG — Tadex Web Frontend

All notable changes to the Tadex Web Frontend (`tadex-landing2`) will be documented in this file.

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
