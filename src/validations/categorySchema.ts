import { z } from "zod";

export const categorySchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("validationSchema.categoryNameRequired"))
      .min(2, t("validationSchema.categoryNameMin"))
      .max(100, t("validationSchema.categoryNameMax")),
    description: z
      .string()
      .max(500, t("validationSchema.descriptionMax"))
      .optional()
      .or(z.literal("")),
  });

export type CategorySchemaType = z.infer<ReturnType<typeof categorySchema>>;
