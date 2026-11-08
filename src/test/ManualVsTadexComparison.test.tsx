import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ManualVsTadexComparison from "@/components/ManualVsTadexComparison";

describe("ManualVsTadexComparison Component (Phase 2)", () => {
  it("renders section header with workflow comparison badge and balanced value statement", () => {
    render(<ManualVsTadexComparison />);

    expect(
      screen.getByRole("region", { name: /Manual Signal Copying versus Tadex Automation/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: /Manual Execution vs\. Tadex Automation/i })
    ).toBeInTheDocument();

    expect(screen.getByText("WORKFLOW COMPARISON")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Trading signals move fast\. Manual copy-pasting introduces operational friction, calculation pressure, and unforced entry delays\./i
      )
    ).toBeInTheDocument();
  });

  it("renders all 6 operational workflow dimensions with distinct friction and advantage tags", () => {
    render(<ManualVsTadexComparison />);

    // Dimension 1: Signal Ingestion
    expect(screen.getAllByText("Signal Ingestion & Monitoring").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Manual Phone Vigilance").length).toBeGreaterThan(0);
    expect(screen.getAllByText("24/7 Cloud Ingestion").length).toBeGreaterThan(0);

    // Dimension 2: Execution Timing
    expect(screen.getAllByText("Order Entry & Execution Timing").length).toBeGreaterThan(0);
    expect(screen.getAllByText("App-Switching Delay").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Low-Latency API Dispatch").length).toBeGreaterThan(0);

    // Dimension 3: Position Sizing
    expect(screen.getAllByText("Position Sizing & Risk Calculation").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Calculation Pressure").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Automated Risk Rules").length).toBeGreaterThan(0);

    // Dimension 4: Stop Loss Discipline
    expect(screen.getAllByText("Stop Loss Discipline").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Emotional Hesitation").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Configured Stop Loss").length).toBeGreaterThan(0);

    // Dimension 5: Duplicate Protection
    expect(screen.getAllByText("Signal Updates & Duplicate Guard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Duplicate Order Risk").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Idempotent Order Guard").length).toBeGreaterThan(0);

    // Dimension 6: Account Custody
    expect(screen.getAllByText("Account Custody & Operational Control").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Manual Responsibility").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Non-Custodial · Bybit Only").length).toBeGreaterThan(0);

    // Precise responsibility copy check (no "100% operational burden")
    expect(
      screen.getAllByText(
        /You remain responsible for monitoring signals, calculating position sizes, and placing orders\./i
      ).length
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/100% operational burden/i)).not.toBeInTheDocument();

    // Defensible idempotency copy check (no "strict single execution" absolute)
    expect(
      screen.getAllByText(/helping prevent duplicate order dispatches/i).length
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/execute strictly once/i)).not.toBeInTheDocument();
  });

  it("truthfully clarifies automation execution scope without investment advice or profit guarantees", () => {
    render(<ManualVsTadexComparison />);

    expect(
      screen.getByText("Automation Eliminates Delay — You Configure the Rules")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Tadex is a software automation layer that executes your instructions directly on your connected Bybit account\. Tadex does not give financial advice, generate trading signals, or guarantee profits\./i
      )
    ).toBeInTheDocument();

    // CTA routing check
    const ctaLink = screen.getByRole("link", { name: /Start Free\. No Credit Card\./i });
    expect(ctaLink).toHaveAttribute("href", "/register");
  });

  it("strictly confines supported exchange scope to Bybit with zero unsupported exchange mentions", () => {
    render(<ManualVsTadexComparison />);

    // Must NOT mention Binance or OKX as active comparison targets
    expect(screen.queryByText(/Binance/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/OKX/i)).not.toBeInTheDocument();

    // Mentions Bybit explicitly
    expect(screen.getAllByText(/Bybit/i).length).toBeGreaterThan(0);
  });
});
