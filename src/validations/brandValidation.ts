import { z } from "zod";

/**
 * Marka oluşturma/güncelleme form validasyon şeması.
 */
export const brandSchema = z.object({
  name: z
    .string()
    .min(1, "Marka adı gereklidir")
    .min(2, "Marka adı en az 2 karakter olmalıdır")
    .max(100, "Marka adı en fazla 100 karakter olabilir"),
  description: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional()
    .or(z.literal("")),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
