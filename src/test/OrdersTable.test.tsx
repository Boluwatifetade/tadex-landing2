import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OrdersTable from "@/components/dashboard/OrdersTable";
import * as apiClientModule from "@/lib/api-client";

describe("OrdersTable", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty state when GET /trading/orders returns empty list", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce([]);

    render(<OrdersTable />);

    expect(await screen.findByText("No orders yet.")).toBeInTheDocument();
    expect(screen.getByText("Executed trade orders will be recorded here.")).toBeInTheDocument();
  });

  it("renders populated orders list and filters by status", async () => {
    const mockOrders = [
      {
        id: "ord_1",
        symbol: "ETHUSDT",
        side: "Buy",
        status: "filled",
        size: 1.5,
        price: 3400.0,
        order_type: "Market",
        timestamp: "2026-08-03T15:00:00Z",
      },
    ];

    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path.includes("/trading/orders")) {
        return mockOrders;
      }
      return [];
    });

    render(<OrdersTable />);

    expect(await screen.findByText("ETHUSDT")).toBeInTheDocument();
    expect(screen.getByText("filled")).toBeInTheDocument();
    expect(screen.getByText("1.5")).toBeInTheDocument();
    expect(screen.getByText("$3,400.00")).toBeInTheDocument();

    // Test filter button click
    const filledFilterBtn = screen.getByRole("button", { name: "Filled" });
    fireEvent.click(filledFilterBtn);

    expect(apiClientSpy).toHaveBeenCalledWith("/trading/orders?status=filled");
  });

  it("renders error state when fetch fails and allows retry", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient");
    apiClientSpy.mockRejectedValueOnce(new Error("Network error loading orders"));

    render(<OrdersTable />);

    expect(await screen.findByText("Network error loading orders")).toBeInTheDocument();

    // Retry
    apiClientSpy.mockResolvedValueOnce([]);
    const retryBtn = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(retryBtn);

    expect(await screen.findByText("No orders yet.")).toBeInTheDocument();
  });
});
