import { z } from "zod";

export const registerSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, t("validationSchema.firstNameRequired"))
        .max(50, t("validationSchema.firstNameMax")),
      lastName: z
        .string()
        .min(1, t("validationSchema.lastNameRequired"))
        .max(50, t("validationSchema.lastNameMax")),
      email: z
        .string()
        .min(1, t("validationSchema.emailRequired"))
        .email(t("validationSchema.emailValid")),
      userName: z
        .string()
        .min(3, t("validationSchema.userNameMin"))
        .max(50, t("validationSchema.userNameMax"))
        .regex(/^[a-z0-9._-]+$/, t("validationSchema.userNameFormat")),
      password: z
        .string()
        .min(6, t("validationSchema.passwordMinLength"))
        .regex(/[A-Z]/, t("validationSchema.passwordUppercase"))
        .regex(/[0-9]/, t("validationSchema.passwordNumber")),
      confirmPassword: z.string().min(1, t("validationSchema.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validationSchema.passwordsMustMatch"),
      path: ["confirmPassword"],
    });

export type RegisterSchemaType = z.infer<ReturnType<typeof registerSchema>>;
