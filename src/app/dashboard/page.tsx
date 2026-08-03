"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import ApiKeyManager, { KeyResponse } from "@/components/dashboard/ApiKeyManager";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

interface UserMeResponse {
  id?: string;
  user_id?: string;
  email?: string;
  status?: string;
  email_verified?: boolean;
}

function DashboardContent() {
  const router = useRouter();
  const { clear } = useAuthStore();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [connectedKeysCount, setConnectedKeysCount] = useState<number>(0);

  const fetchSessionAndKeys = useCallback(async () => {
    try {
      const me = await apiClient<UserMeResponse>("/me");
      setUser(me || {});
    } catch (err) {
      console.error("Failed to fetch user session info:", err);
    }

    try {
      const keys = await apiClient<KeyResponse[]>("/keys");
      if (Array.isArray(keys)) {
        setConnectedKeysCount(keys.length);
      }
    } catch {
      /* non-blocking metrics fetch */
    }
  }, []);

  useEffect(() => {
    fetchSessionAndKeys();
  }, [fetchSessionAndKeys]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      clear();
      router.push("/login");
    }
  };

  const getUserIdentifier = (): string => {
    if (user?.email) {
      return user.email.split("@")[0];
    }
    const rawId = user?.id || user?.user_id;
    if (rawId && typeof rawId === "string" && rawId.length > 0) {
      return rawId.substring(0, 8);
    }
    return "Trader";
  };

  const userStatus = user?.status || "active";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Tadex Trading App</span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                  User: {getUserIdentifier()}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground capitalize">
                  {userStatus}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors"
            >
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Trading Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Non-custodial signal execution platform & automated trading overview.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Signal Execution</span>
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
              <p className="mt-4 text-2xl font-bold text-card-foreground">Active</p>
              <p className="mt-1 text-xs text-muted-foreground">Listening for automated signal triggers</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Exchange API Keys</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">Read/Trade Only</span>
              </div>
              <p className="mt-4 text-2xl font-bold text-card-foreground">
                {connectedKeysCount > 0 ? `${connectedKeysCount} Connected` : "Not Connected"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {connectedKeysCount > 0 ? "Non-custodial execution ready" : "Connect Bybit key below"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Account Security</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">HttpOnly Cookie</span>
              </div>
              <p className="mt-4 text-2xl font-bold text-card-foreground">Verified</p>
              <p className="mt-1 text-xs text-muted-foreground">In-memory access token active</p>
            </div>
          </div>

          {/* Exchange API Key Management Section */}
          <section className="pt-2">
            <ApiKeyManager />
          </section>

          {/* Signal Execution Activity Table */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-6">
              <h2 className="text-base font-semibold text-card-foreground">Recent Signal Executions</h2>
              <p className="mt-1 text-sm text-muted-foreground">Live automated trades executed on connected exchanges.</p>
            </div>
            <div className="p-6 text-center text-sm text-muted-foreground">
              No recent automated trades. Signal execution pipeline ready.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
