"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  ShieldCheck,
  Clock,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminExecutionNav from "@/components/admin/AdminExecutionNav";
import { ExecutionReconciliationResponse } from "@/types/admin";
import { getAuthHeader } from "@/lib/auth-store";

export default function AdminExecutionReconciliationPage() {
  const [reconciliation, setReconciliation] =
    useState<ExecutionReconciliationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReconciliation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authHeader = getAuthHeader();
      const res = await fetch("/api/v1/admin/execution/reconciliation", {
        headers: { ...authHeader },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load reconciliation status`);
      }
      const data: ExecutionReconciliationResponse = await res.json();
      setReconciliation(data);
    } catch (err: any) {
      setError(err.message || "Failed to load position reconciliation");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReconciliation();
  }, []);

  const isClean = reconciliation?.drift_status === "CLEAN" && reconciliation?.is_consistent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Position Reconciliation &amp; Invariant Telemetry
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
              Admin-4a Telemetry
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time audit comparing local database position tracking against active monitors and autonomous corrective actions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchReconciliation}
          disabled={isLoading}
          className="text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Audit</span>
        </Button>
      </div>

      <AdminExecutionNav />

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchReconciliation} className="h-7 text-xs">
            Retry
          </Button>
        </div>
      )}

      {isLoading && !reconciliation ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span>Auditing position invariants and drift state...</span>
        </div>
      ) : reconciliation ? (
        <div className="space-y-6">
          {/* Consistency & Drift Status Banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isClean
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isClean ? "bg-emerald-500/20" : "bg-amber-500/20"
                }`}
              >
                {isClean ? (
                  <CheckCircle2 className="h-7 w-7" />
                ) : (
                  <AlertTriangle className="h-7 w-7" />
                )}
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-wide">
                  {isClean ? "POSITION RECONCILIATION CLEAN" : "DRIFT DETECTED IN POSITIONS"}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  {isClean
                    ? "Local position monitors and active positions are 100% aligned with zero invariant violations."
                    : "Position drift detected. Automated reconciliation tasks or manual position sync required."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs font-bold uppercase px-3 py-1.5 rounded-lg bg-background border border-border">
              <span>Drift Status:</span>
              <span className={isClean ? "text-emerald-500" : "text-amber-500"}>
                {reconciliation.drift_status}
              </span>
            </div>
          </div>

          {/* Counts & Invariant Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                Active Position Monitors
              </span>
              <div className="text-2xl font-mono font-black text-foreground mt-1">
                {reconciliation.active_monitors_count}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                Open Positions in DB
              </span>
              <div className="text-2xl font-mono font-black text-foreground mt-1">
                {reconciliation.open_positions_count}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                Consistency Verdict
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {reconciliation.is_consistent ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <span className="text-sm font-bold text-foreground">
                  {reconciliation.is_consistent ? "Consistent" : "Discrepancy"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                Corrective Actions Recorded
              </span>
              <div className="text-2xl font-mono font-black text-primary mt-1">
                {reconciliation.recent_corrective_actions.length}
              </div>
            </div>
          </div>

          {/* Corrective Actions Log Table */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
              <ListChecks className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">
                Autonomous Corrective Actions History
              </h3>
            </div>

            {reconciliation.recent_corrective_actions.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <p>No corrective reconciliation actions needed or logged.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {reconciliation.recent_corrective_actions.map((act, i) => (
                  <div key={act.id || i} className="py-3 first:pt-0 last:pb-0 space-y-1 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">
                          {act.action_type || "Reconciliation Check"}
                        </span>
                        {act.target_entity_type && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {act.target_entity_type}
                          </span>
                        )}
                      </div>
                      {act.created_at && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {new Date(act.created_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {act.reason && (
                      <p className="text-muted-foreground italic">&ldquo;{act.reason}&rdquo;</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
