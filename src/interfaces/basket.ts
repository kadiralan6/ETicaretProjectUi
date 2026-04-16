/**
 * Sepet domain modeli.
 */
export interface BasketItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Basket {
  id: string;
  userId: string;
  items: BasketItem[];
  totalPrice: number;
  itemCount: number;
}

/** Sepete ürün ekleme isteği */
export interface AddToBasketRequest {
  productId: string;
  quantity: number;
}

/** Sepet item güncelleme isteği */
export interface UpdateBasketItemRequest {
  itemId: string;
  quantity: number;
}
