"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  AdminVerificationQueueItem,
  AdminVerificationQueueResponse,
} from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  User,
  Radio,
  FileText,
  BarChart3,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminVerificationQueue() {
  const [items, setItems] = useState<AdminVerificationQueueItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Expanded dossier item
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Verify Modal
  const [verifyTarget, setVerifyTarget] = useState<AdminVerificationQueueItem | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("basic");
  const [verifyNotes, setVerifyNotes] = useState("");
  const [riskFlags, setRiskFlags] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Reject Modal
  const [rejectTarget, setRejectTarget] = useState<AdminVerificationQueueItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectError, setRejectError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("per_page", "20");

      const res = await apiClient<AdminVerificationQueueResponse>(
        `/admin/providers/verification-queue?${params.toString()}`
      );
      setItems(res.items || []);
      setTotalCount(res.total || 0);

      // Auto-expand first item if available
      if (res.items && res.items.length > 0 && !expandedId) {
        setExpandedId(res.items[0].provider_id);
      }
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : "Failed to load verification queue");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, expandedId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleOpenVerifyModal = (item: AdminVerificationQueueItem) => {
    setVerifyTarget(item);
    setSelectedLevel("basic");
    setVerifyNotes("");
    setRiskFlags("");
    setVerifyError(null);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyTarget) return;

    setIsVerifying(true);
    setVerifyError(null);
    try {
      await apiClient(`/admin/providers/${verifyTarget.provider_id}/verify`, {
        method: "POST",
        body: JSON.stringify({
          verification_level: selectedLevel,
          notes: verifyNotes.trim() || undefined,
          risk_flags: riskFlags.trim() || undefined,
        }),
      });
      setToastMsg(`Provider "${verifyTarget.provider_name}" verified at tier level "${selectedLevel}".`);
      setVerifyTarget(null);
      fetchQueue();
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : "Failed to verify provider");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenRejectModal = (item: AdminVerificationQueueItem) => {
    setRejectTarget(item);
    setRejectReason("");
    setRejectError(null);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTarget) return;

    if (!rejectReason.trim() || rejectReason.trim().length < 3) {
      setRejectError("A mandatory rejection reason (at least 3 characters) is required.");
      return;
    }

    setIsRejecting(true);
    setRejectError(null);
    try {
      await apiClient(`/admin/providers/${rejectTarget.provider_id}/reject-verification`, {
        method: "POST",
        body: JSON.stringify({
          reason: rejectReason.trim(),
        }),
      });
      setToastMsg(`Verification request for "${rejectTarget.provider_name}" rejected.`);
      setRejectTarget(null);
      fetchQueue();
    } catch (err: unknown) {
      setRejectError(err instanceof Error ? err.message : "Failed to reject verification request");
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

  const verificationLevels = [
    { id: "basic", label: "Basic Verified", desc: "Meets basic identity & 3 historical trade signals check" },
    { id: "intermediate", label: "Intermediate", desc: "Proven track record with audited statement" },
    { id: "advanced", label: "Advanced", desc: "Over 1 year active operations with verifiable exchange link" },
    { id: "premium", label: "Premium Tier", desc: "Top tier performance, strict risk controls, high win rate" },
    { id: "verified", label: "Standard Verified", desc: "General verified badge" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification Review Queue</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Audit full evidence dossiers, verify track records, and assign verified tier badges to signal providers.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchQueue}
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

      {/* Verification Queue Items */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading verification evidence dossiers...</p>
        </div>
      ) : fetchError ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive space-y-3 max-w-2xl mx-auto">
          <AlertTriangle className="h-6 w-6 mx-auto" />
          <p className="text-xs">{fetchError}</p>
          <Button variant="outline" size="sm" onClick={fetchQueue} className="text-xs">
            Try Again
          </Button>
        </div>
      ) : items.length === 0 ? (
        <Card className="border-border bg-card p-12 text-center text-muted-foreground space-y-2">
          <ShieldCheck className="h-10 w-10 mx-auto opacity-40 text-emerald-500" />
          <p className="text-base font-bold text-foreground">Verification Queue Clear</p>
          <p className="text-xs">All submitted provider verification dossiers have been audited.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isExpanded = expandedId === item.provider_id;
            const dossier = item.dossier || {};
            const identity = dossier.identity || {};
            const signalOp = dossier.signal_operation || {};
            const evidence = dossier.trading_evidence || {};
            const signals = dossier.historical_signals || [];
            const declarations = dossier.declarations || {};

            return (
              <Card key={item.provider_id} className="border-border bg-card shadow-xs overflow-hidden transition-all">
                {/* Dossier Header */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 bg-muted/20">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-xs">
                      {item.provider_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">{item.provider_name}</h3>
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Pending Audit
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 font-mono">
                        <span>{item.user_email || identity.email || "No email"}</span>
                        <span>•</span>
                        <span>Submitted: {formatDate(item.verification_submitted_at)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions & Expand Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenRejectModal(item)}
                      className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 flex items-center gap-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleOpenVerifyModal(item)}
                      className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verify Provider</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(isExpanded ? null : item.provider_id)}
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Evidence Dossier Body */}
                {isExpanded && (
                  <CardContent className="p-6 space-y-6 animate-in fade-in-50 duration-150">
                    {/* Section 1: Operator Identity */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1.5">
                        <User className="h-4 w-4" />
                        <span>Section 1: Operator Identity</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                          <span className="text-muted-foreground block text-[10px]">Legal / Operator Full Name</span>
                          <span className="font-semibold text-foreground">{String(identity.full_name || "-")}</span>
                        </div>
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                          <span className="text-muted-foreground block text-[10px]">Telegram Username</span>
                          <span className="font-mono text-foreground">{String(identity.telegram_username || "-")}</span>
                        </div>
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                          <span className="text-muted-foreground block text-[10px]">Operating Country / Region</span>
                          <span className="font-semibold text-foreground">{String(identity.country_region || "-")}</span>
                        </div>
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3 sm:col-span-2 md:col-span-3">
                          <span className="text-muted-foreground block text-[10px]">Signal Channel Link</span>
                          {identity.telegram_channel_link ? (
                            <a
                              href={String(identity.telegram_channel_link)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-mono text-xs mt-0.5"
                            >
                              <span>{String(identity.telegram_channel_link)}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                        {identity.service_description && (
                          <div className="rounded-lg border border-border/80 bg-muted/20 p-3 sm:col-span-2 md:col-span-3">
                            <span className="text-muted-foreground block text-[10px]">Strategy Methodology</span>
                            <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                              {String(identity.service_description)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 2: Signal Operation */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1.5">
                        <Radio className="h-4 w-4" />
                        <span>Section 2: Signal Operation</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                          <span className="text-muted-foreground block text-[10px]">Subscriber Count</span>
                          <span className="font-bold text-foreground">
                            {signalOp.approx_subscriber_count !== undefined
                              ? Number(signalOp.approx_subscriber_count).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                          <span className="text-muted-foreground block text-[10px]">Experience Duration</span>
                          <span className="font-semibold text-foreground">
                            {String(signalOp.time_providing_signals || "-")}
                          </span>
                        </div>
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                          <span className="text-muted-foreground block text-[10px]">Execution Mode</span>
                          <span className="font-semibold text-foreground capitalize">
                            {String(signalOp.manual_or_automated || "Automated")}
                          </span>
                        </div>
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                          <span className="text-muted-foreground block text-[10px]">Signal Frequency</span>
                          <span className="font-semibold text-foreground">
                            {String(signalOp.typical_signal_frequency || "-")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Trading Evidence & Links */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1.5">
                        <BarChart3 className="h-4 w-4" />
                        <span>Section 3: Trading Evidence & External Proof</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1">
                          <span className="text-muted-foreground block text-[10px]">Exchange UID</span>
                          <span className="font-mono font-semibold text-foreground">
                            {evidence.exchange_name || "Exchange"}: {String(evidence.exchange_uid || "None provided")}
                          </span>
                        </div>

                        <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1">
                          <span className="text-muted-foreground block text-[10px]">Public Leaderboard / Trading Profile</span>
                          {evidence.trading_profile_link ? (
                            <a
                              href={String(evidence.trading_profile_link)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-mono text-xs"
                            >
                              <span>View Profile on {String(evidence.exchange_name || "Exchange")}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">None provided</span>
                          )}
                        </div>

                        {evidence.performance_report_link && (
                          <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1">
                            <span className="text-muted-foreground block text-[10px]">Audit Statement / Report PDF</span>
                            <a
                              href={String(evidence.performance_report_link)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-mono text-xs"
                            >
                              <span>View Performance Statement</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}

                        {evidence.third_party_performance_link && (
                          <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1">
                            <span className="text-muted-foreground block text-[10px]">3rd-Party Verification Link</span>
                            <a
                              href={String(evidence.third_party_performance_link)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-mono text-xs"
                            >
                              <span>View 3rd-Party Track Record</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 4: Historical Signals Table */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1.5">
                        <FileText className="h-4 w-4" />
                        <span>Section 4: Historical Signals Table ({signals.length} Samples)</span>
                      </div>

                      {signals.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No historical signal records attached.</p>
                      ) : (
                        <div className="rounded-xl border border-border overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                                <th className="py-2.5 px-3">#</th>
                                <th className="py-2.5 px-3">Symbol</th>
                                <th className="py-2.5 px-3">Entry</th>
                                <th className="py-2.5 px-3">Stop Loss</th>
                                <th className="py-2.5 px-3">Take Profit</th>
                                <th className="py-2.5 px-3">Date / Time</th>
                                <th className="py-2.5 px-3">Outcome</th>
                                <th className="py-2.5 px-3">Telegram Link</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {signals.map((sig, idx) => (
                                <tr key={idx} className="hover:bg-muted/20">
                                  <td className="py-2 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                                  <td className="py-2 px-3 font-bold text-foreground">{sig.symbol || "-"}</td>
                                  <td className="py-2 px-3 font-mono">{String(sig.entry || "-")}</td>
                                  <td className="py-2 px-3 font-mono text-destructive">{String(sig.stop_loss || "-")}</td>
                                  <td className="py-2 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                                    {String(sig.take_profit || "-")}
                                  </td>
                                  <td className="py-2 px-3 text-muted-foreground">{String(sig.datetime || "-")}</td>
                                  <td className="py-2 px-3 font-semibold text-foreground">{String(sig.result || "-")}</td>
                                  <td className="py-2 px-3">
                                    {sig.original_message_link ? (
                                      <a
                                        href={String(sig.original_message_link)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                                      >
                                        <span>View Post</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Section 5: Affirmations */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Section 5: Operator Affirmations & Declarations</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="text-foreground">Confirms channel ownership & operation</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="text-foreground">All submitted information is accurate</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="text-foreground">Understands no return guarantee</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="text-foreground">Agrees to platform rules & code of conduct</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5 sm:col-span-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="text-foreground">Confirms no historical results are fabricated</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Verify Modal with Tier Level Selection */}
      {verifyTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Grant Verified Provider Status</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Approve verification and assign tier level to <strong className="text-foreground">{verifyTarget.provider_name}</strong>.
                </p>
              </div>
            </div>

            {verifyError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
              {/* Tier Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Select Verified Tier Level</label>
                <div className="space-y-2">
                  {verificationLevels.map((lvl) => (
                    <label
                      key={lvl.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedLevel === lvl.id
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="verification_level"
                        value={lvl.id}
                        checked={selectedLevel === lvl.id}
                        onChange={() => setSelectedLevel(lvl.id)}
                        className="mt-0.5"
                      />
                      <div className="space-y-0.5">
                        <span className="font-semibold text-xs text-foreground block">{lvl.label}</span>
                        <span className="text-[11px] text-muted-foreground">{lvl.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Review Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="e.g. Audited Bybit copytrade leaderboard and 3 historical trade signals."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Identified Risk Flags (Optional)</label>
                <input
                  type="text"
                  value={riskFlags}
                  onChange={(e) => setRiskFlags(e.target.value)}
                  placeholder="e.g. Martingale sizing or high leverage notes"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVerifyTarget(null)}
                  disabled={isVerifying}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isVerifying}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Granting Verification...</span>
                    </>
                  ) : (
                    <span>Grant Verified Badge</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Verification Modal */}
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
                <h3 className="text-base font-bold text-foreground">Reject Verification Request</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Decline verification request for <strong className="text-foreground">{rejectTarget.provider_name}</strong>.
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
                  Rejection Reason (Mandatory Audit Requirement) <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    if (rejectError) setRejectError(null);
                  }}
                  placeholder="e.g. Historical signal message links did not match telegram timestamps, or statement was unverified."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50"
                />
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
