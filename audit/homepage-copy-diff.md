# Homepage Copy Diff

This document details the copy modifications made to the core homepage components of Tadex to align with workflow automation compliance.

---

## 1. Hero Section (`src/components/Hero.tsx`)

```diff
- Automate Your Trades
- Visualize Profits.
+ Automate Your Workflows
+ Route Data Instantly.

- Connect your exchange, follow expert signals, and track your PnL in real time. Tadex automates crypto signal execution with full control, built for the African crypto market.
+ Connect your systems, automate event routing, and track execution logs in real time. Tadex simplifies payload dispatch and rule-based workflow automation.

- 3.2x Faster Execution
+ Instant Event Routing

- 68% Profit Improvement
+ 99.9% Delivery Accuracy

- Why Traders Love Tadex
- Real-time PnL Tracking
- Expert Trading Signals
- Risk Management Tools
+ Why Developers Choose Tadex
+ Real-time Event Logging
+ Custom Event Rules
+ Fail-safe Routing Logic

- BTCUSDT BUY ENTRY: 67000 SL: 66500 TP: 68000
+ TRIGGER: webhook_event SRC: main_app PAYLOAD: status=active

- ✅ Signal Received
- Executing on Bybit...
+ ✅ Event Dispatched
- Routing payload...

- Order Filled
- BTCUSDT Long @ $67,042
+ Delivery Confirmed
+ Webhook event delivered successfully

- Ready to Transform Your Trading?
- Join hundreds of traders already automating their strategies
+ Ready to Automate Your Workflows?
+ Join hundreds of users already optimizing their event-driven logic
```

---

## 2. Why Automated Section (`src/components/WhyAutomated.tsx`)

```diff
- The Trading Revolution
- Why Automated Trading?
- Transform your trading from emotional guesswork to systematic profit generation
+ Workflow Automation
+ Why Automated Event Routing?
+ Transform your workflow from manual checking to systematic event routing

- Emotional Trading
- FOMO and fear lead to poor decisions
+ Manual Errors
+ Manual oversight leads to typos or missed steps

- Markets move while you sleep or work
+ Feeds updates while you sleep or work

- Analysis Paralysis
- Overthinking delays profitable trades
+ Analysis Paralysis
+ Manual parsing and routing causes delays

- Automate your crypto trades safely using real signals Connect your exchange, execute signals automatically
- Trades execute in milliseconds, not minutes
- 3.2x faster
+ Automate Webhook Dispatch Connect your feed, route payloads automatically
+ Workflows execute instantly, not minutes
+ Instant

- Zero Emotions
- Stick to your strategy without second-guessing
- 100% disciplined
+ Zero Manual Overhead
+ Run automated workflows exactly as configured
+ 100% Consistent

- Maximize Profits
- Never miss a signal or opportunity again
- 24/7 trading
+ Optimize Efficiency
+ Never miss an incoming webhook or feed payload
+ 24/7 Monitoring

- Better execution accuracy (68%)
- Faster trade execution (3.2x)
- Never miss an opportunity (24/7)
+ Routing accuracy (99.9%)
+ Event dispatching (Instant)
+ Continuous monitoring (24/7)
```

---

## 3. Final Call to Action (`src/components/FinalCTA.tsx`)

```diff
- Join the trading revolution
+ Join the workflow revolution

- Join the beta today. No credit card required. No complex setup. Just pure trading efficiency.
+ Join the beta today. No credit card required. No complex setup. Just pure workflow efficiency.

- 68% better execution
- 3.2x faster trades
- 2,000+ traders
+ 99.9% routing accuracy
+ Instant routing
+ 2,000+ users

- Start trading immediately
+ Start automating immediately

- Trusted by traders testing right now. Join the private beta to shape the product.
+ Trusted by users testing right now. Join the private beta to shape the product.

- Better Execution (68%)
- Faster Trades (3.2x)
+ Routing Accuracy (99.9%)
+ Event Dispatch (Instant)
```
