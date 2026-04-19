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

/** Admin - Backend'den gelen ürün detay modeli */
export interface AdminProductDetail {
  id: number;
  code: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  imageUrls: string[];
  isDeleted: boolean;
  createdAt: string;
  createdBy: number | null;
  modifiedAt: string | null;
  modifiedBy: number | null;
  deletedAt: string | null;
  deletedBy: number | null;
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
