"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Activity, RefreshCw } from "lucide-react";

export default function AdminExecutionNav() {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/admin/execution",
      label: "System Controls & Kill Switch",
      icon: Zap,
      active: pathname === "/admin/execution",
    },
    {
      href: "/admin/execution/health",
      label: "Pipeline Health & Telemetry",
      icon: Activity,
      active: pathname.startsWith("/admin/execution/health"),
    },
    {
      href: "/admin/execution/reconciliation",
      label: "Position Reconciliation",
      icon: RefreshCw,
      active: pathname.startsWith("/admin/execution/reconciliation"),
    },
  ];

  return (
    <div className="flex border-b border-border mb-6 overflow-x-auto scrollbar-none">
      <div className="flex gap-2 min-w-max pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab.active
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
