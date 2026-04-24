import { siteConfig } from "@/core/config/site";

// ─── Product Schema ────────────────────────────────────────

interface ProductJsonLdProps {
  name: string;
  description: string;
  slug: string;
  price: number;
  currency?: string;
  imageUrls: string[];
  brand: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  sku?: string;
}

export function generateProductJsonLd(
  product: ProductJsonLdProps,
): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `${siteConfig.url}/product/${product.slug}`,
    image: product.imageUrls,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: product.currency || siteConfig.currency,
      price: product.price.toFixed(2),
      availability: `https://schema.org/${product.availability || "InStock"}`,
      seller: {
        "@type": "Organization",
        name: siteConfig.organization.name,
      },
    },
  };

  if (product.sku) {
    jsonLd.sku = product.sku;
  }

  if (product.rating && product.reviewCount) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return jsonLd;
}

// ─── Breadcrumb Schema ─────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}${item.url}`,
    })),
  };
}

// ─── Organization Schema ───────────────────────────────────

export function generateOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.organization.logo}`,
    sameAs: siteConfig.organization.sameAs,
  };
}

// ─── WebSite Schema (for sitelinks search box) ────────────

export function generateWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── ItemList Schema (for category pages) ──────────────────

interface ItemListProduct {
  name: string;
  url: string;
  imageUrl: string;
  price: number;
}

export function generateItemListJsonLd(
  products: ItemListProduct[],
  listName: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: product.url.startsWith("http")
        ? product.url
        : `${siteConfig.url}${product.url}`,
    })),
  };
}

// ─── JSON-LD Script Component ──────────────────────────────

export function JsonLdScript({
  data,
}: {
  data: Record<string, unknown>;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
