import { AdminCategoryUpdatePage } from "@/pages-lib/AdminCategoryUpdatePage/AdminCategoryUpdatePage";

export default async function Index({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminCategoryUpdatePage params={params} />;
}
