"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { AdminPlatformFeeConfigOut } from "@/types/admin";
import { AlertOctagon, AlertTriangle, Loader2, ShieldCheck, DollarSign } from "lucide-react";

interface AdminUpdateFeeModalProps {
  currentNgnAmount?: number;
  currentUsdtAmount?: number;
  onSuccess: (updatedFee: AdminPlatformFeeConfigOut) => void;
  onCancel: () => void;
}

export default function AdminUpdateFeeModal({
  currentNgnAmount = 1500,
  currentUsdtAmount = 10,
  onSuccess,
  onCancel,
}: AdminUpdateFeeModalProps) {
  const [currency, setCurrency] = useState<"NGN" | "USDT">("NGN");
  const [amountStr, setAmountStr] = useState<string>(
    currency === "NGN" ? String(currentNgnAmount) : String(currentUsdtAmount)
  );
  const [reason, setReason] = useState("");
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCurrencyChange = (curr: "NGN" | "USDT") => {
    setCurrency(curr);
    setAmountStr(curr === "NGN" ? String(currentNgnAmount) : String(currentUsdtAmount));
  };

  const parsedAmount = parseFloat(amountStr);
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;
  const isReasonValid = reason.trim().length >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid) {
      setErrorMsg("Please enter a valid positive numeric fee amount.");
      return;
    }
    if (!isReasonValid) {
      setErrorMsg("A justification reason (minimum 3 characters) is strictly mandatory for the compliance audit trail.");
      return;
    }
    if (!isAcknowledged) {
      setErrorMsg("You must acknowledge the platform-wide revenue impact before proceeding.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const amountMinor = Math.round(parsedAmount * 100);
      const res = await apiClient<AdminPlatformFeeConfigOut>("/admin/billing/fees", {
        method: "POST",
        body: JSON.stringify({
          currency,
          amount: parsedAmount,
          amount_minor: amountMinor,
          reason: reason.trim(),
        }),
      });
      onSuccess(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update platform fee configuration.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-fee-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in-0 duration-150"
    >
      <div className="w-full max-w-lg rounded-2xl border-2 border-red-500/50 bg-card p-6 shadow-2xl space-y-5">
        {/* Header with High-Gravity Danger Icon */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive ring-4 ring-destructive/10">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="update-fee-title" className="text-base font-extrabold text-foreground tracking-tight">
                Global Platform Fee Modification
              </h3>
              <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-bold text-destructive uppercase tracking-wider">
                Critical
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Alters the default platform cut deducted from all provider subscription checkouts.
            </p>
          </div>
        </div>

        {/* High-Consequence Impact Callout */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Immediate Revenue Split Consequence</span>
          </div>
          <p className="leading-relaxed">
            Changing this setting <strong>immediately modifies the revenue split formula</strong> for every incoming signal checkout quote and automated subscription renewal across the entire platform for <strong>{currency}</strong>.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/15 p-3 text-xs text-destructive font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Currency Selection Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Target Settlement Currency</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleCurrencyChange("NGN")}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  currency === "NGN"
                    ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary"
                    : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                }`}
              >
                NGN (Nigerian Naira ₦)
              </button>

              <button
                type="button"
                onClick={() => handleCurrencyChange("USDT")}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  currency === "USDT"
                    ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary"
                    : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                }`}
              >
                USDT (Tether USD $)
              </button>
            </div>
          </div>

          {/* New Fee Input */}
          <div className="space-y-1.5">
            <label htmlFor="fee-amount" className="text-xs font-semibold text-foreground">
              New Flat Platform Fee ({currency}) <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                id="fee-amount"
                type="number"
                step="any"
                min="0.01"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder={currency === "NGN" ? "1500" : "10"}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-border bg-background p-2.5 text-sm font-bold text-foreground focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-foreground">
                {currency}
              </span>
            </div>
            {isAmountValid && (
              <p className="text-[11px] text-muted-foreground font-mono">
                Equivalent minor units: {Math.round(parsedAmount * 100).toLocaleString()} {currency === "NGN" ? "kobo" : "cents"}
              </p>
            )}
          </div>

          {/* Justification Reason */}
          <div className="space-y-1.5">
            <label htmlFor="fee-reason" className="text-xs font-semibold text-foreground">
              Executive Justification Reason <span className="text-destructive">*</span>
            </label>
            <textarea
              id="fee-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed rationale for this fee revision (e.g. Q3 platform pricing adjustment approved by board)..."
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Minimum 3 characters required. Permanently logged in administrative audit history.
            </p>
          </div>

          {/* Double-Confirmation Acknowledgment Checkbox */}
          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={isAcknowledged}
                onChange={(e) => setIsAcknowledged(e.target.checked)}
                disabled={isSubmitting}
                className="mt-0.5 h-4 w-4 rounded border-border text-destructive focus:ring-destructive"
              />
              <span className="text-foreground leading-snug font-medium">
                I understand that this fee adjustment will immediately take effect for all future checkout quotes and subscriber renewals across the platform.
              </span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
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
              disabled={isSubmitting || !isAmountValid || !isReasonValid || !isAcknowledged}
              className="text-xs flex items-center gap-1.5 font-bold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating Platform Fee...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Confirm Global Fee Update</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
