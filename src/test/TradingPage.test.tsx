import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TradingPage from "@/app/dashboard/trading/page";
import * as apiClientModule from "@/lib/api-client";

describe("Live Trading Page (/dashboard/trading) - Freshness & Source-of-Truth", () => {
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

  it("Case 1: keys success + positions success + orders success -> fresh", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") return mockKeys;
      if (path.includes("/trading/positions")) return [];
      if (path.includes("/trading/orders")) return [];
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Live Trading & Execution")).toBeInTheDocument();
    expect(screen.getByText("BYBIT Connection Active")).toBeInTheDocument();
    expect(screen.getByText(/Trade-Only/)).toBeInTheDocument();
    expect(screen.getByText(/...4411/)).toBeInTheDocument();

    expect(await screen.findByText(/Synced just now|Synced/i)).toBeInTheDocument();
    expect(screen.queryByText("Sync Error")).not.toBeInTheDocument();
  });

  it("Case 2: keys error + positions success + orders success -> fresh (THE CORE FIX)", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") throw new Error("Key management service unreachable");
      if (path.includes("/trading/positions")) return [];
      if (path.includes("/trading/orders")) return [];
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Live Trading & Execution")).toBeInTheDocument();
    // Key failure is reflected in the exchange connection card
    expect(screen.getByText("No Exchange Connected")).toBeInTheDocument();

    // But execution state freshness remains fresh because exchange feeds succeeded!
    expect(await screen.findByText(/Synced just now|Synced/i)).toBeInTheDocument();
    expect(screen.queryByText("Sync Error")).not.toBeInTheDocument();
  });

  it("Case 3: keys success + positions error + orders success -> error", async () => {
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

  it("Case 4: keys success + positions success + orders error -> error", async () => {
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

  it("Case 5: keys error + positions error + orders success -> error", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") throw new Error("Key service down");
      if (path.includes("/trading/positions")) throw new Error("Positions error");
      if (path.includes("/trading/orders")) return [];
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Sync Error")).toBeInTheDocument();
    expect(screen.getByText("No Exchange Connected")).toBeInTheDocument();
    expect(screen.queryByText(/Synced just now/i)).not.toBeInTheDocument();
  });

  it("Case 6: keys error + positions success + orders error -> error", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") throw new Error("Key service down");
      if (path.includes("/trading/positions")) return [];
      if (path.includes("/trading/orders")) throw new Error("Orders error");
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Sync Error")).toBeInTheDocument();
    expect(screen.getByText("No Exchange Connected")).toBeInTheDocument();
    expect(screen.queryByText(/Synced just now/i)).not.toBeInTheDocument();
  });

  it("Case 7: lastSyncedAt updates only upon successful completion", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") return mockKeys;
      if (path.includes("/trading/positions")) throw new Error("Failed");
      if (path.includes("/trading/orders")) return [];
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText("Sync Error")).toBeInTheDocument();
    expect(screen.queryByText(/Synced just now/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Synced \d+s ago/i)).not.toBeInTheDocument();
  });

  it("Case 8: polling initiation alone never sets fresh", async () => {
    let resolvePositions: (val: unknown) => void;
    let resolveOrders: (val: unknown) => void;

    vi.spyOn(apiClientModule, "apiClient").mockImplementation((path) => {
      if (path === "/keys") return Promise.resolve(mockKeys);
      if (path.includes("/trading/positions")) {
        return new Promise((resolve) => {
          resolvePositions = resolve;
        });
      }
      if (path.includes("/trading/orders")) {
        return new Promise((resolve) => {
          resolveOrders = resolve;
        });
      }
      return Promise.resolve([]);
    });

    render(<TradingPage />);

    // Freshness must indicate syncing, never fresh
    expect(await screen.findByText("Syncing with Bybit...")).toBeInTheDocument();
    expect(screen.queryByText(/Synced just now/i)).not.toBeInTheDocument();

    // Now resolve feeds
    resolvePositions!([]);
    resolveOrders!([]);

    expect(await screen.findByText(/Synced just now|Synced/i)).toBeInTheDocument();
  });

  it("Case 9: manual refresh follows same semantics", async () => {
    let callCount = 0;
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      callCount++;
      if (path === "/keys") return mockKeys;
      if (path.includes("/trading/positions")) return [];
      if (path.includes("/trading/orders")) return [];
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText(/Synced just now|Synced/i)).toBeInTheDocument();
    const initialCalls = callCount;

    const refreshBtn = screen.getByRole("button", { name: /refresh now/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(initialCalls);
    });
    expect(await screen.findByText(/Synced just now|Synced/i)).toBeInTheDocument();
  });

  it("Case 10: visibility-aware polling preserved", async () => {
    let keysFetchCount = 0;
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/keys") {
        keysFetchCount++;
        return mockKeys;
      }
      return [];
    });

    render(<TradingPage />);

    expect(await screen.findByText(/Synced just now|Synced/i)).toBeInTheDocument();
    const countBeforeVisibility = keysFetchCount;

    // Simulate tab becoming visible
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      writable: true,
      configurable: true,
    });
    fireEvent(document, new Event("visibilitychange"));

    await waitFor(() => {
      expect(keysFetchCount).toBeGreaterThan(countBeforeVisibility);
    });
  });
});
