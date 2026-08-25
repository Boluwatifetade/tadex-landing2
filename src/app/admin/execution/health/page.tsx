"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Radio,
  Send,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminExecutionNav from "@/components/admin/AdminExecutionNav";
import { ExecutionHealthResponse } from "@/types/admin";
import { apiClient } from "@/lib/api-client";

export default function AdminExecutionHealthPage() {
  const [windowHours, setWindowHours] = useState<number>(24);
  const [health, setHealth] = useState<ExecutionHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<ExecutionHealthResponse>(
        `/admin/execution/health?window_hours=${windowHours}`
      );
      setHealth(data);
    } catch (err: any) {
      setError(err.message || "Failed to load execution health metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, [windowHours]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Pipeline Health &amp; Telemetry
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
              Admin-4a Telemetry
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            24h real-time operational telemetry across signal ingest, dispatch queue, and order execution.
          </p>
        </div>

        {/* Window Selector & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center rounded-lg border border-border bg-background p-1 text-xs">
            {[6, 24, 72, 168].map((h) => (
              <button
                key={h}
                onClick={() => setWindowHours(h)}
                className={`px-2.5 py-1 rounded font-bold text-xs transition-colors ${
                  windowHours === h
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {h === 168 ? "7d" : `${h}h`}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchHealth}
            disabled={isLoading}
            className="text-xs h-8 px-2.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <AdminExecutionNav />

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchHealth} className="h-7 text-xs">
            Retry
          </Button>
        </div>
      )}

      {isLoading && !health ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span>Calculating pipeline telemetry rates...</span>
        </div>
      ) : health ? (
        <div className="space-y-6">
          {/* Overall Health Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              health.overall_healthy
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  health.overall_healthy ? "bg-emerald-500/20" : "bg-amber-500/20"
                }`}
              >
                {health.overall_healthy ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide">
                  {health.overall_healthy
                    ? "EXECUTION PIPELINE OPERATIONAL & HEALTHY"
                    : "EXECUTION PIPELINE LATENCY OR ERROR ELEVATED"}
                </h3>
                <p className="text-xs opacity-90">
                  Analysis window: {health.window_hours} hours. Latencies and success metrics are within acceptable thresholds.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Pipeline Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Stage 1: Signaling Ingest */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Radio className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">1. Signal Ingestion</h4>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-500">
                  {health.signaling.parsing_success_rate}%
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Ingested:</span>
                  <span className="font-mono font-bold text-foreground">
                    {health.signaling.total_signals}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dispatched:</span>
                  <span className="font-mono font-bold text-emerald-500">
                    {health.signaling.dispatched_signals}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Failed Signals:</span>
                  <span className="font-mono font-bold text-destructive">
                    {health.signaling.failed_signals}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-muted-foreground">Avg Ingest Latency:</span>
                  <span className="font-mono font-bold text-foreground">
                    {health.signaling.avg_ingest_latency_seconds.toFixed(2)}s
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 2: Dispatch Queue */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Send className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">2. Dispatch Queue</h4>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-500">
                  {health.dispatch.dispatch_success_rate}%
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Dispatches:</span>
                  <span className="font-mono font-bold text-foreground">
                    {health.dispatch.total_dispatches}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-mono font-bold text-emerald-500">
                    {health.dispatch.completed_dispatches}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Failed Dispatches:</span>
                  <span className="font-mono font-bold text-destructive">
                    {health.dispatch.failed_dispatches}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-muted-foreground">Avg Dispatch Latency:</span>
                  <span className="font-mono font-bold text-foreground">
                    {health.dispatch.avg_dispatch_latency_seconds.toFixed(2)}s
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 3: Exchange Order Placement */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">3. Bybit Ordering</h4>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-500">
                  {health.ordering.ordering_success_rate}%
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Orders Placed:</span>
                  <span className="font-mono font-bold text-foreground">
                    {health.ordering.total_orders}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Filled / Active:</span>
                  <span className="font-mono font-bold text-emerald-500">
                    {health.ordering.filled_orders}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Failed / Rejected:</span>
                  <span className="font-mono font-bold text-destructive">
                    {health.ordering.failed_orders}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span className="font-mono font-bold text-emerald-500">
                    {health.ordering.ordering_success_rate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
