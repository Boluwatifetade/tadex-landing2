"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Percent,
  AlertTriangle,
  RefreshCw,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  SystemControlState,
  SystemControlMutationResponse,
  ExecutionCohortResponse,
} from "@/types/admin";
import { getAuthHeader } from "@/lib/auth-store";

interface AdminCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  controlState: SystemControlState;
  cohortTelemetry?: ExecutionCohortResponse | null;
  onSuccess: (response: SystemControlMutationResponse) => void;
}

export default function AdminCohortModal({
  isOpen,
  onClose,
  controlState,
  cohortTelemetry,
  onSuccess,
}: AdminCohortModalProps) {
  const currentPercent =
    cohortTelemetry?.cohort_percent ??
    (typeof controlState.effective_value === "number" ? controlState.effective_value : 100);

  const [targetPercent, setTargetPercent] = useState<number>(currentPercent);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTargetPercent(currentPercent);
      setReason("");
      setConflictError(null);
      setGeneralError(null);
    }
  }, [isOpen, currentPercent]);

  if (!isOpen) return null;

  const isPercentValid =
    !isNaN(targetPercent) && targetPercent >= 0 && targetPercent <= 100;
  const isReasonValid = reason.trim().length >= 3;
  const canSubmit = isPercentValid && isReasonValid && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setConflictError(null);
    setGeneralError(null);

    const expectedUpdatedAt = controlState.db_row?.updated_at || null;

    try {
      const authHeader = getAuthHeader();
      const payload = {
        percent: Number(targetPercent),
        reason: reason.trim(),
        expected_updated_at: expectedUpdatedAt,
      };

      const res = await fetch("/api/v1/admin/execution/cohort", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        const errData = await res.json().catch(() => ({}));
        setConflictError(
          errData.detail ||
            "State conflict: Cohort configuration changed since you loaded this page. Please refresh to load the latest state."
        );
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Request failed with status ${res.status}`);
      }

      const data: SystemControlMutationResponse = await res.json();
      onSuccess(data);
      onClose();
    } catch (err: any) {
      setGeneralError(err.message || "Failed to update cohort distribution");
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
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">
              Adjust Position Monitoring Rollout Cohort
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control: <code className="font-mono text-[11px] text-foreground">monitoring_cohort</code>
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

        {/* Percentage Selector */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-lg bg-muted/60 border border-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">Target Rollout Percentage</span>
              <span className="font-mono font-extrabold text-sm text-primary">
                {targetPercent}%
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={targetPercent}
              onChange={(e) => setTargetPercent(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />

            {/* Quick Increment Buttons */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {[0, 10, 25, 50, 75, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTargetPercent(preset)}
                  className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${
                    targetPercent === preset
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground border border-border hover:text-foreground"
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>

            {/* Live User Count Estimate */}
            {cohortTelemetry && cohortTelemetry.total_users > 0 && (
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Estimated in-cohort accounts:</span>
                <span className="font-mono font-bold text-foreground">
                  ~{Math.round((cohortTelemetry.total_users * targetPercent) / 100)} / {cohortTelemetry.total_users} users
                </span>
              </div>
            )}
          </div>

          {/* Audit Justification Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Audit Justification Rationale <span className="text-destructive">*</span>
            </label>
            <Textarea
              rows={3}
              placeholder="Explain the operational rationale for resizing the rollout cohort percentage..."
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
                <span>Saving Rollout...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Apply Cohort Rollout</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
