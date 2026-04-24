import { Metadata } from "next";
import { fetchSearchResults } from "@/infrastructure/api/fetchClient";
import { ProductGrid } from "@/components/shop/ProductGrid/ProductGrid";
import { Pagination } from "@/components/shop/Pagination/Pagination";
import { SearchInput } from "@/features/search/components/SearchInput";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Arama Sonuçları",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

// No caching for search pages
export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q, page } = await searchParams;
  const query = q?.trim() || "";
  const currentPage = Number(page) || 1;

  let products: Array<{
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    categoryName: string;
    brandName: string;
    rating?: number;
  }> = [];
  let totalPages = 1;
  let totalCount = 0;

  if (query) {
    const res = await fetchSearchResults(
      query,
      currentPage,
      20,
    ).catch(() => null);

    if (res) {
      products = res.data.results.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        imageUrl: p.imageUrls[0] ?? null,
        categoryName: p.categoryName,
        brandName: p.brandName,
        rating: p.rating,
      }));
      totalPages = res.data.pageCount;
      totalCount = res.data.rowCount;
    }
  }

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Arama Sonuçları</h1>
        <SearchInput initialQuery={query} />
      </div>

      {query ? (
        <>
          <p className={styles.resultCount}>
            <strong>&ldquo;{query}&rdquo;</strong> için{" "}
            {totalCount} sonuç bulundu
          </p>
          <ProductGrid products={products} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/search"
            searchParams={{ q: query }}
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
          <p className={styles.emptyTitle}>Bir şeyler arayın</p>
          <p className={styles.emptyText}>
            Aradığınız ürünü bulmak için yukarıdaki arama kutusunu
            kullanın.
          </p>
        </div>
      )}
    </div>
  );
}
