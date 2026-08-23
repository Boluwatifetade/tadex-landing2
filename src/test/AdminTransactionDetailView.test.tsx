import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminTransactionDetailView from "@/components/admin/AdminTransactionDetailView";
import { apiClient } from "@/lib/api-client";
import { AdminTransactionDetailOut } from "@/types/admin";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

const mockTransactionDetail: AdminTransactionDetailOut = {
  id: "tx-test-9988-7766-5544",
  user_id: "user-uuid-1234",
  user_email: "testtrader@example.com",
  user_username: "tester1",
  provider: "flutterwave",
  provider_reference: "FLW_TEST_9999",
  amount_minor: 2500000,
  fee_minor: 150000,
  provider_amount_minor: 2350000,
  total_amount_minor: 2500000,
  currency: "NGN",
  status: "pending",
  payment_method: "card",
  provider_name: "Super Forex Hub",
  raw_webhook_payload: {
    event: "charge.completed",
    data: {
      id: 998877,
      status: "successful",
      amount: 25000,
      customer: { email: "testtrader@example.com" },
    },
  },
  created_at: "2026-08-20T10:00:00Z",
  associated_subscription: {
    id: "sub-123",
    user_id: "user-uuid-1234",
    plan_name: "Super Forex Monthly",
    tier: "vip",
    status: "active",
    current_period_start: "2026-08-20T10:00:00Z",
    current_period_end: "2026-09-20T10:00:00Z",
  },
  user: {
    id: "user-uuid-1234",
    email: "testtrader@example.com",
    role: "user",
    status: "active",
    email_verified: true,
    created_at: "2026-08-01T00:00:00Z",
  },
  provider_profile: {
    id: "provider-123",
    name: "Super Forex Hub",
    status: "active",
    is_verified: true,
    verification_level: "advanced",
    subscriber_count: 42,
    total_signals_sent: 180,
    created_at: "2026-07-01T00:00:00Z",
  },
  recent_audit_logs: [],
};

describe("AdminTransactionDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 360 transaction diagnostics, split breakdown, and linked context cards", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockTransactionDetail);

    render(<AdminTransactionDetailView transactionId="tx-test-9988-7766-5544" />);

    await waitFor(() => {
      expect(screen.getByText("tx-test-9988-7766-5544")).toBeInTheDocument();
      expect(screen.getByText("testtrader@example.com")).toBeInTheDocument();
      expect(screen.getByText("FLW_TEST_9999")).toBeInTheDocument();
      expect(screen.getByText("Super Forex Hub")).toBeInTheDocument();
    });

    expect(screen.getByText("Customer Account")).toBeInTheDocument();
    expect(screen.getByText("Signal Provider")).toBeInTheDocument();
    expect(screen.getByText("Associated Subscription")).toBeInTheDocument();
    expect(screen.getByText("Raw Webhook Payload & Diagnostics")).toBeInTheDocument();
  });

  it("opens manual reconciliation modal, enforces min 3 chars reason, and calls reconcile endpoint", async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockTransactionDetail);

    render(<AdminTransactionDetailView transactionId="tx-test-9988-7766-5544" />);

    await waitFor(() => {
      expect(screen.getByText(/Reconcile Payment/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Reconcile Payment/i));

    // Modal is open
    expect(screen.getByRole("heading", { name: /Manually Reconcile Payment/i })).toBeInTheDocument();
    const reasonInput = screen.getByPlaceholderText(/Provide a mandatory justification for manual settlement/i);
    const submitBtn = screen.getByRole("button", { name: /Confirm Manual Reconciliation/i });

    // Disabled initially
    expect(submitBtn).toBeDisabled();

    // Type valid reason
    fireEvent.change(reasonInput, { target: { value: "Confirmed wire transfer proof #9021" } });
    expect(submitBtn).not.toBeDisabled();

    // Mock reconcile success response
    vi.mocked(apiClient).mockResolvedValueOnce({
      success: true,
      status: "success",
      applied: true,
      transaction_id: "tx-test-9988-7766-5544",
      message: "Payment successfully reconciled.",
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/admin/billing/transactions/tx-test-9988-7766-5544/reconcile",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ reason: "Confirmed wire transfer proof #9021" }),
        })
      );
    });
  });
});
