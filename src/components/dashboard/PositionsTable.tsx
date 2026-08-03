"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, TrendingUp, TrendingDown, Layers } from "lucide-react";

export interface PositionOut {
  id: string;
  symbol: str;
  side: string;
  size: number;
  entry_price?: number | null;
  unrealized_pnl?: number | null;
  leverage?: number | null;
  stop_loss?: number | null;
  take_profit?: number | null;
}

export default function PositionsTable() {
  const [positions, setPositions] = useState<PositionOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await apiClient<PositionOut[]>("/trading/positions");
      setPositions(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load positions";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const formatPrice = (val?: number | null) => {
    if (val === undefined || val === null) return "-";
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const formatPnl = (val?: number | null) => {
    if (val === undefined || val === null) return { text: "$0.00", className: "text-muted-foreground" };
    const prefix = val > 0 ? "+" : "";
    const text = `${prefix}$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (val > 0) return { text, className: "text-emerald-500 bg-emerald-500/10 font-bold" };
    if (val < 0) return { text, className: "text-destructive bg-destructive/10 font-bold" };
    return { text, className: "text-muted-foreground bg-secondary font-medium" };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base font-semibold">Active Positions</CardTitle>
              <CardDescription>Live open positions managed on connected exchanges.</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPositions}
            disabled={isLoading}
            title="Refresh positions"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading open positions...</p>
          </div>
        ) : fetchError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
            <span>{fetchError}</span>
            <Button variant="outline" size="sm" onClick={fetchPositions}>Retry</Button>
          </div>
        ) : positions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">No active positions.</p>
            <p className="text-xs text-muted-foreground">Automated signal triggers will open and monitor trades here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="py-3 px-2 font-medium">Symbol</th>
                  <th className="py-3 px-2 font-medium">Side</th>
                  <th className="py-3 px-2 font-medium">Size</th>
                  <th className="py-3 px-2 font-medium">Entry Price</th>
                  <th className="py-3 px-2 font-medium">Leverage</th>
                  <th className="py-3 px-2 font-medium">Unrealized PnL</th>
                  <th className="py-3 px-2 font-medium">SL / TP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {positions.map((pos) => {
                  const pnl = formatPnl(pos.unrealized_pnl);
                  const isLong = (pos.side || "").toLowerCase().includes("buy") || (pos.side || "").toLowerCase().includes("long");

                  return (
                    <tr key={pos.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-2 font-bold text-foreground">{pos.symbol}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isLong ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                        }`}>
                          {isLong ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {pos.side}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-foreground">{pos.size}</td>
                      <td className="py-3 px-2 font-mono text-foreground">{formatPrice(pos.entry_price)}</td>
                      <td className="py-3 px-2 font-medium text-foreground">{pos.leverage ? `${pos.leverage}x` : "-"}</td>
                      <td className="py-3 px-2 font-mono">
                        <span className={`rounded-md px-2 py-1 text-xs ${pnl.className}`}>
                          {pnl.text}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-muted-foreground font-mono">
                        <div>SL: {formatPrice(pos.stop_loss)}</div>
                        <div>TP: {formatPrice(pos.take_profit)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
