"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { Settings2, Loader2 } from "lucide-react";

interface AdminSetSubscriptionStatusModalProps {
  subscriptionId: string;
  currentStatus: string;
  userEmail?: string | null;
  planName?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminSetSubscriptionStatusModal({
  subscriptionId,
  currentStatus,
  userEmail,
  planName,
  onSuccess,
  onCancel,
}: AdminSetSubscriptionStatusModalProps) {
  const [status, setStatus] = useState(currentStatus || "active");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const statusOptions = [
    { value: "active", label: "Active (Signal Execution Enabled)" },
    { value: "trialing", label: "Trialing (Free Trial Period)" },
    { value: "past_due", label: "Past Due (Payment Pending/Failed)" },
    { value: "paused", label: "Paused (Temporarily Suspended)" },
    { value: "canceled", label: "Canceled (Terminated)" },
    { value: "expired", label: "Expired (Period Ended)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 3) {
      setErrorMsg("A justification reason (minimum 3 characters) is required for compliance audit logs.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await apiClient(`/admin/billing/subscriptions/${subscriptionId}/set-status`, {
        method: "POST",
        body: JSON.stringify({ status, reason: reason.trim() }),
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to override subscription status.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="set-status-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
    >
      <div className="w-full max-w-md rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Settings2 className="h-5 w-5" />
          </div>
          <div>
            <h3 id="set-status-title" className="text-base font-bold text-foreground">
              Override Subscription Status
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Plan: <span className="font-semibold text-foreground">{planName || "Signal Plan"}</span>
              {userEmail && <span className="ml-2 font-mono">({userEmail})</span>}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Status Selector */}
          <div className="space-y-1.5">
            <label htmlFor="target-status" className="text-xs font-semibold text-foreground">
              Target Status <span className="text-destructive">*</span>
            </label>
            <select
              id="target-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label htmlFor="status-reason" className="text-xs font-semibold text-foreground">
              Audit Reason <span className="text-destructive">*</span>
            </label>
            <textarea
              id="status-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason for administrative status override (e.g. VIP manual trial extension, billing dispute hold)..."
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Minimum 3 characters required.
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
              className="text-xs flex items-center gap-1.5 font-semibold bg-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating Status...</span>
                </>
              ) : (
                <>
                  <Settings2 className="h-3.5 w-3.5" />
                  <span>Confirm Status Override</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
