"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, RefreshCw, Zap, Check, Coins, BadgeCheck, User } from "lucide-react";
import CheckoutQuoteModal from "./CheckoutQuoteModal";

export interface PlanPriceItem {
  currency: string;
  amount_cents: number;
  amount: number;
  is_override?: boolean;
}

export interface PlanOut {
  id: string;
  provider_id?: string | null;
  provider_name?: string | null;
  name: string;
  description?: string | null;
  currency: string;
  monthly_price_cents: number;
  monthly_price: number;
  max_duration_days: number;
  is_active: boolean;
  supported_currencies: string[];
  prices: PlanPriceItem[];
}

export default function PricingGrid() {
  const [plans, setPlans] = useState<PlanOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Global currency filter for display
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  // Selected plan for CheckoutQuoteModal
  const [selectedPlanForQuote, setSelectedPlanForQuote] = useState<PlanOut | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await apiClient<PlanOut[]>("/billing/plans");
      const activePlans = Array.isArray(data) ? data.filter((p) => p.is_active !== false) : [];
      setPlans(activePlans);

      // Auto-detect available currency preference
      if (activePlans.length > 0) {
        const firstSupported = activePlans[0].supported_currencies || [];
        if (firstSupported.includes("NGN")) {
          setSelectedCurrency("NGN");
        } else if (firstSupported.length > 0) {
          setSelectedCurrency(firstSupported[0]);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load pricing plans";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Aggregate all unique supported currencies across plans
  const allCurrencies = Array.from(
    new Set(plans.flatMap((p) => p.supported_currencies || [p.currency || "USD"]))
  );

  const getPriceForCurrency = (plan: PlanOut, currCode: string) => {
    const item = plan.prices?.find((p) => p.currency.toUpperCase() === currCode.toUpperCase());
    if (item) {
      return item.amount;
    }
    return plan.monthly_price;
  };

  const formatAmount = (amount: number, currCode: string) => {
    const symbols: Record<string, string> = {
      NGN: "₦",
      USD: "$",
      USDT: "USDT ",
      EUR: "€",
      GBP: "£",
      KES: "KSh ",
      GHS: "GH₵ ",
    };
    const sym = symbols[currCode.toUpperCase()] || `${currCode} `;
    return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleOpenQuote = (plan: PlanOut) => {
    setSelectedPlanForQuote(plan);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Signal Execution Plans & Pricing
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Transparent pricing with multi-currency support and itemized quotes.
          </p>
        </div>

        {/* Global Currency Switcher */}
        {allCurrencies.length > 0 && (
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Currency:</span>
            <div className="flex items-center rounded-lg border border-border bg-card p-1">
              {allCurrencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                    selectedCurrency === curr
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchPlans}
              disabled={isLoading}
              title="Refresh pricing"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading pricing plans...</p>
        </div>
      ) : fetchError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
          <span>{fetchError}</span>
          <Button variant="outline" size="sm" onClick={fetchPlans}>Retry</Button>
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          <p className="font-semibold text-foreground">No active plans available.</p>
          <p className="text-xs text-muted-foreground mt-1">Check back later for updated provider execution plans.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const displayPrice = getPriceForCurrency(plan, selectedCurrency);

            return (
              <Card key={plan.id} className="flex flex-col justify-between border-border hover:border-primary/40 transition-colors">
                <CardHeader className="space-y-2">
                  {/* Provider Identity Badge Row */}
                  <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1 border border-primary/20 text-xs font-medium text-primary">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">
                      {(plan.provider_name || "P").charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">Provider: <strong className="font-semibold text-foreground">{plan.provider_name || "Signal Provider"}</strong></span>
                    <BadgeCheck className="h-3.5 w-3.5 fill-emerald-500/20 text-emerald-500 shrink-0 ml-auto" />
                  </div>

                  <CardTitle className="text-lg font-bold text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px] text-xs leading-relaxed">
                    {plan.description || "Automated trading execution plan for Bybit traders."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="pt-2">
                    <span className="text-3xl font-extrabold font-mono text-foreground">
                      {formatAmount(displayPrice, selectedCurrency)}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium"> / month</span>
                  </div>

                  <div className="space-y-2 pt-2 text-xs border-t border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Non-custodial Bybit signal automation</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Supported: {plan.supported_currencies?.join(", ") || plan.currency}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border">
                  <Button
                    onClick={() => handleOpenQuote(plan)}
                    className="w-full text-xs font-semibold"
                  >
                    Get Checkout Quote
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Checkout Quote Modal */}
      <CheckoutQuoteModal
        plan={selectedPlanForQuote}
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
