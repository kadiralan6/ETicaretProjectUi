import { Metadata } from "next";
import { OrdersPageClient } from "@/features/orders/components/OrdersPageClient";
import { siteConfig } from "@/core/config/site";

export const metadata: Metadata = {
  title: `Siparişlerim | ${siteConfig.name}`,
  description: "Geçmiş ve mevcut siparişlerinizi görüntüleyin.",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <div className="container">
      <OrdersPageClient />
    </div>
  );
}
