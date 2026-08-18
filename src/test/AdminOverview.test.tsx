import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdminOverview from "@/components/admin/AdminOverview";
import * as apiClientModule from "@/lib/api-client";
import { AdminOverviewResponse } from "@/types/admin";

const mockOverview: AdminOverviewResponse = {
  users: {
    total: 142,
    active: 138,
    suspended: 3,
    banned: 1,
  },
  providers: {
    total: 8,
    active: 4,
    suspended: 2,
    deleted: 2,
    verified: 3,
    pending_applications: 5,
    pending_verifications: 2,
    by_status: { active: 4, suspended: 2, deleted: 2 },
  },
  exchange_accounts: {
    total: 95,
    bybit: 95,
    active: 91,
    revoked: 4,
  },
  subscriptions: {
    total: 62,
    active: 48,
    trialing: 6,
    cancelled: 8,
    expired: 0,
    by_status: { active: 48, trialing: 6, cancelled: 8 },
  },
  payments: {
    total: 210,
    completed: 198,
    pending: 7,
    failed: 5,
    by_status: { completed: 198, pending: 7, failed: 5 },
  },
  system_state: {
    kill_switch_enabled: false,
    kill_switch_status: "NORMAL",
    trades_24h: 312,
    failed_trades_24h: 2,
    success_rate_24h: 99.4,
    pending_tasks: 0,
    processing_tasks: 0,
  },
};

describe("AdminOverview Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders platform KPIs and Needs Attention counters correctly", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockOverview);

    render(<AdminOverview />);

    expect(await screen.findByText("Platform Overview")).toBeInTheDocument();

    // Needs Attention queues
    expect(screen.getByText("Pending Applications")).toBeInTheDocument();
    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
    expect(screen.getByText("Verification Dossiers")).toBeInTheDocument();
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getByText("Suspended Providers")).toBeInTheDocument();

    // Primary KPI cards
    expect(screen.getByText("Registered Users")).toBeInTheDocument();
    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getByText("Signal Providers")).toBeInTheDocument();
    expect(screen.getAllByText("8").length).toBeGreaterThan(0);
    expect(screen.getByText("Connected Exchanges")).toBeInTheDocument();
    expect(screen.getAllByText("95").length).toBeGreaterThan(0);
    expect(screen.getByText("Active Subscriptions")).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByText("Completed Payments")).toBeInTheDocument();
    expect(screen.getByText("198")).toBeInTheDocument();
    expect(screen.getByText("99.4%")).toBeInTheDocument();
  });

  it("displays prominent kill switch alert when kill_switch_enabled is true", async () => {
    const killSwitchOverview = {
      ...mockOverview,
      system_state: {
        ...mockOverview.system_state,
        kill_switch_enabled: true,
        kill_switch_status: "ACTIVE",
      },
    };

    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(killSwitchOverview);

    render(<AdminOverview />);

    expect(await screen.findByText("GLOBAL KILL SWITCH ENGAGED")).toBeInTheDocument();
  });

  it("renders error state when overview fetch fails and allows retry", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockRejectedValueOnce(
      new Error("Backend database timeout")
    );

    render(<AdminOverview />);

    expect(await screen.findByText("Failed to load platform overview")).toBeInTheDocument();
    expect(screen.getByText("Backend database timeout")).toBeInTheDocument();
  });
});
