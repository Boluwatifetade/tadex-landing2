"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import {
  AdminUserSummaryOut,
  AdminUserListResponse,
} from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Users,
  ShieldCheck,
  ShieldAlert,
  Shield,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight,
  RefreshCw,
  Send,
  SlidersHorizontal,
} from "lucide-react";

export default function AdminUserTable() {
  const [users, setUsers] = useState<AdminUserSummaryOut[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [authOriginFilter, setAuthOriginFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", String(perPage));

      if (debouncedSearch.trim()) {
        params.set("q", debouncedSearch.trim());
      }
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (verifiedFilter !== "all") {
        params.set("email_verified", verifiedFilter === "verified" ? "true" : "false");
      }
      if (authOriginFilter !== "all") {
        params.set("auth_origin", authOriginFilter);
      }
      if (roleFilter !== "all") {
        params.set("role", roleFilter);
      }

      const res = await apiClient<AdminUserListResponse>(`/admin/users?${params.toString()}`);
      setUsers(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || Math.ceil((res.total || 0) / perPage) || 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load user directory.";
      setErrorMsg(msg);
      setUsers([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, debouncedSearch, statusFilter, verifiedFilter, authOriginFilter, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      case "suspended":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "banned":
        return "bg-destructive/10 text-destructive border-destructive/20 font-bold";
      case "deleted":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* 5-Dimension Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search across Email, Telegram Username/ID, UUID, Exchange UID..."
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

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
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
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
              <option value="deleted">Deleted</option>
            </select>

            {/* Email Verified Filter */}
            <select
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Verifications</option>
              <option value="verified">Email Verified</option>
              <option value="unverified">Email Unverified</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Auth Origin Filter */}
            <select
              value={authOriginFilter}
              onChange={(e) => {
                setAuthOriginFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Auth Origins</option>
              <option value="web">Web</option>
              <option value="telegram">Telegram</option>
              <option value="bot">Bot</option>
            </select>

            <span className="ml-auto text-xs text-muted-foreground">
              Total: <strong>{total}</strong> users
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error Banner */}
      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-center justify-between">
          <span>{errorMsg}</span>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* User Directory Table (Desktop) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Telegram</th>
                <th className="py-3 px-4">Role / Status</th>
                <th className="py-3 px-4 text-center">Exchanges</th>
                <th className="py-3 px-4 text-center">Subscriptions</th>
                <th className="py-3 px-4">Registered</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Users className="mx-auto h-8 w-8 opacity-40 mb-2" />
                    <p className="font-semibold text-sm">No users found</p>
                    <p className="text-xs mt-1">Try adjusting your search term or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    {/* User & Email */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase">
                          {u.email ? u.email.charAt(0) : "U"}
                        </div>
                        <div className="space-y-0.5 max-w-[220px]">
                          <p className="font-medium text-foreground truncate" title={u.email || "No Email"}>
                            {u.email || <span className="italic text-muted-foreground">No email</span>}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {u.id.substring(0, 8)}...
                            </span>
                            {u.email_verified ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                <XCircle className="h-3 w-3" />
                                <span>Unverified</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Telegram */}
                    <td className="py-3 px-4">
                      {(u.telegram_username || u.username) ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-mono">
                            <Send className="h-3 w-3" />
                            <span>@{u.telegram_username || u.username}</span>
                          </span>
                          {u.telegram_id && (
                            <p className="text-[10px] text-muted-foreground font-mono">
                              ID: {u.telegram_id}
                            </p>
                          )}
                        </div>
                      ) : u.telegram_id ? (
                        <span className="text-xs text-muted-foreground font-mono">
                          ID: {u.telegram_id}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* Role & Status */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                            u.status
                          )}`}
                        >
                          {u.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono capitalize">
                          Role: {u.role}
                        </span>
                      </div>
                    </td>

                    {/* Connected Exchanges */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-muted/60 px-2 py-0.5 text-xs font-mono font-medium text-foreground">
                        <KeyRound className="h-3 w-3 mr-1 text-muted-foreground" />
                        {u.connected_accounts_count}
                      </span>
                    </td>

                    {/* Active Subscriptions */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-muted/60 px-2 py-0.5 text-xs font-mono font-medium text-foreground">
                        {u.active_subscriptions_count}
                      </span>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-4 text-muted-foreground">
                      <p>{formatDate(u.created_at)}</p>
                      {u.registration_source && (
                        <p className="text-[10px] text-muted-foreground/70 font-mono">
                          src: {u.registration_source}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>View 360°</span>
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

      {/* User Directory Mobile Cards */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse"></div>
          ))
        ) : users.length === 0 ? (
          <Card className="border-border bg-card p-6 text-center text-muted-foreground">
            <Users className="mx-auto h-8 w-8 opacity-40 mb-2" />
            <p className="font-semibold text-sm">No users found</p>
          </Card>
        ) : (
          users.map((u) => (
            <Card key={u.id} className="border-border bg-card shadow-xs">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase">
                      {u.email ? u.email.charAt(0) : "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground truncate max-w-[180px]">
                        {u.email || "No email"}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">{u.id.substring(0, 10)}...</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                      u.status
                    )}`}
                  >
                    {u.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border text-muted-foreground">
                  <div>
                    <span className="text-[10px] block">Email Verified</span>
                    <span className="font-medium text-foreground">
                      {u.email_verified ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Telegram</span>
                    <span className="font-medium text-foreground">
                      {(u.telegram_username || u.username) ? `@${u.telegram_username || u.username}` : u.telegram_id || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Exchanges</span>
                    <span className="font-medium text-foreground">{u.connected_accounts_count}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Subscriptions</span>
                    <span className="font-medium text-foreground">{u.active_subscriptions_count}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Joined: {formatDate(u.created_at)}
                  </span>
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    <span>View 360°</span>
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
