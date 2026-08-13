import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutQuoteModal from "@/components/dashboard/CheckoutQuoteModal";
import * as apiClientModule from "@/lib/api-client";
import { PlanOut } from "@/components/dashboard/PricingGrid";

describe("CheckoutQuoteModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockPlan: PlanOut = {
    id: "plan_pro_101",
    name: "Pro Trader Plan",
    description: "Automated trading execution plan.",
    currency: "USD",
    monthly_price_cents: 2500,
    monthly_price: 25.0,
    max_duration_days: 30,
    is_active: true,
    supported_currencies: ["USD", "NGN", "USDT"],
    prices: [],
  };

  const mockQuoteResponse = {
    months: 1,
    currency: "USD",
    provider_monthly_cents: 2500,
    platform_monthly_cents: 500,
    provider_total_cents: 2500,
    platform_total_cents: 500,
    total_cents: 3000,
    provider_monthly_amount: 25.0,
    platform_monthly_amount: 5.0,
    provider_total_amount: 25.0,
    platform_total_amount: 5.0,
    total_amount: 30.0,
    provider_name: "Signal Master",
  };

  it("calculates checkout quote and asserts platform fee line item is present, visibly separate, and clearly labeled", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockQuoteResponse);

    render(<CheckoutQuoteModal plan={mockPlan} isOpen={true} onClose={vi.fn()} />);

    // 1. Verify modal title and request payload
    expect(await screen.findByText("Transparent Checkout Quote")).toBeInTheDocument();
    expect(apiClientSpy).toHaveBeenCalledWith("/billing/checkout-quote", expect.objectContaining({ method: "POST" }));

    // 2. Assert Provider Base Price line item
    expect(screen.getByText("Provider Base Price")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();

    // 3. Assert Platform Service & Automation Fee line item is present, visibly separate, and clearly labeled
    const feeLabel = screen.getByText("Platform Service & Automation Fee");
    expect(feeLabel).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();

    // 4. Assert Total Checkout Quote line
    expect(screen.getByText("Total Checkout Quote")).toBeInTheDocument();
    expect(screen.getByText("$30.00")).toBeInTheDocument();

    // 5. Assert active action button
    const submitBtn = screen.getByRole("button", { name: "Proceed to Payment" });
    expect(submitBtn).toBeEnabled();

    // 6. Assert container applies scrollable max-h-[90vh] overflow-y-auto for mobile viewports
    const modalTitle = screen.getByText("Transparent Checkout Quote");
    const containerCard = modalTitle.closest("div.relative");
    expect(containerCard).toHaveClass("max-h-[90vh]");
    expect(containerCard).toHaveClass("overflow-y-auto");
  });

  it("triggers checkout initiation API call and displays loading state when 'Proceed to Payment' is clicked", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/billing/checkout-quote") return mockQuoteResponse;
      if (path === "/billing/checkout") {
        return {
          authorization_url: "https://checkout.flutterwave.com/v3/hosted/pay/test12345",
          reference: "tx_ref_999",
          provider_name: "flutterwave",
          status: "pending",
        };
      }
      return {};
    });

    render(<CheckoutQuoteModal plan={mockPlan} isOpen={true} onClose={vi.fn()} />);

    expect(await screen.findByText("Total Checkout Quote")).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: "Proceed to Payment" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClientSpy).toHaveBeenCalledWith("/billing/checkout", expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("plan_pro_101"),
      }));
    });
  });
});
