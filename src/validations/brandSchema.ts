import { z } from "zod";

export const brandSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("validationSchema.brandNameRequired"))
      .min(2, t("validationSchema.brandNameMin"))
      .max(100, t("validationSchema.brandNameMax")),
    description: z
      .string()
      .max(500, t("validationSchema.descriptionMax"))
      .optional()
      .or(z.literal("")),
    slug: z.string().optional(),
  });

export type BrandSchemaType = z.infer<ReturnType<typeof brandSchema>>;
