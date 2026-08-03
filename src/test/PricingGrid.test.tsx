import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PricingGrid from "@/components/dashboard/PricingGrid";
import * as apiClientModule from "@/lib/api-client";

describe("PricingGrid", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockPlans = [
    {
      id: "plan_pro_101",
      name: "Pro Trader Plan",
      description: "Automated trading execution plan for Bybit traders.",
      currency: "NGN",
      monthly_price_cents: 1500000,
      monthly_price: 15000.0,
      max_duration_days: 30,
      is_active: true,
      supported_currencies: ["NGN", "USD", "USDT"],
      prices: [
        { currency: "NGN", amount_cents: 1500000, amount: 15000.0 },
        { currency: "USD", amount_cents: 2500, amount: 25.0 },
        { currency: "USDT", amount_cents: 2500, amount: 25.0 },
      ],
    },
  ];

  it("renders active plans and handles currency switching correctly", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockPlans);

    render(<PricingGrid />);

    expect(await screen.findByText("Pro Trader Plan")).toBeInTheDocument();
    // Default NGN display
    expect(screen.getByText("₦15,000.00")).toBeInTheDocument();

    // Click USD currency switcher button
    const usdBtn = screen.getByRole("button", { name: "USD" });
    fireEvent.click(usdBtn);

    expect(screen.getByText("$25.00")).toBeInTheDocument();

    // Click USDT currency switcher button
    const usdtBtn = screen.getByRole("button", { name: "USDT" });
    fireEvent.click(usdtBtn);

    expect(screen.getByText("USDT 25.00")).toBeInTheDocument();
  });

  it("opens CheckoutQuoteModal when clicking 'Get Checkout Quote'", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/billing/plans") return mockPlans;
      if (path === "/billing/checkout-quote") {
        return {
          months: 1,
          currency: "NGN",
          provider_monthly_cents: 1500000,
          platform_monthly_cents: 300000,
          provider_total_cents: 1500000,
          platform_total_cents: 300000,
          total_cents: 1800000,
          provider_monthly_amount: 15000.0,
          platform_monthly_amount: 3000.0,
          provider_total_amount: 15000.0,
          platform_total_amount: 3000.0,
          total_amount: 18000.0,
          provider_name: "Bybit Pro Signal Provider",
        };
      }
      return [];
    });

    render(<PricingGrid />);

    expect(await screen.findByText("Pro Trader Plan")).toBeInTheDocument();

    const quoteBtn = screen.getByRole("button", { name: "Get Checkout Quote" });
    fireEvent.click(quoteBtn);

    expect(await screen.findByText("Transparent Checkout Quote")).toBeInTheDocument();
  });
});
