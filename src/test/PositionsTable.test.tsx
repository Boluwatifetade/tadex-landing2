import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PositionsTable from "@/components/dashboard/PositionsTable";
import * as apiClientModule from "@/lib/api-client";

describe("PositionsTable", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty state when GET /trading/positions returns empty list", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce([]);

    render(<PositionsTable />);

    expect(await screen.findByText("No active positions.")).toBeInTheDocument();
    expect(screen.getByText("Automated signal triggers will open and monitor trades here.")).toBeInTheDocument();
  });

  it("renders active position with correct symbol, side, size, and PnL formatting across mobile and desktop views", async () => {
    const mockPositions = [
      {
        id: "pos_101",
        symbol: "BTCUSDT",
        side: "Buy",
        size: 0.25,
        entry_price: 64500.0,
        unrealized_pnl: 125.5,
        leverage: 10,
        stop_loss: 63000.0,
        take_profit: 68000.0,
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockPositions);

    render(<PositionsTable />);

    const symbols = await screen.findAllByText("BTCUSDT");
    expect(symbols.length).toBeGreaterThan(0);

    expect(screen.getAllByText("Buy").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0.25").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$64,500.00").length).toBeGreaterThan(0);

    const pnlEls = screen.getAllByText("+$125.50");
    expect(pnlEls.length).toBeGreaterThan(0);
    expect(pnlEls[0].className).toContain("text-emerald-500");
  });

  it("renders error state when fetch fails and allows retry", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient");
    apiClientSpy.mockRejectedValueOnce(new Error("Failed to fetch positions"));

    render(<PositionsTable />);

    expect(await screen.findByText("Failed to fetch positions")).toBeInTheDocument();

    // Retry
    apiClientSpy.mockResolvedValueOnce([]);
    const retryBtn = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(retryBtn);

    expect(await screen.findByText("No active positions.")).toBeInTheDocument();
  });
});
