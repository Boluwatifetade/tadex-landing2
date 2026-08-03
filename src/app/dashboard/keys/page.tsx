"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ApiKeyManager from "@/components/dashboard/ApiKeyManager";

export default function KeysPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-background text-foreground">
          <DashboardHeader />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <ApiKeyManager />
          </main>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
