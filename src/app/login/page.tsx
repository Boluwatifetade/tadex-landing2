"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, ShieldCheck, Zap, KeyRound } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";
import TadexLogo from "@/components/ui/TadexLogo";

interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const resetSuccess = searchParams.get("reset") === "success";
  const { setAccessToken } = useAuthStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient<TokenResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        { skipAuth: true }
      );

      if (response?.access_token) {
        setAccessToken(response.access_token);
        router.push(redirectUrl);
      } else {
        setErrorMessage("Authentication failed. Invalid response from server.");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to log in. Please check your credentials.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-testid="auth-split-shell"
      className="min-h-screen bg-surface-canvas text-text-primary lg:grid lg:grid-cols-12"
    >
      {/* Left Brand & Trust Composition (Figma 12:59 Harmonized with B4) */}
      <aside
        aria-label="Tadex Security Architecture"
        className="relative hidden overflow-hidden border-r border-surface-elevated bg-surface-primary lg:col-span-5 lg:flex lg:flex-col lg:justify-between p-10 xl:p-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-brand/30 blur-3xl"
        />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <TadexLogo size={40} />
            <span className="text-2xl font-bold tracking-tight text-text-primary">
              Tadex
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-auto py-12 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand/30 px-3 py-1 font-mono text-xs font-medium text-brand-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>NON-CUSTODIAL EXECUTION TERMINAL</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-text-primary leading-tight">
            Automated signal execution without surrendering custody.
          </h1>

          <p className="text-sm leading-relaxed text-text-secondary max-w-md">
            Your capital remains in your personal Bybit account at all
            times. Tadex executes verified signals through trade-only API keys.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 rounded-xl border border-surface-elevated bg-surface-subtle/80 p-3.5">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Zero Withdrawal Permissions
                </p>
                <p className="text-xs text-text-muted">
                  API credentials with withdrawal scopes are rejected at
                  validation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-surface-elevated bg-surface-subtle/80 p-3.5">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Idempotent Order Routing
                </p>
                <p className="text-xs text-text-muted">
                  Every signal dispatch is deduplicated and audited in real time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-surface-elevated pt-6 text-xs text-text-muted">
          <span className="font-mono">ENCRYPTED KEY VAULT</span>
          <span>Nigeria · Kenya · Ghana</span>
        </div>
      </aside>

      {/* Right Authentication Form Panel */}
      <div className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:col-span-7 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <TadexLogo size={38} />
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                Tadex
              </span>
            </Link>
          </div>

          {/* Mode Switcher Tabs (Figma 12:59 / 12:116) */}
          <div
            role="navigation"
            aria-label="Authentication mode"
            className="mb-6 grid grid-cols-2 rounded-xl border border-surface-elevated bg-surface-primary p-1"
          >
            <Link
              href="/login"
              aria-current="page"
              className="flex items-center justify-center rounded-lg border border-brand-accent/30 bg-brand py-2 text-xs font-semibold text-text-primary shadow-xs transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center rounded-lg py-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
            >
              Create Account
            </Link>
          </div>

          <div className="rounded-2xl border border-surface-elevated bg-surface-primary p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                Log in to your account
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary">
                Enter your verified email and password to access your trading
                terminal, or{" "}
                <Link
                  href="/register"
                  className="font-semibold text-brand-accent hover:underline"
                >
                  create a new account
                </Link>
                .
              </p>
            </div>

            {resetSuccess && (
              <div className="mb-6 rounded-xl border border-status-success/30 bg-status-success/10 p-4 text-sm text-status-success">
                Password reset successfully. Please log in with your new
                password.
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-status-danger/30 bg-status-danger/10 p-4 text-sm text-status-danger"
              >
                {errorMessage}
              </div>
            )}

            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Email address
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    {...register("email")}
                    className="block w-full rounded-xl border border-surface-elevated bg-surface-secondary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent disabled:opacity-50"
                    placeholder="trader@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-status-danger">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-brand-accent hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...register("password")}
                    className="block w-full rounded-xl border border-surface-elevated bg-surface-secondary py-2.5 pl-3.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-status-danger">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-accent/30 bg-brand py-2.5 px-4 text-sm font-semibold text-text-primary shadow-sm hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent active:scale-[0.98] disabled:opacity-50 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-primary border-t-transparent" />
                      Logging in...
                    </span>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-brand-accent" />
                      <span>Log In</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-canvas text-text-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
