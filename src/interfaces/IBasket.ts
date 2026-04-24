export interface IBasketItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface IBasket {
  id: string;
  userId: string;
  items: IBasketItem[];
  totalPrice: number;
  itemCount: number;
}

export interface IAddToBasketRequest {
  productId: string;
  quantity: number;
}

export interface IUpdateBasketItemRequest {
  itemId: string;
  quantity: number;
}
