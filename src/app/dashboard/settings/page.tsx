"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AccountSettings from "@/components/dashboard/AccountSettings";
import { apiClient } from "@/lib/api-client";

interface UserMeResponse {
  id?: string;
  email?: string;
  status?: string;
}

function SettingsPageContent() {
  const [user, setUser] = useState<UserMeResponse | null>(null);

  const fetchUserMe = useCallback(async () => {
    try {
      const me = await apiClient<UserMeResponse>("/me");
      setUser(me || {});
    } catch {
      /* non-blocking session check */
    }
  }, []);

  useEffect(() => {
    fetchUserMe();
  }, [fetchUserMe]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader userEmail={user?.email} userStatus={user?.status} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AccountSettings />
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <SettingsPageContent />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
