"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { AdminTransactionDetailOut, AdminReconcilePaymentResponse } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminReconcileModal from "./AdminReconcileModal";
import {
  Receipt,
  ChevronLeft,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building,
  User,
  Radio,
  ScrollText,
  Copy,
  Check,
  Code,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AdminTransactionDetailViewProps {
  transactionId: string;
}

export default function AdminTransactionDetailView({ transactionId }: AdminTransactionDetailViewProps) {
  const [tx, setTx] = useState<AdminTransactionDetailOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Modals & UI toggles
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [isPayloadOpen, setIsPayloadOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const fetchTransaction = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await apiClient<AdminTransactionDetailOut>(`/admin/billing/transactions/${transactionId}`);
      setTx(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load transaction diagnostics.";
      setErrorMsg(msg);
      setTx(null);
    } finally {
      setIsLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatMoney = (minor?: number | null, cents?: number | null, curr: string = "USD") => {
    const raw = minor ?? cents;
    if (raw === undefined || raw === null) return "-";
    const val = raw / 100;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: curr.toUpperCase(),
      }).format(val);
    } catch {
      return `${curr.toUpperCase()} ${val.toFixed(2)}`;
    }
  };

  const handleCopyJson = () => {
    if (!tx) return;
    const jsonStr = JSON.stringify(tx.raw_webhook_payload || tx.meta || {}, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("succ") || s.includes("comp")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
    if (s.includes("pend") || s.includes("init")) {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-muted rounded-md"></div>
        <div className="h-32 bg-muted rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-44 bg-muted rounded-xl"></div>
          <div className="h-44 bg-muted rounded-xl"></div>
          <div className="h-44 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (errorMsg && !tx) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/billing/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Transactions Ledger</span>
        </Link>
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3">
          <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
          <h2 className="text-base font-bold text-foreground">Transaction Not Available</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">{errorMsg}</p>
          <Button variant="outline" size="sm" onClick={fetchTransaction} className="text-xs">
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  if (!tx) return null;

  const totalStr = formatMoney(tx.total_amount_minor ?? tx.amount_minor, tx.amount_cents, tx.currency || "USD");

  return (
    <div className="space-y-6">
      {/* Top Nav & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/billing/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Transactions Ledger</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchTransaction}
          className="text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Diagnostics</span>
        </Button>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Header Diagnostics Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black shadow-xs">
                <Receipt className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg font-bold text-foreground font-mono">
                    {tx.id}
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border ${getStatusBadge(
                      tx.status
                    )}`}
                  >
                    {tx.status}
                  </span>

                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase">
                    {tx.provider || "Gateway"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
                  {tx.provider_reference && (
                    <span>Ref: <strong className="text-foreground">{tx.provider_reference}</strong></span>
                  )}
                  <span>Created: <strong className="text-foreground">{formatDate(tx.created_at)}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
              <div className="text-right mr-2">
                <span className="text-[10px] text-muted-foreground block uppercase">Gross Amount</span>
                <span className="text-lg font-extrabold text-foreground">{totalStr}</span>
              </div>

              <Button
                size="sm"
                onClick={() => setIsReconcileModalOpen(true)}
                className="text-xs flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Reconcile Payment</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failure / Error Callout Banner */}
      {tx.error_message && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Gateway Settlement Failure</h4>
            <p className="leading-relaxed">{tx.error_message}</p>
            {tx.manual_review_status && (
              <p className="text-[11px] font-mono">Manual Review Status: {tx.manual_review_status}</p>
            )}
          </div>
        </div>
      )}

      {/* Split & Financial Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Total Gross Paid</span>
            <p className="text-xl font-bold text-foreground">{totalStr}</p>
            <p className="text-[10px] text-muted-foreground font-mono">Method: {tx.payment_method || "Card"}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Platform Fee Retained</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatMoney(tx.fee_minor, null, tx.currency || "USD")}
            </p>
            <p className="text-[10px] text-muted-foreground font-mono">Fixed platform cut</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Provider Net Payout</span>
            <p className="text-xl font-bold text-primary">
              {formatMoney(tx.provider_amount_minor, null, tx.currency || "USD")}
            </p>
            <p className="text-[10px] text-muted-foreground font-mono">Settlement to signal provider</p>
          </CardContent>
        </Card>
      </div>

      {/* Linked Entities Context (Customer, Provider, Subscription) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Linked Customer */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle className="text-xs font-bold uppercase">Customer Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <p className="font-semibold text-foreground truncate" title={tx.user_email || "No Email"}>
              {tx.user_email || "Anonymous"}
            </p>
            {tx.user_id && (
              <p className="font-mono text-[11px] text-muted-foreground">
                ID: {tx.user_id.substring(0, 10)}...
              </p>
            )}
            {tx.user_username && (
              <p className="text-[11px] text-muted-foreground font-mono">
                @{tx.user_username}
              </p>
            )}
            {tx.user_id && (
              <div className="pt-2">
                <Link
                  href={`/admin/users/${tx.user_id}`}
                  className="text-xs text-primary font-semibold hover:underline inline-block"
                >
                  View 360° User Profile &rarr;
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Linked Provider */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <CardTitle className="text-xs font-bold uppercase">Signal Provider</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <p className="font-semibold text-foreground">
              {tx.provider_name || tx.provider_profile?.name || "Standard Platform"}
            </p>
            {tx.provider_profile && (
              <div className="space-y-1 text-[11px] text-muted-foreground">
                <p>Tier: <strong className="capitalize text-foreground">{tx.provider_profile.verification_level}</strong></p>
                <p>Subscribers: {tx.provider_profile.subscriber_count}</p>
              </div>
            )}
            <div className="pt-2">
              <Link
                href="/admin/providers"
                className="text-xs text-primary font-semibold hover:underline inline-block"
              >
                View in Provider Governance &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Linked Subscription */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary" />
              <CardTitle className="text-xs font-bold uppercase">Associated Subscription</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            {tx.associated_subscription ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    {tx.associated_subscription.plan_name || "Signal Subscription"}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] uppercase font-bold">
                    {tx.associated_subscription.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Tier: {tx.associated_subscription.tier || "standard"}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground italic py-2">
                No active subscription directly mapped to this payment record.
              </p>
            )}
            <div className="pt-2">
              <Link
                href="/admin/billing/subscriptions"
                className="text-xs text-primary font-semibold hover:underline inline-block"
              >
                View Subscriptions Ledger &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Raw Webhook Payload & Diagnostics (Collapsible) */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <CardTitle className="text-xs font-bold uppercase">Raw Webhook Payload & Diagnostics</CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyJson}
                className="text-xs flex items-center gap-1.5 h-7 px-2.5"
              >
                {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{isCopied ? "Copied" : "Copy JSON"}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPayloadOpen(!isPayloadOpen)}
                className="text-xs h-7 px-2"
              >
                {isPayloadOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isPayloadOpen && (
          <CardContent className="p-4">
            <pre className="p-4 rounded-lg bg-muted/40 border border-border text-[11px] font-mono text-foreground overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(tx.raw_webhook_payload || tx.meta || { note: "No webhook payload captured" }, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>

      {/* Recent Audit Logs */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-primary" />
            <CardTitle className="text-xs font-bold uppercase">Administrative Audit History</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-xs">
          {tx.recent_audit_logs.length === 0 ? (
            <p className="text-muted-foreground italic text-center py-3">
              No audit logs recorded for this transaction.
            </p>
          ) : (
            <div className="space-y-2.5">
              {tx.recent_audit_logs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold uppercase text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                      {log.action_type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{formatDate(log.created_at)}</span>
                  </div>
                  {log.reason && (
                    <p className="text-xs text-foreground mt-1">
                      <strong className="text-muted-foreground">Reason: </strong> {log.reason}
                    </p>
                  )}
                  <div className="text-[10px] text-muted-foreground font-mono pt-1">
                    Admin ID: {log.admin_user_id || "System"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reconcile Modal */}
      {isReconcileModalOpen && (
        <AdminReconcileModal
          transactionId={tx.id}
          providerReference={tx.provider_reference}
          amountFormatted={totalStr}
          onSuccess={(res) => {
            setIsReconcileModalOpen(false);
            setActionSuccessMsg(res.message || "Transaction successfully reconciled.");
            fetchTransaction();
          }}
          onCancel={() => setIsReconcileModalOpen(false)}
        />
      )}
    </div>
  );
}
