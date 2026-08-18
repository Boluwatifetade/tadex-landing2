"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminApplicationsQueue from "@/components/admin/AdminApplicationsQueue";
import { Loader2 } from "lucide-react";

function ApplicationsPageContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("status") || "pending";

  return <AdminApplicationsQueue initialStatusFilter={initialStatus} />;
}

export default function AdminApplicationsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Loading applications queue...</p>
          </div>
        }
      >
        <ApplicationsPageContent />
      </Suspense>
    </main>
  );
}
