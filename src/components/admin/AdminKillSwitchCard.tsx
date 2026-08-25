"use client";

import { useState } from "react";
import {
  Flame,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Database,
  Clock,
  User,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SystemControlState,
  SystemControlMutationResponse,
} from "@/types/admin";
import AdminKillSwitchModal from "./AdminKillSwitchModal";

interface AdminKillSwitchCardProps {
  controlState: SystemControlState;
  onMutationSuccess: (response: SystemControlMutationResponse) => void;
}

export default function AdminKillSwitchCard({
  controlState,
  onMutationSuccess,
}: AdminKillSwitchCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetEnable, setTargetEnable] = useState(true);

  const isHalted = Boolean(controlState.effective_value);
  const dbRow = controlState.db_row;

  const handleOpenHalt = () => {
    setTargetEnable(true);
    setModalOpen(true);
  };

  const handleOpenResume = () => {
    setTargetEnable(false);
    setModalOpen(true);
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all ${
          isHalted
            ? "border-destructive bg-destructive/10 ring-4 ring-destructive/20 shadow-xl shadow-destructive/10"
            : "border-border bg-card shadow-md"
        }`}
      >
        {/* Top Danger Strip for Emergency Halt State */}
        {isHalted && (
          <div className="bg-destructive text-destructive-foreground px-4 py-1.5 text-xs font-black tracking-wider uppercase flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              <span>EMERGENCY STOP ENGAGED — TRADING HALTED PLATFORM-WIDE</span>
            </div>
            <span className="font-mono text-[10px] bg-black/20 px-2 py-0.5 rounded">
              CRITICAL STATE
            </span>
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Side: Status, Title, Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                    isHalted
                      ? "bg-destructive text-destructive-foreground ring-4 ring-destructive/30"
                      : "bg-emerald-500/15 text-emerald-500 ring-4 ring-emerald-500/10"
                  }`}
                >
                  {isHalted ? (
                    <Flame className="h-7 w-7 animate-bounce" />
                  ) : (
                    <ShieldCheck className="h-7 w-7" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      Global Emergency Kill Switch
                    </h2>
                    {controlState.is_db_override ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary border border-primary/20">
                        <Database className="h-3 w-3" />
                        <span>DB Override</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground border border-border">
                        <Info className="h-3 w-3" />
                        <span>Default Fallback</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {controlState.description ||
                      "Master safety circuit breaker. Controls automated order execution on Bybit."}
                  </p>
                </div>
              </div>

              {/* Status Badge Callout */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide border ${
                    isHalted
                      ? "bg-destructive/20 text-destructive border-destructive/40"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isHalted
                        ? "bg-destructive animate-ping"
                        : "bg-emerald-500 animate-pulse"
                    }`}
                  />
                  <span>
                    {isHalted
                      ? "EMERGENCY HALT ACTIVE"
                      : "NORMAL OPERATIONS (TRADING ACTIVE)"}
                  </span>
                </div>

                {dbRow?.reason && (
                  <span className="text-xs text-muted-foreground italic truncate max-w-md">
                    &ldquo;{dbRow.reason}&rdquo;
                  </span>
                )}
              </div>
            </div>

            {/* Right Side: Action Trigger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:shrink-0">
              {isHalted ? (
                <Button
                  onClick={handleOpenResume}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-5 rounded-xl shadow-lg shadow-emerald-600/20 gap-2 uppercase tracking-wide"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Resume Trading Pipeline</span>
                </Button>
              ) : (
                <Button
                  onClick={handleOpenHalt}
                  variant="destructive"
                  className="font-black text-xs px-6 py-5 rounded-xl shadow-lg shadow-destructive/20 gap-2 uppercase tracking-wide border border-destructive/50"
                >
                  <Flame className="h-4 w-4" />
                  <span>Emergency Halt Trading</span>
                </Button>
              )}
            </div>
          </div>

          {/* Metadata Footer */}
          {dbRow && (
            <div className="mt-5 pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Last Modified:{" "}
                  <strong className="text-foreground">
                    {new Date(dbRow.updated_at).toLocaleString()}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Enabled By:{" "}
                  <strong className="text-foreground">
                    {dbRow.enabled_by ? String(dbRow.enabled_by).slice(0, 8) + "..." : "System"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Control Key:{" "}
                  <strong className="font-mono text-foreground">{controlState.control_type}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdminKillSwitchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        controlState={controlState}
        targetEnable={targetEnable}
        onSuccess={onMutationSuccess}
      />
    </>
  );
}
