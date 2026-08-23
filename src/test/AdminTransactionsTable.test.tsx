import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminTransactionsTable from "@/components/admin/AdminTransactionsTable";
import { apiClient } from "@/lib/api-client";
import { AdminTransactionListResponse } from "@/types/admin";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

const mockTransactionsResponse: AdminTransactionListResponse = {
  items: [
    {
      id: "tx-11111111-2222-3333-4444-555555555555",
      user_id: "user-aaaa-bbbb",
      user_email: "trader@example.com",
      user_username: "cryptotrader",
      provider: "flutterwave",
      provider_reference: "FLW_REF_99812",
      amount_minor: 1500000,
      fee_minor: 150000,
      provider_amount_minor: 1350000,
      total_amount_minor: 1500000,
      currency: "NGN",
      status: "success",
      payment_method: "card",
      provider_name: "Alpha Signals",
      created_at: "2026-08-20T10:00:00Z",
    },
    {
      id: "tx-22222222-3333-4444-5555-666666666666",
      user_id: "user-cccc-dddd",
      user_email: "whale@example.com",
      user_username: "whaletrader",
      provider: "crypto_manual",
      provider_reference: "USDT_TX_123",
      amount_minor: 5000,
      fee_minor: 1000,
      provider_amount_minor: 4000,
      total_amount_minor: 5000,
      currency: "USDT",
      status: "pending",
      payment_method: "crypto",
      provider_name: "VIP Crypto Hub",
      created_at: "2026-08-21T12:00:00Z",
    },
  ],
  total: 2,
  page: 1,
  page_size: 15,
  total_pages: 1,
};

describe("AdminTransactionsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders transaction table with customer emails, gateways, amounts, and statuses", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockTransactionsResponse);

    render(<AdminTransactionsTable />);

    await waitFor(() => {
      expect(screen.getAllByText(/trader@example.com/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/whale@example.com/i).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText(/FLW_REF_99812/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/success/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/pending/i).length).toBeGreaterThan(0);
  });

  it("filters transactions when changing status or gateway filter dropdown", async () => {
    vi.mocked(apiClient).mockResolvedValue(mockTransactionsResponse);

    render(<AdminTransactionsTable />);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        expect.stringContaining("/admin/billing/transactions")
      );
    });

    // Select gateway filter
    const selects = screen.getAllByRole("combobox");
    const gatewaySelect = selects[1]; // second dropdown is gateway
    fireEvent.change(gatewaySelect, { target: { value: "flutterwave" } });

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        expect.stringContaining("gateway=flutterwave")
      );
    });
  });

  it("handles empty transaction state gracefully", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      page_size: 15,
      total_pages: 1,
    });

    render(<AdminTransactionsTable />);

    await waitFor(() => {
      expect(screen.getAllByText(/No transactions found/i).length).toBeGreaterThan(0);
    });
  });
});
