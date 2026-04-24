/**
 * External backend API endpoint paths.
 * Used by fetchClient.ts (server-side only).
 */
export const API_ENDPOINTS = {
  // Catalog - Products
  products: {
    list: "/api/catalog/Products/getAllFilter",
    getBySlug: (slug: string) => `/api/catalog/Products/getBySlug/${slug}`,
    getById: (id: number) => `/api/catalog/Products/getById/${id}`,
  },

  // Catalog - Categories
  categories: {
    list: "/api/catalog/Categories/getAllFilter",
    getBySlug: (slug: string) =>
      `/api/catalog/Categories/getBySlug/${slug}`,
    getById: (id: number) => `/api/catalog/Categories/getById/${id}`,
  },

  // Catalog - Brands
  brands: {
    list: "/api/catalog/Brands/getAllFilter",
    getBySlug: (slug: string) => `/api/catalog/Brands/getBySlug/${slug}`,
    getById: (id: number) => `/api/catalog/Brands/getById/${id}`,
  },

  // Cart
  cart: {
    get: "/gateway/cart/ShoppingCartItems/GetAllShoppingCartItems",
    addItem:
      "/gateway/cart/ShoppingCartItems/CreateShoppingCartItems",
    removeItem:
      "/gateway/cart/ShoppingCartItems/DeleteShoppingCartItem",
  },

  // Orders
  orders: {
    list: "/api/orders/getAll",
    getById: (id: number) => `/api/orders/getById/${id}`,
    create: "/api/orders/create",
  },

  // Auth
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
  },
} as const;
