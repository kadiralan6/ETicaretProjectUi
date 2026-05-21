import { Metadata } from "next";
import { OrderDetailPageClient } from "@/features/orders/components/OrderDetailPageClient";
import { siteConfig } from "@/core/config/site";

export const metadata: Metadata = {
  title: `Sipariş Detayı | ${siteConfig.name}`,
  description: "Sipariş detaylarınızı görüntüleyin.",
  robots: { index: false, follow: false },
};

export default function OrderDetailPage() {
  return (
    <div className="container">
      <OrderDetailPageClient />
    </div>
  );
}
