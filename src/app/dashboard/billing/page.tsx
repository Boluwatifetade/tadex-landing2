"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import PricingGrid from "@/components/dashboard/PricingGrid";
import { apiClient } from "@/lib/api-client";
import { CreditCard, CheckCircle2, AlertTriangle, Loader2, X } from "lucide-react";

export interface TransactionStatusResponse {
  id: string;
  reference: string;
  user_id: string;
  provider: string;
  status: string;
  amount_cents: number;
  amount: number;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

function BillingPageContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const rawRef = searchParams.get("tx_ref") || searchParams.get("ref") || searchParams.get("reference") || searchParams.get("trxref");
  const refParam = rawRef && rawRef !== "{reference}" && rawRef !== "%7Breference%7D" ? rawRef : null;

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [banner, setBanner] = useState<{
    type: "verifying" | "success" | "cancelled" | "failed";
    message: string;
  } | null>(null);

  const hasPolledRef = useRef<string | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pollTransactionStatus = useCallback((reference: string) => {
    if (hasPolledRef.current === reference) return;
    hasPolledRef.current = reference;

    let attempts = 0;
    const maxAttempts = 8; // 16 seconds total

    const poll = async () => {
      attempts++;
      try {
        const tx = await apiClient<TransactionStatusResponse>(`/billing/transactions/${encodeURIComponent(reference)}`);
        const statusLower = (tx?.status || "").toLowerCase();

        if (statusLower === "success" || statusLower === "successful" || statusLower === "paid") {
          setBanner({
            type: "success",
            message: "Payment successful! Your subscription has been activated.",
          });
          setRefreshTrigger((prev) => prev + 1);
          return;
        }

        if (statusLower === "failed" || statusLower === "cancelled") {
          setBanner({
            type: "failed",
            message: "Payment transaction failed or was rejected.",
          });
          return;
        }
      } catch (err) {
        console.error("Polling error for reference", reference, err);
      }

      if (attempts < maxAttempts) {
        pollTimerRef.current = setTimeout(poll, 2000);
      } else {
        setBanner({
          type: "failed",
          message: "Payment verification is still processing. Check back shortly — your subscription will activate automatically once confirmed.",
        });
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    poll();
  }, []);

  useEffect(() => {
    if (!statusParam) return;

    const s = statusParam.toLowerCase();
    if (s === "success" || s === "successful" || s === "completed") {
      if (refParam) {
        setBanner({
          type: "verifying",
          message: "Payment submitted — verifying transaction status...",
        });
        pollTransactionStatus(refParam);
      } else {
        setBanner({
          type: "success",
          message: "Payment returned successfully. Refreshing subscription status...",
        });
        setRefreshTrigger((prev) => prev + 1);
      }
    } else if (s === "cancelled" || s === "cancel" || s === "failed") {
      setBanner({
        type: "cancelled",
        message: "Payment was cancelled or not completed. Your account remains on the current plan.",
      });
    }

    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, [statusParam, refParam, pollTransactionStatus]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Subscription & Billing
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your trade execution plan, browse pricing tiers, and generate transparent checkout quotes.
          </p>
        </div>

        {/* Return Notification Banner */}
        {banner && (
          <div
            className={`rounded-xl border p-4 text-sm flex items-center justify-between gap-3 shadow-sm transition-all ${
              banner.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                : banner.type === "verifying"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-amber-500/30 bg-amber-500/10 text-amber-500"
            }`}
          >
            <div className="flex items-center gap-2.5 font-medium">
              {banner.type === "verifying" ? (
                <Loader2 className="h-5 w-5 animate-spin shrink-0" />
              ) : banner.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 shrink-0" />
              )}
              <span>{banner.message}</span>
            </div>

            <button
              onClick={() => setBanner(null)}
              className="rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <SubscriptionCard refreshTrigger={refreshTrigger} />
        <PricingGrid />
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <Suspense
          fallback={
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <BillingPageContent />
        </Suspense>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
