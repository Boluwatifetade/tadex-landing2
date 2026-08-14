# AGENTS.md — Tadex Frontend Development Rules

This file governs how any AI coding agent (Antigravity, Cursor, Copilot, etc.) should behave when working in this repo. Read this fully before making any change. If a rule here conflicts with a prompt instruction, this file wins.

## Project context
Tadex is a non-custodial crypto signal execution automation platform for retail traders in Nigeria, Kenya, and Ghana. Users connect exchange API keys (trade-only permission) and execute signals automatically. Tadex never holds user funds. This is a trading platform — bugs here can cost users real money. Treat every change accordingly.

## Session start protocol
At the start of every session:
1. Read this file in full.
2. Read `/docs/API_CONTRACT.md` (or the OpenAPI spec) before touching any frontend code that calls the backend — do not assume field names, always verify against the current contract.
3. Check `/docs/CHANGELOG.md` for what changed since the last session.
4. State a short plan before writing code. Do not start editing files immediately on a vague instruction — confirm scope first.

## Non-negotiable rules
- Never hardcode, log, print, or commit API keys, secrets, JWTs, or exchange credentials — not even in comments or test files.
- Never store tokens in `localStorage`/`sessionStorage`. Access tokens live in memory; refresh tokens are httpOnly cookies.
- Never write code that skips idempotency checks on order/execution endpoints.
- Never modify database schema without a migration file. No raw ALTER TABLE, no manual prod edits.
- Never point frontend env config at production DB/API from a dev or staging branch.
- Every new API-calling function must handle the error envelope shape consistently — no silent failures on trading actions.

## Design system rule (build-ahead-of-design)
Design is not finalized yet. Build using semantic design tokens, not hardcoded values:
- Colors: `bg-primary`, `text-heading`, `border-muted` — never raw hex codes in components.
- Spacing/typography: reference Tailwind config variables, not magic numbers.
- All tokens live in one config file (`tailwind.config.js` or `theme.ts`). When final design tokens arrive, only that file changes — no component should need editing for a design swap.
- Build components assuming placeholder values (e.g. a neutral navy/teal placeholder palette) and structure them so real assets/colors are a drop-in, not a rebuild.

## Coding conventions
- Backend: FastAPI (Python), Pydantic schemas for every request/response.
- Frontend: Next.js + TypeScript.
- State: server state via React Query, UI state via Zustand/local state — do not mix the two.
- Forms: React Hook Form + Zod schema per form.
- Every PR/change touching an execution or auth flow must include or update a test.

## Verification standard
Live end-to-end verification against real infrastructure (staging backend, real database queries, live third-party gateways) is mandatory before any task touching payments, authentication, credential management, or data integrity is considered complete. Passing unit tests alone is insufficient, as unit tests with mocked responses frequently fail to catch contract mismatches, callback parameter quirks, and state persistence gaps.

## Before ending a session
- Leave a short note in `/docs/CHANGELOG.md`: what changed, what's incomplete, what the next session should pick up.
- Do not leave commented-out debug code or console.logs with sensitive data in the diff.

## Escalation
If a task is ambiguous or touches money-moving logic (execution, credentials, balances) and the instruction isn't fully clear — stop and ask, don't guess.
