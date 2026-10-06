import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TradingPage from "@/app/dashboard/trading/page";
import * as apiClientModule from "@/lib/api-client";

describe("Live Trading Page (/dashboard/trading)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockKeys = [
    {
      id: "key_trade_1",
      exchange: "bybit",
      api_key_masked: "...4411",
      is_testnet: false,
      status: "active",
      created_at: "2026-08-01T00:00:00Z",
    },
  ];

  it("renders live exchange connection and freshness indicator", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") return mockKeys;
      if (path === "/trading/positions") return [];
      if (path === "/trading/orders") return [];
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Live Trading & Execution")).toBeInTheDocument();

    // Verify exchange connection banner
    expect(screen.getByText("BYBIT Connection Active")).toBeInTheDocument();
    expect(screen.getByText(/Trade-Only/)).toBeInTheDocument();
    expect(screen.getByText(/...4411/)).toBeInTheDocument();

    // Verify Freshness indicator
    expect(await screen.findByText(/Synced just now|Synced/i)).toBeInTheDocument();

    // Verify manual refresh button
    expect(screen.getByRole("button", { name: /refresh now/i })).toBeInTheDocument();
  });

  it("triggers manual sync and updates freshness state", async () => {
    let keysFetchCount = 0;

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") {
        keysFetchCount++;
        return mockKeys;
      }
      if (path === "/trading/positions") return [];
      if (path === "/trading/orders") return [];
      return [];
    });

    render(<TradingPage />);

    await screen.findByText("Live Trading & Execution");

    const refreshBtn = screen.getByRole("button", { name: /refresh now/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(keysFetchCount).toBeGreaterThanOrEqual(2);
    });
  });

  it("displays sync error state when exchange key fetch fails", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") throw new Error("Exchange API Timeout");
      if (path === "/trading/positions") return [];
      if (path === "/trading/orders") return [];
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Sync Error")).toBeInTheDocument();
    expect(screen.getByText("No Exchange Connected")).toBeInTheDocument();
  });

  it("displays sync error state and does not mark fresh when positions fetch fails", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") return mockKeys;
      if (path.includes("/trading/positions")) throw new Error("Positions Gateway Error");
      if (path.includes("/trading/orders")) return [];
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Sync Error")).toBeInTheDocument();
    expect(screen.queryByText(/Synced just now/i)).not.toBeInTheDocument();
  });

  it("displays sync error state and does not mark fresh when orders fetch fails", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") return mockKeys;
      if (path.includes("/trading/positions")) return [];
      if (path.includes("/trading/orders")) throw new Error("Orders Gateway Error");
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Sync Error")).toBeInTheDocument();
    expect(screen.queryByText(/Synced just now/i)).not.toBeInTheDocument();
  });
});
