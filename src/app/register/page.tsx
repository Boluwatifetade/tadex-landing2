"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

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
        setErrorMessage("Registration succeeded, but auto-login failed. Please log in manually.");
        router.push("/login");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          Create your Tadex account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow-sm sm:rounded-xl sm:px-10 border border-border">
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...register("email")}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
                  placeholder="trader@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("password")}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
                  placeholder="At least 8 characters"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
                  placeholder="Repeat your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
