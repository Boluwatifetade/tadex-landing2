"use client";

import { useState } from "react";
import {
  Users,
  Percent,
  Database,
  Info,
  Server,
  UserCheck,
  UserX,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SystemControlState,
  SystemControlMutationResponse,
  ExecutionCohortResponse,
} from "@/types/admin";
import AdminCohortModal from "./AdminCohortModal";

interface AdminCohortControlCardProps {
  controlState: SystemControlState;
  cohortTelemetry?: ExecutionCohortResponse | null;
  onMutationSuccess: (response: SystemControlMutationResponse) => void;
}

export default function AdminCohortControlCard({
  controlState,
  cohortTelemetry,
  onMutationSuccess,
}: AdminCohortControlCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const cohortPercent =
    cohortTelemetry?.cohort_percent ??
    (typeof controlState.effective_value === "number"
      ? controlState.effective_value
      : 100);

  const totalUsers = cohortTelemetry?.total_users ?? 0;
  const inCohortUsers = cohortTelemetry?.users_in_cohort ?? 0;
  const excludedUsers = cohortTelemetry?.users_excluded ?? 0;
  const environments = cohortTelemetry?.enabled_environments ?? ["mainnet", "testnet"];

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Position Monitoring Rollout Cohort
                </h3>
                {controlState.is_db_override ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                    <Database className="h-2.5 w-2.5" />
                    <span>DB Override</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground border border-border">
                    <Info className="h-2.5 w-2.5" />
                    <span>Env Fallback</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Deterministic SHA-256 account hashing for staged rollout of position monitoring.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold gap-1.5 self-start sm:self-auto"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Adjust Rollout Cohort</span>
          </Button>
        </div>

        {/* Cohort Percentage Gauge Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground">Rollout Saturation:</span>
            <span className="font-mono font-bold text-foreground text-sm">
              {cohortPercent}% of accounts
            </span>
          </div>
          <div className="w-full bg-muted h-3 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                cohortPercent === 100
                  ? "bg-emerald-500"
                  : cohortPercent > 0
                  ? "bg-primary"
                  : "bg-muted-foreground"
              }`}
              style={{ width: `${cohortPercent}%` }}
            />
          </div>
        </div>

        {/* Real User Counts Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl border border-border/80 bg-background/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                In-Cohort Accounts
              </span>
              <div className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {inCohortUsers.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/80 bg-background/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Excluded Accounts
              </span>
              <div className="text-lg font-mono font-black text-muted-foreground mt-0.5">
                {excludedUsers.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted text-muted-foreground">
              <UserX className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/80 bg-background/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Total Evaluated Users
              </span>
              <div className="text-lg font-mono font-black text-foreground mt-0.5">
                {totalUsers.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Environments Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5" />
            <span>Target Environments:</span>
            <div className="flex gap-1.5 ml-1">
              {environments.map((env) => (
                <span
                  key={env}
                  className="px-2 py-0.5 rounded bg-muted text-foreground text-[10px] font-mono uppercase font-bold border border-border"
                >
                  {env}
                </span>
              ))}
            </div>
          </div>

          {controlState.db_row?.updated_at && (
            <span className="text-[11px]">
              Last updated: {new Date(controlState.db_row.updated_at).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <AdminCohortModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        controlState={controlState}
        cohortTelemetry={cohortTelemetry}
        onSuccess={onMutationSuccess}
      />
    </>
  );
}
