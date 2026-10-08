"use client";

import { use } from "react";
import ProviderDetailView from "@/components/dashboard/ProviderDetailView";

interface ProviderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProviderDetailPage({ params }: ProviderDetailPageProps) {
  const resolvedParams = use(params);

  return (
    <div className="space-y-6">
      <ProviderDetailView providerId={resolvedParams.id} />
    </div>
  );
}
