# Tadex Compliance Classification Specification

## 1. Purpose
This document defines the semantic and architectural interpretation rules for all Tadex user-facing and system-facing descriptions.

The objective is to ensure Tadex is consistently classified as a workflow automation SaaS platform and not interpreted as a financial service, trading system, investment tool, or brokerage infrastructure during payment processor review and compliance evaluation.

This specification governs all product copy, UI language, documentation, and system descriptions.

## 2. Core Classification Boundary
Tadex is strictly defined as:
* **A workflow automation platform that processes user-defined rules for routing event-based data between external systems.**

Tadex is NOT:
* a trading platform
* a financial service provider
* an investment system
* a brokerage or exchange
* a decision-making engine for financial outcomes
* a profit-generating system
* a signal marketplace

Any interpretation outside the workflow automation boundary is considered invalid.

## 3. Non-Decision Authority Constraint (CRITICAL)
Tadex does not perform, infer, or simulate decision-making on behalf of users.

This means:
* Tadex does NOT evaluate input quality.
* Tadex does NOT rank, score, or optimize external inputs.
* Tadex does NOT interpret inputs for value, profit, or performance.
* Tadex does NOT determine outcomes based on external market or system conditions.

All routing behavior is strictly executed based on explicit user-defined rules. Tadex acts only as a passive routing and transformation layer for event flows.

## 4. Intent Decoupling Rule
All system descriptions must avoid implying:
* financial intent
* investment intent
* trading intent
* performance-based outcomes

All actions must be framed as:
* user-defined workflow routing
* rule-based automation
* event delivery between systems
* data movement across integrations

No language may suggest Tadex improves, predicts, or optimizes external outcomes.

## 5. Monetization Decoupling Rule
Tadex does not operate or facilitate any marketplace for financial signals, trading strategies, or investment content.

If monetization is referenced, it must strictly refer to:
* subscription access to software features
* access to automation workflows
* access to integration capabilities

Tadex does NOT:
* facilitate monetization of signals or predictions.
* act as a performance-based content marketplace.
* enable financial advisory distribution.

## 6. Workflow-Only Interpretation Rule
All Tadex functionality must be described as:
* workflow automation
* event routing
* rule-based data processing
* integration-driven automation

The system must never be described as executing outcomes in external financial or investment environments. External systems are always independent execution environments controlled solely by the user.

## 7. Vocabulary Standardization
The following terms must be used consistently:
* Replace "signal" → "event" or "data input"
* Replace "signal source" → "data feed" or "external source"
* Replace "execution" → "routing" or "dispatch"
* Replace "monetize signals" → "content subscription"
* Replace "performance tracking" → "usage analytics"
* Replace "validation of signals" → "rule-based filtering"

### Contextual Rule:
* **UI**: event / alert
* **API / backend**: data stream
* **Feature naming**: workflow automation or routing system

## 8. External System Responsibility Boundary
Tadex does not control or influence external systems. This includes:
* trading platforms
* financial exchanges
* APIs connected by users
* third-party automation tools

All actions executed externally are:
* initiated by user-defined configuration
* executed by third-party systems
* outside Tadex control or liability

Tadex only transmits structured routing instructions.

## 9. Risk Disclaimers Alignment Rule
All legal and UI disclaimers must align with:
* no financial advice
* no investment guidance
* no outcome guarantees
* no execution control over external systems

Tadex is strictly a software infrastructure layer.

## 10. Compliance Consistency Requirement
All product surfaces must maintain consistent classification:
* Website
* UI components
* API documentation
* Legal pages
* Onboarding flows
* Email templates
* Analytics events
* Error messages

No surface may reintroduce financial, trading, or investment semantics.

## 11. Final Interpretation Rule (MANDATORY)
In all contexts, Tadex must be interpreted as:
* **"A workflow automation system for routing user-defined event data between integrated external tools."**

Any alternative interpretation is explicitly invalid under this specification.
