/**
 * Phase 3 final acceptance — targeted regression tests.
 *
 * Verifies that:
 *  - Exchange communication health (active key + last_used_at recency, 15m threshold)
 *    is independent from positions-feed health.
 *  - Failed, malformed, or unavailable data is never rendered as zero.
 *  - Zero is rendered only when a successful response supports it.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardOverviewPage from "@/app/dashboard/page";
import * as apiClientModule from "@/lib/api-client";

type Responder = unknown | (() => unknown);

const MINUTE = 60 * 1000;

const baseUser = {
  id: "usr_sig",
  email: "signals@tadex.app",
  role: "user",
  status: "active",
  email_verified: true,
  telegram_linked: true,
  telegram_username: "tadex_signals",
};

const baseSubscription = {
  has_active_subscription: true,
  subscription: { id: "sub_sig", tier: "pro", status: "active", is_active: true },
  notifications: [],
};

function activeKey(lastUsedAt: string | null) {
  return [
    {
      id: "key_sig",
      exchange: "bybit",
      api_key_masked: "byb...0001",
      is_testnet: false,
      status: "active",
      last_used_at: lastUsedAt,
    },
  ];
}

function position(unrealized_pnl: unknown, id = "pos_1") {
  return {
    id,
    symbol: "BTCUSDT",
    side: "Buy",
    size: 0.1,
    entry_price: 68000,
    unrealized_pnl,
    leverage: 5,
  };
}

function mockApi(overrides: Record<string, Responder>) {
  const defaults: Record<string, Responder> = {
    "/me": baseUser,
    "/keys": activeKey(new Date(Date.now() - 2 * MINUTE).toISOString()),
    "/billing/subscription": baseSubscription,
    "/trading/positions": [],
    "/trading/orders": [],
    "/providers": [],
  };
  const table = { ...defaults, ...overrides };
  vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path: string) => {
    const r = table[path];
    return typeof r === "function" ? (r as () => unknown)() : r;
  });
}

function failWith(message: string) {
  return () => {
    throw new Error(message);
  };
}

async function renderPage() {
  render(<DashboardOverviewPage />);
  expect(await screen.findByText("Overview & Readiness")).toBeInTheDocument();
}

describe("Phase 3 — operational signal separation & KPI state correctness", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Positions: successful empty response
  // ---------------------------------------------------------------------------
  it("renders '0 Open' only for a successful empty positions response", async () => {
    mockApi({ "/trading/positions": [] });
    await renderPage();

    expect(screen.getByTestId("kpi-active-positions")).toHaveTextContent("0Open");
    expect(screen.getByText("Zero open market exposure")).toBeInTheDocument();
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "ok");
    expect(screen.queryByTestId("positions-error-state")).not.toBeInTheDocument();
    expect(screen.getByText("No active positions")).toBeInTheDocument();
  });

  it("renders $0.00 PnL for a successful empty positions response", async () => {
    mockApi({ "/trading/positions": [] });
    await renderPage();

    const pnl = screen.getByTestId("kpi-unrealized-pnl");
    expect(pnl).toHaveTextContent("$0.00");
    expect(pnl.textContent).not.toMatch(/[+-]/);
    expect(screen.getByText("Zero floating risk (no positions)")).toBeInTheDocument();
  });

  it("renders $0.00 PnL when valid open positions sum to exactly zero", async () => {
    mockApi({
      "/trading/positions": [position(15.25, "pos_a"), position(-15.25, "pos_b")],
    });
    await renderPage();

    expect(screen.getByTestId("kpi-active-positions")).toHaveTextContent("2Open");
    const pnl = screen.getByTestId("kpi-unrealized-pnl");
    expect(pnl).toHaveTextContent("$0.00");
    expect(pnl.textContent).not.toMatch(/[+-]/);
    expect(screen.getByText("Aggregated open position PnL")).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Positions: malformed PnL values
  // ---------------------------------------------------------------------------
  it.each([
    ["null", null],
    ["undefined", undefined],
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["-Infinity", Number.NEGATIVE_INFINITY],
    ["numeric string", "12.50"],
    ["object", { value: 12.5 }],
  ])("renders '—' (never a partial total) when one position PnL is %s", async (_label, bad) => {
    mockApi({
      "/trading/positions": [position(250, "pos_ok"), position(bad, "pos_bad")],
    });
    await renderPage();

    const pnl = screen.getByTestId("kpi-unrealized-pnl");
    expect(pnl).toHaveTextContent("—");
    expect(pnl).not.toHaveTextContent("$");
    expect(screen.getByText("PnL telemetry unavailable")).toBeInTheDocument();
  });

  it("treats a malformed (non-array) positions payload as a feed error, not zero", async () => {
    mockApi({ "/trading/positions": { unexpected: "shape" } });
    await renderPage();

    expect(screen.queryByTestId("kpi-active-positions")).not.toBeInTheDocument();
    expect(screen.getByText("Position feed query failed")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-unrealized-pnl")).toHaveTextContent("—");
    expect(screen.getByTestId("positions-error-state")).toBeInTheDocument();
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "error");
  });

  // ---------------------------------------------------------------------------
  // Signal independence
  // ---------------------------------------------------------------------------
  it("keeps 'Exchange Connected' with recent communication when the positions query fails", async () => {
    mockApi({
      "/keys": activeKey(new Date(Date.now() - 1 * MINUTE).toISOString()),
      "/trading/positions": failWith("Upstream timeout on Bybit position feed"),
    });
    await renderPage();

    const banner = screen.getByTestId("operational-status-banner");
    expect(banner).toHaveAttribute("data-mode", "optimal");
    expect(screen.getByText("Exchange Connected")).toBeInTheDocument();
    expect(screen.queryByText("Connection Idle")).not.toBeInTheDocument();

    // Positions-feed degradation shown independently
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "error");
    expect(screen.getByText("POSITIONS FEED UNAVAILABLE")).toBeInTheDocument();
    expect(screen.getByTestId("positions-error-state")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-unrealized-pnl")).toHaveTextContent("—");
  });

  it("reports 'Connection Idle' for stale communication even when the positions query succeeds", async () => {
    mockApi({
      "/keys": activeKey(new Date(Date.now() - 40 * MINUTE).toISOString()),
      "/trading/positions": [position(42.1)],
    });
    await renderPage();

    const banner = screen.getByTestId("operational-status-banner");
    expect(banner).toHaveAttribute("data-mode", "degraded");
    expect(screen.getByText("Connection Idle")).toBeInTheDocument();

    // Positions feed itself is healthy and its data is still shown
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "ok");
    expect(screen.getByTestId("kpi-active-positions")).toHaveTextContent("1Open");
    expect(screen.getByTestId("kpi-unrealized-pnl")).toHaveTextContent("+$42.10");
  });

  it.each([
    ["14 minutes ago", 14 * MINUTE, "optimal"],
    ["16 minutes ago", 16 * MINUTE, "degraded"],
  ])("applies the 15-minute communication threshold (%s → %s)", async (_label, ageMs, expected) => {
    mockApi({ "/keys": activeKey(new Date(Date.now() - ageMs).toISOString()) });
    await renderPage();

    expect(screen.getByTestId("operational-status-banner")).toHaveAttribute("data-mode", expected);
  });

  it("reports 'Connection Idle' when an active key has never communicated (last_used_at null)", async () => {
    mockApi({ "/keys": activeKey(null) });
    await renderPage();

    expect(screen.getByTestId("operational-status-banner")).toHaveAttribute("data-mode", "degraded");
    expect(screen.getByText("Connection Idle")).toBeInTheDocument();
  });

  it("shows positions feed as standby (not OK) when no exchange key is connected", async () => {
    mockApi({ "/keys": [] });
    await renderPage();

    expect(screen.getByTestId("operational-status-banner")).toHaveAttribute("data-mode", "disconnected");
    expect(screen.getByTestId("banner-positions-feed")).toHaveAttribute("data-feed-state", "standby");
  });

  // ---------------------------------------------------------------------------
  // Orders: failed vs successful empty
  // ---------------------------------------------------------------------------
  it("renders '—' when the orders request fails", async () => {
    mockApi({ "/trading/orders": failWith("Orders service unavailable") });
    await renderPage();

    const fills = screen.getByTestId("kpi-recent-fills");
    expect(fills).toHaveTextContent("—");
    expect(fills).not.toHaveTextContent("0");
    expect(screen.getByText("Orders telemetry unavailable")).toBeInTheDocument();
  });

  it("renders '0 Fills' for a successful empty order history", async () => {
    mockApi({ "/trading/orders": [] });
    await renderPage();

    expect(screen.getByTestId("kpi-recent-fills")).toHaveTextContent("0Fills");
    expect(screen.getByText("Cumulative filled orders in trade history")).toBeInTheDocument();
  });

  it("treats a malformed (non-array) orders payload as unavailable, not zero", async () => {
    mockApi({ "/trading/orders": { unexpected: "shape" } });
    await renderPage();

    expect(screen.getByTestId("kpi-recent-fills")).toHaveTextContent("—");
    expect(screen.getByText("Orders telemetry unavailable")).toBeInTheDocument();
  });

  it("counts only filled orders from a successful order history", async () => {
    mockApi({
      "/trading/orders": [
        { id: "o1", status: "filled" },
        { id: "o2", status: "cancelled" },
        { id: "o3", status: "FILLED" },
        { id: "o4", status: "new" },
      ],
    });
    await renderPage();

    expect(screen.getByTestId("kpi-recent-fills")).toHaveTextContent("2Fills");
  });
});
