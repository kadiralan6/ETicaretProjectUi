import { AdminBrandUpdatePage } from "@/pages-lib/AdminBrandUpdatePage/AdminBrandUpdatePage";

export default async function Index({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminBrandUpdatePage params={params} />;
}
