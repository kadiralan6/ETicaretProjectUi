import { AdminCouponUpdatePage } from "@/pages-lib/AdminCouponUpdatePage/AdminCouponUpdatePage";

export default async function Index({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminCouponUpdatePage params={params} />;
}
