import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  fetchSearchFilter,
  fetchCategories,
  fetchBrands,
} from "@/infrastructure/api/fetchClient";
import { ProductGrid } from "@/components/shop/ProductGrid/ProductGrid";
import { Pagination } from "@/components/shop/Pagination/Pagination";
import { SearchInput } from "@/features/search/components/SearchInput";
import { SearchFilters } from "@/features/search/components/SearchFilters";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Ürün Ara & Filtrele",
  robots: { index: false, follow: true },
};

export const revalidate = 0;

interface SearchPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { lang } = await params;
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortOrder,
    page,
  } = await searchParams;

  const query = q?.trim() || "";
  const currentPage = Number(page) || 1;
  const isInStock = inStock === "true";
  const currentSort =
    sortBy && sortOrder ? `${sortBy}:${sortOrder}` : "";

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    fetchSearchFilter({
      query: query || undefined,
      category: category || undefined,
      brand: brand || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock === "true" ? true : undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
      page: currentPage,
      pageSize: 20,
    }).catch(() => null),
    fetchCategories().catch(() => null),
    fetchBrands().catch(() => null),
  ]);

  const products = (productsRes?.data?.results ?? []).map((p) => ({
    name: p.name,
    slug: p.slug,
    price: p.price,
    imageUrl: p.imageUrls?.[0] ?? null,
    categoryName: p.categoryName,
    brandName: p.brandName ?? "",
    rating: undefined as number | undefined,
  }));
  const totalPages = productsRes?.data?.pageCount ?? 1;
  const totalCount = productsRes?.data?.totalCount ?? 0;
  const categories = categoriesRes?.data?.results ?? [];
  const brands = brandsRes?.data?.results ?? [];

  // Build current search params for Pagination and links
  const currentSearchParams: Record<string, string> = {};
  if (query) currentSearchParams.q = query;
  if (category) currentSearchParams.category = category;
  if (brand) currentSearchParams.brand = brand;
  if (minPrice) currentSearchParams.minPrice = minPrice;
  if (maxPrice) currentSearchParams.maxPrice = maxPrice;
  if (inStock) currentSearchParams.inStock = inStock;
  if (sortBy) currentSearchParams.sortBy = sortBy;
  if (sortOrder) currentSearchParams.sortOrder = sortOrder;

  const buildLink = (overrides: Record<string, string | undefined>) => {
    const ps = new URLSearchParams(currentSearchParams);
    Object.entries(overrides).forEach(([key, val]) => {
      if (val === undefined || val === "") ps.delete(key);
      else ps.set(key, val);
    });
    ps.delete("page");
    return `/${lang}/search?${ps.toString()}`;
  };

  const hasFilters =
    query || category || brand || minPrice || maxPrice || inStock;

  return (
    <div className="container">
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Ürünleri Keşfet</h1>
        <Suspense fallback={<div style={{ height: 48 }} />}>
          <SearchInput initialQuery={query} />
        </Suspense>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className={styles.chips}>
          {query && (
            <span className={styles.chip}>
              <strong>Arama:</strong> {query}
              <Link href={buildLink({ q: undefined })} className={styles.chipRemove}>
                ×
              </Link>
            </span>
          )}
          {category && (
            <span className={styles.chip}>
              <strong>Kategori:</strong>{" "}
              {categories.find((c) => c.name === category)?.name ?? category}
              <Link href={buildLink({ category: undefined })} className={styles.chipRemove}>
                ×
              </Link>
            </span>
          )}
          {brand && (
            <span className={styles.chip}>
              <strong>Marka:</strong> {brand}
              <Link href={buildLink({ brand: undefined })} className={styles.chipRemove}>
                ×
              </Link>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className={styles.chip}>
              <strong>Fiyat:</strong>{" "}
              {minPrice ? `${Number(minPrice).toLocaleString("tr-TR")} ₺` : "0 ₺"} —{" "}
              {maxPrice ? `${Number(maxPrice).toLocaleString("tr-TR")} ₺` : "∞"}
              <Link
                href={buildLink({ minPrice: undefined, maxPrice: undefined })}
                className={styles.chipRemove}
              >
                ×
              </Link>
            </span>
          )}
          {isInStock && (
            <span className={styles.chip}>
              Stokta Var
              <Link href={buildLink({ inStock: undefined })} className={styles.chipRemove}>
                ×
              </Link>
            </span>
          )}
          <Link href={`/${lang}/search`} className={styles.clearAll}>
            Tümünü Temizle
          </Link>
        </div>
      )}

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Interactive filters (sort, price, in-stock) */}
          <div className={styles.sidebarBlock}>
            <Suspense fallback={null}>
              <SearchFilters
                currentMinPrice={minPrice ?? ""}
                currentMaxPrice={maxPrice ?? ""}
                currentInStock={isInStock}
                currentSort={currentSort}
              />
            </Suspense>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className={styles.sidebarBlock}>
              <h2 className={styles.sidebarTitle}>Kategoriler</h2>
              <ul className={styles.filterList}>
                <li>
                  <Link
                    href={buildLink({ category: undefined })}
                    className={`${styles.filterItem} ${!category ? styles.filterItemActive : ""}`}
                  >
                    Tümü
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={buildLink({ category: cat.name })}
                      className={`${styles.filterItem} ${category === cat.name ? styles.filterItemActive : ""}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Brands */}
          {brands.length > 0 && (
            <div className={styles.sidebarBlock}>
              <h2 className={styles.sidebarTitle}>Markalar</h2>
              <ul className={styles.filterList}>
                <li>
                  <Link
                    href={buildLink({ brand: undefined })}
                    className={`${styles.filterItem} ${!brand ? styles.filterItemActive : ""}`}
                  >
                    Tümü
                  </Link>
                </li>
                {brands.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={buildLink({ brand: b.name })}
                      className={`${styles.filterItem} ${brand === b.name ? styles.filterItemActive : ""}`}
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Results */}
        <main className={styles.results}>
          {totalCount > 0 && (
            <p className={styles.resultCount}>
              {hasFilters ? (
                <>
                  Filtrelere göre{" "}
                  <strong>{totalCount}</strong> ürün bulundu
                </>
              ) : (
                <>
                  <strong>{totalCount}</strong> ürün
                </>
              )}
            </p>
          )}

          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/${lang}/search`}
                searchParams={currentSearchParams}
              />
            </>
          ) : (
            <div className={styles.empty}>
              <svg
                className={styles.emptyIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <p className={styles.emptyTitle}>
                {hasFilters ? "Ürün bulunamadı" : "Ürünleri keşfedin"}
              </p>
              <p className={styles.emptyText}>
                {hasFilters
                  ? "Filtrelerinizi değiştirmeyi veya aramayı temizlemeyi deneyin."
                  : "Arama yapın ya da kategori/marka seçerek ürünleri filtreleyin."}
              </p>
              {hasFilters && (
                <Link href={`/${lang}/search`} className={styles.resetLink}>
                  Tüm ürünleri göster
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
