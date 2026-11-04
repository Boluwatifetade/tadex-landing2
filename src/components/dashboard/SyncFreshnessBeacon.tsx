"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

export type FreshnessState =
  | "fresh"
  | "syncing"
  | "stale"
  | "degraded"
  | "disconnected"
  | "error";

export interface SyncFreshnessBeaconProps {
  state?: FreshnessState;
  label?: string;
  lastUpdatedAt?: Date | string | number | null;
  onSync?: () => void;
  className?: string;
}

const defaultLabels: Record<FreshnessState, string> = {
  fresh: "Mainnet Connected",
  syncing: "Syncing...",
  stale: "Stale (>60s)",
  degraded: "Cached Snapshot",
  disconnected: "Not Connected",
  error: "Sync Error",
};

export default function SyncFreshnessBeacon({
  state = "fresh",
  label,
  onSync,
  className,
}: SyncFreshnessBeaconProps) {
  const displayLabel = label ?? defaultLabels[state];

  return (
    <div
      data-testid="sync-freshness-beacon"
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <StatusBadge
        variant={state}
        pulse={state === "syncing"}
        data-testid="sync-freshness-status"
      >
        {displayLabel}
      </StatusBadge>
      {onSync && (
        <button
          type="button"
          onClick={onSync}
          disabled={state === "syncing"}
          aria-label="Synchronize exchange state"
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-surface-elevated bg-surface-subtle text-content-secondary hover:bg-surface-secondary hover:text-content-primary active:scale-[0.98] transition-[background-color,color,transform] duration-150 ease-weighted disabled:opacity-50"
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5",
              state === "syncing" && "animate-spin text-brand-accent"
            )}
          />
        </button>
      )}
    </div>
  );
}
