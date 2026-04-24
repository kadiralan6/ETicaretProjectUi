import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchCategoryBySlug,
  fetchProducts,
  fetchCategories,
} from "@/infrastructure/api/fetchClient";
import { generateCategoryMetadata } from "@/core/seo/metadata";
import {
  generateBreadcrumbJsonLd,
  generateItemListJsonLd,
  JsonLdScript,
} from "@/core/seo/jsonLd";
import { siteConfig } from "@/core/config/site";
import { ProductGrid } from "@/components/shop/ProductGrid/ProductGrid";
import { Pagination } from "@/components/shop/Pagination/Pagination";
import { Breadcrumb } from "@/components/shop/Breadcrumb/Breadcrumb";
import styles from "./page.module.css";

export const revalidate = 120;

interface CategoryPageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const categoryRes = await fetchCategoryBySlug(slug).catch(() => null);
  if (!categoryRes?.data) {
    return { title: "Kategori Bulunamadı" };
  }

  const category = categoryRes.data;

  const productsRes = await fetchProducts({
    categorySlug: slug,
    page: currentPage,
    pageSize: 20,
  }).catch(() => null);

  const totalPages = productsRes?.data?.pageCount || 1;

  const metadata = generateCategoryMetadata({
    name: category.name,
    description: category.description,
    slug: category.slug,
    page: currentPage,
    totalPages,
  });

  // Noindex for pages beyond first if they have filter params
  if (currentPage > 1) {
    metadata.robots = {
      index: true,
      follow: true,
    };
  }

  return metadata;
}

export async function generateStaticParams() {
  const res = await fetchCategories().catch(() => null);
  if (!res?.data) return [];

  return res.data.results
    .filter((c) => c.isActive)
    .map((category) => ({
      slug: category.slug,
    }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [categoryRes, productsRes] = await Promise.all([
    fetchCategoryBySlug(slug).catch(() => null),
    fetchProducts({
      categorySlug: slug,
      page: currentPage,
      pageSize: 20,
    }).catch(() => null),
  ]);

  if (!categoryRes?.data) {
    notFound();
  }

  const category = categoryRes.data;
  const products = productsRes?.data?.results ?? [];
  const totalPages = productsRes?.data?.pageCount ?? 1;
  const totalCount = productsRes?.data?.rowCount ?? 0;

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: category.name },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Ana Sayfa", url: "/" },
    {
      name: category.name,
      url: `/category/${category.slug}`,
    },
  ]);

  const itemListJsonLd = generateItemListJsonLd(
    products.map((p) => ({
      name: p.name,
      url: `/product/${p.slug}`,
      imageUrl: p.imageUrls[0] ?? null,
      price: p.price,
    })),
    category.name,
  );

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={itemListJsonLd} />

      {/* Pagination SEO: rel prev/next */}
      {currentPage > 1 && (
        <link
          rel="prev"
          href={
            currentPage === 2
              ? `${siteConfig.url}/category/${slug}`
              : `${siteConfig.url}/category/${slug}?page=${currentPage - 1}`
          }
        />
      )}
      {currentPage < totalPages && (
        <link
          rel="next"
          href={`${siteConfig.url}/category/${slug}?page=${currentPage + 1}`}
        />
      )}

      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.header}>
          <h1 className={styles.title}>{category.name}</h1>
          {category.description && (
            <p className={styles.description}>{category.description}</p>
          )}
          <span className={styles.count}>
            {totalCount} ürün bulundu
          </span>
        </div>

        <ProductGrid
          products={products.map((p) => ({
            name: p.name,
            slug: p.slug,
            price: p.price,
            imageUrl: p.imageUrls[0] ?? null,
            categoryName: p.categoryName,
            brandName: p.brandName,
            rating: p.rating,
          }))}
          priorityCount={4}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/category/${slug}`}
        />
      </div>
    </>
  );
}
