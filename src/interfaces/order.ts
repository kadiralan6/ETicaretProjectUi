/**
 * Sipariş domain modeli.
 */
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

/** Sipariş oluşturma isteği */
export interface CreateOrderRequest {
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}
