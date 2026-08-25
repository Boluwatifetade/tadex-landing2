"use client";

import { useState } from "react";
import {
  Radio,
  SlidersHorizontal,
  Database,
  Info,
  CheckCircle2,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SystemControlState,
  SystemControlMutationResponse,
} from "@/types/admin";
import AdminMonitoringModal from "./AdminMonitoringModal";

interface AdminMonitoringControlsCardProps {
  controls: Record<string, SystemControlState>;
  onMutationSuccess: (response: SystemControlMutationResponse) => void;
}

export default function AdminMonitoringControlsCard({
  controls,
  onMutationSuccess,
}: AdminMonitoringControlsCardProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    controlKey: "monitoring_enabled" | "monitoring_actions_kill_switch";
    targetEnable: boolean;
  }>({
    isOpen: false,
    controlKey: "monitoring_enabled",
    targetEnable: false,
  });

  const streamControl = controls["monitoring_enabled"] || {
    control_type: "monitoring_enabled",
    effective_value: true,
    source: "env_fallback",
    is_db_override: false,
    description: "Position monitoring stream master switch.",
  };

  const actionsControl = controls["monitoring_actions_kill_switch"] || {
    control_type: "monitoring_actions_kill_switch",
    effective_value: false,
    source: "env_fallback",
    is_db_override: false,
    description: "Position monitoring automated actions kill switch.",
  };

  const isStreamActive = Boolean(streamControl.effective_value);
  const isActionsBlocked = Boolean(actionsControl.effective_value); // true means kill switch engaged = actions blocked

  const handleToggleStream = () => {
    setModalState({
      isOpen: true,
      controlKey: "monitoring_enabled",
      targetEnable: !isStreamActive,
    });
  };

  const handleToggleActions = () => {
    setModalState({
      isOpen: true,
      controlKey: "monitoring_actions_kill_switch",
      targetEnable: !isActionsBlocked,
    });
  };

  const activeModalControl =
    modalState.controlKey === "monitoring_enabled" ? streamControl : actionsControl;

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Position Monitoring &amp; Automation Controls
              </h3>
              <p className="text-xs text-muted-foreground">
                Isolated control boundary for WebSocket telemetry and soft SL/TP automated executions.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-muted text-muted-foreground px-2.5 py-1 rounded-md border border-border self-start sm:self-auto">
            Spatially Isolated Controls
          </span>
        </div>

        {/* 2 Sub-Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sub-Control 1: Monitoring Stream */}
          <div className="rounded-xl border border-border/80 bg-background/50 p-4.5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">
                    WebSocket Position Streaming
                  </h4>
                </div>
                {streamControl.is_db_override ? (
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

              <p className="text-xs text-muted-foreground leading-relaxed">
                {streamControl.description ||
                  "Master switch for WebSocket price streaming and drift calculation."}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                    isStreamActive
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {isStreamActive ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                  <span>{isStreamActive ? "STREAMING ACTIVE" : "STREAMING DISABLED"}</span>
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex justify-end">
              <Button
                variant={isStreamActive ? "outline" : "default"}
                size="sm"
                onClick={handleToggleStream}
                className="text-xs font-semibold"
              >
                {isStreamActive ? "Disable Stream" : "Enable Stream"}
              </Button>
            </div>
          </div>

          {/* Sub-Control 2: Automated Actions Kill Switch */}
          <div className="rounded-xl border border-border/80 bg-background/50 p-4.5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">
                    Automated SL/TP Action Gating
                  </h4>
                </div>
                {actionsControl.is_db_override ? (
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

              <p className="text-xs text-muted-foreground leading-relaxed">
                {actionsControl.description ||
                  "Controls whether software can autonomously place market-close orders on Bybit."}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                    !isActionsBlocked
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-destructive/15 text-destructive border border-destructive/30"
                  }`}
                >
                  {!isActionsBlocked ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {!isActionsBlocked
                      ? "AUTONOMOUS CLOSES ALLOWED"
                      : "AUTOMATED ACTIONS BLOCKED"}
                  </span>
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex justify-end">
              <Button
                variant={isActionsBlocked ? "default" : "outline"}
                size="sm"
                onClick={handleToggleActions}
                className="text-xs font-semibold"
              >
                {isActionsBlocked ? "Unblock Automated Closes" : "Block Automated Closes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AdminMonitoringModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        controlKey={modalState.controlKey}
        controlState={activeModalControl}
        targetEnable={modalState.targetEnable}
        onSuccess={onMutationSuccess}
      />
    </>
  );
}
