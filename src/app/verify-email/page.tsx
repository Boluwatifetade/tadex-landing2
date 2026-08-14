"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";

interface VerifyResponse {
  status: string;
  message: string;
  email_verified: boolean;
}

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setErrorMessage("Missing verification token. Please click the link sent to your email inbox.");
      return;
    }

    let isMounted = true;

    async function executeVerification() {
      try {
        const data = await apiClient<VerifyResponse>(
          "/auth/verify-email",
          {
            method: "POST",
            body: JSON.stringify({ token }),
          },
          { skipAuth: true }
        );

        if (isMounted) {
          if (data?.email_verified) {
            setSuccessMessage("Your email address has been verified successfully! You can now add exchange API keys and access web billing.");
          } else {
            setErrorMessage(data?.message || "Email verification was not completed. Please request a new verification link.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(
            err.message || "Invalid or expired email verification link. Verification links expire after 24 hours."
          );
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus(null);

    try {
      await apiClient(
        "/auth/resend-verification",
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );
      setResendStatus("A fresh verification email has been sent. Please check your inbox.");
    } catch (err: any) {
      setResendStatus(err.message || "Failed to resend verification email. Please try again in 60 seconds.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow-sm sm:rounded-xl sm:px-10 border border-border text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">Email Verification</h2>

          {isVerifying && (
            <div className="py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-sm text-muted-foreground">Verifying your email token...</p>
            </div>
          )}

          {!isVerifying && successMessage && (
            <div className="space-y-6">
              <div className="rounded-md bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-400">
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/dashboard/keys"
                  className="inline-flex justify-center rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Attach Exchange API Key
                </Link>
              </div>
            </div>
          )}

          {!isVerifying && errorMessage && (
            <div className="space-y-6">
              <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20 text-destructive">
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>

              {resendStatus && (
                <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                  {resendStatus}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="inline-flex justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </button>
                <Link
                  href="/login"
                  className="inline-flex justify-center rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading verification page...</p>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
