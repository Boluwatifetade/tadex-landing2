"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  KeyRound,
  Menu,
} from "lucide-react";

interface DashboardMobileNavProps {
  onOpenDrawer?: () => void;
  isDrawerOpen?: boolean;
}

export default function DashboardMobileNav({
  onOpenDrawer,
  isDrawerOpen = false,
}: DashboardMobileNavProps) {
  const pathname = usePathname();

  const dockItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      label: "Trading",
      href: "/dashboard/trading",
      icon: LineChart,
      isActive: pathname?.startsWith("/dashboard/trading") ?? false,
    },
    {
      label: "API Keys",
      href: "/dashboard/keys",
      icon: KeyRound,
      isActive: pathname?.startsWith("/dashboard/keys") ?? false,
    },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      data-testid="mobile-bottom-dock"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 border-t border-surface-elevated bg-surface-primary/95 backdrop-blur-md px-2 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid h-full max-w-md grid-cols-4 items-center gap-1">
        {dockItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.isActive ? "page" : undefined}
              className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 caption-5 transition-colors ${
                item.isActive
                  ? "bg-brand text-text-primary border border-brand-accent/30 font-semibold"
                  : "text-text-muted hover:bg-surface-subtle hover:text-text-primary"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  item.isActive ? "text-brand-accent" : "text-text-muted"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onOpenDrawer}
          aria-expanded={isDrawerOpen}
          aria-label="Open more navigation options"
          className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 caption-5 transition-colors ${
            isDrawerOpen
              ? "bg-surface-secondary text-text-primary font-semibold"
              : "text-text-muted hover:bg-surface-subtle hover:text-text-primary"
          }`}
        >
          <Menu className="h-4 w-4" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
