import type {
  CampaignTypeCommon,
  OrderType,
} from "@/interfaces/ICampaign";

export const CouponOrderByEnum = {
  CreatedAt: 0,
  ModifiedAt: 1,
  ExpirationDate: 2,
  Code: 3,
} as const;

export type CouponOrderBy =
  (typeof CouponOrderByEnum)[keyof typeof CouponOrderByEnum];

export interface ICoupon {
  id: number;
  code: string;
  type: CampaignTypeCommon;
  discountValue: number;
  minimumOrderAmount: number;
  expirationDate: string;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  isDeleted: boolean;
  createdAt: string;
  createdBy: number | null;
  modifiedAt: string | null;
  modifiedBy: number | null;
  deletedAt: string | null;
  deletedBy: number | null;
}

export interface ICreateCouponRequest {
  code: string;
  type: CampaignTypeCommon;
  discountValue: number;
  minimumOrderAmount: number;
  expirationDate: string;
  usageLimit: number;
}

export interface IUpdateCouponRequest extends ICreateCouponRequest {
  id: number;
  isActive: boolean;
}

export interface ICouponFilter {
  page?: number;
  pageSize?: number;
  orderBy?: CouponOrderBy;
  orderType?: OrderType;
  search?: string;
  code?: string;
  type?: CampaignTypeCommon;
  isActive?: boolean;
  expiresAfter?: string;
}
