/**
 * TanStack React Query cache key sabitleri.
 * Query invalidation ve cache yönetimi için tutarlı key'ler sağlar.
 */
export const QUERY_KEYS = {
  // Products
  PRODUCTS: "products",
  PRODUCT_DETAIL: (id: string | number) => ["products", String(id)] as const,

  // Categories
  CATEGORIES: "categories",
  CATEGORY_DETAIL: (id: string | number) => ["categories", String(id)] as const,

  // Brands
  BRANDS: "brands",
  BRAND_DETAIL: (id: string | number) => ["brands", String(id)] as const,

  // Basket
  BASKET: "basket",

  // Orders
  ORDERS: "orders",
  ORDER_DETAIL: (id: string) => ["orders", id] as const,

  // User
  USER: "user",
} as const;
