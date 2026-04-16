import { z } from "zod";

/**
 * Ürün oluşturma/güncelleme form validasyon şeması.
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Ürün adı gereklidir")
    .min(2, "Ürün adı en az 2 karakter olmalıdır")
    .max(200, "Ürün adı en fazla 200 karakter olabilir"),
  description: z
    .string()
    .min(1, "Açıklama gereklidir")
    .min(10, "Açıklama en az 10 karakter olmalıdır"),
  price: z
    .number({ error: "Fiyat sayı olmalıdır" })
    .positive("Fiyat 0'dan büyük olmalıdır"),
  stock: z
    .number({ error: "Stok sayı olmalıdır" })
    .int("Stok tam sayı olmalıdır")
    .min(0, "Stok negatif olamaz"),
  categoryId: z
    .string()
    .min(1, "Kategori seçilmelidir"),
  brandId: z
    .string()
    .min(1, "Marka seçilmelidir"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
