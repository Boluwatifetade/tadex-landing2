"use client";

import { useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { apiClient } from "@/lib/api-client";
import { useAuthStore, UserProfile } from "@/lib/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useAuthStore();

  const fetchSession = useCallback(async () => {
    try {
      const me = await apiClient<UserProfile>("/me");
      if (me) {
        setUser(me);
      }
    } catch {
      // Non-blocking background session check
    }
  }, [setUser]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <DashboardHeader
            userEmail={user?.email}
            userStatus={user?.status}
            userEmailVerified={user?.email_verified}
            telegramLinked={user?.telegram_linked}
            telegramUsername={user?.telegram_username}
          />
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
