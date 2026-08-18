"use client";

import { useState } from "react";
import { AdminProviderDetailOut } from "@/types/admin";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ShieldAlert,
  Radio,
  Users,
  TrendingUp,
  Mail,
  Calendar,
  AlertTriangle,
  Send,
  X,
  Lock,
  Unlock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import AdminSuspendModal from "./AdminSuspendModal";

interface AdminProviderDetailModalProps {
  provider: AdminProviderDetailOut;
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (providerId: string, reason: string) => Promise<void>;
  onUnsuspend: (providerId: string) => Promise<void>;
}

export default function AdminProviderDetailModal({
  provider,
  isOpen,
  onClose,
  onSuspend,
  onUnsuspend,
}: AdminProviderDetailModalProps) {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendConfirm, setShowUnsuspendConfirm] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSuspended = provider.status === "suspended";
  const isVerified = Boolean(provider.is_verified);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleUnsuspendAction = async () => {
    setIsMutating(true);
    setMutationError(null);
    try {
      await onUnsuspend(provider.id);
      setShowUnsuspendConfirm(false);
      onClose();
    } catch (err: unknown) {
      setMutationError(err instanceof Error ? err.message : "Failed to unsuspend provider");
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs overflow-y-auto animate-in fade-in-0 duration-150"
      >
        <div className="my-8 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-xs">
                {provider.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{provider.name}</h3>
                <p className="text-[11px] font-mono text-muted-foreground">{provider.id}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {mutationError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{mutationError}</span>
              </div>
            )}

            {/* Suspended Alert Banner if currently suspended */}
            {isSuspended && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 space-y-2 text-destructive">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Provider Currently Suspended</span>
                </div>
                {provider.suspension_reason && (
                  <p className="text-xs text-foreground font-medium pl-6">
                    <strong>Reason:</strong> {provider.suspension_reason}
                  </p>
                )}
                {provider.suspended_at && (
                  <p className="text-[11px] text-muted-foreground pl-6 border-t border-destructive/20 pt-1">
                    Suspended on: {formatDate(provider.suspended_at)}
                  </p>
                )}
              </div>
            )}

            {/* Status & Verification Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  provider.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : provider.status === "suspended"
                    ? "bg-destructive/10 text-destructive border border-destructive/20"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                Status: {provider.status}
              </span>

              {isVerified ? (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified ({provider.verification_level || "basic"})</span>
                </span>
              ) : (
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground border border-border">
                  Tier: {provider.verification_level || "Unverified"}
                </span>
              )}
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Subscribers</span>
                <span className="text-lg font-bold text-foreground">
                  {provider.subscriber_count.toLocaleString()}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Signals Sent</span>
                <span className="text-lg font-bold text-foreground">
                  {provider.total_signals_sent.toLocaleString()}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Win Rate</span>
                <span className="text-lg font-bold text-foreground">
                  {provider.win_rate !== null && provider.win_rate !== undefined
                    ? `${provider.win_rate}%`
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Admin Detail Fields */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Owner Account Email:</span>
                <span className="font-semibold text-foreground">{provider.user_email || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Owner User ID:</span>
                <span className="font-mono text-foreground">{provider.user_id || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Telegram Channel ID:</span>
                <span className="font-mono text-foreground">{provider.telegram_channel_id || "None linked"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Telegram Username:</span>
                <span className="text-foreground">{provider.telegram_username || "None"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Created / Onboarded:</span>
                <span className="text-foreground">{formatDate(provider.created_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Verification Approved At:</span>
                <span className="text-foreground">{formatDate(provider.verification_approved_at)}</span>
              </div>
            </div>

            {provider.description && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-foreground">Provider Bio & Methodology:</span>
                <p className="rounded-lg border border-border bg-card p-3 text-muted-foreground leading-relaxed">
                  {provider.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>

            <div className="flex items-center gap-2">
              {isSuspended ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowUnsuspendConfirm(true)}
                  disabled={isMutating}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  <span>Unsuspend Provider</span>
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowSuspendModal(true)}
                  disabled={isMutating}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Suspend Provider</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suspend Reason Dialog */}
      <AdminSuspendModal
        providerName={provider.name}
        providerId={provider.id}
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={async (reason) => {
          await onSuspend(provider.id, reason);
          setShowSuspendModal(false);
          onClose();
        }}
      />

      {/* Unsuspend Single Confirmation Dialog */}
      {showUnsuspendConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Unlock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Unsuspend Provider</h3>
                <p className="text-xs text-muted-foreground">
                  Restore <strong className="text-foreground">{provider.name}</strong> to active operational status?
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              This will restore the provider&apos;s signal broadcast permissions and allow them to manage subscription tiers.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUnsuspendConfirm(false)}
                disabled={isMutating}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUnsuspendAction}
                disabled={isMutating}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
              >
                {isMutating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Unsuspending...</span>
                  </>
                ) : (
                  <span>Confirm Unsuspend</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
