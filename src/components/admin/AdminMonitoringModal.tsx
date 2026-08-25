"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  RefreshCw,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  SystemControlState,
  SystemControlMutationResponse,
} from "@/types/admin";
import { apiClient } from "@/lib/api-client";

interface AdminMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  controlKey: "monitoring_enabled" | "monitoring_actions_kill_switch";
  controlState: SystemControlState;
  targetEnable: boolean;
  onSuccess: (response: SystemControlMutationResponse) => void;
}

export default function AdminMonitoringModal({
  isOpen,
  onClose,
  controlKey,
  controlState,
  targetEnable,
  onSuccess,
}: AdminMonitoringModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setConflictError(null);
      setGeneralError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isStreamControl = controlKey === "monitoring_enabled";
  const isReasonValid = reason.trim().length >= 3;
  const canSubmit = isReasonValid && !isSubmitting;

  const title = isStreamControl
    ? targetEnable
      ? "Enable Position Monitoring Stream"
      : "Disable Position Monitoring Stream"
    : targetEnable
    ? "Enable Automated Actions Kill Switch (Block SL/TP Closes)"
    : "Disable Automated Actions Kill Switch (Allow SL/TP Closes)";

  const impactWarning = isStreamControl
    ? targetEnable
      ? "Enables live WebSocket price and position streams for all subscriber accounts."
      : "Disables live WebSocket position tracking. Real-time drift detection and soft SL/TP calculations will pause until re-enabled."
    : targetEnable
    ? "Engages kill switch on automated actions. The software will NOT place automated market-close orders for soft SL/TP hits."
    : "Disengages kill switch on automated actions. The software is permitted to execute automated market-close orders on Bybit when soft SL/TP thresholds are triggered.";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setConflictError(null);
    setGeneralError(null);

    const expectedUpdatedAt = controlState.db_row?.updated_at || null;

    try {
      const payload = {
        control: controlKey,
        enable: targetEnable,
        reason: reason.trim(),
        expected_updated_at: expectedUpdatedAt,
      };

      const data = await apiClient<SystemControlMutationResponse>(
        "/admin/execution/monitoring",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      onSuccess(data);
      onClose();
    } catch (err: any) {
      const msg = err.message || "Failed to update monitoring control";
      if (msg.toLowerCase().includes("conflict") || msg.toLowerCase().includes("modified concurrently") || msg.includes("409")) {
        setConflictError(
          "State conflict: Monitoring control state changed since you loaded this page. Please refresh to load the latest state."
        );
      } else {
        setGeneralError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-xl border border-border p-6 shadow-xl bg-card text-card-foreground">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            {isStreamControl ? (
              <Radio className="h-5 w-5" />
            ) : (
              <SlidersHorizontal className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control: <code className="font-mono text-[11px] text-foreground">{controlKey}</code>
            </p>
          </div>
        </div>

        {/* 409 Conflict Banner */}
        {conflictError && (
          <div className="mt-4 p-3.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Optimistic Lock Conflict (409)</span>
            </div>
            <p>{conflictError}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="self-start mt-1 text-xs border-amber-500/40 hover:bg-amber-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Refresh Latest System State
            </Button>
          </div>
        )}

        {/* General Error Banner */}
        {generalError && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Impact Warning */}
        <div className="mt-4 rounded-lg bg-muted/60 border border-border p-3.5 text-xs text-foreground space-y-1.5">
          <div className="font-semibold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Operational Consequence</span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">{impactWarning}</p>
        </div>

        {/* Audit Justification Reason */}
        <div className="mt-4 space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Audit Justification Rationale <span className="text-destructive">*</span>
          </label>
          <Textarea
            rows={3}
            placeholder="Explain why this monitoring control is being toggled..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="text-xs resize-none"
            autoFocus
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Minimum 3 characters required</span>
            <span className={reason.trim().length < 3 ? "text-destructive" : "text-emerald-500"}>
              {reason.trim().length}/500
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="font-bold gap-1.5"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Applying Mutation...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Confirm Mutation</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
