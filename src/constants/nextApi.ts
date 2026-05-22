/**
 * BFF route handler path sabitleri.
 * nextApiClient bu path'lere /api prefix'i ekleyerek istek atar.
 * Örn: NEXT_API_URLS.PRODUCTS → nextApiClient.get("/api/products")
 */
export const NEXT_API_URLS = {
  // Home
  HOME: "/home",

  // Products
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: string | number) => `/products/${id}`,
  PRODUCT_IMAGES: "/productImages",
  PRODUCT_IMAGES_BY_ID: (id: number | string) => `/productImages/${id}`,

  // Categories
  CATEGORIES_ALL_FILTER: "/categories/getAllFilter",
  CATEGORY_BY_ID: (id: string | number) => `/categories/${id}`,
  CATEGORIES_CREATE: "/categories/create",

  // Brands
  BRANDS_GET_ALL: "/brands/getAll",
  BRAND_BY_ID: (id: string | number) => `/brands/${id}`,
  BRANDS_CREATE: "/brands/create",

  // Basket (legacy)
  BASKET: "/basket",
  BASKET_ITEM: (itemId: string) => `/basket/${itemId}`,
  BASKET_ADD_ITEM: "/basket/add-item-to-basket",

  // Cart (Basket Service)
  CART: "/carts",
  CART_COUNT: "/carts/count",
  CART_ITEMS: "/carts/items",
  CART_ITEM: (cartItemId: number | string) => `/carts/items/${cartItemId}`,
  CART_COUPON: "/carts/coupon",
  CART_COUPON_REMOVE: (cartId: number | string) => `/carts/coupon/${cartId}`,
  CART_CLEAR: "/carts/clear",

  // Orders
  ORDERS: "/orders",
  ORDER_BY_ID: (id: string) => `/orders/${id}`,

  // Profile
  PROFILE: "/profile",
  PROFILE_PASSWORD: "/profile/password",

  // Addresses
  ADDRESSES: "/addresses",
  ADDRESS_BY_ID: (id: number | string) => `/addresses/${id}`,

  // Campaigns
  CAMPAIGNS_GET_ALL_FILTER: "/campaigns/getAllFilter",
  CAMPAIGN_BY_ID: (id: string | number) => `/campaigns/${id}`,
  CAMPAIGNS_CREATE: "/campaigns/create",

  // Coupons
  COUPONS_GET_ALL_FILTER: "/coupons/getAllFilter",
  COUPON_BY_ID: (id: string | number) => `/coupons/${id}`,
  COUPONS_CREATE: "/coupons/create",
} as const;
