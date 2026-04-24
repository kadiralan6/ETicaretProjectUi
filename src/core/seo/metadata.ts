import { Metadata } from "next";
import { siteConfig } from "@/core/config/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  images?: Array<{ url: string; width: number; height: number; alt: string }>;
  type?: "website" | "article" | "product";
}

export function generatePageMetadata(
  options: PageMetadataOptions,
): Metadata {
  const {
    title,
    description,
    path,
    noindex = false,
    images,
    type = "website",
  } = options;

  const canonical = `${siteConfig.url}${path}`;
  const ogImages = images || siteConfig.openGraph.images;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "tr-TR": `${siteConfig.url}/tr${path}`,
        "en-US": `${siteConfig.url}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.openGraph.siteName,
      type: type === "product" ? "website" : type,
      locale: siteConfig.locale,
      images: ogImages.map((img) => ({
        ...img,
        url: img.url.startsWith("http")
          ? img.url
          : `${siteConfig.url}${img.url}`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) =>
        img.url.startsWith("http")
          ? img.url
          : `${siteConfig.url}${img.url}`,
      ),
    },
  };

  if (noindex) {
    metadata.robots = {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    };
  }

  return metadata;
}

// Generate pagination link headers for SEO
export function generatePaginationLinks(
  basePath: string,
  currentPage: number,
  totalPages: number,
): Pick<Metadata, "alternates"> & { other: Record<string, string>[] } {
  const links: Record<string, string>[] = [];

  if (currentPage > 1) {
    const prevPage = currentPage - 1;
    const prevUrl =
      prevPage === 1
        ? `${siteConfig.url}${basePath}`
        : `${siteConfig.url}${basePath}?page=${prevPage}`;
    links.push({ rel: "prev", href: prevUrl });
  }

  if (currentPage < totalPages) {
    links.push({
      rel: "next",
      href: `${siteConfig.url}${basePath}?page=${currentPage + 1}`,
    });
  }

  return {
    alternates: {
      canonical:
        currentPage === 1
          ? `${siteConfig.url}${basePath}`
          : `${siteConfig.url}${basePath}?page=${currentPage}`,
    },
    other: links,
  };
}

export function generateProductMetadata(product: {
  name: string;
  description: string;
  slug: string;
  price: number;
  imageUrls: string[];
  categoryName: string;
  brandName: string;
}): Metadata {
  const path = `/product/${product.slug}`;
  const title = `${product.name} | ${product.brandName} - ${siteConfig.name}`;
  const description =
    product.description.length > 160
      ? product.description.slice(0, 157) + "..."
      : product.description;

  return generatePageMetadata({
    title,
    description,
    path,
    type: "product",
    images: product.imageUrls.length
      ? product.imageUrls.map((url) => ({
          url,
          width: 800,
          height: 800,
          alt: product.name,
        }))
      : undefined,
  });
}

export function generateCategoryMetadata(category: {
  name: string;
  description?: string;
  slug: string;
  page?: number;
  totalPages?: number;
}): Metadata {
  const basePath = `/category/${category.slug}`;
  const page = category.page || 1;
  const title =
    page > 1
      ? `${category.name} - Sayfa ${page} | ${siteConfig.name}`
      : `${category.name} | ${siteConfig.name}`;
  const description =
    category.description ||
    `${category.name} kategorisindeki tüm ürünleri keşfedin. En uygun fiyatlar ve hızlı teslimat.`;

  const metadata = generatePageMetadata({
    title,
    description,
    path: page > 1 ? `${basePath}?page=${page}` : basePath,
  });

  if (category.totalPages && category.totalPages > 1) {
    const paginationLinks = generatePaginationLinks(
      basePath,
      page,
      category.totalPages,
    );
    metadata.alternates = {
      ...metadata.alternates,
      ...paginationLinks.alternates,
    };
  }

  return metadata;
}
