"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api-client";
import { LayoutDashboard, KeyRound, LineChart, CreditCard, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  userEmail?: string;
  userStatus?: string;
}

export default function DashboardHeader({ userEmail, userStatus = "active" }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { clear } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      clear();
      router.push("/login");
    }
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "API Keys", href: "/dashboard/keys", icon: KeyRound },
    { label: "Trading", href: "/dashboard/trading", icon: LineChart },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  ];

  const userIdentifier = userEmail ? userEmail.split("@")[0] : "Trader";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline">
              Tadex App
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {userEmail && (
            <div className="hidden md:flex items-center gap-2 text-xs font-medium">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                User: {userIdentifier}
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground capitalize">
                {userStatus}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
