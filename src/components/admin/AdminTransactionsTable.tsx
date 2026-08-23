"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { AdminTransactionItemOut, AdminTransactionListResponse } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  RefreshCw,
  Receipt,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
} from "lucide-react";

export default function AdminTransactionsTable() {
  const [transactions, setTransactions] = useState<AdminTransactionItemOut[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gatewayFilter, setGatewayFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("page_size", String(pageSize));

      if (debouncedSearch.trim()) {
        params.set("q", debouncedSearch.trim());
      }
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (gatewayFilter !== "all") {
        params.set("gateway", gatewayFilter);
      }
      if (currencyFilter !== "all") {
        params.set("currency", currencyFilter);
      }

      const res = await apiClient<AdminTransactionListResponse>(
        `/admin/billing/transactions?${params.toString()}`
      );
      setTransactions(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || Math.ceil((res.total || 0) / pageSize) || 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load transaction ledger.";
      setErrorMsg(msg);
      setTransactions([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter, gatewayFilter, currencyFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatMoney = (minor?: number | null, cents?: number | null, curr: string = "USD") => {
    const raw = minor ?? cents;
    if (raw === undefined || raw === null) return "-";
    const val = raw / 100;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: curr.toUpperCase(),
      }).format(val);
    } catch {
      return `${curr.toUpperCase()} ${val.toFixed(2)}`;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("succ") || s.includes("comp")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
    if (s.includes("pend") || s.includes("init")) {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search across Tx ID, Gateway Ref, Customer Email, Username..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchTransactions}
              disabled={isLoading}
              className="text-xs flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-border text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground font-semibold shrink-0">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters:</span>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success / Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Gateway Filter */}
            <select
              value={gatewayFilter}
              onChange={(e) => {
                setGatewayFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Gateways</option>
              <option value="flutterwave">Flutterwave</option>
              <option value="paystack">Paystack</option>
              <option value="crypto_manual">Crypto Manual</option>
            </select>

            {/* Currency Filter */}
            <select
              value={currencyFilter}
              onChange={(e) => {
                setCurrencyFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Currencies</option>
              <option value="NGN">NGN (₦)</option>
              <option value="USDT">USDT ($)</option>
              <option value="USD">USD ($)</option>
            </select>

            <span className="ml-auto text-xs text-muted-foreground">
              Total: <strong>{total}</strong> transactions
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error Banner */}
      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-center justify-between">
          <span>{errorMsg}</span>
          <Button variant="outline" size="sm" onClick={fetchTransactions} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Transactions Table (Desktop) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Transaction / Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Amount & Split</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-4 bg-muted rounded-md w-full"></div>
                    </td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Receipt className="mx-auto h-8 w-8 opacity-40 mb-2" />
                    <p className="font-semibold text-sm">No transactions found</p>
                    <p className="text-xs mt-1">Try adjusting your search query or filter selection.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    {/* Tx ID & Ref */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono font-semibold text-foreground text-xs block">
                          {tx.id.substring(0, 10)}...
                        </span>
                        {tx.provider_reference && (
                          <span className="font-mono text-[10px] text-muted-foreground block truncate max-w-[160px]" title={tx.provider_reference}>
                            ref: {tx.provider_reference}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-[180px]">
                        <p className="font-medium text-foreground truncate" title={tx.user_email || "Anonymous"}>
                          {tx.user_email || <span className="italic text-muted-foreground">No Email</span>}
                        </p>
                        {tx.user_id && (
                          <Link
                            href={`/admin/users/${tx.user_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-[10px] text-primary hover:underline block"
                          >
                            User: {tx.user_id.substring(0, 8)}...
                          </Link>
                        )}
                      </div>
                    </td>

                    {/* Gateway / Provider */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary inline-block">
                          {tx.provider || "Gateway"}
                        </span>
                        {tx.provider_name && (
                          <p className="text-[10px] text-muted-foreground truncate max-w-[120px]" title={tx.provider_name}>
                            {tx.provider_name}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Amount & Split */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground text-xs">
                          {formatMoney(tx.total_amount_minor ?? tx.amount_minor, tx.amount_cents, tx.currency || "USD")}
                        </p>
                        {(tx.fee_minor !== null && tx.fee_minor !== undefined) && (
                          <p className="text-[10px] text-muted-foreground">
                            Fee: {formatMoney(tx.fee_minor, null, tx.currency || "USD")}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="py-3 px-4 text-muted-foreground">
                      <span>{formatDate(tx.created_at)}</span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/billing/transactions/${tx.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>Diagnostics</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions Mobile Cards */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse"></div>
          ))
        ) : transactions.length === 0 ? (
          <Card className="border-border bg-card p-6 text-center text-muted-foreground">
            <Receipt className="mx-auto h-8 w-8 opacity-40 mb-2" />
            <p className="font-semibold text-sm">No transactions found</p>
          </Card>
        ) : (
          transactions.map((tx) => (
            <Card key={tx.id} className="border-border bg-card shadow-xs">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {tx.id.substring(0, 12)}...
                    </span>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {tx.user_email || "No email"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                      tx.status
                    )}`}
                  >
                    {tx.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border text-muted-foreground">
                  <div>
                    <span className="text-[10px] block">Amount</span>
                    <span className="font-bold text-foreground">
                      {formatMoney(tx.total_amount_minor ?? tx.amount_minor, tx.amount_cents, tx.currency || "USD")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Gateway</span>
                    <span className="font-medium text-foreground uppercase">{tx.provider || "-"}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(tx.created_at)}
                  </span>
                  <Link
                    href={`/admin/billing/transactions/${tx.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    <span>Diagnostics</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total results)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="text-xs flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className="text-xs flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
