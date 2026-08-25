"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminExecutionNav from "@/components/admin/AdminExecutionNav";
import AdminKillSwitchCard from "@/components/admin/AdminKillSwitchCard";
import AdminMonitoringControlsCard from "@/components/admin/AdminMonitoringControlsCard";
import AdminCohortControlCard from "@/components/admin/AdminCohortControlCard";
import AdminReadOnlyControlsGrid from "@/components/admin/AdminReadOnlyControlsGrid";
import AdminExecutionAuditFeed from "@/components/admin/AdminExecutionAuditFeed";
import {
  ExecutionOverviewResponse,
  ExecutionCohortResponse,
  SystemControlMutationResponse,
} from "@/types/admin";
import { apiClient } from "@/lib/api-client";

export default function AdminExecutionPage() {
  const [overview, setOverview] = useState<ExecutionOverviewResponse | null>(null);
  const [cohort, setCohort] = useState<ExecutionCohortResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "info";
    title: string;
    message: string;
    connectivity?: any;
  } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchState = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [overviewData, cohortData] = await Promise.all([
        apiClient<ExecutionOverviewResponse>("/admin/execution/overview"),
        apiClient<ExecutionCohortResponse>("/admin/execution/cohort").catch(() => null),
      ]);

      setOverview(overviewData);
      if (cohortData) {
        setCohort(cohortData);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load execution system controls");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, [refreshTrigger]);

  const handleMutationSuccess = (response: SystemControlMutationResponse) => {
    setNotification({
      type: "success",
      title: "System Control Updated Successfully",
      message: response.message || "The requested system control mutation was applied.",
      connectivity: response.exchange_connectivity,
    });
    setRefreshTrigger((prev) => prev + 1);
  };

  const killSwitchControl = overview?.controls["kill_switch"] || {
    control_type: "kill_switch",
    effective_value: false,
    source: "default_fallback",
    is_db_override: false,
    description:
      "Global emergency stop. When enabled, halts all new trade executions platform-wide.",
  };

  const cohortControl = overview?.controls["monitoring_cohort"] || {
    control_type: "monitoring_cohort",
    effective_value: cohort?.cohort_percent ?? 100,
    source: "env_fallback",
    is_db_override: false,
    description: "Position monitoring user rollout percentage (0-100%).",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Execution &amp; System Controls
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
              Phase Admin-4b
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Master safety circuit breakers, WebSocket streaming controls, rollout cohorts, and operational governance.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
          disabled={isLoading}
          className="text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Controls</span>
        </Button>
      </div>

      {/* Sub Navigation */}
      <AdminExecutionNav />

      {/* Success Notification Banner */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-foreground space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{notification.title}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              &times;
            </button>
          </div>
          <p className="text-muted-foreground text-[11px]">{notification.message}</p>

          {/* If connectivity was returned in mutation response */}
          {notification.connectivity && (
            <div className="p-2.5 rounded-lg bg-background/80 border border-emerald-500/20 flex items-center gap-3 text-[11px]">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                Bybit Exchange Status:{" "}
                <strong className="text-emerald-500 uppercase">
                  {notification.connectivity.status}
                </strong>{" "}
                (Ping Latency:{" "}
                <strong className="font-mono">{notification.connectivity.latency_ms} ms</strong>)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Error */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchState} className="h-7 text-xs">
            Retry
          </Button>
        </div>
      )}

      {isLoading && !overview ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span>Loading system controls and operational boundaries...</span>
        </div>
      ) : overview ? (
        <div className="space-y-6">
          {/* 1. Global Kill Switch (Highest Consequence) */}
          <AdminKillSwitchCard
            controlState={killSwitchControl}
            onMutationSuccess={handleMutationSuccess}
          />

          {/* 2. Spatially Separated Monitoring Controls */}
          <AdminMonitoringControlsCard
            controls={overview.controls}
            onMutationSuccess={handleMutationSuccess}
          />

          {/* 3. Cohort Rollout Control */}
          <AdminCohortControlCard
            controlState={cohortControl}
            cohortTelemetry={cohort}
            onMutationSuccess={handleMutationSuccess}
          />

          {/* 4. Read-Only Controls Matrix */}
          <AdminReadOnlyControlsGrid controls={overview.controls} />

          {/* 5. Front-and-Center Execution Audit Feed */}
          <AdminExecutionAuditFeed refreshTrigger={refreshTrigger} />
        </div>
      ) : null}
    </div>
  );
}
