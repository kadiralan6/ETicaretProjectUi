"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import { ProductGrid, ProductGridSkeleton } from "@/components/shop/ProductGrid/ProductGrid";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";

interface FeedProduct {
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  categoryName: string;
  brandName: string;
  rating?: number;
}

interface HomeProductsFeedProps {
  initialProducts: FeedProduct[];
}

// Initial load = 8 products = 2 pages of 4 → scroll starts at page 3
const SCROLL_START_PAGE = 3;
const SCROLL_PAGE_SIZE = 4;
const MAX_EXTRA_LOADS = 3;

export const HomeProductsFeed = ({ initialProducts }: HomeProductsFeedProps) => {
  const [products, setProducts] = useState<FeedProduct[]>(initialProducts);
  const [page, setPage] = useState(SCROLL_START_PAGE);
  const [loadCount, setLoadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || loadCount >= MAX_EXTRA_LOADS) return;
    setLoading(true);
    try {
      const res = await nextApiClient.get(NEXT_API_URLS.PRODUCTS, {
        params: { isFeatured: true, pageSize: SCROLL_PAGE_SIZE, page },
      });
      const results: any[] = res.data?.data?.results ?? [];
      if (results.length === 0) {
        setLoadCount(MAX_EXTRA_LOADS);
        return;
      }
      const incoming: FeedProduct[] = results.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        imageUrl: p.imageUrls?.[0] ?? null,
        categoryName: p.categoryName,
        brandName: p.brandName,
        rating: typeof p.rating === "number" ? p.rating : p.rating?.average,
      }));
      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p.slug));
        return [...prev, ...incoming.filter((p) => !seen.has(p.slug))];
      });
      setPage((p) => p + 1);
      setLoadCount((c) => c + 1);
    } catch {
      // silently ignore fetch errors
    } finally {
      setLoading(false);
    }
  }, [loading, loadCount, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const done = loadCount >= MAX_EXTRA_LOADS;

  return (
    <>
      <ProductGrid products={products} priorityCount={4} />
      {loading && <ProductGridSkeleton count={SCROLL_PAGE_SIZE} />}
      {!done && <div ref={sentinelRef} style={{ height: 1 }} />}
    </>
  );
};
