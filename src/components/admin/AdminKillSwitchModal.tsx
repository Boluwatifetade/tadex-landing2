"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  SystemControlState,
  SystemControlMutationResponse,
  ExchangeConnectivityResponse,
} from "@/types/admin";
import { getAuthHeader } from "@/lib/auth-store";

interface AdminKillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  controlState: SystemControlState;
  targetEnable: boolean; // true to HALT, false to RESUME
  onSuccess: (response: SystemControlMutationResponse) => void;
}

export default function AdminKillSwitchModal({
  isOpen,
  onClose,
  controlState,
  targetEnable,
  onSuccess,
}: AdminKillSwitchModalProps) {
  const [step, setStep] = useState<1 | 2>(1); // For enable flow: 1 = impact review, 2 = typed confirm
  const [typedPhrase, setTypedPhrase] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Pre-flight connectivity check state for RESUME flow
  const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(false);
  const [connectivityData, setConnectivityData] =
    useState<ExchangeConnectivityResponse | null>(null);
  const [connectivityError, setConnectivityError] = useState<string | null>(null);

  const fetchConnectivity = async () => {
    setIsCheckingConnectivity(true);
    setConnectivityError(null);
    try {
      const authHeader = getAuthHeader();
      const res = await fetch("/api/v1/admin/execution/connectivity", {
        headers: {
          ...authHeader,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to reach Bybit connectivity endpoint`);
      }
      const data = await res.json();
      setConnectivityData(data);
    } catch (err: any) {
      setConnectivityError(err.message || "Failed to ping exchange endpoint");
    } finally {
      setIsCheckingConnectivity(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTypedPhrase("");
      setReason("");
      setConflictError(null);
      setGeneralError(null);

      // If resuming trading, run pre-flight live Bybit ping immediately
      if (!targetEnable) {
        fetchConnectivity();
      }
    }
  }, [isOpen, targetEnable]);

  if (!isOpen) return null;

  const isPhraseValid = typedPhrase.trim() === "HALT TRADING";
  const isReasonValid = reason.trim().length >= 3;

  const canSubmit = targetEnable
    ? step === 2 && isPhraseValid && isReasonValid && !isSubmitting
    : isReasonValid && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setConflictError(null);
    setGeneralError(null);

    const expectedUpdatedAt = controlState.db_row?.updated_at || null;

    try {
      const authHeader = getAuthHeader();
      const payload: any = {
        enable: targetEnable,
        reason: reason.trim(),
        expected_updated_at: expectedUpdatedAt,
      };

      if (targetEnable) {
        payload.confirmation_phrase = "HALT TRADING";
      }

      const res = await fetch("/api/v1/admin/execution/kill-switch", {
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
            "State conflict: The system controls state was modified by another administrator since you loaded this page. Please refresh to load the latest state before retrying."
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
      setGeneralError(err.message || "Failed to update emergency kill switch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-xl border p-6 shadow-2xl bg-card text-card-foreground ${
          targetEnable
            ? "border-destructive/80 ring-4 ring-destructive/20"
            : "border-emerald-500/80 ring-4 ring-emerald-500/20"
        }`}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              targetEnable
                ? "bg-destructive/15 text-destructive"
                : "bg-emerald-500/15 text-emerald-500"
            }`}
          >
            {targetEnable ? (
              <Flame className="h-6 w-6 animate-pulse" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight uppercase">
                {targetEnable
                  ? "EMERGENCY ACTION: HALT ALL TRADING"
                  : "RESUME TRADING PIPELINE"}
              </h3>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  targetEnable
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-emerald-500 text-white"
                }`}
              >
                Critical
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {targetEnable
                ? "Global Kill Switch Activation — Immediately stops execution across all accounts."
                : "Global Kill Switch Deactivation — Re-enables automated order executions on Bybit."}
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

        {/* ==================================================================== */}
        {/* HALT FLOW (2 STEPS) */}
        {/* ==================================================================== */}
        {targetEnable && step === 1 && (
          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-xs space-y-2.5">
              <div className="font-bold text-destructive uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Immediate Operational Consequences</span>
              </div>
              <ul className="space-y-1.5 text-foreground list-disc list-inside">
                <li>
                  <strong>Trading Pipeline:</strong> All new trade order dispatches to Bybit will be blocked immediately.
                </li>
                <li>
                  <strong>Signal Processing:</strong> Ingested provider signals will be dropped with execution rejected.
                </li>
                <li>
                  <strong>Subscriber Accounts:</strong> No new orders will open for any connected user account.
                </li>
                <li>
                  <strong>Existing Open Positions:</strong> Open positions remain open unless closed by exchange SL/TP or manual intervention.
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-muted/60 border border-border text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Current DB State:</span>
              <span className="font-mono font-bold text-foreground">
                {controlState.effective_value ? "HALTED" : "ACTIVE / NORMAL"}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setStep(2)}
                className="gap-1.5 font-bold"
              >
                <span>Proceed to Confirmation</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {targetEnable && step === 2 && (
          <div className="mt-5 space-y-4">
            {/* Exact Confirmation Phrase Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-destructive">
                Step 2: Type &quot;HALT TRADING&quot; to confirm
              </label>
              <p className="text-[11px] text-muted-foreground">
                To prevent accidental stoppage, you must type the exact uppercase phrase below.
              </p>
              <Input
                type="text"
                placeholder="HALT TRADING"
                value={typedPhrase}
                onChange={(e) => setTypedPhrase(e.target.value)}
                className={`font-mono text-sm tracking-wider font-bold ${
                  typedPhrase && !isPhraseValid
                    ? "border-destructive ring-1 ring-destructive"
                    : isPhraseValid
                    ? "border-emerald-500 ring-1 ring-emerald-500"
                    : ""
                }`}
                autoFocus
              />
              {typedPhrase && !isPhraseValid && (
                <p className="text-[11px] text-destructive font-medium">
                  Phrase does not match &quot;HALT TRADING&quot;
                </p>
              )}
            </div>

            {/* Audit Justification Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Audit Justification Rationale <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={3}
                placeholder="Explain the emergency incident (e.g. Market flash crash, critical exchange API anomaly, security breach)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs resize-none"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Minimum 3 characters required</span>
                <span className={reason.trim().length < 3 ? "text-destructive" : "text-emerald-500"}>
                  {reason.trim().length}/500
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="text-xs text-muted-foreground"
              >
                &larr; Back to Review
              </Button>
              <div className="flex items-center gap-2">
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
                  variant="destructive"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="font-bold gap-1.5 shadow-lg shadow-destructive/20"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Engaging Emergency Stop...</span>
                    </>
                  ) : (
                    <>
                      <Flame className="h-3.5 w-3.5" />
                      <span>HALT TRADING NOW</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* RESUME TRADING FLOW */}
        {/* ==================================================================== */}
        {!targetEnable && (
          <div className="mt-5 space-y-4">
            {/* Live Exchange Connectivity Pre-flight Diagnostic Box */}
            <div className="rounded-lg bg-muted/60 border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>Live Exchange Pre-flight Connectivity (Bybit)</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fetchConnectivity}
                  disabled={isCheckingConnectivity}
                  className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw
                    className={`h-3 w-3 mr-1 ${isCheckingConnectivity ? "animate-spin" : ""}`}
                  />
                  <span>Re-check Ping</span>
                </Button>
              </div>

              {isCheckingConnectivity && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Pinging Bybit public endpoint (/v5/market/time)...</span>
                </div>
              )}

              {connectivityError && (
                <div className="p-2.5 rounded bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>Connectivity Check Failed: {connectivityError}</span>
                </div>
              )}

              {connectivityData && !isCheckingConnectivity && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2 rounded bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Status
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {connectivityData.status === "online" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      )}
                      <span
                        className={`text-xs font-bold uppercase ${
                          connectivityData.status === "online"
                            ? "text-emerald-500"
                            : "text-amber-500"
                        }`}
                      >
                        {connectivityData.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Latency
                    </span>
                    <span
                      className={`text-xs font-mono font-bold mt-0.5 block ${
                        connectivityData.latency_ms < 500
                          ? "text-emerald-500"
                          : connectivityData.latency_ms < 1500
                          ? "text-amber-500"
                          : "text-destructive"
                      }`}
                    >
                      {connectivityData.latency_ms} ms
                    </span>
                  </div>

                  <div className="p-2 rounded bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Exchange
                    </span>
                    <span className="text-xs font-mono font-bold mt-0.5 block uppercase">
                      {connectivityData.exchange || "Bybit"}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Verified At
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground mt-0.5 block">
                      {new Date(connectivityData.checked_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Warning Callout */}
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs text-foreground space-y-1.5">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Resuming Trade Order Execution</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Disabling the emergency kill switch restores automated signal routing and allows subscriber trade orders to execute immediately on connected exchange accounts.
              </p>
            </div>

            {/* Audit Justification Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Audit Justification Rationale <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={3}
                placeholder="Explain the operational reason for resumption (e.g. Market stabilization verified, exchange maintenance complete, tests passed)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs resize-none"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Minimum 3 characters required</span>
                <span className={reason.trim().length < 3 ? "text-destructive" : "text-emerald-500"}>
                  {reason.trim().length}/500
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Resuming Execution...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>CONFIRM &amp; RESUME TRADING</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
