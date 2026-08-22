"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { ShieldCheck, Loader2 } from "lucide-react";

interface AdminUnbanUserModalProps {
  userId: string;
  userEmail?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminUnbanUserModal({
  userId,
  userEmail,
  onSuccess,
  onCancel,
}: AdminUnbanUserModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUnban = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await apiClient(`/admin/users/${userId}/unban`, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim() || undefined }),
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to unban user.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unban-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
    >
      <div className="w-full max-w-md rounded-xl border border-emerald-500/30 bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 id="unban-modal-title" className="text-base font-bold text-foreground">
              Unban User Account
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target: <span className="font-mono text-foreground font-semibold">{userEmail || userId}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Restores this user account status to <strong>active</strong>. The user will regain normal login access and platform features.
        </p>

        {errorMsg && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="unban-reason" className="text-xs font-semibold text-foreground">
            Optional Note / Reason
          </label>
          <input
            id="unban-reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Administrative note (optional)..."
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
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
            type="button"
            size="sm"
            onClick={handleUnban}
            disabled={isSubmitting}
            className="text-xs flex items-center gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Restoring...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Confirm Unban</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
