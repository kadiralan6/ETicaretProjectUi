export interface IBrand {
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

export interface ICreateBrandRequest {
  name: string;
  description?: string;
  slug: string;
}

export interface IUpdateBrandRequest extends Partial<ICreateBrandRequest> {
  id: string | number;
  isActive?: boolean;
}
