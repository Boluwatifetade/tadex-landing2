"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Receipt, Radio, Settings2 } from "lucide-react";

export default function AdminBillingNav() {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/admin/billing/transactions",
      label: "Transaction Ledger",
      icon: Receipt,
      active: pathname.startsWith("/admin/billing/transactions"),
    },
    {
      href: "/admin/billing/subscriptions",
      label: "Subscription Ledger",
      icon: Radio,
      active: pathname.startsWith("/admin/billing/subscriptions"),
    },
    {
      href: "/admin/billing/fees",
      label: "Platform Fees & Splits",
      icon: Settings2,
      active: pathname.startsWith("/admin/billing/fees"),
    },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-border pb-2 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              tab.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
