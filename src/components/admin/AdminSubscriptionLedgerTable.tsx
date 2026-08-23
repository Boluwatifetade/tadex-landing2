"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { AdminSubscriptionLedgerItemOut, AdminSubscriptionListResponse } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminCancelSubscriptionModal from "./AdminCancelSubscriptionModal";
import AdminSetSubscriptionStatusModal from "./AdminSetSubscriptionStatusModal";
import {
  Search,
  Filter,
  RefreshCw,
  Radio,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Settings2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function AdminSubscriptionLedgerTable() {
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionLedgerItemOut[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Modals state
  const [selectedSubForCancel, setSelectedSubForCancel] = useState<AdminSubscriptionLedgerItemOut | null>(null);
  const [selectedSubForStatus, setSelectedSubForStatus] = useState<AdminSubscriptionLedgerItemOut | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchSubscriptions = useCallback(async () => {
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
      if (tierFilter !== "all") {
        params.set("tier", tierFilter);
      }
      if (activeFilter !== "all") {
        params.set("is_active", activeFilter === "active" ? "true" : "false");
      }

      const res = await apiClient<AdminSubscriptionListResponse>(
        `/admin/billing/subscriptions?${params.toString()}`
      );
      setSubscriptions(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || Math.ceil((res.total || 0) / pageSize) || 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load subscription ledger.";
      setErrorMsg(msg);
      setSubscriptions([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter, tierFilter, activeFilter]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "trialing":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "past_due":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "paused":
        return "bg-muted text-muted-foreground border-border";
      case "canceled":
      case "expired":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Notification Banner */}
      {actionSuccessMsg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

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
                placeholder="Search across Subscriber Email, Username, or Provider Name..."
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
              onClick={fetchSubscriptions}
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
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past Due</option>
              <option value="paused">Paused</option>
              <option value="canceled">Canceled</option>
              <option value="expired">Expired</option>
            </select>

            {/* Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="standard">Standard</option>
              <option value="vip">VIP</option>
              <option value="premium">Premium</option>
            </select>

            {/* Active Switch */}
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Access States</option>
              <option value="active">Active Access Only</option>
              <option value="inactive">Inactive / Ineligible</option>
            </select>

            <span className="ml-auto text-xs text-muted-foreground">
              Total: <strong>{total}</strong> subscriptions
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error Banner */}
      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-center justify-between">
          <span>{errorMsg}</span>
          <Button variant="outline" size="sm" onClick={fetchSubscriptions} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Subscriptions Table (Desktop) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Subscriber</th>
                <th className="py-3 px-4">Provider / Plan</th>
                <th className="py-3 px-4">Status & Tier</th>
                <th className="py-3 px-4">Period Dates</th>
                <th className="py-3 px-4">Auto-Renew</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4">
                      <div className="h-4 bg-muted rounded-md w-full"></div>
                    </td>
                  </tr>
                ))
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Radio className="mx-auto h-8 w-8 opacity-40 mb-2" />
                    <p className="font-semibold text-sm">No subscriptions found</p>
                    <p className="text-xs mt-1">Try adjusting your search term or filter selection.</p>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Subscriber */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-[180px]">
                        <p className="font-medium text-foreground truncate" title={sub.user_email || "Anonymous"}>
                          {sub.user_email || <span className="italic text-muted-foreground">No Email</span>}
                        </p>
                        <Link
                          href={`/admin/users/${sub.user_id}`}
                          className="font-mono text-[10px] text-primary hover:underline block truncate"
                        >
                          User: {sub.user_id.substring(0, 8)}...
                        </Link>
                      </div>
                    </td>

                    {/* Provider / Plan */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-[180px]">
                        <p className="font-semibold text-foreground truncate" title={sub.provider_name || "Provider"}>
                          {sub.provider_name || "Platform Provider"}
                        </p>
                        <span className="text-[10px] text-muted-foreground capitalize block font-mono">
                          ID: {sub.id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>

                    {/* Status & Tier */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                            sub.status
                          )}`}
                        >
                          {sub.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize font-mono">
                          Tier: {sub.tier || "standard"}
                        </span>
                      </div>
                    </td>

                    {/* Period Dates */}
                    <td className="py-3 px-4 text-muted-foreground">
                      <p>Start: <strong className="text-foreground">{formatDate(sub.current_period_start || sub.created_at)}</strong></p>
                      <p>End: <strong className="text-foreground">{formatDate(sub.current_period_end || sub.expires_at)}</strong></p>
                    </td>

                    {/* Auto-Renew */}
                    <td className="py-3 px-4">
                      {sub.auto_renew ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>

                    {/* Admin Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubForStatus(sub)}
                          className="text-xs h-7 px-2 flex items-center gap-1"
                        >
                          <Settings2 className="h-3 w-3 text-primary" />
                          <span>Set Status</span>
                        </Button>

                        {sub.status !== "canceled" && sub.status !== "expired" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedSubForCancel(sub)}
                            className="text-xs h-7 px-2 flex items-center gap-1"
                          >
                            <ShieldAlert className="h-3 w-3" />
                            <span>Cancel</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscriptions Mobile Cards */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse"></div>
          ))
        ) : subscriptions.length === 0 ? (
          <Card className="border-border bg-card p-6 text-center text-muted-foreground">
            <Radio className="mx-auto h-8 w-8 opacity-40 mb-2" />
            <p className="font-semibold text-sm">No subscriptions found</p>
          </Card>
        ) : (
          subscriptions.map((sub) => (
            <Card key={sub.id} className="border-border bg-card shadow-xs">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-sm text-foreground">
                      {sub.provider_name || "Signal Subscription"}
                    </span>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {sub.user_email || sub.user_id}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                      sub.status
                    )}`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border text-muted-foreground">
                  <div>
                    <span className="text-[10px] block">Tier</span>
                    <span className="font-medium text-foreground capitalize">{sub.tier || "standard"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Period End</span>
                    <span className="font-medium text-foreground">{formatDate(sub.current_period_end || sub.expires_at)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubForStatus(sub)}
                    className="text-xs h-7 px-2"
                  >
                    Set Status
                  </Button>
                  {sub.status !== "canceled" && sub.status !== "expired" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSelectedSubForCancel(sub)}
                      className="text-xs h-7 px-2"
                    >
                      Cancel
                    </Button>
                  )}
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

      {/* Modals */}
      {selectedSubForCancel && (
        <AdminCancelSubscriptionModal
          subscriptionId={selectedSubForCancel.id}
          userEmail={selectedSubForCancel.user_email}
          planName={selectedSubForCancel.provider_name}
          onSuccess={() => {
            setSelectedSubForCancel(null);
            setActionSuccessMsg(`Subscription ${selectedSubForCancel.id.substring(0, 8)}... successfully canceled.`);
            fetchSubscriptions();
          }}
          onCancel={() => setSelectedSubForCancel(null)}
        />
      )}

      {selectedSubForStatus && (
        <AdminSetSubscriptionStatusModal
          subscriptionId={selectedSubForStatus.id}
          currentStatus={selectedSubForStatus.status}
          userEmail={selectedSubForStatus.user_email}
          planName={selectedSubForStatus.provider_name}
          onSuccess={() => {
            setSelectedSubForStatus(null);
            setActionSuccessMsg(`Subscription status updated successfully.`);
            fetchSubscriptions();
          }}
          onCancel={() => setSelectedSubForStatus(null)}
        />
      )}
    </div>
  );
}
