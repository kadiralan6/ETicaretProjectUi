"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/shop/ProductGrid/ProductGrid";
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

const INITIAL_PAGE_SIZE = 8;
const SCROLL_PAGE_SIZE = 4;

interface HomeFeedApiProduct {
  name: string;
  slug: string;
  price: number;
  coverImageUrl: string | null;
  imageUrls: string[];
  categoryName: string;
  brandName: string;
  rating?: { average?: number } | number;
}

interface HomeFeedApiResponse {
  data?: {
    featuredProducts?: HomeFeedApiProduct[];
    totalPages?: number;
  };
}

export const HomeProductsFeed = ({
  initialProducts,
}: HomeProductsFeedProps) => {
  const [products, setProducts] = useState<FeedProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  // page 1 was already fetched server-side with pageSize 8; scroll starts from page 2
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(2);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const requestedPage = pageRef.current;
      const res = await nextApiClient.get<HomeFeedApiResponse>(
        NEXT_API_URLS.HOME,
        {
          params: {
            page: requestedPage,
            pageSize: SCROLL_PAGE_SIZE,
            OrderBy: 0,
            orderType: 0,
          },
        },
      );
      const featuredProducts = res.data?.data?.featuredProducts ?? [];
      const totalPages = res.data?.data?.totalPages ?? 1;

      pageRef.current += 1;

      if (featuredProducts.length > 0) {
        const incoming: FeedProduct[] = featuredProducts.map((p) => ({
          name: p.name,
          slug: p.slug,
          price: p.price,
          imageUrl: p.coverImageUrl ?? p.imageUrls?.[0] ?? null,
          categoryName: p.categoryName,
          brandName: p.brandName,
          rating:
            typeof p.rating === "number" ? p.rating : p.rating?.average,
        }));
        setProducts((prev) => {
          const seen = new Set(prev.map((q) => q.slug));
          return [...prev, ...incoming.filter((q) => !seen.has(q.slug))];
        });
      }

      if (featuredProducts.length === 0 || requestedPage >= totalPages) {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <ProductGrid products={products} priorityCount={4} />
      {loading && <ProductGridSkeleton count={SCROLL_PAGE_SIZE} />}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
    </>
  );
};
