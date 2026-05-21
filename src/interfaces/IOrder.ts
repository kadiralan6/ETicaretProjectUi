// ─── Numeric status enum (getMyOrders / getDetail) ─────────────
export type IOrderStatusCode = 0 | 1 | 2 | 3 | 4 | 5;
// 0=Pending, 1=Confirmed, 2=Shipped, 3=Delivered, 4=Cancelled, 5=PaymentFailed

// ─── My Orders list ─────────────────────────────────────────────
export interface IMyOrder {
  orderId: number;
  orderNumber: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: IOrderStatusCode;
  createdAt: string;
}

// ─── Order Detail ────────────────────────────────────────────────
export interface IOrderDetailImage {
  id: number;
  url: string;
  isCover: boolean;
  altText: string;
}

export interface IOrderDetailItem {
  productId: number;
  productName: string;
  brandName: string;
  categoryName: string;
  images: IOrderDetailImage[];
  quantity: number;
  price: number;
  totalNetPrice: number;
}

export interface IOrderDetailAddress {
  id: number;
  title: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  fullAddress: string;
  postalCode: string;
}

export interface IOrderDetailBuyer {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface IOrderDetail {
  orderId: number;
  orderNumber: string;
  status: IOrderStatusCode;
  totalPrice: number;
  createdAt: string;
  items: IOrderDetailItem[];
  address: IOrderDetailAddress | null;
  buyer: IOrderDetailBuyer | null;
}

// ─── Checkout / Place Order ──────────────────────────────────────
export interface ICreateOrderCardInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
}

export interface ICreateOrderItem {
  productId: number;
  quantity: number;
}

export type IPaymentMethod = 1 | 2 | 3; // 1=CreditCard, 2=DebitCard, 3=BankTransfer

export interface ICreateOrderRequest {
  cartId?: number;
  addressId: number;
  paymentMethod: IPaymentMethod;
  cardInfo: ICreateOrderCardInfo | null;
  amount: number;
  currency?: string;
  items: ICreateOrderItem[];
}

export interface IPlaceOrderResponse {
  orderId: number;
  orderStatus: number;
  paymentTransactionId: number;
  transactionId: string;
  paymentStatus: number;
  amount: number;
  currency: string;
}
