"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";

const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirm_password: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setErrorMessage("No reset token found in URL. Please request a new password reset link.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiClient(
        "/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            token,
            new_password: data.new_password,
          }),
        },
        { skipAuth: true }
      );

      // Redirect to login page with success query parameter
      router.push("/login?reset=success");
    } catch (err: any) {
      setErrorMessage(
        err.message || "This password reset link is invalid or has expired. Please request a new one."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-4 py-8 shadow-sm sm:rounded-xl sm:px-10 border border-border text-center space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Invalid Reset Link</h2>
            <p className="text-sm text-muted-foreground">
              This password reset link is missing a valid security token or has expired.
            </p>
            <div>
              <Link
                href="/forgot-password"
                className="flex w-full justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm">
              T
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Tadex</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Choose a secure password of at least 8 characters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow-sm sm:rounded-xl sm:px-10 border border-border">
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive space-y-2">
              <p>{errorMessage}</p>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary hover:underline block"
              >
                Request a new password reset link →
              </Link>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-foreground">
                New password
              </label>
              <div className="mt-1">
                <input
                  id="new_password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...register("new_password")}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
                  placeholder="••••••••"
                />
                {errors.new_password && (
                  <p className="mt-1 text-xs text-destructive">{errors.new_password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-foreground">
                Confirm new password
              </label>
              <div className="mt-1">
                <input
                  id="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...register("confirm_password")}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
                  placeholder="••••••••"
                />
                {errors.confirm_password && (
                  <p className="mt-1 text-xs text-destructive">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Resetting password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                ← Back to Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
