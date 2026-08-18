"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminProviderTable from "@/components/admin/AdminProviderTable";
import { Loader2 } from "lucide-react";

function ProvidersPageContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("status") || "all";

  return <AdminProviderTable initialStatusFilter={initialStatus} />;
}

export default function AdminProvidersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Loading provider directory...</p>
          </div>
        }
      >
        <ProvidersPageContent />
      </Suspense>
    </main>
  );
}
