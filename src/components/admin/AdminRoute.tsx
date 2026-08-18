"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserMeResponse {
  id?: string;
  email?: string;
  role?: string;
  status?: string;
}

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      try {
        const user = await apiClient<UserMeResponse>("/me");
        if (!isMounted) return;

        if (user && user.role === "admin") {
          setIsAdmin(true);
          setErrorMsg(null);
        } else {
          setIsAdmin(false);
          setErrorMsg("Access restricted: Administrator privileges required.");
          // Guard: Non-admins redirected to /dashboard
          router.replace("/dashboard");
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setIsAdmin(false);
        const msg = err instanceof Error ? err.message : "Authentication required";
        if (msg.includes("401") || msg.toLowerCase().includes("unauthorized") || !accessToken) {
          router.replace("/login");
        } else {
          router.replace("/dashboard");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [router, accessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying administrator credentials...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {errorMsg || "This portal is reserved for Tadex platform administrators. Redirecting to trading dashboard..."}
          </p>
          <Button
            size="sm"
            onClick={() => router.replace("/dashboard")}
            className="text-xs"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
