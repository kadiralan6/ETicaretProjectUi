/**
 * Profil sayfası için type tanımları.
 */

/** Backend'den dönen kullanıcı profil verisi */
export interface IUserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string | null;
  birthDay: string | null;
  isActive: boolean;
  roles: string[];
}

/** Profil güncelleme isteği (UpdateUserDto) */
export interface IUpdateUserDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDay: string | null;
}

/** Şifre değiştirme isteği */
export interface IChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/** Backend response wrapper */
export interface IProfileApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T;
}
