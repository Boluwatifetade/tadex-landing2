"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { ShieldAlert, AlertTriangle, Loader2 } from "lucide-react";

interface AdminCancelSubscriptionModalProps {
  subscriptionId: string;
  userEmail?: string | null;
  planName?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminCancelSubscriptionModal({
  subscriptionId,
  userEmail,
  planName,
  onSuccess,
  onCancel,
}: AdminCancelSubscriptionModalProps) {
  const [mode, setMode] = useState<"immediate" | "period_end">("immediate");
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
      await apiClient(`/admin/billing/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        body: JSON.stringify({ mode, reason: reason.trim() }),
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel subscription.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-sub-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
    >
      <div className="w-full max-w-md rounded-xl border border-destructive/30 bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 id="cancel-sub-title" className="text-base font-bold text-foreground">
              Cancel User Subscription
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
          {/* Cancellation Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Cancellation Timing</label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex flex-col p-3 rounded-lg border cursor-pointer text-xs transition-colors ${
                  mode === "immediate"
                    ? "border-destructive bg-destructive/10 text-destructive font-semibold"
                    : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cancel-mode"
                    value="immediate"
                    checked={mode === "immediate"}
                    onChange={() => setMode("immediate")}
                    className="text-destructive focus:ring-destructive"
                  />
                  <span>Immediate</span>
                </div>
                <span className="text-[10px] mt-1 opacity-80">Revoke signal execution access right now.</span>
              </label>

              <label
                className={`flex flex-col p-3 rounded-lg border cursor-pointer text-xs transition-colors ${
                  mode === "period_end"
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cancel-mode"
                    value="period_end"
                    checked={mode === "period_end"}
                    onChange={() => setMode("period_end")}
                    className="text-primary focus:ring-primary"
                  />
                  <span>At Period End</span>
                </div>
                <span className="text-[10px] mt-1 opacity-80">Allow current billing cycle to run out.</span>
              </label>
            </div>
          </div>

          {/* Audit Reason */}
          <div className="space-y-1.5">
            <label htmlFor="cancel-reason" className="text-xs font-semibold text-foreground">
              Audit Reason <span className="text-destructive">*</span>
            </label>
            <textarea
              id="cancel-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for administrative cancellation (e.g. Customer refund requested via support #8291)..."
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Minimum 3 characters required. Permanently logged.
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
              variant="destructive"
              size="sm"
              disabled={isSubmitting || reason.trim().length < 3}
              className="text-xs flex items-center gap-1.5 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Confirm Cancellation</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
