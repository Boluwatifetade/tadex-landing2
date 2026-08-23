"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { AdminReconcilePaymentResponse } from "@/types/admin";
import { ShieldAlert, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";

interface AdminReconcileModalProps {
  transactionId: string;
  providerReference?: string | null;
  amountFormatted?: string;
  onSuccess: (res: AdminReconcilePaymentResponse) => void;
  onCancel: () => void;
}

export default function AdminReconcileModal({
  transactionId,
  providerReference,
  amountFormatted,
  onSuccess,
  onCancel,
}: AdminReconcileModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 3) {
      setErrorMsg("A justification reason (minimum 3 characters) is required for compliance audit logs.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await apiClient<AdminReconcilePaymentResponse>(
        `/admin/billing/transactions/${transactionId}/reconcile`,
        {
          method: "POST",
          body: JSON.stringify({ reason: reason.trim() }),
        }
      );
      onSuccess(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reconcile payment transaction.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reconcile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
    >
      <div className="w-full max-w-md rounded-xl border border-amber-500/30 bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 id="reconcile-modal-title" className="text-base font-bold text-foreground">
              Manually Reconcile Payment
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tx ID: <span className="font-mono text-foreground font-semibold">{transactionId.substring(0, 12)}...</span>
              {amountFormatted && <span className="ml-2 font-bold text-foreground">({amountFormatted})</span>}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-300 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>High-Consequence Administrative Action</span>
          </div>
          <p className="leading-relaxed">
            This action <strong>manually marks the transaction as successful</strong> and immediately activates/provisions the associated signal subscription outside the automated payment gateway webhook flow.
          </p>
        </div>

        {providerReference && (
          <div className="rounded-md bg-muted/40 p-2.5 text-[11px] text-muted-foreground font-mono">
            Gateway Reference: <strong className="text-foreground">{providerReference}</strong>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reconcile-reason" className="text-xs font-semibold text-foreground">
              Audit Reason <span className="text-destructive">*</span>
            </label>
            <textarea
              id="reconcile-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a mandatory justification for manual settlement (e.g. Flutterwave dispute resolved #4891, confirmed manual bank wire)..."
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Minimum 3 characters required. Permanently recorded in audit history.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || reason.trim().length < 3}
              className="text-xs flex items-center gap-1.5 font-semibold bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Reconciling...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Confirm Manual Reconciliation</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
