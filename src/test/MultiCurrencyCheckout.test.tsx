import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutQuoteModal from "@/components/dashboard/CheckoutQuoteModal";
import * as apiClientModule from "@/lib/api-client";
import { PlanOut } from "@/components/dashboard/PricingGrid";

describe("Dynamic Multi-Currency Billing Checkout", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
    delete (window as unknown as { location: unknown }).location;
    window.location = { ...originalLocation, href: "", assign: vi.fn() } as unknown as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  const mockMultiCurrencyPlan: PlanOut = {
    id: "plan_africa_pro",
    provider_id: "prov_master",
    provider_name: "Pan-African Crypto Signals",
    name: "Pan-African Pro",
    description: "Multi-currency execution plan",
    currency: "USD",
    monthly_price_cents: 2000,
    monthly_price: 20.0,
    max_duration_days: 30,
    is_active: true,
    supported_currencies: ["USD", "NGN", "KES", "GHS"],
    prices: [
      { currency: "USD", amount_cents: 2000, amount: 20.0 },
      { currency: "NGN", amount_cents: 3000000, amount: 30000.0 },
      { currency: "KES", amount_cents: 260000, amount: 2600.0 },
      { currency: "GHS", amount_cents: 30000, amount: 300.0 },
    ],
  };

  it("submits NGN checkout request without specifying payment provider/gateway", async () => {
    let capturedCheckoutPayload: Record<string, unknown> | null = null;

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path === "/billing/checkout-quote") {
        return {
          months: 1,
          currency: "NGN",
          provider_monthly_cents: 2500000,
          platform_monthly_cents: 500000,
          provider_total_cents: 2500000,
          platform_total_cents: 500000,
          total_cents: 3000000,
          provider_monthly_amount: 25000.0,
          platform_monthly_amount: 5000.0,
          provider_total_amount: 25000.0,
          platform_total_amount: 5000.0,
          total_amount: 30000.0,
        };
      }
      if (path === "/billing/checkout" && options?.method === "POST") {
        capturedCheckoutPayload = JSON.parse(options.body as string);
        return {
          authorization_url: "https://checkout.paystack.com/000-ngn-test",
          reference: "tdx_txn_ngn_12345",
          provider_name: "paystack",
          status: "pending",
        };
      }
      return {};
    });

    render(
      <CheckoutQuoteModal
        plan={mockMultiCurrencyPlan}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    // Switch currency to NGN
    const currencySelect = await screen.findByRole("combobox", { name: /settlement currency/i });
    fireEvent.change(currencySelect, { target: { value: "NGN" } });

    // Wait for quote to load
    expect(await screen.findByText("₦30,000.00")).toBeInTheDocument();

    // Click Proceed to Payment
    const proceedBtn = screen.getByRole("button", { name: /proceed to payment/i });
    fireEvent.click(proceedBtn);

    await waitFor(() => {
      expect(capturedCheckoutPayload).not.toBeNull();
    });

    // Assert strictly: plan_id, currency="NGN", duration_months=1 are sent
    expect(capturedCheckoutPayload).toMatchObject({
      plan_id: "plan_africa_pro",
      currency: "NGN",
      duration_months: 1,
    });

    // Assert NO payment gateway or settlement method is chosen by the frontend
    expect(capturedCheckoutPayload).not.toHaveProperty("provider");
    expect(capturedCheckoutPayload).not.toHaveProperty("gateway");
    expect(capturedCheckoutPayload).not.toHaveProperty("settlement_method");

    // Assert reference was stored in sessionStorage for recovery
    const storedRef = sessionStorage.getItem("tadex_pending_checkout_ref");
    expect(storedRef).toContain("tdx_txn_ngn_12345");
    expect(window.location.href).toBe("https://checkout.paystack.com/000-ngn-test");
  });

  it("submits USD checkout request without specifying payment provider/gateway", async () => {
    let capturedCheckoutPayload: Record<string, unknown> | null = null;

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path === "/billing/checkout-quote") {
        return {
          months: 1,
          currency: "USD",
          provider_monthly_cents: 1800,
          platform_monthly_cents: 200,
          provider_total_cents: 1800,
          platform_total_cents: 200,
          total_cents: 2000,
          provider_monthly_amount: 18.0,
          platform_monthly_amount: 2.0,
          provider_total_amount: 18.0,
          platform_total_amount: 2.0,
          total_amount: 20.0,
        };
      }
      if (path === "/billing/checkout" && options?.method === "POST") {
        capturedCheckoutPayload = JSON.parse(options.body as string);
        return {
          authorization_url: "https://checkout.flutterwave.com/v3/usd-test",
          reference: "tdx_txn_usd_9988",
          provider_name: "flutterwave",
          status: "pending",
        };
      }
      return {};
    });

    render(
      <CheckoutQuoteModal
        plan={mockMultiCurrencyPlan}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(await screen.findByText("$20.00")).toBeInTheDocument();

    const proceedBtn = screen.getByRole("button", { name: /proceed to payment/i });
    fireEvent.click(proceedBtn);

    await waitFor(() => {
      expect(capturedCheckoutPayload).not.toBeNull();
    });

    expect(capturedCheckoutPayload).toMatchObject({
      plan_id: "plan_africa_pro",
      currency: "USD",
      duration_months: 1,
    });
    expect(capturedCheckoutPayload).not.toHaveProperty("provider");
    expect(capturedCheckoutPayload).not.toHaveProperty("settlement_method");
    expect(window.location.href).toBe("https://checkout.flutterwave.com/v3/usd-test");
  });

  it("submits KES checkout request without specifying payment provider/gateway", async () => {
    let capturedCheckoutPayload: Record<string, unknown> | null = null;

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path === "/billing/checkout-quote") {
        return {
          months: 1,
          currency: "KES",
          provider_monthly_cents: 230000,
          platform_monthly_cents: 30000,
          provider_total_cents: 230000,
          platform_total_cents: 30000,
          total_cents: 260000,
          provider_monthly_amount: 2300.0,
          platform_monthly_amount: 300.0,
          provider_total_amount: 2300.0,
          platform_total_amount: 300.0,
          total_amount: 2600.0,
        };
      }
      if (path === "/billing/checkout" && options?.method === "POST") {
        capturedCheckoutPayload = JSON.parse(options.body as string);
        return {
          authorization_url: "https://checkout.flutterwave.com/v3/kes-test",
          reference: "tdx_txn_kes_5544",
          provider_name: "flutterwave",
          status: "pending",
        };
      }
      return {};
    });

    render(
      <CheckoutQuoteModal
        plan={mockMultiCurrencyPlan}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const currencySelect = await screen.findByRole("combobox", { name: /settlement currency/i });
    fireEvent.change(currencySelect, { target: { value: "KES" } });

    expect(await screen.findByText("KSh 2,600.00")).toBeInTheDocument();

    const proceedBtn = screen.getByRole("button", { name: /proceed to payment/i });
    fireEvent.click(proceedBtn);

    await waitFor(() => {
      expect(capturedCheckoutPayload).not.toBeNull();
    });

    expect(capturedCheckoutPayload).toMatchObject({
      plan_id: "plan_africa_pro",
      currency: "KES",
      duration_months: 1,
    });
    expect(capturedCheckoutPayload).not.toHaveProperty("provider");
    expect(window.location.href).toBe("https://checkout.flutterwave.com/v3/kes-test");
  });

  it("submits GHS checkout request without specifying payment provider/gateway", async () => {
    let capturedCheckoutPayload: Record<string, unknown> | null = null;

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path === "/billing/checkout-quote") {
        return {
          months: 1,
          currency: "GHS",
          provider_monthly_cents: 27000,
          platform_monthly_cents: 3000,
          provider_total_cents: 27000,
          platform_total_cents: 3000,
          total_cents: 30000,
          provider_monthly_amount: 270.0,
          platform_monthly_amount: 30.0,
          provider_total_amount: 270.0,
          platform_total_amount: 30.0,
          total_amount: 300.0,
        };
      }
      if (path === "/billing/checkout" && options?.method === "POST") {
        capturedCheckoutPayload = JSON.parse(options.body as string);
        return {
          authorization_url: "https://checkout.flutterwave.com/v3/ghs-test",
          reference: "tdx_txn_ghs_7766",
          provider_name: "flutterwave",
          status: "pending",
        };
      }
      return {};
    });

    render(
      <CheckoutQuoteModal
        plan={mockMultiCurrencyPlan}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const currencySelect = await screen.findByRole("combobox", { name: /settlement currency/i });
    fireEvent.change(currencySelect, { target: { value: "GHS" } });

    expect(await screen.findByText("GH₵ 300.00")).toBeInTheDocument();

    const proceedBtn = screen.getByRole("button", { name: /proceed to payment/i });
    fireEvent.click(proceedBtn);

    await waitFor(() => {
      expect(capturedCheckoutPayload).not.toBeNull();
    });

    expect(capturedCheckoutPayload).toMatchObject({
      plan_id: "plan_africa_pro",
      currency: "GHS",
      duration_months: 1,
    });
    expect(capturedCheckoutPayload).not.toHaveProperty("provider");
    expect(window.location.href).toBe("https://checkout.flutterwave.com/v3/ghs-test");
  });
});
