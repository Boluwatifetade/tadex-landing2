"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  KeyRound,
  LineChart,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
  Settings,
  Radio,
  ShieldAlert,
  Sliders,
  Sparkles,
  ShieldCheck,
  Activity,
} from "lucide-react";

import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api-client";
import { isFeatureEnabled, type FeatureFlagKey } from "@/lib/feature-flags";
import TadexLogo from "@/components/ui/TadexLogo";
import SyncFreshnessBeacon, {
  type FreshnessState,
} from "@/components/dashboard/SyncFreshnessBeacon";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export interface DashboardHeaderProps {
  userEmail?: string;
  userStatus?: string;
  userRole?: string;
  userEmailVerified?: boolean;
  telegramLinked?: boolean;
  telegramUsername?: string | null;
  freshnessState?: FreshnessState;
  freshnessLabel?: string;
  lastUpdatedAt?: Date | string | number | null;
  onSync?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  featureFlag?: FeatureFlagKey;
}

const TRADING_NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "API Keys", href: "/dashboard/keys", icon: KeyRound },
  { label: "Browse Providers", href: "/dashboard/providers", icon: Users },
  { label: "Trading", href: "/dashboard/trading", icon: LineChart },
  {
    label: "Risk Control",
    href: "/dashboard/automation",
    icon: Sliders,
    featureFlag: "riskControl",
  },
  { label: "All Plans", href: "/dashboard/billing", icon: CreditCard },
];

const PROVIDER_NAV_ITEMS: NavItem[] = [
  { label: "Provider Portal", href: "/dashboard/provider", icon: Radio },
  {
    label: "Signal Builder",
    href: "/dashboard/signal-builder",
    icon: Sparkles,
    featureFlag: "signalBuilder",
  },
];

const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Admin Console", href: "/admin", icon: ShieldAlert },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Execution & Risk", href: "/admin/execution", icon: Activity },
];

function filterEnabledItems(items: NavItem[]): NavItem[] {
  return items.filter(
    (item) => !item.featureFlag || isFeatureEnabled(item.featureFlag)
  );
}

export default function DashboardHeader({
  userEmail,
  userStatus = "active",
  userRole,
  userEmailVerified,
  telegramLinked,
  telegramUsername,
  freshnessState = "fresh",
  freshnessLabel,
  lastUpdatedAt,
  onSync,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { clear } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = userRole === "admin";

  const tradingItems = filterEnabledItems(TRADING_NAV_ITEMS);
  const providerItems = filterEnabledItems(PROVIDER_NAV_ITEMS);
  const accountItems = filterEnabledItems(ACCOUNT_NAV_ITEMS);
  const allVisibleItems = [
    ...tradingItems,
    ...providerItems,
    ...accountItems,
    ...(isAdmin ? ADMIN_NAV_ITEMS : []),
  ];

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

  const isItemActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin") {
      return pathname === href;
    }
    return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
  };

  const userInitials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "TR";

  const renderSidebarGroup = (
    title: string,
    items: NavItem[],
    testId?: string
  ) => (
    <div className="space-y-1.5" data-testid={testId}>
      <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-brand text-text-primary border border-brand-accent/30 shadow-xs"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary border border-transparent"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive
                    ? "text-brand-accent"
                    : "text-text-muted group-hover:text-text-primary"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar (Option A) */}
      <aside
        aria-label="Primary Sidebar Navigation"
        data-testid="desktop-sidebar"
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col border-r border-surface-elevated bg-surface-primary"
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-surface-elevated px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <TadexLogo size={30} />
            <span className="text-lg font-bold tracking-tight text-text-primary">
              Tadex App
            </span>
          </Link>
          <span className="rounded-md border border-brand-accent/25 bg-brand/40 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
            B4
          </span>
        </div>

        {/* Grouped Navigation Sections */}
        <nav
          aria-label="Desktop Workspace Navigation"
          className="flex-1 space-y-6 overflow-y-auto px-3.5 py-5"
        >
          {renderSidebarGroup("TRADING", tradingItems, "sidebar-trading-section")}
          {renderSidebarGroup(
            "PROVIDER CENTER",
            providerItems,
            "sidebar-provider-section"
          )}
          {renderSidebarGroup("ACCOUNT", accountItems, "sidebar-account-section")}
          {isAdmin &&
            renderSidebarGroup(
              "SYSTEM ADMINISTRATION",
              ADMIN_NAV_ITEMS,
              "sidebar-admin-section"
            )}
        </nav>

        {/* Non-Custodial Security Assurance Footer */}
        <div className="border-t border-surface-elevated bg-surface-subtle/60 p-4">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary">
                Non-Custodial Mode
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">
                Trade-only API execution. Withdrawals disabled by architecture.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sticky Top Utility Bar */}
      <header
        data-testid="top-utility-bar"
        className="sticky top-0 z-30 lg:pl-64 border-b border-surface-elevated bg-surface-primary/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Brand + Desktop Workspace Context */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 lg:hidden"
            >
              <TadexLogo size={28} />
              <span className="text-base font-bold tracking-tight text-text-primary">
                Tadex
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                TRADING CONTROL CENTER
              </span>
              {isAdmin && (
                <span
                  data-testid="header-admin-badge"
                  className="rounded-full border border-brand-accent/30 bg-brand/40 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-brand-accent"
                >
                  Admin Role
                </span>
              )}
            </div>
          </div>

          {/* Right: Sync Freshness Beacon, User Identity Badges & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <SyncFreshnessBeacon
              state={freshnessState}
              label={freshnessLabel}
              lastUpdatedAt={lastUpdatedAt}
              onSync={onSync}
            />

            {userEmail && (
              <div className="flex items-center gap-2 text-xs font-medium">
                <span
                  className="rounded-full border border-surface-elevated bg-surface-secondary px-2.5 py-1 text-text-primary"
                  title={userEmail}
                >
                  {userEmail}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    userEmailVerified
                      ? "bg-status-success/10 text-status-success border border-status-success/25"
                      : "bg-status-warning/10 text-status-warning border border-status-warning/25"
                  }`}
                >
                  {userEmailVerified ? "Verified" : "Unverified"}
                </span>
                {telegramLinked && (
                  <span
                    data-testid="header-telegram"
                    className="rounded-full border border-status-info/25 bg-status-info/10 px-2.5 py-1 text-xs font-medium text-status-info"
                  >
                    @{telegramUsername || "telegram"}
                  </span>
                )}
                <span className="rounded-full border border-surface-elevated bg-surface-subtle px-2.5 py-1 text-text-secondary capitalize">
                  {userStatus}
                </span>
              </div>
            )}

            <div
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-elevated bg-surface-secondary font-mono text-xs font-semibold text-text-primary"
            >
              {userInitials}
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-xl border border-surface-elevated bg-surface-secondary px-3 py-1.5 text-xs lg:text-sm font-medium text-text-primary hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-brand-accent disabled:opacity-50 transition-colors"
            >
              <LogOut className="h-4 w-4 text-text-secondary" />
              <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
            </button>
          </div>

          {/* Mobile Utility + Hamburger Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <SyncFreshnessBeacon
              state={freshnessState}
              label={freshnessLabel}
              lastUpdatedAt={lastUpdatedAt}
              onSync={onSync}
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="rounded-xl border border-surface-elevated bg-surface-secondary p-2 text-text-primary hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="border-b border-surface-elevated bg-surface-primary px-4 py-4 space-y-3 md:hidden">
            {userEmail && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-elevated text-xs font-medium">
                <span
                  className="rounded-full border border-surface-elevated bg-surface-secondary px-2.5 py-1 text-text-primary truncate max-w-[200px]"
                  title={userEmail}
                >
                  {userEmail}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      userEmailVerified
                        ? "bg-status-success/10 text-status-success"
                        : "bg-status-warning/10 text-status-warning"
                    }`}
                  >
                    {userEmailVerified ? "Verified" : "Unverified"}
                  </span>
                  {telegramLinked && (
                    <span className="rounded-full bg-status-info/10 text-status-info px-2.5 py-1 text-xs font-medium">
                      @{telegramUsername || "telegram"}
                    </span>
                  )}
                  <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-text-secondary capitalize">
                    {userStatus}
                  </span>
                </div>
              </div>
            )}

            <nav className="flex flex-col space-y-1">
              {allVisibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand text-text-primary border border-brand-accent/30 shadow-xs"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-brand-accent" : "text-text-muted"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-surface-elevated">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-status-danger/30 bg-status-danger/10 px-3 py-2.5 text-sm font-medium text-status-danger hover:bg-status-danger/20 transition-colors disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Dock (Option A) */}
      <DashboardMobileNav
        onOpenDrawer={() => setIsMobileMenuOpen((prev) => !prev)}
        isDrawerOpen={isMobileMenuOpen}
      />
    </>
  );
}
