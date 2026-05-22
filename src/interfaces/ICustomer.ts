export interface ICustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Customer" | "Admin";
  orderCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface ICreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "Customer" | "Admin";
}

export interface IUpdateCustomerRequest {
  firstName: string;
  lastName: string;
  phone: string;
  role: "Customer" | "Admin";
  isActive: boolean;
}

export type CustomerOrderBy = "createdAt" | "firstName" | "email";

export const CustomerOrderByEnum = {
  CreatedAt: "createdAt",
  FirstName: "firstName",
  Email: "email",
} as const;
