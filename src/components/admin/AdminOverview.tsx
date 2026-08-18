"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { AdminOverviewResponse } from "@/types/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Radio,
  KeyRound,
  CreditCard,
  Zap,
  Activity,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  Loader2,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminOverview() {
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await apiClient<AdminOverviewResponse>("/admin/overview");
      setOverview(data);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : "Failed to load admin overview metrics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading system metrics and platform overview...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive space-y-3 max-w-2xl mx-auto my-8">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="h-5 w-5" />
          <span>Failed to load platform overview</span>
        </div>
        <p className="text-xs text-muted-foreground">{fetchError}</p>
        <Button variant="outline" size="sm" onClick={fetchOverview} className="text-xs">
          Try Again
        </Button>
      </div>
    );
  }

  if (!overview) return null;

  const pendingAppsCount = overview.providers?.pending_applications || 0;
  const pendingVerifsCount = overview.providers?.pending_verifications || 0;
  const suspendedProvidersCount = overview.providers?.suspended || 0;
  const isKillSwitchActive = overview.system_state?.kill_switch_enabled;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time aggregate platform metrics, operational health, and provider governance queues.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOverview}
          disabled={isLoading}
          className="text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Kill Switch Global Banner if Active */}
      {isKillSwitchActive && (
        <div
          role="alert"
          className="rounded-xl border border-destructive bg-destructive/15 p-4 text-destructive space-y-1 shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <span>GLOBAL KILL SWITCH ENGAGED</span>
          </div>
          <p className="text-xs text-muted-foreground pl-7">
            All signal broadcast dispatching and automated trade execution workflows are currently halted across all connected exchanges.
          </p>
        </div>
      )}

      {/* "Needs Attention" Queue Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Needs Attention
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Pending Applications */}
          <Link
            href="/admin/providers/applications"
            className="group rounded-xl border border-border bg-card p-5 space-y-3 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <FileCheck className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">Pending Applications</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  pendingAppsCount > 0
                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {pendingAppsCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Provider registration requests awaiting administrative review and approval.
            </p>
            <div className="flex items-center text-xs font-semibold text-primary group-hover:underline pt-1">
              <span>Review Queue</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 2. Pending Verifications */}
          <Link
            href="/admin/providers/verification-queue"
            className="group rounded-xl border border-border bg-card p-5 space-y-3 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">Verification Dossiers</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  pendingVerifsCount > 0
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {pendingVerifsCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Track record evidence dossiers submitted for verified provider tier badge upgrades.
            </p>
            <div className="flex items-center text-xs font-semibold text-primary group-hover:underline pt-1">
              <span>Inspect Dossiers</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 3. Suspended Providers */}
          <Link
            href="/admin/providers?status=suspended"
            className="group rounded-xl border border-border bg-card p-5 space-y-3 transition-all hover:border-destructive/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">Suspended Providers</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  suspendedProvidersCount > 0
                    ? "bg-destructive/20 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {suspendedProvidersCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Signal provider profiles currently suspended from plan creation and trade dispatch.
            </p>
            <div className="flex items-center text-xs font-semibold text-primary group-hover:underline pt-1">
              <span>Manage Directory</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Platform KPIs & Resource Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Users */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Registered Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {(overview.users?.total || 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent className="pt-2 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Active</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {overview.users?.active || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Suspended</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {overview.users?.suspended || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Banned</span>
                  <span className="font-semibold text-destructive">
                    {overview.users?.banned || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Signal Providers */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Signal Providers</CardTitle>
                <Radio className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {(overview.providers?.total || 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent className="pt-2 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Active</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {overview.providers?.active || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Verified</span>
                  <span className="font-semibold text-primary">
                    {overview.providers?.verified || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Suspended</span>
                  <span className="font-semibold text-destructive">
                    {overview.providers?.suspended || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Exchange Connections */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Connected Exchanges</CardTitle>
                <KeyRound className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {(overview.exchange_accounts?.total || 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent className="pt-2 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Bybit Active</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {overview.exchange_accounts?.active || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Total Keys</span>
                  <span className="font-semibold text-foreground">
                    {overview.exchange_accounts?.bybit || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Revoked</span>
                  <span className="font-semibold text-muted-foreground">
                    {overview.exchange_accounts?.revoked || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Subscriptions */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Active Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {(overview.subscriptions?.active || 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent className="pt-2 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Total Ever</span>
                  <span className="font-semibold text-foreground">
                    {overview.subscriptions?.total || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Trialing</span>
                  <span className="font-semibold text-primary">
                    {overview.subscriptions?.trialing || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Cancelled</span>
                  <span className="font-semibold text-muted-foreground">
                    {overview.subscriptions?.cancelled || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Payment Volume */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Completed Payments</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {(overview.payments?.completed || 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent className="pt-2 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Pending</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {overview.payments?.pending || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Failed</span>
                  <span className="font-semibold text-destructive">
                    {overview.payments?.failed || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Total Tx</span>
                  <span className="font-semibold text-foreground">
                    {overview.payments?.total || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 6: Execution Engine & Health */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Execution Engine (24h)</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-foreground">
                  {overview.system_state?.success_rate_24h !== undefined
                    ? `${overview.system_state.success_rate_24h}%`
                    : "100%"}
                </p>
                <span className="text-[10px] text-muted-foreground">success rate</span>
              </div>
            </CardHeader>
            <CardContent className="pt-2 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Trades 24h</span>
                  <span className="font-semibold text-foreground">
                    {overview.system_state?.trades_24h || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Queue Tasks</span>
                  <span className="font-semibold text-foreground">
                    {overview.system_state?.pending_tasks || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Kill Switch</span>
                  <span
                    className={`font-semibold ${
                      isKillSwitchActive ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {isKillSwitchActive ? "ACTIVE" : "NORMAL"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
