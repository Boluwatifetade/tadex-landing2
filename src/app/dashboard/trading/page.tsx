"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PositionsTable from "@/components/dashboard/PositionsTable";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { LineChart } from "lucide-react";

export default function TradingPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-background text-foreground">
          <DashboardHeader />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <LineChart className="h-6 w-6 text-primary" />
                Trading Overview & Positions
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Monitor active positions, open orders, and trade execution logs in real-time.
              </p>
            </div>

            <PositionsTable />
            <OrdersTable />
          </main>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
