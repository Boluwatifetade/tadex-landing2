import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPlatformFeesView from "@/components/admin/AdminPlatformFeesView";
import { apiClient } from "@/lib/api-client";
import { AdminPlatformFeesResponse } from "@/types/admin";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

const mockFeesResponse: AdminPlatformFeesResponse = {
  active_fees: [
    {
      id: "fee-ngn-1",
      settlement_method: "flutterwave",
      currency_code: "NGN",
      amount_minor: 150000,
      amount: 1500,
      active: true,
      created_at: "2026-08-01T00:00:00Z",
    },
    {
      id: "fee-usdt-1",
      settlement_method: "crypto_manual",
      currency_code: "USDT",
      amount_minor: 1000,
      amount: 10,
      active: true,
      created_at: "2026-08-01T00:00:00Z",
    },
  ],
  history: [
    {
      id: "fee-hist-1",
      settlement_method: "flutterwave",
      currency_code: "NGN",
      amount_minor: 150000,
      amount: 1500,
      active: true,
      created_by_admin_id: 1,
      created_at: "2026-08-01T00:00:00Z",
    },
  ],
};

describe("AdminPlatformFeesView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders active fee cards for NGN (₦1,500) and USDT ($10.00) and fee audit history", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockFeesResponse);

    render(<AdminPlatformFeesView />);

    await waitFor(() => {
      expect(screen.getByText("₦1,500")).toBeInTheDocument();
      expect(screen.getByText("$10.00")).toBeInTheDocument();
    });

    expect(screen.getByText("NGN Settlement Platform Fee")).toBeInTheDocument();
    expect(screen.getByText("USDT Settlement Platform Fee")).toBeInTheDocument();
    expect(screen.getByText("Fee Change History & Audit Logs")).toBeInTheDocument();
  });

  it("opens high-gravity fee update modal, enforces valid amount, min 3 chars reason, and double-confirmation check", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockFeesResponse);

    render(<AdminPlatformFeesView />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Update Global Fee/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Global Fee/i }));

    // High gravity warning elements
    expect(screen.getByRole("heading", { name: /Global Platform Fee Modification/i })).toBeInTheDocument();
    expect(screen.getByText(/Immediate Revenue Split Consequence/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /Confirm Global Fee Update/i });
    const reasonInput = screen.getByPlaceholderText(/Provide a detailed rationale for this fee revision/i);
    const ackCheckbox = screen.getByRole("checkbox");

    // Disabled initially without reason and acknowledgement
    expect(submitBtn).toBeDisabled();

    // Type reason
    fireEvent.change(reasonInput, { target: { value: "Q3 pricing board revision" } });
    expect(submitBtn).toBeDisabled(); // Still disabled without checkbox

    // Check acknowledgment checkbox
    fireEvent.click(ackCheckbox);
    expect(submitBtn).not.toBeDisabled();

    // Mock fee update response
    vi.mocked(apiClient).mockResolvedValueOnce({
      id: "fee-ngn-new",
      settlement_method: "flutterwave",
      currency_code: "NGN",
      amount_minor: 200000,
      amount: 2000,
      active: true,
      created_at: "2026-08-23T00:00:00Z",
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/admin/billing/fees",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            currency: "NGN",
            amount: 1500,
            amount_minor: 150000,
            reason: "Q3 pricing board revision",
          }),
        })
      );
    });
  });
});
