import { use } from "react";
import AdminTransactionDetailView from "@/components/admin/AdminTransactionDetailView";

interface AdminTransactionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminTransactionDetailPage({ params }: AdminTransactionDetailPageProps) {
  const resolvedParams = use(params);
  return <AdminTransactionDetailView transactionId={resolvedParams.id} />;
}
