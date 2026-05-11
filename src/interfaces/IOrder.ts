export interface IOrderItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type IOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface IOrderShippingAddress {
  title: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode: string;
}

export interface IOrder {
  id: number;
  userId: number;
  items: IOrderItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
  status: IOrderStatus;
  shippingAddress: IOrderShippingAddress;
  paymentMethod: "CreditCard";
  createdAt: string;
  updatedAt: string;
}

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
  cartId: number;
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
