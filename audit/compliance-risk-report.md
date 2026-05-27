# Compliance Content Risk Report

This report outlines all detected words, phrases, and structures in the Tadex codebase that pose a risk of triggering payment processor (e.g. Flutterwave) rejection.

---

## 1. High Risk (Likely Rejection Trigger)
Phrases and terms directly referencing financial trading, signals, automated trading, signal marketplaces, or copy trading.

| File Location | Line | Detected Copy / Phrase | Context | Risk Explanation |
| :--- | :--- | :--- | :--- | :--- |
| `src/app/layout.tsx` | 16 | `"Tadex - Automated Trading"` | Document Title | Direct trading association |
| `src/app/layout.tsx` | 17 | `"Simplify Trading. Amplify Results"` | Meta Description | Direct trading association |
| `src/components/Hero.tsx` | 33 | `"Tadex automates crypto signal execution..."` | Hero Main Text | Signal execution trigger |
| `src/components/Hero.tsx` | 96 | `"Expert Trading Signals"` | Benefit Card | Implies external advisor/signal source |
| `src/components/Hero.tsx` | 135 | `"✅ Signal Received"` | Demo Component | Implies signal execution framework |
| `src/components/Hero.tsx` | 171 | `"Ready to Transform Your Trading?"` | Call to Action | Direct trading association |
| `src/components/Features.tsx` | 18 | `"Manage your entire trading portfolio..."` | Feature Item | Financial management inference |
| `src/components/Features.tsx` | 33 | `"Eliminate FOMO, fear and emotional trading decisions..."` | Feature Item | Direct trading association |
| `src/components/Features.tsx` | 39 | `"Smart Signal Parsing"` | Feature Title | Signal/NLP parsing trigger |
| `src/components/Features.tsx` | 40 | `"Copy-paste signals from any VIP group..."` | Feature Description | Implies third-party signals |
| `src/components/Features.tsx` | 69 | `"Signal Provider Integration"` | Feature Title | Signal marketplace inference |
| `src/components/Features.tsx` | 70 | `"Subscribe to proven signal providers..."` | Feature Description | Signal marketplace / Copy-trading |
| `src/components/Features.tsx` | 88 | `"Everything you need to automate your trading strategy..."` | Features Bottom Text | Direct trading strategy execution |
| `src/components/Features.tsx` | 132 | `"Ready to Experience Automated Trading?"` | Call to Action | Direct trading association |
| `src/components/FAQ.tsx` | 53 | `"Tadex is an automated crypto trading platform..."` | FAQ Q&A | Direct trading platform framing |
| `src/components/FAQ.tsx` | 86 | `"Everything you need to know about Tadex automated trading"` | Section Header | Direct trading association |
| `src/components/WhyAutomated.tsx` | 33 | `"Automate your crypto trades safely using real signals"` | Section Subtitle | Direct trading / signals |
| `src/components/WhyAutomated.tsx` | 64 | `"Why Automated Trading?"` | Section Title | Direct trading association |
| `src/components/FinalCTA.tsx` | 63 | `"Join the trading revolution"` | CTA Header | Direct trading association |
| `src/components/FinalCTA.tsx` | 103 | `"Start trading immediately"` | CTA Footer | Direct trading association |
| `src/components/Footer.tsx` | 82 | `"Automate your crypto trading..."` | Footer Info | Direct trading association |
| `src/components/Pricing.tsx` | 46 | `"Multiple signal providers"` | Pricing Card Feature | Marketplace subscription indicator |
| `src/components/Pricing.tsx` | 214 | `"Automate your crypto trades safely using real signals"` | Testimonial text | Direct trading / signals |
| `src/components/HowItWorks.tsx` | 24 | `"Paste a Signal"` | Step 1 Title | Signal execution trigger |
| `src/components/HowItWorks.tsx` | 25 | `"Copy a trade signal from your favorite group..."` | Step 1 Description | Signal parsing trigger |
| `src/components/PlanWaitlistModal.tsx` | 178 | `"Monthly Trading Volume"` | Waitlist Input Field | Financial client assessment |
| `src/components/PlanWaitlistModal.tsx` | 196 | `"Current Trading Method"` | Waitlist Input Field | Financial client assessment |
| `src/components/Roadmap.tsx` | 16 | `"Copy Trading Marketplace"` | Roadmap Q2 item | Direct copy-trading marketplace |
| `src/app/terms/page.tsx` | 104 | `"Signal Risk"` | Legal Terms | Signal provider disclaimer |
| `src/app/terms/page.tsx` | 106 | `"Signal Providers are independent third parties."` | Legal Terms | Signal provider disclaimer |

---

## 2. Medium Risk (Context Dependent)
Phrases mapping to execution metrics, profit optimization, cryptocurrency assets, and API control.

| File Location | Line | Detected Copy / Phrase | Context | Risk Explanation |
| :--- | :--- | :--- | :--- | :--- |
| `src/components/Hero.tsx` | 28 | `"Visualize Profits."` | Highlight text | Yield/profit implication |
| `src/components/Hero.tsx` | 74 | `"Profit Improvement"` | Metric label | Yield/profit implication |
| `src/components/WhyAutomated.tsx` | 45 | `"Maximize Profits"` | Card Title | Yield/profit implication |
| `src/components/Features.tsx` | 48 | `"Get notified the moment a trade hits profit."` | Feature Detail | Profit maximization inference |
| `src/components/Features.tsx` | 55 | `"Tadex automatically moves Stop Loss to entry..."` | Guardrails detail | Trading execution detail |
| `src/components/Features.tsx` | 63 | `"Track performance, win rates..."` | Performance item | Yield/win rate tracking |
| `src/components/FAQ.tsx` | 59 | `"Tadex executes trades in milliseconds..."` | Performance FAQ | Execution speed trigger |
| `src/components/SecurityTransparency.tsx` | 10 | `"We only execute trades - we never have access to withdraw..."` | Security text | Trading execution implication |
| `src/app/terms/page.tsx` | 70 | `"We provide a software interface to automate..."` | Service nature | Execution mapping |
| `src/app/privacy/page.tsx` | 83 | `"Bybit API Keys (Encrypted)"` | Data We Collect | Financial integration mapping |

---

## 3. Low Risk (Safe)
Standard operational and security terms which require no modification.

- Reference to AES-256 encryption or database security.
- Data privacy compliant logs.
- Contact email structures.
