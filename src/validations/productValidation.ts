import { z } from "zod";

/**
 * Ürün oluşturma/güncelleme form validasyon şeması.
 */
export const productSchema = z.object({
  code: z
    .string()
    .min(1, "Ürün kodu gereklidir"),
  name: z
    .string()
    .min(1, "Ürün adı gereklidir")
    .min(2, "Ürün adı en az 2 karakter olmalıdır")
    .max(200, "Ürün adı en fazla 200 karakter olabilir"),
  description: z
    .string()
    .optional(),
  price: z
    .number({ message: "Fiyat sayı olmalıdır" })
    .positive("Fiyat 0'dan büyük olmalıdır"),
  stockQuantity: z
    .number({ message: "Stok sayı olmalıdır" })
    .int("Stok tam sayı olmalıdır")
    .min(0, "Stok negatif olamaz"),
  isFeatured: z
    .boolean()
    .optional(),
  categoryId: z
    .string()
    .min(1, "Kategori seçilmelidir"),
  brandId: z
    .string()
    .min(1, "Marka seçilmelidir"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
