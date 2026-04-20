export interface ICategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
}

/** Admin kategori listesi satırı */
export interface IAdminCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
  displayOrder: number;
  isActive: boolean;
}

/** Admin kategori detay (alt kategoriler dahil) */
export interface IAdminCategoryDetail {
  id: number;
  name: string;
  description: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  subCategories?: IAdminSubCategory[];
}

export interface IAdminSubCategory {
  id: number;
  name: string | null;
  description: string | null;
  slug: string | null;
  imageUrl: string | null;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ICreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
}

export interface IUpdateCategoryRequest extends Partial<ICreateCategoryRequest> {
  id: string;
}
