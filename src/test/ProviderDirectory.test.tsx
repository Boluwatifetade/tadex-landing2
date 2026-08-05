import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProviderDirectory, { ProviderOut } from "@/components/dashboard/ProviderDirectory";
import * as apiClientModule from "@/lib/api-client";

describe("ProviderDirectory", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockProviders: ProviderOut[] = [
    {
      id: "prov_101_alpha",
      name: "Alpha Trading Systems",
      description: "High probability algorithmic Bybit signals.",
      is_verified: true,
      win_rate: 0.785,
      total_signals_sent: 142,
      subscriber_count: 89,
      last_active_at: "2026-08-04T12:00:00Z",
    },
    {
      id: "prov_202_beta",
      name: "Beta Macro Signals",
      description: "Swing trading strategies.",
      is_verified: false,
      win_rate: 0.65,
      total_signals_sent: 50,
      subscriber_count: 12,
      last_active_at: "2026-08-03T10:00:00Z",
    },
  ];

  it("fetches and renders signal providers list with verified badges, win rates, and subscriber counts", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockProviders);

    render(<ProviderDirectory />);

    // Loading state initially
    expect(screen.getByText("Loading verified signal providers...")).toBeInTheDocument();

    // Verify API path
    await waitFor(() => {
      expect(apiClientSpy).toHaveBeenCalledWith("/providers");
    });

    // Verify provider details rendered
    expect(await screen.findByText("Alpha Trading Systems")).toBeInTheDocument();
    expect(screen.getByText("Beta Macro Signals")).toBeInTheDocument();

    // Assert win rate formatting (78.5%)
    expect(screen.getByText("78.5%")).toBeInTheDocument();
    expect(screen.getByText("65.0%")).toBeInTheDocument();

    // Assert subscriber counts
    expect(screen.getByText("89")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("renders empty state when no active providers are returned", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce([]);

    render(<ProviderDirectory />);

    expect(await screen.findByText("No signal providers found")).toBeInTheDocument();
    expect(screen.getByText(/No active signal providers are currently available/i)).toBeInTheDocument();
  });

  it("renders error state and retry action when API call fails", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockRejectedValueOnce(new Error("Network connection error"));

    render(<ProviderDirectory />);

    expect(await screen.findByText("Network connection error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });
});
