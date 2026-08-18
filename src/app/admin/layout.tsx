"use client";

import { useEffect, useState } from "react";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminHeader from "@/components/admin/AdminHeader";
import ErrorBoundary from "@/components/ErrorBoundary";
import { apiClient } from "@/lib/api-client";

interface UserMeResponse {
  email?: string;
  role?: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await apiClient<UserMeResponse>("/me");
        if (user?.email) {
          setAdminEmail(user.email);
        }
      } catch {
        /* handled by AdminRoute */
      }
    }
    fetchUser();
  }, []);

  return (
    <AdminRoute>
      <ErrorBoundary>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <AdminHeader adminEmail={adminEmail} />
          <div className="flex-1">{children}</div>
        </div>
      </ErrorBoundary>
    </AdminRoute>
  );
}
