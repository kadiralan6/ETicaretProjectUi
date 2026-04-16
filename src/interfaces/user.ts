/**
 * Kullanıcı domain modeli.
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "Customer" | "Admin";
  createdAt: string;
}

/** Giriş isteği */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Kayıt isteği */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Backend login response */
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}
