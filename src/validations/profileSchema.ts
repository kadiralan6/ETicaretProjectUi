import { z } from "zod";

/**
 * Profil güncelleme formu validasyon şeması.
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Ad alanı zorunludur")
    .max(50, "Ad en fazla 50 karakter olabilir"),
  lastName: z
    .string()
    .min(1, "Soyad alanı zorunludur")
    .max(50, "Soyad en fazla 50 karakter olabilir"),
  phoneNumber: z
    .string()
    .regex(
      /^(\+90|0)?[1-9][0-9]{9}$/,
      "Geçerli bir telefon numarası giriniz (ör: +905001234567)",
    )
    .or(z.literal("")),
  birthDay: z.string().optional().or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

/**
 * Şifre değiştirme formu validasyon şeması.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Mevcut şifre en az 6 karakter olmalıdır"),
    newPassword: z
      .string()
      .min(6, "Yeni şifre en az 6 karakter olmalıdır")
      .regex(/[A-Z]/, "Yeni şifre en az bir büyük harf içermelidir")
      .regex(/[0-9]/, "Yeni şifre en az bir rakam içermelidir"),
    confirmNewPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
