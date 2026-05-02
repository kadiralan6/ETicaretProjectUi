import { ReactNode } from "react";
import { Metadata } from "next";
import "@/styles/shop-globals.css";
import { Header } from "@/components/shop/Header/Header";
import { Footer } from "@/components/shop/Footer/Footer";
import { siteConfig } from "@/core/config/site";
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  JsonLdScript,
} from "@/core/seo/jsonLd";
import { fetchCategories } from "@/infrastructure/api/fetchClient";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Online Alışveriş`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.openGraph.siteName,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const res = await fetchCategories().catch(() => null);
  const categories = res?.data?.results
    ?.filter((c) => c.isActive && c.parentCategoryId === null)
    ?.slice(0, 6)
    ?.map((c) => ({ name: c.name, slug: c.slug })) || [];

  return (
    <>
      <JsonLdScript data={generateOrganizationJsonLd()} />
      <JsonLdScript data={generateWebSiteJsonLd()} />
      <Header categories={categories} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
