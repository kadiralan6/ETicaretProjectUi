import { z } from "zod";

export const productSchema = (t: (key: string) => string) =>
  z.object({
    code: z.string().min(1, t("validationSchema.productCodeRequired")),
    name: z
      .string()
      .min(1, t("validationSchema.productNameRequired"))
      .min(2, t("validationSchema.productNameMin"))
      .max(200, t("validationSchema.productNameMax")),
    description: z.string().optional(),
    price: z
      .number({ message: t("validationSchema.priceNumber") })
      .positive(t("validationSchema.pricePositive")),
    stockQuantity: z
      .number({ message: t("validationSchema.stockNumber") })
      .int(t("validationSchema.stockInt"))
      .min(0, t("validationSchema.stockMin")),
    isFeatured: z.boolean().optional(),
    categoryId: z.string().min(1, t("validationSchema.categoryRequired")),
    brandId: z.string().min(1, t("validationSchema.brandRequired")),
  });

export type ProductSchemaType = z.infer<ReturnType<typeof productSchema>>;
