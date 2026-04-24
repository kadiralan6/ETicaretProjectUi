import "server-only";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { revalidate, tags, headers = {} } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const nextOptions: NextFetchRequestConfig = {};
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;
  if (tags?.length) nextOptions.tags = tags;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    next: nextOptions,
  });

  if (!res.ok) {
    throw new ApiError(
      res.status,
      `API error: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}

// Domain-specific fetchers with built-in caching strategies

export async function fetchStorefrontProduct(slug: string) {
  return fetchApi<{
    isSuccess: boolean;
    data: {
      id: number;
      name: string;
      slug: string;
      description: string;
      shortDescription: string | null;
      metaTitle: string | null;
      metaDescription: string | null;
      price: number;
      currency: string;
      stockQuantity: number;
      isInStock: boolean;
      isActive: boolean;
      isFeatured: boolean;
      createdAt: string;
      category: { name: string; slug: string; imageUrl: string | null };
      categoryPath: string;
      brand: { name: string; slug: string };
      breadcrumbs: Array<{ name: string; slug: string }>;
      images: Array<{ url: string; altText: string | null; isCover: boolean }>;
      rating: { average: number; count: number };
    };
  }>(`/api/catalog/StorefrontProducts/GetBySlug/${slug}`, {
    revalidate: 60,
    tags: ["product", `product-${slug}`],
  });
}

export async function fetchSimilarProducts(slug: string, count = 8) {
  return fetchApi<{
    isSuccess: boolean;
    data: Array<{
      id: number;
      name: string;
      slug: string;
      price: number;
      coverImageUrl: string | null;
      imageUrls: string[];
      categoryName: string;
      brandName: string;
      rating: { average: number; count: number };
    }>;
  }>(`/api/catalog/StorefrontProducts/GetSimilar/${slug}?count=${count}`, {
    revalidate: 120,
    tags: ["similar", `similar-${slug}`],
  });
}

export async function fetchHomeData() {
  return fetchApi<{
    isSuccess: boolean;
    data: {
      featuredProducts: Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        coverImageUrl: string | null;
        imageUrls: string[];
        categoryName: string;
        brandName: string;
        rating: { average: number; count: number };
      }>;
    };
  }>("/api/catalog/Home/getHomeData", {
    revalidate: 300,
    tags: ["home"],
  });
}

export async function fetchProducts(params?: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  isFeatured?: boolean;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params?.categorySlug)
    searchParams.set("categorySlug", params.categorySlug);
  if (params?.brandSlug) searchParams.set("brandSlug", params.brandSlug);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.isFeatured) searchParams.set("isFeatured", "true");

  const query = searchParams.toString();
  const endpoint = `/api/catalog/Products/getAllFilter${query ? `?${query}` : ""}`;

  return fetchApi<{
    isSuccess: boolean;
    data: {
      results: Array<{
        id: number;
        code: string;
        name: string;
        slug: string;
        price: number;
        stockQuantity: number;
        isActive: boolean;
        isFeatured: boolean;
        categoryName: string;
        categorySlug: string;
        brandName: string;
        brandSlug: string;
        imageUrls: string[];
        rating: number;
      }>;
      currentPage: number;
      pageCount: number;
      pageSize: number;
      rowCount: number;
    };
  }>(endpoint, {
    revalidate: 60,
    tags: ["products"],
  });
}

export async function fetchProductBySlug(slug: string) {
  return fetchApi<{
    isSuccess: boolean;
    data: {
      id: number;
      code: string;
      name: string;
      slug: string;
      description: string;
      price: number;
      stockQuantity: number;
      isActive: boolean;
      isFeatured: boolean;
      categoryId: number;
      categoryName: string;
      categorySlug: string;
      brandId: number;
      brandName: string;
      brandSlug: string;
      imageUrls: string[];
      rating: number;
      createdAt: string;
    };
  }>(`/api/catalog/Products/getBySlug/${slug}`, {
    revalidate: 60,
    tags: ["product", `product-${slug}`],
  });
}

export async function fetchCategories() {
  return fetchApi<{
    isSuccess: boolean;
    data: {
      results: Array<{
        id: number;
        name: string;
        slug: string;
        description: string;
        imageUrl: string;
        parentCategoryId: number | null;
        parentCategoryName: string | null;
        displayOrder: number;
        isActive: boolean;
      }>;
      currentPage: number;
      pageCount: number;
      pageSize: number;
      rowCount: number;
    };
  }>("/api/catalog/Categories/getAllFilter", {
    revalidate: 120,
    tags: ["categories"],
  });
}

export async function fetchCategoryBySlug(slug: string) {
  return fetchApi<{
    success: boolean;
    data: {
      id: number;
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
      parentCategoryId: number | null;
      parentCategoryName: string | null;
      displayOrder: number;
      isActive: boolean;
    };
  }>(`/api/catalog/Categories/getBySlug/${slug}`, {
    revalidate: 120,
    tags: ["category", `category-${slug}`],
  });
}

export async function fetchFeaturedProducts() {
  return fetchProducts({ isFeatured: true, pageSize: 8 });
}

export async function fetchSearchResults(
  query: string,
  page: number = 1,
  pageSize: number = 20,
) {
  const searchParams = new URLSearchParams({
    search: query,
    page: String(page),
    pageSize: String(pageSize),
  });

  return fetchApi<{
    isSuccess: boolean;
    data: {
      results: Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        imageUrls: string[];
        categoryName: string;
        brandName: string;
        rating: number;
      }>;
      currentPage: number;
      pageCount: number;
      pageSize: number;
      rowCount: number;
    };
  }>(`/api/catalog/Products/getAllFilter?${searchParams.toString()}`, {
    revalidate: false,
    tags: [],
  });
}
