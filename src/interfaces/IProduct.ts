export interface IProduct {
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

export interface IProductListItem {
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

/** Admin — backend'den gelen ürün detay modeli */
export interface IAdminProductDetail {
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

/** Admin ürün liste satırı */
export interface IAdminProductListItem {
  id: number;
  code: string;
  name: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  categoryName: string;
  brandName: string;
}

export interface ICreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  brandId: string;
  images: string[];
}

export interface IUpdateProductRequest extends Partial<ICreateProductRequest> {
  id: string;
}
