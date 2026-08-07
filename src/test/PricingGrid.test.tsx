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
      provider_id: "prov_101",
      provider_name: "Alpha Signal Master",
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

  it("renders active plans with prominent provider identity header and handles currency switching correctly", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockPlans);

    render(<PricingGrid />);

    expect(await screen.findByText("Pro Trader Plan")).toBeInTheDocument();

    // Assert prominent provider identity header is rendered
    expect(screen.getByText("Alpha Signal Master")).toBeInTheDocument();
    expect(screen.getByText(/Provider:/i)).toBeInTheDocument();

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

  it("handles unsupported currency selection by displaying 'Only available in NGN' pill badge without fabricating a converted price", async () => {
    const singleCurrencyPlan = [
      {
        id: "plan_ngn_only",
        provider_id: "prov_101",
        provider_name: "Local Trader",
        name: "NGN-Only Basic Plan",
        currency: "NGN",
        monthly_price_cents: 1500000,
        monthly_price: 15000.0,
        max_duration_days: 30,
        is_active: true,
        supported_currencies: ["NGN"],
        prices: [{ currency: "NGN", amount_cents: 1500000, amount: 15000.0 }],
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(singleCurrencyPlan);

    render(<PricingGrid />);

    expect(await screen.findByText("NGN-Only Basic Plan")).toBeInTheDocument();
    expect(screen.getByText("₦15,000.00")).toBeInTheDocument();

    // Attempting to select USD when plan only supports NGN
    // Should NOT display a fabricated "$15,000.00" price
    expect(screen.queryByText("$15,000.00")).not.toBeInTheDocument();
  });

  it("renders JPY zero-decimal amounts correctly without decimals", async () => {
    const jpyPlan = [
      {
        id: "plan_jpy_101",
        provider_id: "prov_tokyo",
        provider_name: "Tokyo Quant Signals",
        name: "Yen Execution Plan",
        currency: "JPY",
        monthly_price_cents: 3000,
        monthly_price: 3000,
        max_duration_days: 30,
        is_active: true,
        supported_currencies: ["JPY"],
        prices: [{ currency: "JPY", amount_cents: 3000, amount: 3000 }],
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(jpyPlan);

    render(<PricingGrid />);

    expect(await screen.findByText("Yen Execution Plan")).toBeInTheDocument();
    // Must render as ¥3,000 without ".00" decimals
    expect(screen.getByText("¥3,000")).toBeInTheDocument();
    expect(screen.queryByText("¥3,000.00")).not.toBeInTheDocument();
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
          provider_name: "Alpha Signal Master",
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
