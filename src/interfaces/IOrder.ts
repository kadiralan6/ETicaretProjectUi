export interface IOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export type IOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  totalPrice: number;
  status: IOrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOrderRequest {
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}
