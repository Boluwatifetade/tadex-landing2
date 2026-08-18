"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  AdminProviderApplicationOut,
  AdminProviderApplicationListResponse,
} from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Eye,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";

interface AdminApplicationsQueueProps {
  initialStatusFilter?: string;
}

export default function AdminApplicationsQueue({ initialStatusFilter }: AdminApplicationsQueueProps) {
  const [applications, setApplications] = useState<AdminProviderApplicationOut[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || "pending");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Approve Modal state
  const [approveTarget, setApproveTarget] = useState<AdminProviderApplicationOut | null>(null);
  const [overrideName, setOverrideName] = useState("");
  const [approveNotes, setApproveNotes] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  // Reject Modal state
  const [rejectTarget, setRejectTarget] = useState<AdminProviderApplicationOut | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectError, setRejectError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("per_page", "20");

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const res = await apiClient<AdminProviderApplicationListResponse>(
        `/admin/providers/applications?${params.toString()}`
      );
      setApplications(res.items || []);
      setTotalCount(res.total || 0);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : "Failed to load provider applications");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenApproveModal = (app: AdminProviderApplicationOut) => {
    setApproveTarget(app);
    setOverrideName(app.display_name);
    setApproveNotes("");
    setApproveError(null);
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approveTarget) return;

    setIsApproving(true);
    setApproveError(null);
    try {
      await apiClient(`/admin/providers/applications/${approveTarget.id}/approve`, {
        method: "POST",
        body: JSON.stringify({
          provider_name: overrideName.trim() || undefined,
          notes: approveNotes.trim() || undefined,
        }),
      });
      setToastMsg(`Application for "${approveTarget.display_name}" approved successfully.`);
      setApproveTarget(null);
      fetchApplications();
    } catch (err: unknown) {
      setApproveError(err instanceof Error ? err.message : "Failed to approve application");
    } finally {
      setIsApproving(false);
    }
  };

  const handleOpenRejectModal = (app: AdminProviderApplicationOut) => {
    setRejectTarget(app);
    setRejectReason("");
    setRejectError(null);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTarget) return;

    if (!rejectReason.trim() || rejectReason.trim().length < 3) {
      setRejectError("A mandatory rejection explanation (at least 3 characters) is required.");
      return;
    }

    setIsRejecting(true);
    setRejectError(null);
    try {
      await apiClient(`/admin/providers/applications/${rejectTarget.id}/reject`, {
        method: "POST",
        body: JSON.stringify({
          reason: rejectReason.trim(),
        }),
      });
      setToastMsg(`Application for "${rejectTarget.display_name}" rejected.`);
      setRejectTarget(null);
      fetchApplications();
    } catch (err: unknown) {
      setRejectError(err instanceof Error ? err.message : "Failed to reject application");
    } finally {
      setIsRejecting(false);
    }
  };

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

  const filterTabs = [
    { id: "pending", label: "Pending Review" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "all", label: "All Applications" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FileCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Provider Applications</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review applicant trading backgrounds, approve new signal providers, or reject unqualified submissions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchApplications}
          disabled={isLoading}
          className="text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
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

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/60 w-fit">
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

      {/* Applications List */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-xs">Loading application submissions...</p>
          </div>
        ) : fetchError ? (
          <div role="alert" className="p-8 text-center text-destructive space-y-3">
            <AlertTriangle className="h-6 w-6 mx-auto" />
            <p className="text-xs">{fetchError}</p>
            <Button variant="outline" size="sm" onClick={fetchApplications} className="text-xs">
              Try Again
            </Button>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <FileCheck className="h-8 w-8 mx-auto opacity-40" />
            <p className="text-sm font-semibold text-foreground">Queue Empty</p>
            <p className="text-xs">No provider applications matching status &ldquo;{statusFilter}&rdquo;.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {applications.map((app) => {
              const isPending = app.status === "pending";
              const isApproved = app.status === "approved";
              const isRejected = app.status === "rejected";

              return (
                <div key={app.id} className="p-5 hover:bg-muted/10 transition-colors space-y-4">
                  {/* Top Bar: Identity & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                        {app.display_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">{app.display_name}</h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              isPending
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : isApproved
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{app.contact_email}</span>
                          <span className="font-mono text-[10px] opacity-70">({app.id.slice(0, 8)})</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons for Pending items */}
                    {isPending ? (
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRejectModal(app)}
                          className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 flex items-center gap-1.5"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleOpenApproveModal(app)}
                          className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve & Activate</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground text-right">
                        {isApproved && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approved on {formatDate(app.reviewed_at)}
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-destructive font-semibold flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" />
                            Rejected on {formatDate(app.reviewed_at)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Metadata Chips & Experience */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="rounded-md border border-border bg-muted/20 px-2.5 py-1">
                      Experience: <strong className="text-foreground">{app.experience_level}</strong>
                    </div>

                    {app.trading_focus && app.trading_focus.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span>Markets:</span>
                        {app.trading_focus.map((focus) => (
                          <span
                            key={focus}
                            className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>
                    )}

                    {app.referral_source && (
                      <div className="text-[11px]">
                        Source: <span className="text-foreground">{app.referral_source}</span>
                      </div>
                    )}

                    <div className="text-[11px] ml-auto font-mono">
                      Submitted: {formatDate(app.submitted_at)}
                    </div>
                  </div>

                  {/* Bio statement */}
                  {app.bio && (
                    <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground block mb-0.5">Bio / Strategy Overview:</strong>
                      {app.bio}
                    </div>
                  )}

                  {/* Rejection reason if rejected */}
                  {isRejected && app.rejection_reason && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                      <strong>Rejection Reason:</strong> {app.rejection_reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Approve Application Modal */}
      {approveTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Approve Signal Provider</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Approve application for <strong className="text-foreground">{approveTarget.display_name}</strong> and create an active provider profile.
                </p>
              </div>
            </div>

            {approveError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{approveError}</span>
              </div>
            )}

            <form onSubmit={handleApproveSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Provider Display Name (Optional Override)
                </label>
                <input
                  type="text"
                  value={overrideName}
                  onChange={(e) => setOverrideName(e.target.value)}
                  placeholder="Provider profile name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <p className="text-[11px] text-muted-foreground">
                  Leave as-is to use the applicant&apos;s submitted display name.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Approval Audit Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  placeholder="e.g. Verified Telegram channel ownership and track record."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setApproveTarget(null)}
                  disabled={isApproving}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isApproving}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <span>Confirm Approval</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Application Modal */}
      {rejectTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Reject Provider Application</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Decline application for <strong className="text-foreground">{rejectTarget.display_name}</strong>.
                </p>
              </div>
            </div>

            {rejectError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{rejectError}</span>
              </div>
            )}

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Rejection Reason (Mandatory Feedback & Audit Trail) <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    if (rejectError) setRejectError(null);
                  }}
                  placeholder="e.g. Incomplete track record details, invalid contact channel, or trading strategy does not meet platform risk standards."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50"
                />
                <p className="text-[11px] text-muted-foreground">
                  This explanation will be visible to the applicant on their portal so they can address issues and re-apply.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectTarget(null)}
                  disabled={isRejecting}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  disabled={isRejecting || rejectReason.trim().length < 3}
                  className="text-xs flex items-center gap-1.5"
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <span>Confirm Rejection</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
