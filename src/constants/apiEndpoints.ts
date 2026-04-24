const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const CATALOG_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // You can change this if Catalog API is on a different URL/port

export const ADD_TO_BASKET: string = `${BASE_URL}/gateway/cart/ShoppingCartItems/CreateShoppingCartItems`;
export const GET_BASKET: string = `${BASE_URL}/gateway/cart/ShoppingCartItems/GetAllShoppingCartItems`;
export const REMOVE_FROM_BASKET: string = `${BASE_URL}/gateway/cart/ShoppingCartItems/DeleteShoppingCartItem`;

// Catalog - Home
export const GET_HOME_DATA: string = `${CATALOG_BASE_URL}/api/catalog/Home/getHomeData`;

// Catalog - Brands
export const GET_ALLFILTER_BRANDS: string = `${CATALOG_BASE_URL}/api/catalog/Brands/getAllFilter`;
export const GET_BRAND_BY_ID: string = `${CATALOG_BASE_URL}/api/catalog/Brands/getById`;
export const CREATE_BRAND: string = `${CATALOG_BASE_URL}/api/catalog/Brands/create`;
export const UPDATE_BRAND: string = `${CATALOG_BASE_URL}/api/catalog/Brands/update`;
export const DELETE_BRAND: string = `${CATALOG_BASE_URL}/api/catalog/Brands/delete`;

// Catalog - Categories
export const GET_ALL_CATEGORIES: string = `${CATALOG_BASE_URL}/api/catalog/Categories/getAllFilter`;
export const GET_CATEGORY_BY_ID: string = `${CATALOG_BASE_URL}/api/catalog/Categories/getById`;
export const GET_ADMIN_DETAIL_CATEGORY: string = `${CATALOG_BASE_URL}/api/catalog/Categories/getAdminDetail`;
export const CREATE_CATEGORY: string = `${CATALOG_BASE_URL}/api/catalog/Categories/create`;
export const UPDATE_CATEGORY: string = `${CATALOG_BASE_URL}/api/catalog/Categories/update`;
export const DELETE_CATEGORY: string = `${CATALOG_BASE_URL}/api/catalog/Categories/delete`;

// Catalog - Products
export const GET_ALLFILTER_PRODUCTS: string = `${CATALOG_BASE_URL}/api/catalog/Products/getAllFilter`;
export const GET_ALL_PRODUCTS: string = `${CATALOG_BASE_URL}/api/catalog/Products/getAll`;
export const GET_PRODUCT_BY_ID: string = `${CATALOG_BASE_URL}/api/catalog/Products/getById`;
export const CREATE_PRODUCT: string = `${CATALOG_BASE_URL}/api/catalog/Products/create`;
export const UPDATE_PRODUCT: string = `${CATALOG_BASE_URL}/api/catalog/Products/update`;
export const DELETE_PRODUCT: string = `${CATALOG_BASE_URL}/api/catalog/Products/delete`;
export const CREATE_PRODUCT_IMAGE: string = `${CATALOG_BASE_URL}/api/catalog/ProductImages/create`;
export const UPDATE_PRODUCT_IMAGE: string = `${CATALOG_BASE_URL}/api/catalog/ProductImages/update`;
export const DELETE_PRODUCT_IMAGE: string = `${CATALOG_BASE_URL}/api/catalog/ProductImages/delete`;

// Orders
export const GET_ALL_ORDERS: string = `${BASE_URL}/api/orders/getAll`;
export const GET_ORDER_BY_ID: string = `${BASE_URL}/api/orders/getById`;
export const CREATE_ORDER: string = `${BASE_URL}/api/orders/create`;

// Auth / Identity
export const AUTH_LOGIN: string = `${BASE_URL}/api/auth/login`;
export const AUTH_REGISTER: string = `${BASE_URL}/api/auth/register`;
