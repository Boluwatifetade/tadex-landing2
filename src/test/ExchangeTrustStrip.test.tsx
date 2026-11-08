import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExchangeTrustStrip from "@/components/ExchangeTrustStrip";

describe("ExchangeTrustStrip Component", () => {
  it("renders Bybit integration with tested API claim and AVAILABLE badge", () => {
    render(<ExchangeTrustStrip />);

    expect(
      screen.getByRole("region", { name: /Exchange compatibility and security/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Bybit Integration")).toBeInTheDocument();
    expect(screen.getByText("AVAILABLE")).toBeInTheDocument();
    expect(
      screen.getByText(/Bybit API integration tested for USDT Perpetuals and Futures execution\./i)
    ).toBeInTheDocument();

    // Must NOT make unsupported partnership or official verification claims
    expect(screen.queryByText(/Bybit verified live/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/official partner/i)).not.toBeInTheDocument();
  });

  it("renders Binance & OKX with PLANNED badge and roadmap statement", () => {
    render(<ExchangeTrustStrip />);

    expect(screen.getByText("Binance & OKX")).toBeInTheDocument();
    expect(screen.getByText("PLANNED")).toBeInTheDocument();
    expect(
      screen.getByText(/Planned integrations underway for upcoming platform releases\./i)
    ).toBeInTheDocument();
  });

  it("renders verified non-custodial scope with Fernet encryption and trade-only permissions", () => {
    render(<ExchangeTrustStrip />);

    expect(screen.getByText("Non-Custodial Scope")).toBeInTheDocument();
    expect(
      screen.getByText(
        /API credentials are encrypted at rest using Fernet-based symmetric encryption\. Tadex requires exchange read and trading permissions, with withdrawal permissions disabled\./i
      )
    ).toBeInTheDocument();
  });
});
