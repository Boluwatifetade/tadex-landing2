"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import ApiKeyManager, { KeyResponse } from "@/components/dashboard/ApiKeyManager";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface UserMeResponse {
  id?: string;
  user_id?: string;
  email?: string;
  status?: string;
  email_verified?: boolean;
}

function DashboardContent() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader userEmail={user?.email} userStatus={user?.status} />

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
