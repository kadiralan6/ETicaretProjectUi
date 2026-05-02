import { Metadata } from "next";
import { CartPageClient } from "@/features/cart/components/CartPageClient";
import { siteConfig } from "@/core/config/site";

export const metadata: Metadata = {
  title: `Sepetim | ${siteConfig.name}`,
  description: "Sepetinizi görüntüleyin, ürün miktarlarını düzenleyin ve alışverişinizi tamamlayın.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  return (
    <div className="container">
      <CartPageClient />
    </div>
  );
}
