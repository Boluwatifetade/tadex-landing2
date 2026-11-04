"use client";

import { useEffect, useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { apiClient } from "@/lib/api-client";
import { useAuthStore, UserProfile } from "@/lib/auth-store";
import { isRouteEnabled } from "@/lib/feature-flags";
import {
  resolveExchangeStatus,
  type KeySummary,
  type ResolvedExchangeStatus,
} from "@/lib/exchange-status";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuthStore();
  const [exchangeStatus, setExchangeStatus] = useState<ResolvedExchangeStatus>(
    () => resolveExchangeStatus({ isSyncing: true })
  );

  const routeAllowed = isRouteEnabled(pathname);

  useEffect(() => {
    if (!routeAllowed) {
      router.replace("/dashboard");
    }
  }, [routeAllowed, router]);

  const fetchSession = useCallback(async () => {
    setExchangeStatus(resolveExchangeStatus({ isSyncing: true }));
    try {
      const [meRes, keysRes] = await Promise.allSettled([
        apiClient<UserProfile>("/me"),
        apiClient<KeySummary[]>("/keys"),
      ]);

      if (meRes.status === "fulfilled" && meRes.value) {
        setUser(meRes.value);
      }

      if (keysRes.status === "fulfilled" && Array.isArray(keysRes.value)) {
        const resolved = resolveExchangeStatus({
          keys: keysRes.value,
        });
        setExchangeStatus(resolved);
      } else {
        setExchangeStatus(
          resolveExchangeStatus({
            keys: [],
          })
        );
      }
    } catch {
      setExchangeStatus(
        resolveExchangeStatus({
          keys: [],
        })
      );
    }
  }, [setUser]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col">
          <DashboardHeader
            userEmail={user?.email}
            userStatus={user?.status}
            userRole={user?.role}
            userEmailVerified={user?.email_verified}
            telegramLinked={user?.telegram_linked}
            telegramUsername={user?.telegram_username}
            freshnessState={exchangeStatus.state}
            freshnessLabel={exchangeStatus.label}
            lastUpdatedAt={exchangeStatus.lastUpdatedAt}
            onSync={fetchSession}
          />
          <div className="flex-1 lg:pl-64 pb-20 lg:pb-8">
            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {routeAllowed ? children : null}
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
