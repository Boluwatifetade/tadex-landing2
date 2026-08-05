"use client";

import { use } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProviderDetailView from "@/components/dashboard/ProviderDetailView";

interface ProviderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProviderDetailPage({ params }: ProviderDetailPageProps) {
  const resolvedParams = use(params);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary>
            <ProviderDetailView providerId={resolvedParams.id} />
          </ErrorBoundary>
        </main>
      </div>
    </ProtectedRoute>
  );
}
