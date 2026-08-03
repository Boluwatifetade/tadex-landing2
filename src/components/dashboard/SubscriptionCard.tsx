"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, ShieldCheck, ShieldAlert, AlertTriangle, Info, Calendar } from "lucide-react";

export interface SubscriptionOut {
  id: string;
  user_id: string;
  provider_id?: string | null;
  plan_id?: string | null;
  tier?: string | null;
  status: string;
  is_active: boolean;
  current_period_start?: string | null;
  current_period_end?: string | null;
  expires_at?: string | null;
  canceled_at?: string | null;
  created_at?: string | null;
}

export interface UserSubscriptionResponse {
  has_active_subscription: boolean;
  subscription?: SubscriptionOut | null;
  notifications: string[];
}

export default function SubscriptionCard() {
  const [subscriptionData, setSubscriptionData] = useState<UserSubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await apiClient<UserSubscriptionResponse>("/billing/subscription");
      setSubscriptionData(data || { has_active_subscription: false, subscription: null, notifications: [] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load subscription status";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const hasActive = Boolean(subscriptionData?.has_active_subscription && subscriptionData?.subscription?.is_active);
  const sub = subscriptionData?.subscription;
  const notifications = subscriptionData?.notifications || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasActive ? (
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-500" />
            )}
            <div>
              <CardTitle className="text-base font-semibold">Current Subscription</CardTitle>
              <CardDescription>Automated trade signal execution plan status.</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubscription}
            disabled={isLoading}
            title="Refresh subscription"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Checking subscription status...</p>
          </div>
        ) : fetchError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
            <span>{fetchError}</span>
            <Button variant="outline" size="sm" onClick={fetchSubscription}>Retry</Button>
          </div>
        ) : !hasActive ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">No active subscription</h3>
              <p className="text-xs text-muted-foreground mt-1">
                You are currently on the Free / Demo tier. Subscribe to a plan below to activate automated signal execution on Bybit.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Subscription Details Grid */}
            <div className="rounded-xl border border-border bg-card/60 p-4 grid gap-4 sm:grid-cols-3">
              <div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tier / Plan</span>
                <p className="text-base font-bold text-foreground capitalize mt-0.5">{sub?.tier || "Standard"}</p>
              </div>

              <div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    sub?.status === "active" || sub?.status === "trialing"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : sub?.status === "past_due"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {sub?.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Renewal / Expiry</span>
                <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(sub?.current_period_end || sub?.expires_at)}
                </p>
              </div>
            </div>

            {/* Notifications Banner if present */}
            {notifications.length > 0 && (
              <div className="space-y-2">
                {notifications.map((note, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-500 flex items-start gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
