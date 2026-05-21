export interface IProductImage {
  id: number;
  url: string;
  isMain: boolean;
}

export interface IAppliedCoupon {
  id: number;
  code: string;
  type: number;
  discountValue: number;
  minimumOrderAmount: number | null;
  expirationDate: string;
  discountAmount: number;
}

export interface IAppliedCampaign {
  id: number;
  name: string | null;
  type: number;
  discountValue: number;
  minimumOrderAmount: number | null;
  startDate: string;
  endDate: string;
  discountAmount: number;
}

export interface ICartItem {
  cartItemId: number;
  userId: number;
  productId: number;
  quantity: number;
  couponId: number | null;
  orderNumber: string | null;
  productName: string | null;
  productCode: string | null;
  productSlug: string | null;
  unitPrice: number;
  lineTotal: number;
  stockQuantity: number;
  isActive: boolean;
  categoryName: string | null;
  brandName: string | null;
  images: IProductImage[];
  imageUrl: string;
}

export interface ICart {
  items: ICartItem[];
  totalQuantity: number;
  uniqueItemCount: number;
  subTotal: number;
  shippingCost: number;
  appliedCoupon: IAppliedCoupon | null;
  appliedCampaign: IAppliedCampaign | null;
  totalDiscount: number;
  total: number;
}

export interface ICartItemCount {
  userId: number;
  totalQuantity: number;
  uniqueItemCount: number;
}

export interface IAddCartItemRequest {
  productId: number;
  productName: string;
  productSlug: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
}

export interface IUpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}

export interface IApplyCouponRequest {
  couponCode: string;
}
