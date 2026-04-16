/**
 * Marka domain modeli.
 */
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
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
