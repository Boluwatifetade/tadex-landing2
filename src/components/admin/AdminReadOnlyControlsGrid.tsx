"use client";

import {
  Lock,
  Database,
  Info,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { SystemControlState } from "@/types/admin";

interface AdminReadOnlyControlsGridProps {
  controls: Record<string, SystemControlState>;
}

export default function AdminReadOnlyControlsGrid({
  controls,
}: AdminReadOnlyControlsGridProps) {
  // Exclude the 4 operational controls mutated in this phase
  const operationalKeys = new Set([
    "kill_switch",
    "monitoring_enabled",
    "monitoring_actions_kill_switch",
    "monitoring_cohort",
  ]);

  // Dynamically extract all other controls from the overview response
  const readOnlyControls = Object.values(controls).filter(
    (ctrl) => !operationalKeys.has(ctrl.control_type)
  );

  // Helper for human-readable title
  const formatTitle = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-muted text-muted-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                Platform Operating Parameters &amp; Beta Controls
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-border">
                <Lock className="h-2.5 w-2.5" />
                <span>Read-Only Display</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live configuration flags governed by backend system policies. Dynamically loaded from database.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-muted text-muted-foreground px-2.5 py-1 rounded-md border border-border self-start sm:self-auto">
          {readOnlyControls.length} Parameters Tracked
        </span>
      </div>

      {/* Grid of Read-Only Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readOnlyControls.map((ctrl) => {
          const effectiveVal = ctrl.effective_value;
          const isBool = typeof effectiveVal === "boolean";
          const dbRow = ctrl.db_row;
          const metadata = dbRow?.metadata || {};
          const maxVal = metadata.max;

          return (
            <div
              key={ctrl.control_type}
              className="rounded-xl border border-border/80 bg-background/50 p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Title & Source Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-foreground font-mono">
                    {ctrl.control_type}
                  </h4>
                  {ctrl.is_db_override ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary border border-primary/20 shrink-0">
                      <Database className="h-2 w-2" />
                      <span>DB Override</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground border border-border shrink-0">
                      <Info className="h-2 w-2" />
                      <span>Default</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {ctrl.description ||
                    metadata.description ||
                    dbRow?.reason ||
                    "Platform operational parameter."}
                </p>
              </div>

              {/* Value / Badge */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Effective Value
                </span>

                {isBool ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      effectiveVal
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {effectiveVal ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{effectiveVal ? "TRUE" : "FALSE"}</span>
                  </span>
                ) : (
                  <span className="font-mono font-bold text-xs text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                    {String(effectiveVal)}
                  </span>
                )}

                {maxVal !== undefined && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Limit: {maxVal}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
