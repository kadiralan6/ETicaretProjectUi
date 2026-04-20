export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "Customer" | "Admin";
  createdAt: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ILoginResponse {
  token: string;
  refreshToken: string;
  user: IUser;
}
