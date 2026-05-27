# Tadex Compliance & Semantic Decoupling Guidelines

To secure approval from payment processors (e.g. Flutterwave), all public copy, onboarding materials, metadata, and developer documentation must adhere strictly to these rules.

## 1. The Intent Decoupling Rule
No description of the Tadex system should suggest it possesses decision-making authority over external accounts, or that it optimizes and increases financial yields/returns. 

- **Prohibited Framework**: "Automated decision system acting on third-party financial signals."
- **Approved Framework**: "Workflow routing based on user-defined rules" or "Workflow automation for event-driven systems."

### Copy Replacements
* **Prohibited**: Performance tracking of sources, accuracy metrics, automated verification layers.
* **Approved**: Validation rules for routing logic, filtering conditions for workflow triggers, delivery conditions for event dispatch.

---

## 2. Monetization Decoupling Rule
No portion of the Tadex service should be described as a copy-trading marketplace, a signal provider network, or an automated investment community.

- **Prohibited Framework**: Signal marketplace, copy trading, subscription-based signals, verified signal performance boards.
- **Approved Framework**: User-defined webhooks, raw event streams, data connectors, and private developer API endpoints.
