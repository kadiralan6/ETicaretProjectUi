import { MetadataRoute } from "next";
import { siteConfig } from "@/core/config/site";
import {
  fetchCategories,
  fetchProducts,
} from "@/infrastructure/api/fetchClient";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Category pages
  const categoriesRes = await fetchCategories().catch(() => null);
  const categories = categoriesRes?.data.results ?? [];
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.isActive)
    .map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  // Product pages
  const productsRes = await fetchProducts({ pageSize: 1000 }).catch(
    () => null,
  );
  const products = productsRes?.data.results ?? [];
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
