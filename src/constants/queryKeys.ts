/**
 * TanStack React Query key sabitleri.
 * Query invalidation ve cache yönetimi için tutarlı key'ler sağlar.
 */
export const QUERY_KEYS = {
  // Products
  PRODUCTS: ["products"] as const,
  PRODUCT_DETAIL: (id: string) => ["products", id] as const,

  // Categories
  CATEGORIES: ["categories"] as const,
  CATEGORY_DETAIL: (id: string) => ["categories", id] as const,

  // Brands
  BRANDS: ["brands"] as const,
  BRAND_DETAIL: (id: string) => ["brands", id] as const,

  // Basket
  BASKET: ["basket"] as const,

  // Orders
  ORDERS: ["orders"] as const,
  ORDER_DETAIL: (id: string) => ["orders", id] as const,

  // User
  USER: ["user"] as const,
} as const;
