"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Clock,
  ArrowRight,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { formatCurrencyAmount } from "@/lib/currency";

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

export type CheckoutWorkflowState =
  | "VERIFICATION_PENDING"
  | "CONFIRMED"
  | "FAILED"
  | "CANCELLED"
  | "TIMEOUT"
  | "INVALID_REFERENCE";

function CheckoutResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Reference Normalization: extract reference across gateways (Paystack: reference/trxref, Flutterwave: tx_ref)
  const rawQueryRef =
    searchParams.get("reference") ||
    searchParams.get("tx_ref") ||
    searchParams.get("trxref") ||
    searchParams.get("ref") ||
    searchParams.get("transaction_id");

  const queryStatus = searchParams.get("status")?.toLowerCase() || null;

  const [workflowState, setWorkflowState] = useState<CheckoutWorkflowState>("VERIFICATION_PENDING");
  const [transaction, setTransaction] = useState<TransactionStatusResponse | null>(null);
  const [activeReference, setActiveReference] = useState<string | null>(null);
  const [pollAttempt, setPollAttempt] = useState<number>(0);
  const [isManualChecking, setIsManualChecking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("Initializing secure payment verification...");

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  // Normalize reference from URL or sessionStorage fallback
  useEffect(() => {
    let resolvedRef: string | null = null;

    if (
      rawQueryRef &&
      rawQueryRef !== "{reference}" &&
      rawQueryRef !== "%7Breference%7D" &&
      rawQueryRef.trim() !== ""
    ) {
      resolvedRef = rawQueryRef.trim();
    } else if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("tadex_pending_checkout_ref");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.reference) {
            resolvedRef = parsed.reference;
          }
        }
      } catch {
        // Non-blocking storage access
      }
    }

    setActiveReference(resolvedRef);

    // If explicit cancelled parameter from gateway and no reference
    if (queryStatus === "cancelled" && !resolvedRef) {
      setWorkflowState("CANCELLED");
      setStatusMessage("Payment was cancelled by the user. No funds were debited.");
    } else if (!resolvedRef) {
      setWorkflowState("INVALID_REFERENCE");
      setStatusMessage("No valid payment transaction reference found.");
    }
  }, [rawQueryRef, queryStatus]);

  // Authoritative status verification against backend
  const verifyTransaction = useCallback(
    async (ref: string, attemptCount: number = 1): Promise<void> => {
      if (isPollingRef.current && attemptCount === 1) return;
      isPollingRef.current = true;
      setPollAttempt(attemptCount);

      try {
        const tx = await apiClient<TransactionStatusResponse>(
          `/billing/transactions/${encodeURIComponent(ref)}`
        );
        setTransaction(tx);

        const st = (tx?.status || "").toLowerCase().trim();

        if (st === "success" || st === "successful" || st === "paid" || st === "active") {
          setWorkflowState("CONFIRMED");
          setStatusMessage("Payment confirmed! Your subscription entitlement has been activated.");
          isPollingRef.current = false;

          // Clear pending reference in sessionStorage
          try {
            sessionStorage.removeItem("tadex_pending_checkout_ref");
          } catch {
            // Non-blocking
          }

          // Authoritatively refetch subscription
          try {
            await apiClient("/billing/subscription");
          } catch {
            // Non-blocking
          }
          return;
        }

        if (st === "failed" || st === "declined" || st === "error") {
          setWorkflowState("FAILED");
          setStatusMessage("Payment transaction was declined or failed to process.");
          isPollingRef.current = false;
          return;
        }

        if (st === "cancelled" || queryStatus === "cancelled") {
          setWorkflowState("CANCELLED");
          setStatusMessage("Payment transaction was cancelled. No charges were made.");
          isPollingRef.current = false;
          return;
        }

        // Still pending/verifying
        setWorkflowState("VERIFICATION_PENDING");
        setStatusMessage(
          `Confirming payment with banking provider (attempt ${attemptCount} of 8)...`
        );

        if (attemptCount < 8) {
          const delay = attemptCount <= 3 ? 2000 : attemptCount <= 6 ? 3000 : 5000;
          pollTimerRef.current = setTimeout(() => {
            verifyTransaction(ref, attemptCount + 1);
          }, delay);
        } else {
          // Timeout reached after 8 attempts (~30 seconds)
          setWorkflowState("TIMEOUT");
          setStatusMessage(
            "Payment verification is taking longer than expected. Banking webhooks may take up to a few minutes to settle."
          );
          isPollingRef.current = false;
        }
      } catch (err: unknown) {
        // If 404 or network error
        if (attemptCount < 5) {
          pollTimerRef.current = setTimeout(() => {
            verifyTransaction(ref, attemptCount + 1);
          }, 3000);
        } else {
          setWorkflowState("TIMEOUT");
          setStatusMessage("Transaction verification is processing in background.");
          isPollingRef.current = false;
        }
      }
    },
    [queryStatus]
  );

  // Trigger polling when active reference is set
  useEffect(() => {
    if (activeReference && workflowState === "VERIFICATION_PENDING") {
      verifyTransaction(activeReference, 1);
    }

    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
      isPollingRef.current = false;
    };
  }, [activeReference, verifyTransaction]);

  const handleManualRetry = () => {
    if (!activeReference) return;
    setIsManualChecking(true);
    verifyTransaction(activeReference, 1).finally(() => {
      setIsManualChecking(false);
    });
  };

  return (
    <div className="mx-auto max-w-xl py-12 px-4 sm:px-6">
      <Card className="border-border bg-card shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            {workflowState === "VERIFICATION_PENDING" && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>
            )}
            {workflowState === "CONFIRMED" && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            )}
            {workflowState === "FAILED" && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle className="h-8 w-8" />
              </div>
            )}
            {workflowState === "CANCELLED" && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-8 w-8" />
              </div>
            )}
            {workflowState === "TIMEOUT" && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="h-8 w-8" />
              </div>
            )}
            {workflowState === "INVALID_REFERENCE" && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <HelpCircle className="h-8 w-8" />
              </div>
            )}
          </div>

          <CardTitle className="text-xl font-bold">
            {workflowState === "VERIFICATION_PENDING" && "Verifying Payment"}
            {workflowState === "CONFIRMED" && "Payment Successful!"}
            {workflowState === "FAILED" && "Payment Failed"}
            {workflowState === "CANCELLED" && "Payment Cancelled"}
            {workflowState === "TIMEOUT" && "Payment Pending Confirmation"}
            {workflowState === "INVALID_REFERENCE" && "Unknown Transaction"}
          </CardTitle>

          <CardDescription className="text-sm mt-1">{statusMessage}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Transaction Metadata Details */}
          {activeReference && (
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Reference</span>
                <span className="font-mono font-medium text-foreground">{activeReference}</span>
              </div>

              {transaction && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Settlement Amount</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrencyAmount(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Settlement Currency</span>
                    <span className="font-medium text-foreground uppercase">{transaction.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Provider</span>
                    <span className="font-medium text-foreground capitalize">{transaction.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backend Status</span>
                    <span
                      className={`font-semibold capitalize ${
                        workflowState === "CONFIRMED"
                          ? "text-emerald-500"
                          : workflowState === "FAILED"
                          ? "text-destructive"
                          : "text-amber-500"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Contextual User Guidance Box */}
          {workflowState === "VERIFICATION_PENDING" && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground text-center">
              Please keep this window open while we communicate with the banking gateway. Do not refresh.
            </div>
          )}

          {workflowState === "TIMEOUT" && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-muted-foreground space-y-1.5">
              <p className="font-medium text-foreground">What happens now?</p>
              <p>
                Your payment provider has accepted the request. Once their webhook confirms the transaction with Tadex, your plan will activate automatically without any further action required.
              </p>
            </div>
          )}

          {workflowState === "CONFIRMED" && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Your account entitlement is active. Automated signal executions are ready.</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/60">
          {workflowState === "CONFIRMED" && (
            <Link href="/dashboard" className="w-full">
              <Button className="w-full gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {workflowState === "TIMEOUT" && (
            <>
              <Button
                variant="default"
                className="w-full gap-2"
                onClick={handleManualRetry}
                disabled={isManualChecking}
              >
                <RefreshCw className={`h-4 w-4 ${isManualChecking ? "animate-spin" : ""}`} />
                Re-check Status
              </Button>
              <Link href="/dashboard/billing" className="w-full">
                <Button variant="outline" className="w-full">
                  Return to Billing
                </Button>
              </Link>
            </>
          )}

          {(workflowState === "FAILED" || workflowState === "CANCELLED" || workflowState === "INVALID_REFERENCE") && (
            <Link href="/dashboard/billing" className="w-full">
              <Button variant="default" className="w-full">
                Return to Plans & Billing
              </Button>
            </Link>
          )}

          {workflowState === "VERIFICATION_PENDING" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRetry}
              disabled={isManualChecking}
              className="w-full gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isManualChecking ? "animate-spin" : ""}`} />
              Poll Again Now
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 space-y-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading checkout verification...</p>
        </div>
      }
    >
      <CheckoutResultContent />
    </Suspense>
  );
}
