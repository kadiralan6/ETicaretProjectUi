/**
 * BFF route handler path sabitleri.
 * nextApiClient bu path'lere /api prefix'i ekleyerek istek atar.
 * Örn: NEXT_API_URLS.PRODUCTS → nextApiClient.get("/api/products")
 */
export const NEXT_API_URLS = {
  // Products
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: string | number) => `/products/${id}`,
  PRODUCT_IMAGES: "/productImages",

  // Categories
  CATEGORIES_ALL_FILTER: "/categories/getAllFilter",
  CATEGORY_BY_ID: (id: string | number) => `/categories/${id}`,
  CATEGORIES_CREATE: "/categories/create",

  // Brands
  BRANDS_GET_ALL: "/brands/getAll",
  BRAND_BY_ID: (id: string | number) => `/brands/${id}`,
  BRANDS_CREATE: "/brands/create",

  // Basket
  BASKET: "/basket",
  BASKET_ITEM: (itemId: string) => `/basket/${itemId}`,
  BASKET_ADD_ITEM: "/basket/add-item-to-basket",

  // Orders
  ORDERS: "/orders",
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
} as const;
