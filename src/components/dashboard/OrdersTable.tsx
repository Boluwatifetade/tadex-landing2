"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export interface OrderOut {
  id: string;
  symbol: string;
  side: string;
  status: string;
  size: number;
  price?: number | null;
  order_type?: string | null;
  stop_loss?: number | null;
  take_profit?: number | null;
  timestamp?: string | null;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const query = statusFilter !== "all" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const data = await apiClient<OrderOut[]>(`/trading/orders${query}`);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load orders";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatPrice = (val?: number | null) => {
    if (val === undefined || val === null) return "-";
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  const renderStatusBadge = (statusStr: string) => {
    const s = (statusStr || "").toLowerCase();
    if (s === "filled" || s === "success") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500 capitalize">
          <CheckCircle className="h-3 w-3" />
          {statusStr}
        </span>
      );
    }
    if (s === "pending" || s === "submitted" || s === "open") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500 capitalize">
          <Clock className="h-3 w-3" />
          {statusStr}
        </span>
      );
    }
    if (s === "cancelled" || s === "canceled") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground capitalize">
          <XCircle className="h-3 w-3" />
          {statusStr}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive capitalize">
        <AlertCircle className="h-3 w-3" />
        {statusStr || "failed"}
      </span>
    );
  };

  const filterOptions = [
    { label: "All Orders", value: "all" },
    { label: "Filled", value: "filled" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Failed", value: "failed" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold">Order History</CardTitle>
            <CardDescription>Submitted automated orders and execution logs.</CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Buttons */}
            <div className="flex items-center rounded-lg border border-border p-1 bg-muted/30">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    statusFilter === opt.value
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={isLoading}
              title="Refresh orders"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading order history...</p>
          </div>
        ) : fetchError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
            <span>{fetchError}</span>
            <Button variant="outline" size="sm" onClick={fetchOrders}>Retry</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">No orders yet.</p>
            <p className="text-xs text-muted-foreground">Executed trade orders will be recorded here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="py-3 px-2 font-medium">Time</th>
                  <th className="py-3 px-2 font-medium">Symbol</th>
                  <th className="py-3 px-2 font-medium">Side</th>
                  <th className="py-3 px-2 font-medium">Type</th>
                  <th className="py-3 px-2 font-medium">Size</th>
                  <th className="py-3 px-2 font-medium">Price</th>
                  <th className="py-3 px-2 font-medium">Status</th>
                  <th className="py-3 px-2 font-medium">SL / TP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((ord) => {
                  const isBuy = (ord.side || "").toLowerCase().includes("buy");

                  return (
                    <tr key={ord.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-2 text-xs text-muted-foreground whitespace-nowrap">{formatDate(ord.timestamp)}</td>
                      <td className="py-3 px-2 font-bold text-foreground">{ord.symbol}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isBuy ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                        }`}>
                          {ord.side}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs font-medium text-foreground">{ord.order_type || "Market"}</td>
                      <td className="py-3 px-2 font-mono text-foreground">{ord.size}</td>
                      <td className="py-3 px-2 font-mono text-foreground">{formatPrice(ord.price)}</td>
                      <td className="py-3 px-2">{renderStatusBadge(ord.status)}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground font-mono">
                        <div>SL: {formatPrice(ord.stop_loss)}</div>
                        <div>TP: {formatPrice(ord.take_profit)}</div>
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
