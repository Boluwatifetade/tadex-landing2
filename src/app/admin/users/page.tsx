import AdminUserTable from "@/components/admin/AdminUserTable";
import { Users } from "lucide-react";

export const metadata = {
  title: "User Directory | Tadex Admin",
  description: "Manage registered traders, connected exchange keys, subscriptions, and security status.",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-foreground font-bold text-xl">
          <Users className="h-6 w-6 text-primary" />
          <h1>User Management</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Search, audit, inspect 360° user profiles, manage connected API keys, and enforce security policies.
        </p>
      </div>

      {/* Directory Table */}
      <AdminUserTable />
    </div>
  );
}
