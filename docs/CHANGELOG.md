# CHANGELOG — Tadex Web Frontend

All notable changes to the Tadex Web Frontend (`tadex-landing2`) will be documented in this file.

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
