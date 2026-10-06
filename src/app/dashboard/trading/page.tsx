"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import PositionsTable from "@/components/dashboard/PositionsTable";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  LineChart,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  ExternalLink,
} from "lucide-react";

interface KeyResponse {
  id: string;
  exchange: string;
  api_key_masked: string;
  is_testnet: boolean;
  status: string;
  created_at?: string;
  last_used_at?: string;
}

type FreshnessState = "fresh" | "syncing" | "stale" | "error";

export default function TradingPage() {
  const [keys, setKeys] = useState<KeyResponse[]>([]);
  const [isKeysLoading, setIsKeysLoading] = useState(true);

  // Freshness tracking
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [freshness, setFreshness] = useState<FreshnessState>("syncing");
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Cycle tracking ref
  const syncCycleRef = useRef<{
    cycleId: number;
    keys: "pending" | "success" | "error";
    positions: "pending" | "success" | "error";
    orders: "pending" | "success" | "error";
  }>({
    cycleId: 0,
    keys: "pending",
    positions: "pending",
    orders: "pending",
  });

  const evaluateCycle = useCallback((cycleId: number) => {
    if (syncCycleRef.current.cycleId !== cycleId) return;
    const { keys, positions, orders } = syncCycleRef.current;

    // If any component failed, mark error and do not update lastSyncedAt
    if (keys === "error" || positions === "error" || orders === "error") {
      setFreshness("error");
      setIsRefreshing(false);
      return;
    }

    // Only when all 3 have successfully resolved
    if (keys === "success" && positions === "success" && orders === "success") {
      setFreshness("fresh");
      setLastSyncedAt(new Date());
      setIsRefreshing(false);
    }
  }, []);

  const startSyncCycle = useCallback((newCycleId: number) => {
    syncCycleRef.current = {
      cycleId: newCycleId,
      keys: "pending",
      positions: "pending",
      orders: "pending",
    };
    setFreshness("syncing");
  }, []);

  // Fetch exchange key health
  const fetchExchangeKeys = useCallback(async (cycleId: number) => {
    setIsKeysLoading(true);
    try {
      const data = await apiClient<KeyResponse[]>("/keys");
      setKeys(Array.isArray(data) ? data : []);
      if (syncCycleRef.current.cycleId === cycleId) {
        syncCycleRef.current.keys = "success";
        evaluateCycle(cycleId);
      }
    } catch {
      if (syncCycleRef.current.cycleId === cycleId) {
        syncCycleRef.current.keys = "error";
        evaluateCycle(cycleId);
      }
    } finally {
      setIsKeysLoading(false);
    }
  }, [evaluateCycle]);

  const handlePositionsSuccess = useCallback(() => {
    const cycleId = syncCycleRef.current.cycleId;
    syncCycleRef.current.positions = "success";
    evaluateCycle(cycleId);
  }, [evaluateCycle]);

  const handlePositionsError = useCallback(() => {
    const cycleId = syncCycleRef.current.cycleId;
    syncCycleRef.current.positions = "error";
    evaluateCycle(cycleId);
  }, [evaluateCycle]);

  const handleOrdersSuccess = useCallback(() => {
    const cycleId = syncCycleRef.current.cycleId;
    syncCycleRef.current.orders = "success";
    evaluateCycle(cycleId);
  }, [evaluateCycle]);

  const handleOrdersError = useCallback(() => {
    const cycleId = syncCycleRef.current.cycleId;
    syncCycleRef.current.orders = "error";
    evaluateCycle(cycleId);
  }, [evaluateCycle]);

  const triggerManualSync = useCallback(() => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => {
      const next = prev + 1;
      startSyncCycle(next);
      fetchExchangeKeys(next);
      return next;
    });
  }, [startSyncCycle, fetchExchangeKeys]);

  useEffect(() => {
    startSyncCycle(0);
    fetchExchangeKeys(0);
  }, [startSyncCycle, fetchExchangeKeys]);

  // Tab-aware polling: Poll every 15s only when tab is active/visible
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (pollInterval) clearInterval(pollInterval);
      pollInterval = setInterval(() => {
        if (typeof document !== "undefined" && document.visibilityState === "visible") {
          setRefreshTrigger((prev) => {
            const next = prev + 1;
            startSyncCycle(next);
            fetchExchangeKeys(next);
            return next;
          });
        }
      }, 15000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        triggerManualSync();
        startPolling();
      } else if (pollInterval) {
        clearInterval(pollInterval);
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startSyncCycle, fetchExchangeKeys, triggerManualSync]);

  // Seconds ago timer calculation
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastSyncedAt) {
        const diff = Math.floor((Date.now() - lastSyncedAt.getTime()) / 1000);
        setSecondsAgo(diff);
        if (diff > 30 && freshness === "fresh") {
          setFreshness("stale");
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastSyncedAt, freshness]);

  const activeKey = keys.find((k) => k.status === "active") || (keys.length > 0 ? keys[0] : null);

  return (
    <div className="space-y-8">
      {/* Header with Title and Freshness Indicator */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LineChart className="h-6 w-6 text-primary" />
            Live Trading & Execution
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time execution monitoring for connected exchange accounts.
          </p>
        </div>

        {/* Freshness Badge and Refresh Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs shadow-xs">
            {freshness === "fresh" && (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-500 font-medium">
                  {secondsAgo <= 2 ? "Synced just now" : `Synced ${secondsAgo}s ago`}
                </span>
              </>
            )}
            {freshness === "syncing" && (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-amber-500 font-medium">Syncing with Bybit...</span>
              </>
            )}
            {freshness === "stale" && (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-amber-500 font-medium">{`Stale (${secondsAgo}s ago)`}</span>
              </>
            )}
            {freshness === "error" && (
              <>
                <span className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-destructive font-medium">Sync Error</span>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={triggerManualSync}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Now</span>
          </Button>
        </div>
      </div>

      {/* Exchange Connection Status Banner */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                activeKey ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
              }`}>
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    {activeKey
                      ? `${activeKey.exchange.toUpperCase()} Connection Active`
                      : "No Exchange Connected"}
                  </h2>
                  {activeKey && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
                      Trade-Only
                    </span>
                  )}
                  {activeKey?.is_testnet && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
                      Testnet
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activeKey
                    ? `Encrypted API key: ${activeKey.api_key_masked} · Withdrawals disabled by policy.`
                    : "Connect your Bybit trade-only API key to enable live signal execution."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {activeKey ? (
                <Link href="/dashboard/keys">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" />
                    Manage Key
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard/keys">
                  <Button variant="default" size="sm" className="text-xs gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" />
                    Connect Bybit Key
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Positions Table */}
      <PositionsTable
        key={`positions-${refreshTrigger}`}
        onSyncSuccess={handlePositionsSuccess}
        onSyncError={handlePositionsError}
      />

      {/* Open Orders Table */}
      <OrdersTable
        key={`orders-${refreshTrigger}`}
        onSyncSuccess={handleOrdersSuccess}
        onSyncError={handleOrdersError}
      />
    </div>
  );
}
