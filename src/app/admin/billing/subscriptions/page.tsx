import AdminBillingNav from "@/components/admin/AdminBillingNav";
import AdminSubscriptionLedgerTable from "@/components/admin/AdminSubscriptionLedgerTable";
import { Radio } from "lucide-react";

export const metadata = {
  title: "Subscription Ledger | Tadex Admin",
  description: "Cross-user subscription directory, status overrides, and cancellation governance.",
};

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-foreground font-bold text-xl">
          <Radio className="h-6 w-6 text-primary" />
          <h1>Billing & Revenue</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Inspect platform-wide subscriber active periods, enforce cancellation timing, and override lifecycle statuses.
        </p>
      </div>

      {/* Subnavigation */}
      <AdminBillingNav />

      {/* Subscription Ledger Table */}
      <AdminSubscriptionLedgerTable />
    </div>
  );
}
