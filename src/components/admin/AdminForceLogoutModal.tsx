"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { LogOut, AlertTriangle, Loader2, Shield } from "lucide-react";

interface AdminForceLogoutModalProps {
  userId: string;
  userEmail?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminForceLogoutModal({
  userId,
  userEmail,
  onSuccess,
  onCancel,
}: AdminForceLogoutModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 3) {
      setErrorMsg("A justification reason (minimum 3 characters) is required for administrative session revocation.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await apiClient(`/admin/users/${userId}/logout-all`, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to revoke user sessions.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="force-logout-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
    >
      <div className="w-full max-w-md rounded-xl border border-amber-500/30 bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <LogOut className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 id="force-logout-title" className="text-base font-bold text-foreground">
                Administrative Force Logout-All
              </h3>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                Admin Action
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target: <span className="font-mono text-foreground font-semibold">{userEmail || userId}</span>
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            This is an <strong>administrative revocation</strong> that forcefully invalidates all active refresh tokens and sessions for this user across all web and mobile browsers.
          </span>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="logout-reason" className="text-xs font-semibold text-foreground">
              Administrative Justification <span className="text-destructive">*</span>
            </label>
            <textarea
              id="logout-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for administrative session termination (e.g. Credential compromise report, security audit)..."
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Minimum 3 characters required. Stored in administrative audit trail.
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
                  <span>Revoking Sessions...</span>
                </>
              ) : (
                <>
                  <Shield className="h-3.5 w-3.5" />
                  <span>Force Logout All Devices</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
