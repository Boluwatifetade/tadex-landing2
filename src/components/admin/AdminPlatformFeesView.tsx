"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { AdminPlatformFeeConfigOut, AdminPlatformFeesResponse } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminUpdateFeeModal from "./AdminUpdateFeeModal";
import {
  Settings2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ScrollText,
  DollarSign,
  ArrowRightLeft,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export default function AdminPlatformFeesView() {
  const [feesData, setFeesData] = useState<AdminPlatformFeesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchFees = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await apiClient<AdminPlatformFeesResponse>("/admin/billing/fees");
      setFeesData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load platform fees configuration.";
      setErrorMsg(msg);
      setFeesData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

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

  const formatAmount = (fee: AdminPlatformFeeConfigOut) => {
    if (fee.currency_code === "NGN") {
      return `₦${(fee.amount || fee.amount_minor / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    return `$${(fee.amount || fee.amount_minor / 100).toFixed(2)}`;
  };

  // Find active NGN and USDT fees
  const ngnFee = feesData?.active_fees.find((f) => f.currency_code.toUpperCase() === "NGN");
  const usdtFee = feesData?.active_fees.find((f) => f.currency_code.toUpperCase() === "USDT");

  return (
    <div className="space-y-6">
      {/* Top Header & Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Platform Fee Configuration & Revenue Splits</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure default platform fees deducted at checkout and inspect historical fee adjustment logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFees}
            disabled={isLoading}
            className="text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsUpdateModalOpen(true)}
            className="text-xs flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Update Global Fee</span>
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Active Fee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NGN Platform Fee Card */}
        <Card className="border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="p-4 pb-2 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                ₦
              </span>
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  NGN Settlement Platform Fee
                </CardTitle>
                <span className="text-[10px] text-muted-foreground font-mono">Flutterwave / Bank Cards</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              Active
            </span>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground font-mono">
                {ngnFee ? formatAmount(ngnFee) : "₦1,500"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">Per checkout / renewal</span>
            </div>

            <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Settlement Method:</span>
                <strong className="text-foreground font-mono">{ngnFee?.settlement_method || "flutterwave"}</strong>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-foreground">{formatDate(ngnFee?.updated_at || ngnFee?.created_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* USDT Platform Fee Card */}
        <Card className="border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <CardHeader className="p-4 pb-2 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                $
              </span>
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  USDT Settlement Platform Fee
                </CardTitle>
                <span className="text-[10px] text-muted-foreground font-mono">Crypto / Direct Tether Transfers</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              Active
            </span>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-foreground font-mono">
                {usdtFee ? formatAmount(usdtFee) : "$10.00"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">Per checkout / renewal</span>
            </div>

            <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Settlement Method:</span>
                <strong className="text-foreground font-mono">{usdtFee?.settlement_method || "crypto_manual"}</strong>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-foreground">{formatDate(usdtFee?.updated_at || usdtFee?.created_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Split Mechanism Explanation Card */}
      <Card className="border-border bg-muted/20 shadow-xs">
        <CardContent className="p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
            <span>Automated Revenue Split Mechanism</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            When a trader subscribes to a provider&apos;s plan, Tadex calculates the total gross amount by adding the provider&apos;s base plan price and the global platform fee configured above. The platform fee is deducted into the Tadex treasury, and 100% of the provider&apos;s base plan price is routed to the provider.
          </p>
        </CardContent>
      </Card>

      {/* Historical Fee Revisions Audit Trail */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-primary" />
            <CardTitle className="text-xs font-bold uppercase">Fee Change History & Audit Logs</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-xs">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-muted rounded-md w-full"></div>
              <div className="h-10 bg-muted rounded-md w-full"></div>
            </div>
          ) : !feesData || feesData.history.length === 0 ? (
            <p className="text-muted-foreground italic text-center py-4">
              No historical fee adjustments recorded. Currently running on initial genesis configuration.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="pb-2">Effective Date</th>
                    <th className="pb-2">Currency</th>
                    <th className="pb-2">Fee Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">State</th>
                    <th className="pb-2">Admin / Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {feesData.history.map((h) => (
                    <tr key={h.id} className="hover:bg-muted/20">
                      <td className="py-2.5 font-mono text-[11px]">{formatDate(h.created_at)}</td>
                      <td className="py-2.5 font-bold uppercase">{h.currency_code}</td>
                      <td className="py-2.5 font-mono font-bold text-foreground">{formatAmount(h)}</td>
                      <td className="py-2.5 font-mono text-muted-foreground">{h.settlement_method}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            h.active
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {h.active ? "Active" : "Archived"}
                        </span>
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        Admin: {h.created_by_admin_id || "System"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Fee Modal */}
      {isUpdateModalOpen && (
        <AdminUpdateFeeModal
          currentNgnAmount={ngnFee ? (ngnFee.amount || ngnFee.amount_minor / 100) : 1500}
          currentUsdtAmount={usdtFee ? (usdtFee.amount || usdtFee.amount_minor / 100) : 10}
          onSuccess={(updated) => {
            setIsUpdateModalOpen(false);
            setActionSuccessMsg(`Platform fee for ${updated.currency_code} successfully updated to ${formatAmount(updated)}.`);
            fetchFees();
          }}
          onCancel={() => setIsUpdateModalOpen(false)}
        />
      )}
    </div>
  );
}
