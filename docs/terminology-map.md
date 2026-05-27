# Tadex Terminology Normalization Map

This map defines how legacy financial/trading terminology is conditionally replaced across different layers of the Tadex system.

## 1. Contextual Mapping Rules
To maintain semantic consistency and avoid trigger keywords, the following rules apply:

* **UI Context (Marketing copy, labels, headings)**: Use `event` or `alert`.
* **Backend / API / Database / Error Messages**: Use `data stream` or `payload`.
* **Feature Name / Structural Capabilities**: Use `workflow trigger` or `automation connector`.

---

## 2. Word Replacement Catalog

| Legacy Term | Target Context | Normalized Term | Rationale / Compliance Impact |
| :--- | :--- | :--- | :--- |
| **Signal** | UI | `Event` / `Alert` | Removes financial trading association; aligns with standard SaaS webhooks. |
| **Signal** | Backend / API | `Data Stream` / `Message` | Aligns with generic event processing and message routing systems. |
| **Signal** | Feature Name | `Workflow Trigger` | Neutral SaaS feature description. |
| **Signal Source** | Global | `Data Source` / `Feed` / `Integration` | Standard workflow integration copy (like Zapier/Make). |
| **Execution** | Global | `Routing` / `Automation` / `Dispatch` | Eliminates the execution of financial trades association. |
| **Monetize signals** | Global | `Content subscription` / `Distribution system` | Replaces financial trading profit with SaaS content distribution. |
| **Trading bot** | Global | `Workflow automation engine` | Standard SaaS workflow terminology. |
| **Trading volume** | Global | `Event volume` / `Message volume` | Standard API usage tier metric. |
| **Copy trading** | Global | `Shared workflows` / `Feed replication` | Eliminates copy trading model. |
| **PnL / Profit** | Global | `Outcome validation` / `Activity logs` | Removes financial optimization outcome claims. |
| **Stop Loss / Take Profit**| Global | `Routing rules` / `Delivery filters` | Abstracted to routing logic conditions. |
