import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminSubscriptionLedgerTable from "@/components/admin/AdminSubscriptionLedgerTable";
import { apiClient } from "@/lib/api-client";
import { AdminSubscriptionListResponse } from "@/types/admin";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

const mockSubscriptionsResponse: AdminSubscriptionListResponse = {
  items: [
    {
      id: "sub-1111-2222-3333",
      user_id: "user-aaaa-1111",
      user_email: "vipmember@example.com",
      user_username: "vipmember",
      provider_id: "provider-1111",
      provider_name: "Titan Quant",
      tier: "vip",
      status: "active",
      is_active: true,
      auto_renew: true,
      current_period_start: "2026-08-01T00:00:00Z",
      current_period_end: "2026-09-01T00:00:00Z",
      created_at: "2026-08-01T00:00:00Z",
    },
    {
      id: "sub-4444-5555-6666",
      user_id: "user-bbbb-2222",
      user_email: "freelancer@example.com",
      user_username: "freeuser",
      provider_id: "provider-2222",
      provider_name: "Forex Master",
      tier: "standard",
      status: "past_due",
      is_active: false,
      auto_renew: false,
      current_period_start: "2026-07-01T00:00:00Z",
      current_period_end: "2026-08-01T00:00:00Z",
      created_at: "2026-07-01T00:00:00Z",
    },
  ],
  total: 2,
  page: 1,
  page_size: 15,
  total_pages: 1,
};

describe("AdminSubscriptionLedgerTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders subscription ledger rows, status badges, and subscriber emails", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockSubscriptionsResponse);

    render(<AdminSubscriptionLedgerTable />);

    await waitFor(() => {
      expect(screen.getAllByText(/vipmember@example.com/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/freelancer@example.com/i).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText(/Titan Quant/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Forex Master/i).length).toBeGreaterThan(0);
  });

  it("opens cancel modal and enforces min 3 chars reason and mode selection", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockSubscriptionsResponse);

    render(<AdminSubscriptionLedgerTable />);

    await waitFor(() => {
      expect(screen.getAllByText(/Cancel/i).length).toBeGreaterThan(0);
    });

    const cancelButtons = screen.getAllByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButtons[0]);

    // Check modal
    expect(screen.getByRole("heading", { name: /Cancel User Subscription/i })).toBeInTheDocument();
    const reasonInput = screen.getByPlaceholderText(/Reason for administrative cancellation/i);
    const confirmBtn = screen.getByRole("button", { name: /Confirm Cancellation/i });

    expect(confirmBtn).toBeDisabled();

    fireEvent.change(reasonInput, { target: { value: "User requested refund ticket #1234" } });
    expect(confirmBtn).not.toBeDisabled();

    vi.mocked(apiClient).mockResolvedValueOnce({ success: true });

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/admin/billing/subscriptions/sub-1111-2222-3333/cancel",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ mode: "immediate", reason: "User requested refund ticket #1234" }),
        })
      );
    });
  });

  it("opens set-status modal and allows status override with audit reason", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockSubscriptionsResponse);

    render(<AdminSubscriptionLedgerTable />);

    await waitFor(() => {
      expect(screen.getAllByText(/Set Status/i).length).toBeGreaterThan(0);
    });

    const setStatusButtons = screen.getAllByRole("button", { name: /Set Status/i });
    fireEvent.click(setStatusButtons[0]);

    expect(screen.getByRole("heading", { name: /Override Subscription Status/i })).toBeInTheDocument();
    const reasonInput = screen.getByPlaceholderText(/Provide reason for administrative status override/i);
    const confirmBtn = screen.getByRole("button", { name: /Confirm Status Override/i });

    expect(confirmBtn).toBeDisabled();

    fireEvent.change(reasonInput, { target: { value: "VIP courtesy 7-day trial extension" } });
    expect(confirmBtn).not.toBeDisabled();

    vi.mocked(apiClient).mockResolvedValueOnce({ success: true });

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/admin/billing/subscriptions/sub-1111-2222-3333/set-status",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ status: "active", reason: "VIP courtesy 7-day trial extension" }),
        })
      );
    });
  });
});
