"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { AdminProviderDetailOut, AdminProviderListResponse } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Radio,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Users,
  TrendingUp,
  Mail,
  Loader2,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import AdminProviderDetailModal from "./AdminProviderDetailModal";
import AdminSuspendModal from "./AdminSuspendModal";

interface AdminProviderTableProps {
  initialStatusFilter?: string;
}

export default function AdminProviderTable({ initialStatusFilter }: AdminProviderTableProps) {
  const [providers, setProviders] = useState<AdminProviderDetailOut[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals state
  const [selectedProvider, setSelectedProvider] = useState<AdminProviderDetailOut | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [suspendModalTarget, setSuspendModalTarget] = useState<AdminProviderDetailOut | null>(null);
  const [unsuspendTarget, setUnsuspendTarget] = useState<AdminProviderDetailOut | null>(null);
  const [isUnsubmitting, setIsUnsubmitting] = useState(false);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("per_page", "20");

      if (statusFilter === "verified") {
        params.set("is_verified", "true");
      } else if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const res = await apiClient<AdminProviderListResponse>(`/admin/providers?${params.toString()}`);
      setProviders(res.items || []);
      setTotalCount(res.total || 0);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : "Failed to load provider directory");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleSuspendConfirm = async (providerId: string, reason: string) => {
    await apiClient(`/admin/providers/${providerId}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    setToastMsg(`Provider successfully suspended.`);
    fetchProviders();
  };

  const handleUnsuspendConfirm = async (providerId: string) => {
    setIsUnsubmitting(true);
    try {
      await apiClient(`/admin/providers/${providerId}/unsuspend`, {
        method: "POST",
      });
      setToastMsg(`Provider successfully unsuspended.`);
      setUnsuspendTarget(null);
      fetchProviders();
    } finally {
      setIsUnsubmitting(false);
    }
  };

  const openDetailModal = (provider: AdminProviderDetailOut) => {
    setSelectedProvider(provider);
    setDetailModalOpen(true);
  };

  const filterTabs = [
    { id: "all", label: "All Providers" },
    { id: "active", label: "Active" },
    { id: "suspended", label: "Suspended" },
    { id: "verified", label: "Verified" },
    { id: "deleted", label: "Deleted" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Radio className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Provider Directory</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Audit, govern, inspect operational metrics, and manage suspension states across all signal providers.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchProviders}
          disabled={isLoading}
          className="text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {toastMsg && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-xs font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/60">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === tab.id
                  ? "bg-card text-foreground font-semibold shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search provider name, email, slug..."
            className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-xs">Loading provider records...</p>
          </div>
        ) : fetchError ? (
          <div role="alert" className="p-8 text-center text-destructive space-y-3">
            <AlertTriangle className="h-6 w-6 mx-auto" />
            <p className="text-xs">{fetchError}</p>
            <Button variant="outline" size="sm" onClick={fetchProviders} className="text-xs">
              Try Again
            </Button>
          </div>
        ) : providers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <Radio className="h-8 w-8 mx-auto opacity-40" />
            <p className="text-sm font-semibold text-foreground">No Providers Found</p>
            <p className="text-xs">No provider accounts match the current filter or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Provider Identity</th>
                  <th className="py-3 px-4">Owner Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verification Tier</th>
                  <th className="py-3 px-4 text-right">Subscribers</th>
                  <th className="py-3 px-4 text-right">Signals</th>
                  <th className="py-3 px-4 text-right">Win Rate</th>
                  <th className="py-3 px-4 text-center">Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {providers.map((p) => {
                  const isSuspended = p.status === "suspended";
                  const isVerified = Boolean(p.is_verified);

                  return (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      {/* Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">{p.name}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {p.slug || p.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Owner Email */}
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {p.user_email || "N/A"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                            p.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : p.status === "suspended"
                              ? "bg-destructive/10 text-destructive font-bold"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Verification Tier */}
                      <td className="py-3.5 px-4">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                            <ShieldCheck className="h-3 w-3" />
                            <span>{p.verification_level || "basic"}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground capitalize">
                            {p.verification_level || "unverified"}
                          </span>
                        )}
                      </td>

                      {/* Subscribers */}
                      <td className="py-3.5 px-4 text-right font-semibold text-foreground">
                        {p.subscriber_count.toLocaleString()}
                      </td>

                      {/* Signals */}
                      <td className="py-3.5 px-4 text-right text-muted-foreground">
                        {p.total_signals_sent.toLocaleString()}
                      </td>

                      {/* Win Rate */}
                      <td className="py-3.5 px-4 text-right font-medium">
                        {p.win_rate !== null && p.win_rate !== undefined ? `${p.win_rate}%` : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailModal(p)}
                            className="h-7 px-2.5 text-[11px] flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Details</span>
                          </Button>

                          {isSuspended ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setUnsuspendTarget(p)}
                              className="h-7 px-2 text-[11px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/30 flex items-center gap-1"
                            >
                              <Unlock className="h-3 w-3" />
                              <span>Unsuspend</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSuspendModalTarget(p)}
                              className="h-7 px-2 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 flex items-center gap-1"
                            >
                              <Lock className="h-3 w-3" />
                              <span>Suspend</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalCount > 20 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing {providers.length} of {totalCount} providers
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 font-mono">{currentPage}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={providers.length < 20 || isLoading}
                className="h-7 px-2 text-xs"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Selected Provider Detail Modal */}
      {selectedProvider && (
        <AdminProviderDetailModal
          provider={selectedProvider}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedProvider(null);
          }}
          onSuspend={handleSuspendConfirm}
          onUnsuspend={handleUnsuspendConfirm}
        />
      )}

      {/* Suspend Action Modal */}
      {suspendModalTarget && (
        <AdminSuspendModal
          providerName={suspendModalTarget.name}
          providerId={suspendModalTarget.id}
          isOpen={Boolean(suspendModalTarget)}
          onClose={() => setSuspendModalTarget(null)}
          onConfirm={async (reason) => {
            await handleSuspendConfirm(suspendModalTarget.id, reason);
            setSuspendModalTarget(null);
          }}
        />
      )}

      {/* Unsuspend Confirmation Modal */}
      {unsuspendTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Unlock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Unsuspend Signal Provider</h3>
                <p className="text-xs text-muted-foreground">
                  Restore <strong className="text-foreground">{unsuspendTarget.name}</strong> to active operational status?
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              This action will immediately unlock signal broadcast permissions and reactivate tier subscription management.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUnsuspendTarget(null)}
                disabled={isUnsubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleUnsuspendConfirm(unsuspendTarget.id)}
                disabled={isUnsubmitting}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
              >
                {isUnsubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Unsuspending...</span>
                  </>
                ) : (
                  <span>Confirm Unsuspend</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
