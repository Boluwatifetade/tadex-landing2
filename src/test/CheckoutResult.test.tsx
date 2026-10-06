import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CheckoutResultPage from "@/app/dashboard/billing/checkout/result/page";
import * as apiClientModule from "@/lib/api-client";

// Mock next/navigation
const mockSearchParams = new Map<string, string>();
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams.get(key) || null,
  }),
}));

describe("Checkout Result Route (/dashboard/billing/checkout/result)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockSearchParams.clear();
    sessionStorage.clear();
  });

  it("handles successful payment confirmation and authoritatively refetches subscription", async () => {
    mockSearchParams.set("reference", "tdx_txn_success_100");

    let subscriptionRefetched = false;

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/billing/transactions/tdx_txn_success_100") {
        return {
          id: "txn_id_100",
          reference: "tdx_txn_success_100",
          user_id: "user_100",
          provider: "paystack",
          status: "success",
          amount_cents: 1500000,
          amount: 15000.0,
          currency: "NGN",
        };
      }
      if (path === "/billing/subscription") {
        subscriptionRefetched = true;
        return {
          has_active_subscription: true,
          subscription: { id: "sub_1", tier: "pro", is_active: true, status: "active" },
          notifications: [],
        };
      }
      return {};
    });

    render(<CheckoutResultPage />);

    // Assert transition to Payment Successful!
    expect(await screen.findByText("Payment Successful!")).toBeInTheDocument();
    expect(screen.getByText(/Your account entitlement is active/)).toBeInTheDocument();
    expect(screen.getByText("tdx_txn_success_100")).toBeInTheDocument();
    expect(screen.getByText("₦15,000.00")).toBeInTheDocument();

    // Verify button to navigate back to dashboard
    expect(screen.getByRole("button", { name: /go to dashboard/i })).toBeInTheDocument();

    // Verify subscription was refetched
    await waitFor(() => {
      expect(subscriptionRefetched).toBe(true);
    });
  });

  it("normalizes reference from Flutterwave 'tx_ref' parameter", async () => {
    mockSearchParams.set("tx_ref", "tdx_flw_kes_200");
    mockSearchParams.set("status", "successful");

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/billing/transactions/tdx_flw_kes_200") {
        return {
          id: "txn_id_200",
          reference: "tdx_flw_kes_200",
          user_id: "user_200",
          provider: "flutterwave",
          status: "success",
          amount_cents: 260000,
          amount: 2600.0,
          currency: "KES",
        };
      }
      return {};
    });

    render(<CheckoutResultPage />);

    expect(await screen.findByText("Payment Successful!")).toBeInTheDocument();
    expect(screen.getByText("tdx_flw_kes_200")).toBeInTheDocument();
    expect(screen.getByText("KSh 2,600.00")).toBeInTheDocument();
  });

  it("recovers pending reference from sessionStorage if return URL contains placeholder", async () => {
    mockSearchParams.set("reference", "{reference}");
    sessionStorage.setItem(
      "tadex_pending_checkout_ref",
      JSON.stringify({ reference: "tdx_recovered_999", plan_name: "Pro" })
    );

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/billing/transactions/tdx_recovered_999") {
        return {
          id: "txn_id_999",
          reference: "tdx_recovered_999",
          user_id: "user_999",
          provider: "paystack",
          status: "success",
          amount_cents: 2000,
          amount: 20.0,
          currency: "USD",
        };
      }
      return {};
    });

    render(<CheckoutResultPage />);

    expect(await screen.findByText("Payment Successful!")).toBeInTheDocument();
    expect(screen.getByText("tdx_recovered_999")).toBeInTheDocument();
  });

  it("displays failed state when backend transaction status is failed", async () => {
    mockSearchParams.set("reference", "tdx_txn_failed_400");

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/billing/transactions/tdx_txn_failed_400") {
        return {
          id: "txn_id_400",
          reference: "tdx_txn_failed_400",
          user_id: "user_400",
          provider: "flutterwave",
          status: "failed",
          amount_cents: 2000,
          amount: 20.0,
          currency: "USD",
        };
      }
      return {};
    });

    render(<CheckoutResultPage />);

    expect(await screen.findByText("Payment Failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /return to plans & billing/i })).toBeInTheDocument();
  });

  it("displays cancelled state when user cancelled checkout at gateway", async () => {
    mockSearchParams.set("status", "cancelled");

    render(<CheckoutResultPage />);

    expect(await screen.findByText("Payment Cancelled")).toBeInTheDocument();
    expect(screen.getByText(/Payment was cancelled by the user/)).toBeInTheDocument();
  });

  it("displays timeout state when transaction remains pending after polling limit", async () => {
    mockSearchParams.set("reference", "tdx_txn_pending_forever");

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/billing/transactions/tdx_txn_pending_forever") {
        return {
          id: "txn_id_pending",
          reference: "tdx_txn_pending_forever",
          user_id: "user_pending",
          provider: "flutterwave",
          status: "pending",
          amount_cents: 2000,
          amount: 20.0,
          currency: "USD",
        };
      }
      return {};
    });

    // Mock setTimeout to fire immediately
    vi.useFakeTimers();

    render(<CheckoutResultPage />);

    // Fast-forward through polling attempts
    for (let i = 0; i < 9; i++) {
      await vi.runAllTimersAsync();
    }

    vi.useRealTimers();

    expect(await screen.findByText("Payment Pending Confirmation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /re-check status/i })).toBeInTheDocument();
  });

  it("displays invalid reference state when no reference parameter exists", async () => {
    render(<CheckoutResultPage />);

    expect(await screen.findByText("Unknown Transaction")).toBeInTheDocument();
    expect(screen.getByText("No valid payment transaction reference found.")).toBeInTheDocument();
  });
});
