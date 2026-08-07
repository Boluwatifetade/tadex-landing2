import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProviderDetailView from "@/components/dashboard/ProviderDetailView";
import * as apiClientModule from "@/lib/api-client";
import { ProviderOut } from "@/components/dashboard/ProviderDirectory";
import { PlanOut } from "@/components/dashboard/PricingGrid";

describe("ProviderDetailView", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockProvider: ProviderOut = {
    id: "prov_101_alpha",
    name: "Alpha Trading Systems",
    description: "High probability algorithmic Bybit signals.",
    is_verified: true,
    win_rate: 0.82,
    total_signals_sent: 210,
    subscriber_count: 105,
    last_active_at: "2026-08-04T12:00:00Z",
  };

  const mockScopedPlans: PlanOut[] = [
    {
      id: "plan_scoped_01",
      provider_id: "prov_101_alpha",
      name: "Alpha VIP Monthly",
      description: "Full automated execution access.",
      currency: "NGN",
      monthly_price_cents: 1500000,
      monthly_price: 15000.0,
      max_duration_days: 30,
      is_active: true,
      supported_currencies: ["NGN", "USD"],
      prices: [
        { currency: "NGN", amount_cents: 1500000, amount: 15000.0 },
        { currency: "USD", amount_cents: 2000, amount: 20.0 },
      ],
    },
  ];

  it("fetches and renders provider profile stats and scoped active plans", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/providers/prov_101_alpha") return mockProvider;
      if (path === "/providers/prov_101_alpha/plans") return mockScopedPlans;
      return {};
    });

    render(<ProviderDetailView providerId="prov_101_alpha" />);

    expect(screen.getByText("Loading provider profile and plans...")).toBeInTheDocument();

    await waitFor(() => {
      expect(apiClientSpy).toHaveBeenCalledWith("/providers/prov_101_alpha");
      expect(apiClientSpy).toHaveBeenCalledWith("/providers/prov_101_alpha/plans");
    });

    // Profile header stats
    expect(await screen.findByText("Alpha Trading Systems")).toBeInTheDocument();
    expect(screen.getByText("Verified Provider")).toBeInTheDocument();
    expect(screen.getByText("82.0%")).toBeInTheDocument();
    expect(screen.getByText("105")).toBeInTheDocument();

    // Scoped plan card
    expect(screen.getByText("Alpha VIP Monthly")).toBeInTheDocument();
    expect(screen.getByText("₦15,000.00")).toBeInTheDocument();
  });

  it("opens CheckoutQuoteModal when 'Subscribe to Plan' is clicked", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/providers/prov_101_alpha") return mockProvider;
      if (path === "/providers/prov_101_alpha/plans") return mockScopedPlans;
      if (path === "/billing/checkout-quote") {
        return {
          months: 1,
          currency: "NGN",
          provider_monthly_cents: 1500000,
          platform_monthly_cents: 300000,
          total_cents: 1800000,
          provider_monthly_amount: 15000.0,
          platform_monthly_amount: 3000.0,
          total_amount: 18000.0,
          provider_name: "Alpha Trading Systems",
        };
      }
      return {};
    });

    render(<ProviderDetailView providerId="prov_101_alpha" />);

    const subscribeBtn = await screen.findByRole("button", { name: "Subscribe to Plan" });
    fireEvent.click(subscribeBtn);

    expect(await screen.findByText("Transparent Checkout Quote")).toBeInTheDocument();
  });
});
