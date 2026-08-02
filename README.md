# Tadex Web Frontend (`tadex-landing2`)

Tadex is a non-custodial crypto signal execution automation platform for retail traders in Nigeria, Kenya, and Ghana. This repository contains the Next.js web application including the public marketing landing page, compliance pages, authentication system (`/login`, `/register`), and protected trading dashboard shell (`/dashboard`).

---

## 🏛️ Platform Architecture Overview

- **Active Frontend Workspace**: `C:\Users\user\Documents\tadex-landing2` (Next.js 16 App Router + TypeScript + Tailwind CSS + Zustand + React Hook Form + Zod)
- **Reference Backend Repository**: `C:\Users\user\Documents\Tadex` (FastAPI Web Service + Python Trading Engine + 54 Supabase Database Migrations)
- **Authentication System**: In-memory Access Tokens (Zustand `auth-store.ts`) + httpOnly Refresh Cookies issued by FastAPI backend (`/api/v1/auth/refresh`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- npm 10+

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# FastAPI Backend URL
NEXT_PUBLIC_API_BASE_URL=https://api.tadexapp.com/api/v1

# Supabase Public Keys (for Waitlist client-side handlers)
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📚 Audit & Engineering Reports

Comprehensive engineering audit reports are available in the [`audit/`](./audit) directory:

- 📄 [TADEX_PLATFORM_AUDIT_REPORT.md](./audit/TADEX_PLATFORM_AUDIT_REPORT.md) — Master 18-section platform engineering audit report.
- 🏛️ [ARCHITECTURE_READINESS.md](./audit/ARCHITECTURE_READINESS.md) — Backend module reusability, Telegram coupling analysis, and refactoring needs.
- 🔌 [API_GAP_ANALYSIS.md](./audit/API_GAP_ANALYSIS.md) — Existing backend capabilities mapped against missing FastAPI endpoints and Web UI.
- 📊 [FEATURE_MATRIX.md](./audit/FEATURE_MATRIX.md) — Feature verification matrix mapping Frontend $\rightarrow$ API $\rightarrow$ Backend $\rightarrow$ DB $\rightarrow$ Tests.
- 🛠️ [TECHNICAL_DEBT.md](./audit/TECHNICAL_DEBT.md) — Prioritized technical debt inventory (Critical, High, Medium, Low).
- 📜 [DOCUMENTATION_STATUS.md](./audit/DOCUMENTATION_STATUS.md) — Documentation inventory, status classifications, and discrepancy logs.
- 🗺️ [NEXT_STEPS.md](./audit/NEXT_STEPS.md) — Dependency-ordered implementation roadmap for future development.

---

## 🔒 Security & Token Rules

- **Zero Hardcoded Secrets**: Never commit secrets or API keys.
- **In-Memory Access Tokens**: Access tokens are stored exclusively in memory via Zustand (`auth-store.ts`). Never write tokens to `localStorage` or `sessionStorage`.
- **Silent HTTP-Only Refresh**: Refresh tokens survive page reloads via `httpOnly` cookies managed securely by `ProtectedRoute.tsx` and `api-client.ts`.
