export const siteConfig = {
  name: "E-Ticaret",
  description:
    "Türkiye'nin en güvenilir online alışveriş platformu. Binlerce ürün, uygun fiyat ve hızlı teslimat.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com",
  locale: "tr_TR",
  defaultLocale: "tr" as const,
  locales: ["tr", "en"] as const,
  currency: "TRY",
  currencySymbol: "₺",
  organization: {
    name: "E-Ticaret A.Ş.",
    logo: "/logo.png",
    sameAs: [
      "https://twitter.com/eticaret",
      "https://facebook.com/eticaret",
      "https://instagram.com/eticaret",
    ],
  },
  openGraph: {
    type: "website" as const,
    siteName: "E-Ticaret",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "E-Ticaret",
      },
    ],
  },
} as const;

export type Locale = (typeof siteConfig.locales)[number];
