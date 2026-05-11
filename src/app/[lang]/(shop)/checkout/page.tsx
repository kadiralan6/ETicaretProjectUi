import { Metadata } from "next";
import { CheckoutPage } from "@/pages-lib/CheckoutPage/CheckoutPage";
import { siteConfig } from "@/core/config/site";

export const metadata: Metadata = {
  title: `Ödeme | ${siteConfig.name}`,
  description: "Siparişinizi tamamlayın.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPageRoute() {
  return (
    <div className="container">
      <CheckoutPage />
    </div>
  );
}
