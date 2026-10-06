"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import PricingGrid from "@/components/dashboard/PricingGrid";
import { Button } from "@/components/ui/button";
import { CreditCard, Clock, ArrowRight, X, Loader2 } from "lucide-react";

interface PendingCheckoutStorage {
  reference: string;
  plan_id?: string;
  plan_name?: string;
  currency?: string;
  initiated_at?: string;
}

function BillingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // If user arrived with checkout return query parameters, redirect to the dedicated result page
  const queryRef =
    searchParams.get("reference") ||
    searchParams.get("tx_ref") ||
    searchParams.get("trxref") ||
    searchParams.get("ref");
  const queryStatus = searchParams.get("status");

  const [pendingRefData, setPendingRefData] = useState<PendingCheckoutStorage | null>(null);

  useEffect(() => {
    // If incoming query params indicate a payment return, seamlessly route to the dedicated result page
    if (queryRef && queryRef !== "{reference}" && queryRef !== "%7Breference%7D") {
      router.replace(`/dashboard/billing/checkout/result?reference=${encodeURIComponent(queryRef)}`);
      return;
    }
    if (queryStatus === "cancelled" || queryStatus === "cancel") {
      router.replace("/dashboard/billing/checkout/result?status=cancelled");
      return;
    }

    // Check for pending unverified transactions in sessionStorage
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("tadex_pending_checkout_ref");
        if (stored) {
          const parsed: PendingCheckoutStorage = JSON.parse(stored);
          if (parsed?.reference) {
            setPendingRefData(parsed);
          }
        }
      } catch {
        // Non-blocking
      }
    }
  }, [queryRef, queryStatus, router]);

  const handleDismissPending = () => {
    try {
      sessionStorage.removeItem("tadex_pending_checkout_ref");
    } catch {
      // Non-blocking
    }
    setPendingRefData(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Subscription & Billing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your trade execution plan, browse multi-currency pricing tiers, and generate transparent checkout quotes.
        </p>
      </div>

      {/* Pending Transaction Resume Alert */}
      {pendingRefData && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 font-medium text-foreground">
            <Clock className="h-5 w-5 text-primary shrink-0 animate-pulse" />
            <div>
              <span>You have a pending checkout verification in progress for </span>
              <span className="font-bold">{pendingRefData.plan_name || "a subscription plan"}</span>
              <span className="text-muted-foreground"> ({pendingRefData.currency || "USD"})</span>.
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link href={`/dashboard/billing/checkout/result?reference=${encodeURIComponent(pendingRefData.reference)}`}>
              <Button size="sm" variant="default" className="text-xs gap-1.5 h-8">
                Check Status
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismissPending}
              className="text-xs h-8 text-muted-foreground hover:text-foreground"
              title="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Active Subscription Status Card */}
      <SubscriptionCard />

      {/* Multi-Currency Dynamic Pricing Grid */}
      <PricingGrid />
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 space-y-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading billing details...</p>
        </div>
      }
    >
      <BillingPageContent />
    </Suspense>
  );
}
