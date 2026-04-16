import { z } from "zod";

/**
 * Kategori oluşturma/güncelleme form validasyon şeması.
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Kategori adı gereklidir")
    .min(2, "Kategori adı en az 2 karakter olmalıdır")
    .max(100, "Kategori adı en fazla 100 karakter olabilir"),
  description: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional()
    .or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
