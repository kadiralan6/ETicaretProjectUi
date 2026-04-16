/**
 * Ürün domain modeli.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName?: string;
  brandId: string;
  brandName?: string;
  images: string[];
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Ürün listesi için basitleştirilmiş interface */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  categoryName: string;
  brandName: string;
  image: string;
  rating: number;
  stock: number;
}

/** Ürün oluşturma isteği */
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  brandId: string;
  images: string[];
}

/** Ürün güncelleme isteği */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}
