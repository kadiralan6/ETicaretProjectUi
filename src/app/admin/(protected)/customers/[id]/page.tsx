import { AdminCustomerDetailPage } from "@/pages-lib/AdminCustomerDetailPage/AdminCustomerDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  return <AdminCustomerDetailPage customerId={id} />;
}
