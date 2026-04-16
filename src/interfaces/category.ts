/**
 * Kategori domain modeli.
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
}

/** Kategori oluşturma isteği */
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
}

/** Kategori güncelleme isteği */
export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}
