"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import ApiKeyManager from "@/components/dashboard/ApiKeyManager";

export default function KeysPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ApiKeyManager />
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
