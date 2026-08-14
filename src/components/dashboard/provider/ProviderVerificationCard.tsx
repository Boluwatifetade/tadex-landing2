"use client";

import { useState } from "react";
import { ProviderDetailOut, VerificationRequestResponse } from "@/types/provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ProviderVerificationForm from "./ProviderVerificationForm";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ProviderVerificationCardProps {
  provider: ProviderDetailOut;
  onVerificationSubmitted: () => void;
}

export default function ProviderVerificationCard({
  provider,
  onVerificationSubmitted,
}: ProviderVerificationCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isVerified = Boolean(provider.is_verified);
  const isPending = Boolean(provider.verification_submitted_at) && !isVerified;
  const isSuspended = provider.status === "suspended";

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

  const handleSuccess = (res: VerificationRequestResponse) => {
    setSuccessMsg(res.message || "Verification request submitted successfully!");
    setIsFormOpen(false);
    onVerificationSubmitted();
  };

  return (
    <>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isVerified
                    ? "bg-emerald-500/10 text-emerald-500"
                    : isPending
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isVerified ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : isPending ? (
                  <Clock className="h-5 w-5" />
                ) : (
                  <Award className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-bold">Verification Status</CardTitle>
                  {isVerified ? (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                      Verified ({provider.verification_level || "basic"})
                    </span>
                  ) : isPending ? (
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Pending Review
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                      {provider.verification_level || "Unverified"}
                    </span>
                  )}
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  Verified providers gain subscriber trust and higher visibility in the signal marketplace.
                </CardDescription>
              </div>
            </div>

            {!isVerified && !isPending && (
              <Button
                size="sm"
                onClick={() => setIsFormOpen(true)}
                disabled={isSuspended}
                className="text-xs flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Request Verification</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {isVerified ? (
            /* Verified State */
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>Your provider account is verified!</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your profile features the verified badge across the public provider directory. All automated signals dispatched will display verified credential authenticity to subscribers.
              </p>
              {provider.verification_approved_at && (
                <p className="text-[11px] text-muted-foreground pt-1 border-t border-emerald-500/10">
                  Verified on: <strong>{formatDate(provider.verification_approved_at)}</strong>
                </p>
              )}
            </div>
          ) : isPending ? (
            /* Pending State */
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                <Clock className="h-5 w-5" />
                <span>Verification Request Submitted & Under Review</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our compliance team is auditing your submitted operational identity, signal history samples, and track record evidence. You will be notified once review completes (typically within 24–48 hours).
              </p>
              {provider.verification_submitted_at && (
                <p className="text-[11px] text-muted-foreground pt-1 border-t border-amber-500/10">
                  Submitted on: <strong>{formatDate(provider.verification_submitted_at)}</strong>
                </p>
              )}
            </div>
          ) : (
            /* Unverified State */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span>Verified Badge</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Displays verified checkmark badge on your provider card.
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span>Catalog Priority</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Verified providers are sorted to the top of public subscriber search.
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span>Subscriber Trust</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Higher conversion from retail traders seeking audited performance.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Form Modal */}
      {isFormOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto animate-in fade-in-0 duration-150"
        >
          <div className="my-8 w-full max-w-3xl">
            <ProviderVerificationForm
              initialDisplayName={provider.name}
              initialEmail={provider.email || ""}
              onSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
