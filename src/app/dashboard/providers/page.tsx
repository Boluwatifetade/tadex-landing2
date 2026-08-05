"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProviderDirectory from "@/components/dashboard/ProviderDirectory";

export default function ProvidersPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary>
            <ProviderDirectory />
          </ErrorBoundary>
        </main>
      </div>
    </ProtectedRoute>
  );
}
