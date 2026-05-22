import { AdminCampaignUpdatePage } from "@/pages-lib/AdminCampaignUpdatePage/AdminCampaignUpdatePage";

export default async function Index({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminCampaignUpdatePage params={params} />;
}
