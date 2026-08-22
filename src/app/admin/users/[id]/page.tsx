import { use } from "react";
import AdminUserDetailView from "@/components/admin/AdminUserDetailView";

interface AdminUserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const resolvedParams = use(params);
  return <AdminUserDetailView userId={resolvedParams.id} />;
}
