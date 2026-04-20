/**
 * Barrel export — tüm domain model interface'leri tek yerden import edilebilir.
 */
export type { IApiResponse, IPaginatedResponse, IApiError } from "./IApi";
export type {
  IProduct,
  IProductListItem,
  IAdminProductDetail,
  IAdminProductListItem,
  ICreateProductRequest,
  IUpdateProductRequest,
} from "./IProduct";
export type {
  ICategory,
  IAdminCategory,
  IAdminCategoryDetail,
  IAdminSubCategory,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
} from "./ICategory";
export type { IBrand, ICreateBrandRequest, IUpdateBrandRequest } from "./IBrand";
export type {
  IBasket,
  IBasketItem,
  IAddToBasketRequest,
  IUpdateBasketItemRequest,
} from "./IBasket";
export type {
  IOrder,
  IOrderItem,
  IOrderStatus,
  ICreateOrderRequest,
} from "./IOrder";
export type { IUser, ILoginRequest, IRegisterRequest, ILoginResponse } from "./IUser";
