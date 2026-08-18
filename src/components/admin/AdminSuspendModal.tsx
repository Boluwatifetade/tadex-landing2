"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface AdminSuspendModalProps {
  providerName: string;
  providerId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function AdminSuspendModal({
  providerName,
  providerId,
  isOpen,
  onClose,
  onConfirm,
}: AdminSuspendModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 3) {
      setErrorMsg("A justification reason (at least 3 characters) is required to suspend a provider.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onConfirm(reason.trim());
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to suspend provider");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Suspend Signal Provider
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to suspend <strong className="text-foreground">{providerName}</strong>?
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3.5 text-xs text-muted-foreground leading-relaxed">
          <strong>Operational Impact:</strong> Suspending this provider will immediately disable their automated trade broadcast engine, prevent new subscriber checkouts, and block new plan creation.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Suspension Reason (Mandatory Audit Requirement) <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="e.g. Repeated excessive leverage violations, unverified channel ownership, or subscriber complaint review."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50"
            />
            {errorMsg && (
              <p className="text-[11px] font-medium text-destructive">{errorMsg}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
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
              className="text-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Suspending...</span>
                </>
              ) : (
                <span>Confirm Suspension</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
