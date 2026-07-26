"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setAccessToken, clear } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      // Step 1: If access token exists in memory, user is authenticated
      if (useAuthStore.getState().accessToken) {
        if (isMounted) setIsInitializing(false);
        return;
      }

      // Step 2: Access token in memory is null (e.g. hard page reload).
      // Attempt silent refresh using httpOnly refresh cookie before making any redirect decisions.
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.access_token) {
            setAccessToken(data.access_token);
            if (isMounted) setIsInitializing(false);
            return;
          }
        }
      } catch (err) {
        // Network or fetch error
        console.error("Silent refresh error during session restoration:", err);
      }

      // Step 3: Refresh failed or returned invalid response -> clear auth state and redirect to /login
      clear();
      if (isMounted) {
        setIsInitializing(false);
        const loginUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
        router.replace(loginUrl);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, setAccessToken, clear]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
