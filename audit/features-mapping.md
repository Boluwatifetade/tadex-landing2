# Features and Architecture Copy Refactor Mapping

This audit artifact shows the terminology mappings applied to the feature descriptions, how it works steps, and security components to align with a SaaS event routing classification.

---

## 1. Features Component (`src/components/Features.tsx`)

| Legacy Feature | Refactored Feature | Refactored Description Summary |
|---|---|---|
| **Instant Execution** | **Instant Event Dispatch** | Tadex parses event signals and routes requests in milliseconds. |
| **100% Telegram Native** | **100% Chat Managed** | Manage your entire automation configuration directly from Telegram. |
| **Smart Risk Guard** | **Rule-Based Validation** | Define validation/threshold rules once to enforce on outgoing payloads. |
| **Remove Emotional Bias** | **Continuous Processing** | Eliminate manual latency and processing delays with automated routing. |
| **Smart Signal Parsing** | **Structured Payload Parsing** | Parse unstructured data from message feeds automatically. |
| **Real-Time PnL Tracking** | **Real-Time Activity Logs** | Get notified when events route; receive daily summary reports. |
| **Auto-Breakeven & Scaling** | **Auto-Retry & Scaling** | Automatically retry failed dispatches and scale payloads. |
| **Advanced Analytics** | **Advanced Analytics** | Track delivery rates and optimize automated workflow strategies. |
| **Signal Provider Integration** | **Data Feed Integration** | Connect to verified data feeds and automate payload routing with one click. |

---

## 2. Process Component (`src/components/HowItWorks.tsx`)

| Step | Legacy Copy | Refactored Copy |
|---|---|---|
| **Header** | From Chat to Trade Instantly | From Chat to Routed Event Instantly |
| **Step 2** | Connect Exchange (Create API keys on Bybit) | Connect Destination API (Configure target destination API keys) |
| **Step 3** | Paste a Signal (Copy trade signal) | Send a Payload (Send event payload or webhook stream) |
| **Step 4** | See Live Results (places trade, PnL report) | See Live Routing Logs (validates payload, logs execution status) |

---

## 3. Security Component (`src/components/SecurityTransparency.tsx`)

| Legacy Term | Refactored Term | Intent Alignment |
|---|---|---|
| **We Never Hold Your Funds** | **We Never Hold Your Assets** | Explicitly limits platform control to webhook delivery. |
| **Trade-Only API Keys** | **Restricted-Scope API Keys** | Re-aligned to general posting/reading webhooks. |
| **Only trade execution capabilities** | **Only dispatch/routing capabilities** | Removes execution capability over financial operations. |
| **Automated Trading Begins** | **Automated Routing Begins** | Neutralizes automated trading agent perception. |
| **Honest About Risks (Trading carries risk)** | **Honest About Limits (Uptime/API limits)** | Decouples from financial/capital risk indicators. |
| **What happens if Tadex gets hacked?** | **What happens if Tadex gets compromised?** | Fits standard SaaS infrastructure language. |
