# Tadex Web Frontend (`tadex-landing2`)

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-121%20passing-success)](https://vitest.dev/)

Tadex is a non-custodial crypto signal execution automation platform designed specifically for retail traders in Nigeria, Kenya, and Ghana. 

The platform bridges expert crypto signal providers with subscribers by executing trades automatically on users' connected exchange accounts via restricted, trade-only API keys. **Tadex is strictly non-custodial and never holds, manages, or withdraws user funds.**

---

## 🏛️ System Architecture & Repositories

The Tadex platform consists of two coordinated repositories:

1. **Active Web Frontend (`tadex-landing2`)** (This Repository):
   - **Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
   - **Styling**: Tailwind CSS + Radix UI Primitives + Lucide Icons.
   - **State & Forms**: Zustand (in-memory token store) + React Hook Form + Zod validation schemas.
   - **Testing**: Vitest + React Testing Library + jsdom (34 test suites, 121 tests).
   - **Key Features**: Public landing & legal pages, user onboarding & authentication (`/login`, `/register`, `/verify-email`), trader dashboard (`/dashboard/keys`, `/dashboard/trading`, `/dashboard/billing`, `/dashboard/providers`), signal provider workspace (`/dashboard/provider`), and full web admin control suite (`/admin/execution`, `/admin/billing`, `/admin/providers`, `/admin/users`).

2. **Reference Backend Repository (`Tadex`)**:
   - **Location**: [`../Tadex`](../Tadex) (FastAPI Python backend + Pybit trading client + PostgreSQL / Supabase).
   - **Role**: Secure API credential encryption (AES-256), webhook ingestion, signal parsing & validation engine, Bybit dispatch queue, subscription management, payment processing (Flutterwave / Paystack), and Telegram bot synchronization.

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Boluwatifetade/tadex-landing2.git
cd tadex-landing2

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# ==============================================================================
# Tadex Frontend Environment Variables
# ==============================================================================

# Backend API Gateway URL (Points to FastAPI Backend)
# Staging/Dev: http://localhost:8000/api/v1 or http://168.144.72.194:8002/api/v1
# Production: https://api.tadexapp.com/api/v1
NEXT_PUBLIC_API_BASE_URL=https://api.tadexapp.com/api/v1

# Supabase Public Configuration (Used for client-side waitlist & telemetry)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Running Locally
```bash
# Start the local Next.js development server with Turbopack
npm run dev

# Run unit and integration tests (Vitest)
npm test

# Run tests with coverage reporting
npm run test:coverage

# Build optimized production bundle
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Architecture Principles

- **Non-Custodial Enforcement**: The platform only accepts exchange API keys with trade-only permissions (`Read-Write: Orders & Positions`). Keys with withdrawal permissions enabled are automatically detected and rejected during submission.
- **In-Memory JWT Access Tokens**: In compliance with `AGENTS.md`, access tokens are stored exclusively in memory via Zustand (`src/lib/auth-store.ts`). Tokens are never written to `localStorage` or `sessionStorage` to mitigate XSS exposure.
- **Silent HTTP-Only Refresh**: Session persistence across page reloads is handled exclusively via secure `httpOnly` refresh cookies managed by the FastAPI backend and consumed silently by `src/components/auth/ProtectedRoute.tsx` and `src/lib/api-client.ts`.
- **Zero Hardcoded Secrets**: No API secrets, credentials, or private tokens are committed to source control.
- **Emergency System Controls**: Global execution kill-switches, monitoring toggles, and cohort rollout controls are integrated in the admin dashboard (`/admin/execution`) with strict two-step confirmation and mandatory compliance audit logging.

---

## 📚 Platform Documentation & Audit Reports

- 📄 [`audit/TADEX_PLATFORM_AUDIT_REPORT.md`](./audit/TADEX_PLATFORM_AUDIT_REPORT.md) — Master platform engineering and architecture audit.
- 🔌 [`docs/API_CONTRACT.md`](./docs/API_CONTRACT.md) — Authoritative FastAPI client-backend request/response contract.
- 🛠️ [`audit/TECHNICAL_DEBT.md`](./audit/TECHNICAL_DEBT.md) — Prioritized technical debt inventory and resolution status.
- 📜 [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) — Session-by-session engineering changelog.
- ⚖️ [`docs/compliance-rules.md`](./docs/compliance-rules.md) — Payment processor semantic compliance guidelines.

---

## ⚖️ License & Company Info

© 2026 Voreza Technologies. All rights reserved.  
Operating Address: 17 Peaceland Estate, Igbe Kapo, Ikorodu, Lagos State, Nigeria.  
Contact: [tadex.team@gmail.com](mailto:tadex.team@gmail.com)
