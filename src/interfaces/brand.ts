/**
 * Marka domain modeli (API: GetBrandDto / PagedResult).
 */
export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean | null;
  isDeleted: boolean;
  createdAt: string;
  createdBy: number | null;
  modifiedAt: string | null;
  modifiedBy: number | null;
  deletedAt: string | null;
  deletedBy: number | null;
}

/** Marka oluşturma isteği */
export interface CreateBrandRequest {
  name: string;
  description?: string;
  logoUrl?: string;
}

/** Marka güncelleme isteği */
export interface UpdateBrandRequest extends Partial<CreateBrandRequest> {
  id: string;
}
