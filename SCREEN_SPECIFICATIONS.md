# Tadex Web Application: Screen-Level Design Specifications

**Status**: Screen Design Specifications  
**Version**: 1.0.0  
**Target Environment**: Next.js 16 + React 19 + Tailwind CSS  
**Governing Rules**: `AGENTS.md`, `better-layout`, `emil-design-eng`, Perception Laws  

---

## 1. Application Shell & Navigation

### A. Information Architecture & Hierarchy (Option A: Left Sidebar + Top Utility Bar)
The Application Shell is the persistent frame for all authenticated routes (`/dashboard/*`). It preserves the Figma designer's spatial composition (`12:3` / `12:184`) while harmonizing all surfaces and borders with the approved B4 design system:

```
+----------------------+-----------------------------------------------------------------------------+
|  [Tadex Logo]        |  TOP UTILITY BAR (h-16):          [Bybit Beacon] [Sync] [Bell] [User / Out] |
|                      +-----------------------------------------------------------------------------+
|  TRADING             |                                                                             |
|  • Dashboard         |  TRADING CONTROL CENTER                                                     |
|  • Exchange Keys     |  Good evening, [Trader]                                                     |
|  • Marketplace       |  Bybit Main Trade • Live Mainnet • N open positions                         |
|  • Positions         |                                                                             |
|  • Billing & Plans   |  MAIN CONTENT VIEWPORT (Responsive fluid container, px-4 sm:px-6 lg:px-8)   |
|                      |                                                                             |
|  PROVIDER CENTER     |                                                                             |
|  • Provider Portal   |                                                                             |
|                      |                                                                             |
|  • Settings          |                                                                             |
+----------------------+-----------------------------------------------------------------------------+
|  [Mobile Only < 1024px] Bottom Dock:   [Overview]    [Trading]    [Keys]    [More / Drawer]        |
+----------------------------------------------------------------------------------------------------+
```

### B. Component Requirements
- **Desktop Left Sidebar (`DashboardSidebar / DashboardHeader.tsx`)**: Fixed/sticky `w-64` on desktop (`lg:flex`), `bg-surface-primary` (`#181818`) with `border-r border-surface-elevated` (`#313131`). Groups verified routes under `TRADING` and `PROVIDER CENTER`. Unbuilt backend features (e.g., `Risk Control` / `Signal Builder`) are governed by central feature flags (`src/lib/feature-flags.ts`) and hidden by default. Admin links are strictly separated by role-based authorization.
- **Top Utility Bar**: Sticky `h-16` bar (`bg-surface-primary/90 backdrop-blur-md`, `border-b border-surface-elevated`), housing the Exchange Connectivity Heartbeat Beacon, Sync Freshness Trigger, user verification/Telegram status pills, and `Log Out`.
- **Mobile Navigation (`< 1024px`)**: Compact top bar (`h-14`) + thumb-accessible Bottom Floating Action Dock (`h-16`) with full-height drawer for secondary links.

---

## 2. Overview Dashboard (`/dashboard`)

### A. Purpose & Hierarchy
Delivers an immediate 3-second operational briefing answering:
1. *Is my automated trading execution healthy right now?*
2. *What is my active position exposure and recent PnL?*
3. *Are there any pending onboarding steps required?*

```
+---------------------------------------------------------------------------------------------+
|  PAGE HEADER: "Overview & Operations"                      [Manual Sync]  [Emergency Halt]  |
+---------------------------------------------------------------------------------------------+
|  OPERATIONAL STATUS BANNER (Full Width Card)                                                |
|  [● Execution Active]  Connected: Bybit Mainnet   Provider: Alpha Crypto   Subscription: Pro|
+---------------------------------------------------------------------------------------------+
|  KPI SUMMARY CARDS (3-Column Grid)                                                          |
|  +-----------------------+  +-----------------------+  +---------------------------------+  |
|  | Active Positions: 3   |  | Unrealized PnL:       |  | Recent Fills (24h): 14          |  |
|  | Total Margin: $1,450  |  | +$342.50 (+4.8%)      |  | Last Executed: 18m ago          |  |
|  +-----------------------+  +-----------------------+  +---------------------------------+  |
+---------------------------------------------------------------------------------------------+
|  SPLIT SECTION (2 Columns on Desktop)                                                       |
|  +---------------------------------------+  +--------------------------------------------+  |
|  | READINESS & ONBOARDING CHECKLIST      |  | RECENT EXECUTION ACTIVITY                  |  |
|  | [✓] Email Verified                    |  | • BTCUSDT Long Filled @ $68,240 (12m ago)  |  |
|  | [✓] Bybit API Key (Trade-Only)        |  | • SOLUSDT Take Profit 1 Hit (1h ago)       |  |
|  | [!] Link Telegram Channel Alerts      |  | • ETHUSDT Short Opened (3h ago)            |  |
|  | [✓] Active Pro Subscription           |  |                                            |  |
|  +---------------------------------------+  +--------------------------------------------+  |
+---------------------------------------------------------------------------------------------+
```

### B. Data & Endpoint Requirements
- `GET /me`: User profile, Telegram status, email verification.
- `GET /keys`: Exchange connection status.
- `GET /trading/positions`: Compute count of open positions and aggregate unrealized PnL.
- `GET /trading/orders`: Latest execution activity (limited to 5 most recent).
- `GET /billing/subscription`: Active tier and renewal date.

### C. Operational States
- **Loading**: Pulse-skeleton placeholders matching exact card shapes (no layout jump).
- **Empty / Unconnected**: If zero keys exist, the checklist card expands to dominate the screen with a welcoming, high-trust walkthrough: *"Connect your Bybit trade-only key to activate non-custodial automated execution"*. Zero mock numbers are shown.
- **Degraded**: If the exchange API fails, a persistent warning pill appears: *"Exchange connectivity degraded. Displaying cached position snapshot from 11:24 AM"*.

---

## 3. Trading Workspace (`/dashboard/trading`)

### A. Purpose & Layout
An institutional-grade trading terminal layout designed for high data density, zero optical distraction, and clear visual separation between long/short positions.

```
+---------------------------------------------------------------------------------------------+
|  HEADER: "Trading Terminal"      [Cycle Freshness Badge]  [Auto-Refresh Toggle]  [Sync Now] |
+---------------------------------------------------------------------------------------------+
|  SUMMARY STRIP:                                                                             |
|  Total Positions: 4  |  Long Exposure: $2,800  |  Short Exposure: $1,200  |  Net PnL: +$184 |
+---------------------------------------------------------------------------------------------+
|  MODULE A: ACTIVE POSITIONS MONITOR (Full Width Card, Tabular Monospace)                    |
|  +---------------------------------------------------------------------------------------+  |
|  | SYMBOL    SIDE    SIZE      ENTRY       MARK        PNL (USD / %)    LEVERAGE  ACTIONS|  |
|  | BTCUSDT   LONG    0.05 BTC  $67,400.00  $68,120.50  +$36.02 (+1.0%)  10x       [Close]|  |
|  | ETHUSDT   SHORT   1.20 ETH  $2,540.00   $2,510.20   +$35.76 (+1.1%)  5x        [Close]|  |
|  | SOLUSDT   LONG    15.0 SOL  $184.20     $179.50     -$70.50 (-2.5%)  5x        [Close]|  |
|  +---------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------+
|  MODULE B: EXECUTION ORDER LEDGER                                                           |
|  [Tabs: All Orders (48) | Filled (42) | Open/Trigger (2) | Cancelled (4)]                   |
|  +---------------------------------------------------------------------------------------+  |
|  | TIME         SYMBOL    SIDE    TYPE     SIZE        FILL PRICE   STATUS               |  |
|  | 11:14:22 AM  BTCUSDT   BUY     MARKET   0.05 BTC    $67,400.00   [● Filled]           |  |
|  | 10:45:00 AM  SOLUSDT   SELL    LIMIT    15.0 SOL    $184.20      [● Filled]           |  |
|  | 09:30:15 AM  ETHUSDT   BUY     MARKET   1.20 ETH    $2,540.00   [● Filled]           |  |
|  +---------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------+
```

### B. Component & Data Requirements
- **Positions Table (`PositionsTable.tsx`)**:
  - Columns: Symbol, Side badge (`bg-status-success/15 text-status-success` for Long, `bg-status-danger/15 text-status-danger` for Short), Size, Entry Price, Mark Price, Unrealized PnL (colored pill with exact dollar + percentage), Leverage tag (`bg-surface-secondary text-content-secondary`), Actions button.
  - Numeric formatting: `font-mono tabular-nums`.
- **Order History Table (`OrdersTable.tsx`)**:
  - Filter pills: `All`, `Filled`, `Cancelled`, `Rejected`.
  - Timestamp formatted as readable relative time with absolute timestamp in tooltip.
- **Endpoints**: `GET /trading/positions`, `GET /trading/orders?status=...`.

### C. Interactive Modals
- **Manual Close Position Modal** (Proposed / Contingent on Backend Contract):
  - Requires explicit confirmation dialog displaying symbol, side, estimated PnL, and market slippage warning.

---

## 4. Automation Management (`/dashboard/automation`)

### A. Purpose & Layout
Provides retail traders with total clarity on the automated signal pipeline: which signals were received, how they were filtered, how sizing was applied, and whether Bybit accepted the orders.

```
+---------------------------------------------------------------------------------------------+
|  HEADER: "Signal Automation Engine"                                    [Pause Automation]   |
+---------------------------------------------------------------------------------------------+
|  PIPELINE STATUS OVERVIEW:                                                                  |
|  [● Signal Stream: ONLINE]   Linked Provider: "Forex & Crypto Alpha"   Channel ID: -1004928 |
+---------------------------------------------------------------------------------------------+
|  EXECUTION SAFEGUARDS CONFIGURATION                                                         |
|  +-------------------------------------+  +----------------------------------------------+  |
|  | RISK PER TRADE                      |  | MAX POSITION LEVERAGE                        |  |
|  | [ 2.0% Account Equity ]             |  | [ 10x Max Cap (Isolated Margin) ]            |  |
|  +-------------------------------------+  +----------------------------------------------+  |
|  | SL / TP ENFORCEMENT                 |  | SLIPPAGE CEILING                             |  |
|  | [ Strict: Auto-attach exchange SL ] |  | [ 0.35% Maximum Deviation ]                  |  |
|  +-------------------------------------+  +----------------------------------------------+  |
+---------------------------------------------------------------------------------------------+
|  REAL-TIME SIGNAL EXECUTION AUDIT TRAIL                                                     |
|  +---------------------------------------------------------------------------------------+  |
|  | TIME      PROVIDER      SIGNAL PAYLOAD             ACTION          STATUS             |  |
|  | 11:02:14  Alpha Crypto  #BTC LONG Entry 67200-67500 Auto-Sized 0.05 [✓ Dispatched 18ms]|  |
|  | 08:44:10  Alpha Crypto  #ETH SHORT SL 2580         SL Order Placed  [✓ Exchange Conf]  |  |
|  | Yesterday Alpha Crypto  #SOL LONG TP2 Reached      Partial Close 50%[✓ Filled]         |  |
|  +---------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------+
```

### B. Backend Contract Status
- **Existing**: Provider subscription relationship (`/billing/subscription`, `/providers`).
- **Proposed / Missing Contract**: User-level risk preference endpoints (e.g. `GET/PUT /automation/settings`) and execution audit feed (`GET /automation/signals`). The initial release will render verified provider signals and execution order connections, flagging configurable risk parameters as pending backend release.

---

## 5. Exchange & Telegram Connections (`/dashboard/keys`)

### A. Purpose & Layout
The security bedrock of the application. Educates the trader on non-custodial safety, verifies API permissions, and connects Bybit and Telegram.

```
+---------------------------------------------------------------------------------------------+
|  HEADER: "Exchange & Signal Connections"                                                    |
+---------------------------------------------------------------------------------------------+
|  SECURITY ASSURANCE CARD (Cyan-Tinted Surface)                                              |
|  [Shield Icon] Strictly Non-Custodial Architecture.                                         |
|  Tadex connects via Trade-Only API keys. We cannot access or withdraw your funds.            |
+---------------------------------------------------------------------------------------------+
|  ACTIVE EXCHANGE CONNECTIONS                                                                |
|  +---------------------------------------------------------------------------------------+  |
|  | [Bybit Logo] Bybit Mainnet Account                                     [Connected ●]  |  |
|  | API Key: byb******************39a        Environment: Live Trading                      |  |
|  | Permissions: Contract & Spot Trade Only  Last Heartbeat: 4s ago                        |  |
|  | [Test Connection]                                                    [Revoke Key]     |  |
|  +---------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------+
|  CONNECT NEW EXCHANGE API KEY                                                               |
|  [Exchange Selector: Bybit (Active) | Binance (Coming Soon)]                                |
|  [Form: API Key, API Secret, [ ] Connect to Testnet Sandbox]                                |
|  [!] Checklist: Ensure "Enable Withdrawals" is UNCHECKED on Bybit.                          |
|  [Connect Bybit Key Button]                                                                 |
+---------------------------------------------------------------------------------------------+
|  TELEGRAM ACCOUNT INTEGRATION                                                               |
|  Status: @trader_sam (Linked)                                            [Unlink Telegram]  |
+---------------------------------------------------------------------------------------------+
```

### B. Validation & Safety Rules
- **Withdrawal Rejection**: If the user submits a key with withdrawal privileges, the backend returns an error envelope containing `"withdrawal"`. The frontend renders a high-visibility modal instructing the trader to delete the key on Bybit and generate a trade-only replacement.
- **Key Revocation Modal**: Clicking `Revoke Key` opens a destructive modal requiring explicit confirmation. It explains that revoking the key will halt automated signal execution immediately.

---

## 6. Billing & Subscriptions (`/dashboard/billing`)

### A. Purpose & Layout
Enables retail traders across Nigeria, Kenya, Ghana, and global markets to easily view and pay for execution automation plans using their local currency.

```
+---------------------------------------------------------------------------------------------+
|  HEADER: "Subscription & Entitlements"                                                      |
+---------------------------------------------------------------------------------------------+
|  CURRENT SUBSCRIPTION SUMMARY CARD                                                          |
|  +---------------------------------------------------------------------------------------+  |
|  | Plan: Professional Trader (Annual)                       Status: [● Active]           |  |
|  | Billing Currency: NGN (Nigerian Naira)                  Renews: Dec 15, 2026         |  |
|  | Signals Executed This Month: 142 / Unlimited                                             |  |
|  | [Upgrade Plan]                                                      [Manage Billing]  |  |
|  +---------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------+
|  AVAILABLE AUTOMATION PLANS (Multi-Currency Selector: [USD $] [NGN ₦] [KES KSh] [GHS GH₵])   |
|  +------------------------+  +--------------------------+  +-----------------------------+  |
|  | STARTER                |  | PRO (Most Popular)       |  | INSTITUTIONAL / PROVIDER    |  |
|  | ₦15,000 / month        |  | ₦35,000 / month          |  | ₦95,000 / month             |  |
|  | • 1 Exchange Key       |  | • 3 Exchange Keys        |  | • Unlimited Exchange Keys   |  |
|  | • 1 Signal Provider    |  | • Unlimited Providers    |  | • Signal Provider Broadcast |  |
|  | • Bybit Spot & Futures |  | • High-Priority Queue    |  | • Dedicated Account Manager |  |
|  | [Select Starter]       |  | [Current Active Plan]    |  | [Upgrade to Enterprise]     |  |
|  +------------------------+  +--------------------------+  +-----------------------------+  |
+---------------------------------------------------------------------------------------------+
```

### B. Checkout Quote & Payment Flow
1. User clicks **Select Plan**.
2. **Checkout Quote Modal (`CheckoutQuoteModal.tsx`)** opens:
   - Fetches dynamic quote from `GET /billing/quote?plan_id=...&duration_months=...&currency=...`.
   - Itemizes: Provider Fee + Tadex Platform Fee + Gateway Processing Fee.
3. User clicks **Proceed to Payment**:
   - Calls `POST /billing/checkout` $\rightarrow$ receives `authorization_url` and `reference`.
   - Stores reference in `sessionStorage` (`tadex_pending_checkout_ref`).
   - Redirects to payment gateway (Paystack / Flutterwave).
4. On gateway return $\rightarrow$ Lands on `/dashboard/billing/checkout/result?reference=...`.
   - Automatically polls `GET /billing/checkout/verify?reference=...` up to 10 attempts.
   - Refetches subscription state authoritatively and displays success celebration or actionable error.

---

## 7. Account & Security Settings (`/dashboard/settings`)

### A. Purpose & Layout
Centralizes credentials, authentication security, Telegram pairing, and active session termination.

```
+---------------------------------------------------------------------------------------------+
|  HEADER: "Account & Security Settings"                                                      |
+---------------------------------------------------------------------------------------------+
|  MODULE 1: PROFILE & IDENTITY                                                               |
|  Email: user@example.com [✓ Verified]                                                       |
|  Account Status: Active Trader                                                              |
+---------------------------------------------------------------------------------------------+
|  MODULE 2: CREDENTIAL SECURITY (PASSWORD ROTATION)                                          |
|  [Form: Current Password, New Password, Confirm New Password]                              |
|  [Update Password Button]                                                                   |
+---------------------------------------------------------------------------------------------+
|  MODULE 3: TELEGRAM COMMUNITY INTEGRATION                                                   |
|  Telegram Username: @trader_sam                                                             |
|  [Pair with Different Telegram Account]                              [Unlink Telegram]      |
+---------------------------------------------------------------------------------------------+
|  MODULE 4: ACTIVE SESSIONS & SECURITY REVOCATION                                             |
|  Current Device: Chrome on Windows 11 (Lagos, Nigeria) - Active Now                         |
|  [Log Out All Devices (Revoke All Refresh Sessions)]                                        |
+---------------------------------------------------------------------------------------------+
```

### B. Endpoints & State Handling
- `GET /me`: User status and email verification.
- `POST /auth/change-password`: Zod schema validation; clears input fields on success.
- `POST /auth/telegram-link/request`: Generates one-time bot pairing link.
- `POST /auth/telegram/unlink`: Requires current password verification before severing signal connection.
