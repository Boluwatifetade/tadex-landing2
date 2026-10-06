"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Trader Analytics & Performance
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historical trade performance, win rates, and reconciled PnL metrics.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Authoritative Fill Reconciliation in Progress</CardTitle>
              <CardDescription>
                Personal trader analytics are governed by verified exchange execution records.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Tadex strictly prohibits displaying synthetic or unverified financial figures. Historical performance metrics—including net realized PnL, win rates, profit factor, and maximum drawdown—require full multi-exchange fill reconciliation against Bybit execution reports.
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">What is currently active & verified:</p>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Live open positions & unrealized PnL via Exchange API</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Working order tracking and fill detection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Signal provider historical performance and win rates</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3 border-t border-border/60 pt-4">
          <Link href="/dashboard/trading">
            <Button variant="default" size="sm" className="gap-1.5">
              <LineChart className="h-4 w-4" />
              View Live Trading
            </Button>
          </Link>
          <Link href="/dashboard/providers">
            <Button variant="outline" size="sm" className="gap-1.5">
              Browse Signal Providers
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
