"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, RefreshCw, BadgeCheck, Users, Signal, TrendingUp, Clock, ChevronRight } from "lucide-react";

export interface ProviderOut {
  id: string;
  name: string;
  description?: string | null;
  is_verified: boolean;
  win_rate?: number | null;
  total_signals_sent?: number;
  subscriber_count?: number;
  last_active_at?: string | null;
}

export default function ProviderDirectory() {
  const [providers, setProviders] = useState<ProviderOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiClient<ProviderOut[]>("/providers");
      setProviders(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load signal providers";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Recently";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Signal Provider Directory</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Browse verified traders, view historical win rates, and select execution plans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProviders}
            disabled={isLoading}
            title="Refresh providers"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="ml-1.5 hidden sm:inline">Refresh</span>
          </Button>
          <Link href="/dashboard/billing">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              Browse All Plans →
            </Button>
          </Link>
        </div>
      </div>

      {/* Directory Content States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading verified signal providers...</p>
        </div>
      ) : errorMsg ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3">
          <p className="text-sm text-destructive font-medium">{errorMsg}</p>
          <Button variant="outline" size="sm" onClick={fetchProviders}>
            Try Again
          </Button>
        </div>
      ) : providers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">No signal providers found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No active signal providers are currently available in the directory. Please check back soon or browse flat execution plans.
          </p>
          <Link href="/dashboard/billing" className="inline-block mt-2">
            <Button variant="outline" size="sm">
              Browse Flat Execution Plans
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => {
            const winRateFormatted = p.win_rate != null ? `${(p.win_rate * 100).toFixed(1)}%` : "N/A";
            
            return (
              <Card key={p.id} className="flex flex-col justify-between hover:border-primary/50 transition-all duration-200 shadow-sm">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CardTitle className="text-base font-bold text-foreground">{p.name}</CardTitle>
                          {p.is_verified && (
                            <span className="inline-flex items-center text-emerald-500" title="Verified Signal Provider">
                              <BadgeCheck className="h-4 w-4 fill-emerald-500/20 text-emerald-500" />
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          ID: {p.id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {p.description || "Active crypto signal provider providing automated Bybit trade signals."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Provider Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-card/60 p-3 border border-border text-xs">
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500" /> Signal Delivery Rate
                      </span>
                      <p className="font-bold text-foreground text-sm mt-0.5">{winRateFormatted}</p>
                    </div>

                    <div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3 text-primary" /> Subscribers
                      </span>
                      <p className="font-bold text-foreground text-sm mt-0.5">{p.subscriber_count || 0}</p>
                    </div>

                    <div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Signal className="h-3 w-3 text-secondary-foreground" /> Signals Received
                      </span>
                      <p className="font-medium text-foreground mt-0.5">{p.total_signals_sent || 0}</p>
                    </div>

                    <div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" /> Last Active
                      </span>
                      <p className="font-medium text-foreground mt-0.5">{formatDate(p.last_active_at)}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Link href={`/dashboard/providers/${p.id}`} className="w-full">
                    <Button variant="default" className="w-full flex items-center justify-center gap-1 text-xs">
                      <span>View Provider & Plans</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
