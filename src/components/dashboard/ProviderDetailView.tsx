"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, RefreshCw, BadgeCheck, Users, Signal, TrendingUp, ArrowLeft, Check, Shield } from "lucide-react";
import CheckoutQuoteModal from "@/components/dashboard/CheckoutQuoteModal";
import { PlanOut } from "@/components/dashboard/PricingGrid";
import { ProviderOut } from "@/components/dashboard/ProviderDirectory";
import { resolvePlanPrice, formatCurrencyAmount } from "@/lib/currency";

export interface ProviderDetailViewProps {
  providerId: string;
}

export default function ProviderDetailView({ providerId }: ProviderDetailViewProps) {
  const [provider, setProvider] = useState<ProviderOut | null>(null);
  const [plans, setPlans] = useState<PlanOut[]>([]);
  const [currency, setCurrency] = useState<string>("NGN");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<PlanOut | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [provData, plansData] = await Promise.all([
        apiClient<ProviderOut>(`/providers/${providerId}`),
        apiClient<PlanOut[]>(`/providers/${providerId}/plans`),
      ]);
      setProvider(provData || null);
      setPlans(plansData || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load provider details";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectPlan = (plan: PlanOut) => {
    setSelectedPlan(plan);
    setIsQuoteOpen(true);
  };

  const winRateFormatted = provider?.win_rate != null ? `${(provider.win_rate * 100).toFixed(1)}%` : "N/A";

  return (
    <div className="space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/providers">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to All Providers
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={isLoading}
          title="Refresh provider details"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading provider profile and plans...</p>
        </div>
      ) : errorMsg || !provider ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3">
          <p className="text-sm text-destructive font-medium">{errorMsg || "Provider not found or inactive."}</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
            <Link href="/dashboard/providers">
              <Button size="sm">Back to Providers</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Provider Banner & Profile Card */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl">
                  {provider.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">{provider.name}</h1>
                    {provider.is_verified && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 gap-1">
                        <BadgeCheck className="h-3.5 w-3.5 fill-emerald-500/20 text-emerald-500" /> Verified Provider
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    Provider ID: {provider.id}
                  </p>
                </div>
              </div>

              {/* Currency Selector for Plans */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Currency:</span>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                  {["NGN", "USD", "USDT"].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        currency === curr
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {provider.description || "Active crypto signal provider providing automated Bybit trade signals."}
            </p>

            {/* Provider Stats Bar */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-card/60 p-4 border border-border sm:grid-cols-4 text-xs">
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Signal Delivery Rate
                </span>
                <p className="text-lg font-bold text-foreground mt-0.5">{winRateFormatted}</p>
              </div>

              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" /> Active Subscribers
                </span>
                <p className="text-lg font-bold text-foreground mt-0.5">{provider.subscriber_count || 0}</p>
              </div>

              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Signal className="h-3.5 w-3.5 text-secondary-foreground" /> Signals Received
                </span>
                <p className="text-lg font-bold text-foreground mt-0.5">{provider.total_signals_sent || 0}</p>
              </div>

              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" /> Execution Risk Model
                </span>
                <p className="text-sm font-semibold text-foreground mt-1">Non-Custodial API</p>
              </div>
            </div>
          </div>

          {/* Provider Scoped Plans Grid */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Active Subscription Plans</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select an execution plan provided directly by {provider.name}.
              </p>
            </div>

            {plans.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
                This provider currently has no active subscription plans listed for {currency}.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => {
                  const resolvedPrice = resolvePlanPrice(plan, currency);

                  return (
                    <Card key={plan.id} className="flex flex-col justify-between border-border hover:border-primary/50 transition-all shadow-sm">
                      <CardHeader className="space-y-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-bold text-foreground">{plan.name}</CardTitle>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                            {plan.max_duration_days} Days
                          </span>
                        </div>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                          {plan.description || "Automated signal execution plan."}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="border-t border-b border-border py-3 space-y-1">
                          <div className="text-2xl font-extrabold text-foreground">
                            {formatCurrencyAmount(resolvedPrice.amount, resolvedPrice.currency)}
                            <span className="text-xs font-normal text-muted-foreground ml-1">/ month</span>
                          </div>
                          {!resolvedPrice.isSupported && (
                            <div className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-500 border border-amber-500/20">
                              Only available in {resolvedPrice.currency}
                            </div>
                          )}
                        </div>

                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>Provider: {provider.name}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>Auto Bybit Position Mirroring</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>Transparent Platform Fee Breakdown</span>
                          </li>
                        </ul>
                      </CardContent>

                      <CardFooter>
                        <Button onClick={() => handleSelectPlan(plan)} className="w-full text-xs font-semibold">
                          Subscribe to Plan
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Quote Modal */}
      {selectedPlan && (
        <CheckoutQuoteModal
          plan={selectedPlan}
          isOpen={isQuoteOpen}
          onClose={() => setIsQuoteOpen(false)}
        />
      )}
    </div>
  );
}
