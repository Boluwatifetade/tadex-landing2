import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardOverviewPage from "@/app/dashboard/page";
import * as apiClientModule from "@/lib/api-client";

describe("Dashboard Overview (/dashboard)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockUserMe = {
    id: "user_uuid_101",
    email: "trader@tadex.app",
    role: "user",
    status: "active",
    email_verified: true,
    telegram_linked: true,
    telegram_username: "crypto_trader_ng",
  };

  const mockKeys = [
    {
      id: "key_uuid_202",
      exchange: "bybit",
      api_key_masked: "...9821",
      is_testnet: false,
      status: "active",
    },
  ];

  const mockSubscription = {
    has_active_subscription: true,
    subscription: {
      id: "sub_uuid_303",
      tier: "pro",
      status: "active",
      is_active: true,
      current_period_end: "2026-11-01T00:00:00Z",
      provider_id: "prov_uuid_404",
    },
    notifications: [],
  };

  const mockPositions = [
    {
      id: "pos_btc",
      symbol: "BTCUSDT",
      side: "Buy",
      size: 0.1,
      entry_price: 64000.0,
      unrealized_pnl: 45.2,
      leverage: 10,
    },
  ];

  const mockProviders = [
    {
      id: "prov_uuid_404",
      name: "Alpha Quant Signals",
      is_verified: true,
      win_rate: 0.825,
      total_signals_sent: 140,
    },
  ];

  it("renders verified system state and 5/5 completed readiness checklist when fully configured", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return mockUserMe;
      if (path === "/keys") return mockKeys;
      if (path === "/billing/subscription") return mockSubscription;
      if (path === "/trading/positions") return mockPositions;
      if (path === "/providers") return mockProviders;
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    // 5 of 5 steps completed badge
    expect(screen.getByText("Ready for Execution")).toBeInTheDocument();

    // Exchange key status
    expect(screen.getByText("BYBIT")).toBeInTheDocument();
    expect(screen.getByText("...9821")).toBeInTheDocument();

    // Subscription status
    expect(screen.getAllByText(/pro/i).length).toBeGreaterThan(0);

    // Positions status
    expect(screen.getByText("1 Active")).toBeInTheDocument();
    expect(screen.getByText("BTCUSDT")).toBeInTheDocument();
    expect(screen.getByText("+$45.20")).toBeInTheDocument();

    // Telegram status
    expect(screen.getAllByText("@crypto_trader_ng").length).toBeGreaterThan(0);

    // Providers section
    expect(screen.getByText("Alpha Quant Signals")).toBeInTheDocument();
    expect(screen.getByText("82.5%")).toBeInTheDocument();
  });

  it("renders incomplete readiness checklist when user has no API keys, no subscription, and unlinked Telegram", async () => {
    const unverifiedUser = {
      id: "user_uuid_fresh",
      email: "newtrader@tadex.app",
      status: "active",
      email_verified: false,
      telegram_linked: false,
      telegram_username: null,
    };

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return unverifiedUser;
      if (path === "/keys") return [];
      if (path === "/billing/subscription") {
        return { has_active_subscription: false, subscription: null, notifications: [] };
      }
      if (path === "/trading/positions") return [];
      if (path === "/providers") return [];
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    // 0 of 5 Completed badge
    expect(screen.getByText("0 of 5 Completed")).toBeInTheDocument();

    // Not Connected states
    expect(screen.getByText("Not Connected")).toBeInTheDocument();
    expect(screen.getByText("Unlinked")).toBeInTheDocument();

    // Honest empty positions message
    expect(screen.getByText("No active positions")).toBeInTheDocument();
    expect(screen.getByText("Positions opened by signal automations will appear here and in Live Trading.")).toBeInTheDocument();
  });

  it("renders subscription warning notifications banner when returned by backend", async () => {
    const subWithWarning = {
      has_active_subscription: true,
      subscription: { id: "sub_warn", tier: "pro", status: "past_due", is_active: false },
      notifications: ["⚠️ Your subscription payment is past due. Please update billing."],
    };

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return mockUserMe;
      if (path === "/keys") return [];
      if (path === "/billing/subscription") return subWithWarning;
      if (path === "/trading/positions") return [];
      if (path === "/providers") return [];
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText(/Your subscription payment is past due/)).toBeInTheDocument();
  });

  it("treats revoked API keys as not connected in checklist and card", async () => {
    const revokedKeys = [
      {
        id: "key_revoked_1",
        exchange: "bybit",
        api_key_masked: "...1111",
        is_testnet: false,
        status: "revoked",
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return mockUserMe;
      if (path === "/keys") return revokedKeys;
      if (path === "/billing/subscription") return mockSubscription;
      if (path === "/trading/positions") return [];
      if (path === "/providers") return [];
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    expect(screen.getByText("Not Connected")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Connect Key" }).length).toBe(2);
    expect(screen.queryByRole("button", { name: "Manage Key" })).not.toBeInTheDocument();
  });

  it("treats suspended API keys as not connected in checklist and card", async () => {
    const suspendedKeys = [
      {
        id: "key_suspended_1",
        exchange: "binance",
        api_key_masked: "...2222",
        is_testnet: false,
        status: "suspended",
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return mockUserMe;
      if (path === "/keys") return suspendedKeys;
      if (path === "/billing/subscription") return mockSubscription;
      if (path === "/trading/positions") return [];
      if (path === "/providers") return [];
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    expect(screen.getByText("Not Connected")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Connect Key" }).length).toBe(2);
    expect(screen.queryByRole("button", { name: "Manage Key" })).not.toBeInTheDocument();
  });

  it("identifies active connection when user has mixed revoked and active keys", async () => {
    const mixedKeys = [
      {
        id: "key_revoked_0",
        exchange: "bybit",
        api_key_masked: "...0000",
        is_testnet: false,
        status: "revoked",
      },
      {
        id: "key_active_1",
        exchange: "bybit",
        api_key_masked: "...7777",
        is_testnet: false,
        status: "active",
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return mockUserMe;
      if (path === "/keys") return mixedKeys;
      if (path === "/billing/subscription") return mockSubscription;
      if (path === "/trading/positions") return [];
      if (path === "/providers") return [];
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    expect(screen.getByText("BYBIT")).toBeInTheDocument();
    expect(screen.getByText("...7777")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manage Key" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manage Keys" })).toBeInTheDocument();
  });
});
