import AdminBillingNav from "@/components/admin/AdminBillingNav";
import AdminPlatformFeesView from "@/components/admin/AdminPlatformFeesView";
import { Settings2 } from "lucide-react";

export const metadata = {
  title: "Platform Fees & Splits | Tadex Admin",
  description: "Configure global platform fees, revenue split formulas, and review pricing audit logs.",
};

export default function AdminFeesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-foreground font-bold text-xl">
          <Settings2 className="h-6 w-6 text-primary" />
          <h1>Billing & Revenue</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Manage platform fee configurations, revenue split distributions, and fee change history.
        </p>
      </div>

      {/* Subnavigation */}
      <AdminBillingNav />

      {/* Fees View */}
      <AdminPlatformFeesView />
    </div>
  );
}
