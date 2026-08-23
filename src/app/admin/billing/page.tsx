import { redirect } from "next/navigation";

export default function AdminBillingRootPage() {
  redirect("/admin/billing/transactions");
}
