import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardOverviewPage from "@/app/dashboard/page";
import * as apiClientModule from "@/lib/api-client";

describe("Phase 3: Dashboard Overview & Portfolio KPI Workspace", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const baseUser = {
    id: "usr_p3",
    email: "trader_p3@tadex.app",
    role: "user",
    status: "active",
    email_verified: true,
    telegram_linked: true,
    telegram_username: "tadex_trader_ng",
  };

  const baseSubscription = {
    has_active_subscription: true,
    subscription: {
      id: "sub_p3",
      tier: "pro",
      status: "active",
      is_active: true,
      current_period_end: "2026-12-01T00:00:00Z",
      provider_id: "prov_alpha",
    },
    notifications: [],
  };

  const baseProviders = [
    {
      id: "prov_alpha",
      name: "Alpha Bybit Momentum",
      is_verified: true,
      win_rate: 0.78,
      total_signals_sent: 210,
    },
  ];

  it("evaluates operational status as 'Exchange Connected' when active key has recent communication and no query errors", async () => {
    const recentTime = new Date(Date.now() - 3 * 60 * 1000).toISOString(); // 3 minutes ago
    const activeKeys = [
      {
        id: "key_active_recent",
        exchange: "bybit",
        api_key_masked: "byb...4321",
        is_testnet: false,
        status: "active",
        last_used_at: recentTime,
      },
    ];

    const positions = [
      {
        id: "pos_eth",
        symbol: "ETHUSDT",
        side: "Buy",
        size: 1.5,
        entry_price: 3200,
        unrealized_pnl: 120.5,
        leverage: 5,
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return baseUser;
      if (path === "/keys") return activeKeys;
      if (path === "/billing/subscription") return baseSubscription;
      if (path === "/trading/positions") return positions;
      if (path === "/trading/orders") return [{ id: "ord_1", symbol: "ETHUSDT", side: "Buy", status: "filled", size: 1.5 }];
      if (path === "/providers") return baseProviders;
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    // Mode is Exchange Connected (evidence-aligned)
    const banner = screen.getByTestId("operational-status-banner");
    expect(banner).toHaveAttribute("data-mode", "optimal");
    expect(screen.getByText("Exchange Connected")).toBeInTheDocument();
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "ok");
    expect(screen.getByText("POSITIONS FEED OK")).toBeInTheDocument();

    // Telemetry strip
    expect(screen.getByTestId("banner-exchange-telemetry")).toHaveTextContent("BYBIT Mainnet");
    expect(screen.getByTestId("banner-provider-telemetry")).toHaveTextContent("Alpha Bybit Momentum");
    expect(screen.getByTestId("banner-subscription-telemetry")).toHaveTextContent("pro");

    // Portfolio KPI
    expect(screen.getByTestId("kpi-active-positions")).toHaveTextContent("1Open");
    expect(screen.getByTestId("kpi-unrealized-pnl")).toHaveTextContent("+$120.50");
    expect(screen.getByTestId("kpi-recent-fills")).toHaveTextContent("1Fills");

    // Honest unavailable balance
    expect(screen.getByTestId("kpi-exchange-balance")).toHaveTextContent("—");
    expect(screen.getByText("Unavailable")).toBeInTheDocument();

    // Setup checklist shows Setup Complete (not Ready for Execution)
    expect(screen.getByTestId("readiness-progress-pill")).toHaveTextContent("Setup Complete");
  });

  it("evaluates operational status as 'Connection Idle' when exchange communication is older than 15 minutes", async () => {
    const staleTime = new Date(Date.now() - 25 * 60 * 1000).toISOString(); // 25 minutes ago
    const staleKeys = [
      {
        id: "key_active_stale",
        exchange: "bybit",
        api_key_masked: "byb...9999",
        is_testnet: false,
        status: "active",
        last_used_at: staleTime,
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return baseUser;
      if (path === "/keys") return staleKeys;
      if (path === "/billing/subscription") return baseSubscription;
      if (path === "/trading/positions") return [];
      if (path === "/trading/orders") return [];
      if (path === "/providers") return baseProviders;
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    const banner = screen.getByTestId("operational-status-banner");
    expect(banner).toHaveAttribute("data-mode", "degraded");
    expect(screen.getByText("Connection Idle")).toBeInTheDocument();
    expect(screen.getByText(/No authenticated exchange communication recorded in the last 15 minutes/i)).toBeInTheDocument();
    // Positions feed succeeded (empty) — reported independently of stale communication
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "ok");
  });

  it("does not convert failed positions query into zero and marks telemetry as unavailable", async () => {
    const recentTime = new Date().toISOString();
    const activeKeys = [
      {
        id: "key_active",
        exchange: "bybit",
        api_key_masked: "byb...1234",
        is_testnet: false,
        status: "active",
        last_used_at: recentTime,
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return baseUser;
      if (path === "/keys") return activeKeys;
      if (path === "/billing/subscription") return baseSubscription;
      if (path === "/trading/positions") throw new Error("Upstream timeout on Bybit position feed");
      if (path === "/trading/orders") return [];
      if (path === "/providers") return baseProviders;
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    // Exchange communication is recent, so connection health stays "Exchange Connected";
    // the positions-feed failure is surfaced independently.
    const banner = screen.getByTestId("operational-status-banner");
    expect(banner).toHaveAttribute("data-mode", "optimal");
    expect(screen.getByText("Exchange Connected")).toBeInTheDocument();
    expect(screen.queryByText("Connection Idle")).not.toBeInTheDocument();
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "error");
    expect(screen.getByText("POSITIONS FEED UNAVAILABLE")).toBeInTheDocument();

    // Active Positions KPI must not show zero
    expect(screen.queryByTestId("kpi-active-positions")).not.toBeInTheDocument();
    expect(screen.getByText("Position feed query failed")).toBeInTheDocument();

    // KPI 2 (Unrealized PnL) MUST NOT be $0.00 — it must be '—'
    expect(screen.getByTestId("kpi-unrealized-pnl")).toHaveTextContent("—");

    // Active Positions table shows honest error state
    expect(screen.getByTestId("positions-error-state")).toBeInTheDocument();
    expect(screen.getByText("Positions feed unavailable")).toBeInTheDocument();
  });

  it("evaluates operational status as 'Exchange Disconnected' when no active API keys exist", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return baseUser;
      if (path === "/keys") return [];
      if (path === "/billing/subscription") return baseSubscription;
      if (path === "/trading/positions") return [];
      if (path === "/trading/orders") return [];
      if (path === "/providers") return baseProviders;
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    const banner = screen.getByTestId("operational-status-banner");
    expect(banner).toHaveAttribute("data-mode", "disconnected");
    expect(screen.getByText("Exchange Disconnected")).toBeInTheDocument();
    expect(screen.getByTestId("banner-connect-key-btn")).toBeInTheDocument();

    // Checklist reflects missing exchange key
    expect(screen.getByTestId("readiness-progress-pill")).toHaveTextContent("3 of 4 Completed");
  });

  it("evaluates operational status as 'Platform Maintenance' only when backend explicitly identifies a maintenance state", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async () => {
      const err = new Error("Web API is temporarily unavailable for scheduled maintenance. Please try again shortly.");
      (err as unknown as { status: number }).status = 503;
      (err as unknown as { detail: string }).detail = "Web API is temporarily unavailable for scheduled maintenance. Please try again shortly.";
      throw err;
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    const banner = screen.getByTestId("operational-status-banner");
    expect(banner).toHaveAttribute("data-mode", "maintenance");
    expect(screen.getByText("Platform Maintenance")).toBeInTheDocument();
    expect(screen.getByText("Maintenance Mode Active")).toBeInTheDocument();
  });

  it("does not interpret a generic HTTP 503 without maintenance detail as maintenance mode", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/trading/positions") {
        const err = new Error("Gateway timeout");
        (err as unknown as { status: number }).status = 503;
        (err as unknown as { detail: string }).detail = "Upstream cloudflare 503 gateway timeout";
        throw err;
      }
      if (path === "/me") return baseUser;
      if (path === "/keys") return [
        {
          id: "key_active",
          exchange: "bybit",
          api_key_masked: "byb...1234",
          is_testnet: false,
          status: "active",
          last_used_at: new Date().toISOString(),
        },
      ];
      if (path === "/billing/subscription") return baseSubscription;
      if (path === "/trading/orders") return [];
      if (path === "/providers") return baseProviders;
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    const banner = screen.getByTestId("operational-status-banner");
    // MUST NOT be maintenance mode; communication is recent so connection health is unaffected,
    // and the failed positions request is reported as a feed failure.
    expect(banner).not.toHaveAttribute("data-mode", "maintenance");
    expect(banner).toHaveAttribute("data-mode", "optimal");
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "error");
  });

  it("enforces honest unavailable state for exchange balance and does not fabricate numbers", async () => {
    const recentTime = new Date().toISOString();
    const activeKeys = [
      {
        id: "key_active",
        exchange: "bybit",
        api_key_masked: "byb...5555",
        is_testnet: false,
        status: "active",
        last_used_at: recentTime,
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return baseUser;
      if (path === "/keys") return activeKeys;
      if (path === "/billing/subscription") return baseSubscription;
      if (path === "/trading/positions") return [];
      if (path === "/trading/orders") return [];
      if (path === "/providers") return baseProviders;
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    // Verify exchange balance KPI card
    const balanceKpi = screen.getByTestId("kpi-exchange-balance");
    expect(balanceKpi).toHaveTextContent("—");
    expect(screen.getByTitle("Exchange balance feed is unavailable in the current API version.")).toBeInTheDocument();
    expect(screen.getByText("Feed not exposed in current API contract")).toBeInTheDocument();
  });

  it("handles malformed position PnL without silently producing a misleading total", async () => {
    const recentTime = new Date().toISOString();
    const activeKeys = [
      {
        id: "key_active",
        exchange: "bybit",
        api_key_masked: "byb...7777",
        is_testnet: false,
        status: "active",
        last_used_at: recentTime,
      },
    ];

    const malformedPositions = [
      {
        id: "pos_btc",
        symbol: "BTCUSDT",
        side: "Buy",
        size: 0.5,
        entry_price: 68000,
        unrealized_pnl: 250.0,
        leverage: 10,
      },
      {
        id: "pos_sol",
        symbol: "SOLUSDT",
        side: "Sell",
        size: 20,
        entry_price: 180,
        unrealized_pnl: null, // Malformed / missing PnL
        leverage: 3,
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return baseUser;
      if (path === "/keys") return activeKeys;
      if (path === "/billing/subscription") return baseSubscription;
      if (path === "/trading/positions") return malformedPositions;
      if (path === "/trading/orders") return [];
      if (path === "/providers") return baseProviders;
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    // PnL must be '—' rather than a partial or corrupted number
    expect(screen.getByTestId("kpi-unrealized-pnl")).toHaveTextContent("—");
  });

  it("contains strictly 4 genuine onboarding prerequisites without fabricated risk controls", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") return { ...baseUser, email_verified: false, telegram_linked: false };
      if (path === "/keys") return [];
      if (path === "/billing/subscription") return { has_active_subscription: false, subscription: null, notifications: [] };
      if (path === "/trading/positions") return [];
      if (path === "/trading/orders") return [];
      if (path === "/providers") return [];
      return [];
    });

    render(<DashboardOverviewPage />);

    expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();

    const checklist = screen.getByTestId("execution-readiness-checklist");
    expect(checklist).toBeInTheDocument();

    // Assert the 4 genuine checklist items exist
    expect(screen.getByText("Account Verified")).toBeInTheDocument();
    expect(screen.getByText("Exchange API Key")).toBeInTheDocument();
    expect(screen.getByText("Telegram Alerts")).toBeInTheDocument();
    expect(screen.getByText("Platform Subscription")).toBeInTheDocument();

    // Assert NO fake risk management or stop-loss config checklist item exists
    expect(screen.queryByText(/Risk Management Configured/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Max Drawdown Configured/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Stop-Loss Rule Set/i)).not.toBeInTheDocument();

    // Progress is 0 of 4 Completed
    expect(screen.getByTestId("readiness-progress-pill")).toHaveTextContent("0 of 4 Completed");
  });
});
