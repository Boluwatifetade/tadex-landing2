import AdminBillingNav from "@/components/admin/AdminBillingNav";
import AdminTransactionsTable from "@/components/admin/AdminTransactionsTable";
import { Receipt } from "lucide-react";

export const metadata = {
  title: "Transactions Ledger | Tadex Admin",
  description: "Cross-platform payment transactions ledger, split analysis, and diagnostics.",
};

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-foreground font-bold text-xl">
          <Receipt className="h-6 w-6 text-primary" />
          <h1>Billing & Revenue</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor payment settlements, gateway webhooks, split distributions, and manual reconciliations.
        </p>
      </div>

      {/* Subnavigation */}
      <AdminBillingNav />

      {/* Transactions Table */}
      <AdminTransactionsTable />
    </div>
  );
}
