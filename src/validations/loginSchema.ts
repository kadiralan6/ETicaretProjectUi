import { z } from "zod";

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t("validationSchema.emailRequired"))
      .email(t("validationSchema.emailValid")),
    password: z
      .string()
      .min(1, t("validationSchema.passwordRequired"))
      .min(6, t("validationSchema.passwordMinLength")),
  });

export type LoginSchemaType = z.infer<ReturnType<typeof loginSchema>>;
