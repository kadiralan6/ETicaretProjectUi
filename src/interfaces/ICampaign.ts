export const CampaignTypeCommonEnum = {
  Percentage: 1,
  FixedAmount: 2,
} as const;

export type CampaignTypeCommon =
  (typeof CampaignTypeCommonEnum)[keyof typeof CampaignTypeCommonEnum];

export const OrderTypeEnum = {
  ASC: 0,
  DESC: 1,
} as const;

export type OrderType = (typeof OrderTypeEnum)[keyof typeof OrderTypeEnum];

export const CampaignOrderByEnum = {
  CreatedAt: 0,
  ModifiedAt: 1,
  StartDate: 2,
  EndDate: 3,
  Name: 4,
} as const;

export type CampaignOrderBy =
  (typeof CampaignOrderByEnum)[keyof typeof CampaignOrderByEnum];

export interface ICampaign {
  id: number;
  name: string;
  type: CampaignTypeCommon;
  discountValue: number;
  minimumOrderAmount: number;
  startDate: string;
  endDate: string;
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

export interface ICreateCampaignRequest {
  name: string;
  type: CampaignTypeCommon;
  discountValue: number;
  minimumOrderAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
}

export interface IUpdateCampaignRequest extends ICreateCampaignRequest {
  id: number;
  isActive: boolean;
}

export interface ICampaignFilter {
  page?: number;
  pageSize?: number;
  orderBy?: CampaignOrderBy;
  orderType?: OrderType;
  search?: string;
  name?: string;
  type?: CampaignTypeCommon;
  isActive?: boolean;
  activeOn?: string;
}
