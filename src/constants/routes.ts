/**
 * Sayfa route sabitleri — hardcoded URL string'ler yerine bu sabitleri kullanın.
 */
export const ROUTES = {
  // Shop
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCT_CREATE: "/admin/products/create",
  ADMIN_PRODUCT_EDIT: (id: string) => `/admin/products/${id}`,
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_CATEGORY_CREATE: "/admin/categories/create",
  ADMIN_CATEGORY_EDIT: (id: string) => `/admin/categories/${id}`,
  ADMIN_BRANDS: "/admin/brands",
  ADMIN_BRAND_CREATE: "/admin/brands/create",
  ADMIN_BRAND_EDIT: (id: string) => `/admin/brands/${id}`,
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_CAMPAIGNS: "/admin/campaigns",
} as const;
