"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import PricingGrid from "@/components/dashboard/PricingGrid";
import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-background text-foreground">
          <DashboardHeader />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                Subscription & Billing
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your trade execution plan, browse pricing tiers, and generate transparent checkout quotes.
              </p>
            </div>

            <SubscriptionCard />
            <PricingGrid />
          </main>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
