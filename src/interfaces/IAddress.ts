export interface IAddress {
  id: number;
  userId: number;
  title: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode: string;
  isDefault: boolean;
}

export interface ICreateAddressRequest {
  title: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode: string;
  isDefault: boolean;
}

export type IUpdateAddressRequest = ICreateAddressRequest;
