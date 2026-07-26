# Tadex — Backend-to-Frontend Production Checklist
Everything needed to go from "Python backend exists" to "production frontend connected, secure, and live."

---

## 1. API LAYER (the contract between backend and frontend)

This is the foundation. Get this wrong and everything downstream is patched, not built.

- **API style**: REST or GraphQL? For a signal execution platform with live state (positions, PnL, order status), consider REST + WebSockets rather than pure REST polling.
- **Versioning**: `/api/v1/...` from day one. You will change contracts; don't break the frontend when you do.
- **OpenAPI/Swagger spec**: Generate this from your Python backend (FastAPI does this automatically; Flask needs flask-smorest or similar). This becomes the single source of truth for frontend devs — no guessing field names.
- **Response envelope**: Standardize success/error shape across every endpoint. e.g.
  ```json
  { "success": true, "data": {...}, "error": null, "meta": {...} }
  ```
- **Pagination**: Cursor or offset — decide once, apply everywhere (trade history, signal logs, user lists).
- **Rate limiting per endpoint**: Especially execution endpoints. A retail trader's frontend bug shouldn't be able to spam order placement.
- **Idempotency keys**: Critical for you specifically — order execution endpoints must accept an idempotency key so a frontend retry (bad network, double-click) never double-executes a trade.
- **WebSocket/streaming channel**: For live price feeds, position updates, execution status. Define the event schema now (event type, payload, timestamp) — this is usually the most under-documented part of a trading platform and the biggest source of frontend bugs later.

---

## 2. AUTHENTICATION & SECURITY

Non-negotiable, in priority order:

1. **Auth mechanism**: JWT (access + refresh token pair) is standard for SPA/mobile frontends. Short-lived access token (~15 min), longer refresh token, refresh token rotation on use.
2. **Token storage on frontend**: Never localStorage for tokens if avoidable — httpOnly, Secure, SameSite cookies for the refresh token; access token can live in memory (JS variable, not storage). This blocks the most common XSS-token-theft path.
3. **CORS**: Lock `Access-Control-Allow-Origin` to your actual frontend domain(s) only — never `*` once real user funds/keys are involved.
4. **API keys / exchange credentials**: Since Tadex is non-custodial, users likely link exchange API keys. These must be:
   - Encrypted at rest (not just hashed — you need to decrypt to use them), using a proper KMS or at minimum AES-256 with keys never stored alongside the encrypted data.
   - Never returned in any API response after initial save (mask on any GET).
   - Scoped — remind users to create exchange keys with trade-only permission, no withdrawal permission, enforced by your onboarding flow.
5. **Rate limiting + brute-force protection** on login/signup endpoints specifically.
6. **Input validation on every endpoint** — Pydantic (if FastAPI) or marshmallow/cerberus schemas server-side. Never trust frontend validation as your only line of defense.
7. **HTTPS everywhere** — no exceptions, including internal service-to-service calls if you scale to microservices later.
8. **Secrets management**: `.env` files locally, but production secrets go in a proper secrets manager (Doppler, AWS Secrets Manager, or even Railway/Render's built-in secret storage) — never committed, never in frontend bundle.
9. **CSP headers** on the frontend to reduce XSS blast radius.
10. **Audit logging**: every execution action, every credential change, every login — who, what, when. You'll need this for dispute resolution and eventually for compliance.

---

## 3. FRONTEND ARCHITECTURE

- **Framework**: React (Next.js) is the sane default for a trading dashboard — SSR/SSG where useful for marketing pages, CSR for the live dashboard.
- **State management**: Split concerns —
  - Server state (positions, balances, signal feed) → React Query / TanStack Query (handles caching, refetching, stale-while-revalidate — you need this for anything hitting live data).
  - Client/UI state (modals, form state, theme) → Zustand or plain React state. Don't reach for Redux unless complexity truly demands it.
- **Real-time updates**: A WebSocket hook layer (or Socket.io if that's your backend choice) that feeds React Query cache updates, not a separate parallel state system — avoids UI desync between "live" and "fetched" data.
- **Routing/auth guards**: Protected routes that check token validity before rendering dashboard; redirect to login on 401 globally (an axios/fetch interceptor, not per-component checks).
- **Error boundaries**: Trading dashboards fail loudly if unhandled — wrap key sections so one broken widget doesn't crash the whole app.
- **Form handling**: React Hook Form + Zod (schema validation shared in spirit with your backend Pydantic schemas — keep the two in sync manually since they're different languages).
- **Environment config**: `.env.local`, `.env.production` — API base URL, WebSocket URL, never hardcoded.

---

## 4. DATABASE

You mentioned you already have a DB backup — a few things to nail down before frontend work assumes a stable shape:

- **Schema freeze/versioning**: Frontend devs will build against field names. Use migrations (Alembic if you're on SQLAlchemy/Postgres) so schema changes are tracked, not ad hoc.
- **Which environment is the frontend pointed at?** You asked "would they be showing the same bucket" — make sure you have **separate DBs for dev/staging/production**, not the same instance with different app connections. Mixing these is how test trades end up looking like real ones (or vice versa) later.
- **Read-heavy endpoints** (dashboard, history) — consider a read replica or at least proper indexing before launch; trading UIs get hammered with polling/refresh if WebSockets aren't fully in place yet.
- **Backups**: confirm your backup is automated and tested (a backup you've never restored isn't a backup) — you already know this instinct, just formalize the schedule (daily automated + retention policy).
- **Sensitive fields**: encrypted API keys, PII — make sure your backup/export process doesn't casually leak these to logs or a plaintext dump sitting somewhere.

---

## 5. DESIGN → FRONTEND INTEGRATION

Since your design (Oluwakemi's work) comes in separately and gets integrated later:

- **Design tokens first**: Before component-by-component building, extract colors, spacing, typography, breakpoints into a shared config (Tailwind config file is the natural home for this) — so "integrating design later" is a config swap, not a rewrite.
- **Component library approach**: Build a small internal component set (Button, Card, Input, Modal, Table) styled to match design system once, reused everywhere — don't let each page invent its own styling.
- **Design handoff format**: Figma with dev mode / inspect access, or exported specs — agree with Oluwakemi on this now so there's no back-and-forth guessing pixel values later.
- **Responsive/mobile-first**: Confirm early whether Tadex frontend needs to be mobile-first (likely, given your target market's device usage patterns in Nigeria/Kenya/Ghana) — this changes component structure decisions now, not later.

---

## 6. DEPLOYMENT & INFRASTRUCTURE

- **Hosting**: Frontend — Vercel (if Next.js) or Netlify, trivial to set up, good defaults. Backend — Railway, Render, or a VPS (DigitalOcean/Hetzner) if you need more control over long-running processes (signal execution loops, WebSocket servers).
- **CI/CD**: GitHub Actions minimum — run tests on PR, auto-deploy on merge to main (staging) and tag/release to production.
- **Environments**: dev → staging → production, each with its own DB, its own env vars, its own domain/subdomain (`app.tadex.io`, `staging.tadex.io`).
- **Domain + SSL**: Cloudflare in front is a good default — free SSL, DDoS protection, and lets you add WAF rules later cheaply.
- **Health checks**: `/health` endpoint on backend, monitored by your host or an uptime service (UptimeRobot free tier is enough at your stage).

---

## 7. MONITORING & OBSERVABILITY

- **Error tracking**: Sentry (free tier) on both frontend and backend — you want to know about a crashed order execution before a user tweets about it.
- **Logging**: Structured logs (JSON) on backend, especially around execution — you'll need to reconstruct "what happened" for support/dispute cases.
- **Uptime/status**: Even a simple public status page builds trust with early paying users.

---

## 8. TESTING

- **Backend**: You already have 564 passing tests — good. Make sure execution-critical paths (order placement, TP/SL logic, idempotency) stay covered as frontend integration adds new call patterns.
- **Frontend**: At minimum, integration tests on auth flow and order placement flow (Playwright or Cypress) — the two places a bug costs you user trust or money.
- **Contract testing**: Consider a lightweight check that frontend's expected API shape matches backend's actual OpenAPI spec, so a backend refactor doesn't silently break frontend without anyone noticing until a user hits it.

---

## 9. COMPLIANCE/TRUST CONSIDERATIONS (crypto + Nigeria specifically)

- Since Tadex is non-custodial, be explicit in both UI copy and terms that Tadex never holds user funds — this is your main legal/trust differentiator, make sure the frontend reinforces it (not just buried in ToS).
- Clear disclosure flow before a user connects exchange API keys — what permissions you need, why, and a visible reminder to disable withdrawal permission on the key.
- Given the CAC business name (not Ltd) status you've discussed before — keep frontend claims (terms, "About" page) consistent with your actual legal entity status; don't let marketing copy imply more corporate structure than exists yet.

---

## PRIORITY ORDER IF YOU'RE BUILDING SOLO RIGHT NOW

1. OpenAPI spec + auth flow (JWT + refresh) — nothing else can start without this
2. Idempotent execution endpoints + encrypted credential storage — this is where money/trust bugs live
3. WebSocket event schema for live data
4. Core component library matched to design tokens
5. Staging environment fully separate from production DB
6. Sentry + health checks
7. Everything else layers on top of this without rework
