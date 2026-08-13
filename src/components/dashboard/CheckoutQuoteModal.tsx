"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, X, ShieldCheck, HelpCircle, Receipt } from "lucide-react";
import { formatCurrencyAmount } from "@/lib/currency";
import { PlanOut } from "./PricingGrid";

export interface CheckoutQuoteResponse {
  months: number;
  currency: string;
  provider_monthly_cents: number;
  platform_monthly_cents: number;
  provider_total_cents: number;
  platform_total_cents: number;
  total_cents: number;
  provider_monthly_amount: number;
  platform_monthly_amount: number;
  provider_total_amount: number;
  platform_total_amount: number;
  total_amount: number;
  resolved_settlement?: string | null;
  provider_name?: string | null;
}

export interface CheckoutInitiateResponse {
  authorization_url: string;
  reference: string;
  provider_name: string;
  status: string;
}

interface CheckoutQuoteModalProps {
  plan: PlanOut | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutQuoteModal({ plan, isOpen, onClose }: CheckoutQuoteModalProps) {
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [quote, setQuote] = useState<CheckoutQuoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [initiateError, setInitiateError] = useState<string | null>(null);

  const handleProceedToPayment = async () => {
    if (!plan || !quote) return;
    setIsInitiatingPayment(true);
    setInitiateError(null);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const res = await apiClient<CheckoutInitiateResponse>("/billing/checkout", {
        method: "POST",
        body: JSON.stringify({
          plan_id: plan.id,
          currency: selectedCurrency,
          duration_months: durationMonths,
          success_url: `${origin}/dashboard/billing?status=success&ref={reference}`,
          cancel_url: `${origin}/dashboard/billing?status=cancelled&ref={reference}`,
        }),
      });

      if (res?.authorization_url) {
        window.location.href = res.authorization_url;
      } else {
        throw new Error("No payment authorization URL returned.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate payment process";
      setInitiateError(msg);
      setIsInitiatingPayment(false);
    }
  };

  // Initialize selected currency when plan changes
  useEffect(() => {
    if (plan) {
      if (plan.supported_currencies && plan.supported_currencies.length > 0) {
        setSelectedCurrency(plan.supported_currencies[0]);
      } else {
        setSelectedCurrency(plan.currency || "USD");
      }
    }
  }, [plan]);

  const fetchQuote = useCallback(async () => {
    if (!plan) return;
    setIsLoading(true);
    setQuoteError(null);

    try {
      const resp = await apiClient<CheckoutQuoteResponse>("/billing/checkout-quote", {
        method: "POST",
        body: JSON.stringify({
          plan_id: plan.id,
          currency: selectedCurrency,
          duration_months: durationMonths,
        }),
      });
      setQuote(resp);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to calculate checkout quote";
      setQuoteError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [plan, selectedCurrency, durationMonths]);

  useEffect(() => {
    if (isOpen && plan) {
      fetchQuote();
    }
  }, [isOpen, plan, fetchQuote]);

  if (!isOpen || !plan) return null;

  const formatCurrency = (amount: number, curr: string) => {
    return formatCurrencyAmount(amount, curr);
  };

  const durationOptions = [
    { label: "1 Month", months: 1 },
    { label: "3 Months", months: 3 },
    { label: "6 Months", months: 6 },
    { label: "12 Months", months: 12 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl text-card-foreground p-6 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Transparent Checkout Quote</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Itemized cost breakdown for <strong>{plan.name}</strong>. No hidden fees.
          </p>
        </div>

        {/* Controls: Duration & Currency Selector */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Duration Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Duration</label>
            <select
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              disabled={isLoading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {durationOptions.map((opt) => (
                <option key={opt.months} value={opt.months}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Settlement Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {(plan.supported_currencies || [plan.currency || "USD"]).map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quote Calculation Area */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Calculating itemized quote...</p>
            </div>
          ) : quoteError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center justify-between">
              <span>{quoteError}</span>
              <Button variant="outline" size="sm" onClick={fetchQuote}>Retry</Button>
            </div>
          ) : quote ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                Itemized Cost Breakdown ({quote.months} {quote.months === 1 ? "Month" : "Months"})
              </h3>

              {/* Provider Base Price Line Item */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span>Provider Base Price</span>
                  <span className="text-[10px] text-muted-foreground/70">({quote.provider_name || "Provider"})</span>
                </span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(quote.provider_total_amount, quote.currency)}
                </span>
              </div>

              {/* Platform Service & Automation Fee Line Item (MUST BE VISIBLY SEPARATE AND CLEARLY LABELED) */}
              <div className="flex items-center justify-between text-sm p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">Platform Service & Automation Fee</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Tadex</span>
                </div>
                <span className="font-mono font-semibold text-primary">
                  {formatCurrency(quote.platform_total_amount, quote.currency)}
                </span>
              </div>

              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Total Checkout Quote</span>
                <span className="text-lg font-bold font-mono text-foreground">
                  {formatCurrency(quote.total_amount, quote.currency)}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Action Button & Disclaimer */}
        <div className="space-y-2">
          {initiateError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive flex items-center justify-between">
              <span>{initiateError}</span>
            </div>
          )}

          <Button
            onClick={handleProceedToPayment}
            disabled={isLoading || !quote || isInitiatingPayment}
            className="w-full text-xs font-semibold py-3 flex items-center justify-center gap-2"
          >
            {isInitiatingPayment ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Initiating Payment...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Tadex never holds your funds. Payment processed via secure hosted checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
