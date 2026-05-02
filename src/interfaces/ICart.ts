// Backend: /api/basket/carts/* endpoint response types

export interface ICartItem {
  id: number;
  cartId: number;
  productId: number;
  productName: string;
  productSlug: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ICart {
  id: number;
  userId: number;
  couponId: number | null;
  couponCode: string | null;
  subtotal: number;
  discountAmount: number;
  total: number;
  items: ICartItem[];
}

export interface ICartItemCount {
  userId: number;
  totalQuantity: number;
  uniqueItemCount: number;
}

// Request types

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
  cartId: number;
  couponCode: string;
}
