"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  Zap,
  UserPlus,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { registerSchema, type RegisterFormValues } from "@/lib/schemas/auth";
import TadexLogo from "@/components/ui/TadexLogo";

interface UserOut {
  id: string;
  email: string;
  email_verified: boolean;
  status: string;
}

interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAccessToken } = useAuthStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Step 1: Register user on backend
      await apiClient<UserOut>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
        { skipAuth: true }
      );

      // Step 2: Auto-login after registration
      const loginResponse = await apiClient<TokenResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
        { skipAuth: true }
      );

      if (loginResponse?.access_token) {
        setAccessToken(loginResponse.access_token);
        router.push("/dashboard");
      } else {
        setErrorMessage(
          "Registration succeeded, but auto-login failed. Please log in manually."
        );
        router.push("/login");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
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
      {/* Left Brand & Trust Composition (Figma 12:116 Harmonized with B4) */}
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
            <span>BUILT FOR AFRICAN CRYPTO TRADERS</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-text-primary leading-tight">
            Connect once. Execute verified signals 24/7.
          </h1>

          <p className="text-sm leading-relaxed text-text-secondary max-w-md">
            Start with a free account, link your trade-only exchange API key,
            and subscribe to verified signal providers with transparent
            execution logs.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 rounded-xl border border-surface-elevated bg-surface-subtle/80 p-3.5">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Non-Custodial by Design
                </p>
                <p className="text-xs text-text-muted">
                  Tadex never holds user funds or accepts withdrawal-enabled
                  keys.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-surface-elevated bg-surface-subtle/80 p-3.5">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Local NGN &amp; Crypto Billing
                </p>
                <p className="text-xs text-text-muted">
                  Flexible plans built for retail traders and VIP signal
                  communities.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-surface-elevated pt-6 text-xs text-text-muted">
          <span className="font-mono">NDPA 2023 / GAID 2025 COMPLIANT</span>
          <span>Bybit API Execution</span>
        </div>
      </aside>

      {/* Right Registration Form Panel */}
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
              className="flex items-center justify-center rounded-lg py-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              aria-current="page"
              className="flex items-center justify-center rounded-lg border border-brand-accent/30 bg-brand py-2 text-xs font-semibold text-text-primary shadow-xs transition-colors"
            >
              Create Account
            </Link>
          </div>

          <div className="rounded-2xl border border-surface-elevated bg-surface-primary p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                Create your Tadex account
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-brand-accent hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>

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
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...register("password")}
                    className="block w-full rounded-xl border border-surface-elevated bg-surface-secondary py-2.5 pl-3.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent disabled:opacity-50"
                    placeholder="At least 8 characters"
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...register("confirmPassword")}
                    className="block w-full rounded-xl border border-surface-elevated bg-surface-secondary py-2.5 pl-3.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent disabled:opacity-50"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-status-danger">
                    {errors.confirmPassword.message}
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
                      Creating account...
                    </span>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 text-brand-accent" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
                <p className="mt-3.5 text-center text-xs text-text-muted">
                  By continuing, you agree to Tadex&apos;s{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-brand-accent hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-brand-accent hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
