"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import type { ICart } from "@/interfaces/ICart";
import styles from "./CheckoutPage.module.css";

const addressSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  phone: z
    .string()
    .min(10, "Geçerli bir telefon numarası girin")
    .regex(/^[0-9\s+()-]+$/, "Geçerli bir telefon numarası girin"),
  city: z.string().min(2, "Şehir seçiniz"),
  district: z.string().min(2, "İlçe giriniz"),
  address: z.string().min(10, "Adres en az 10 karakter olmalı"),
});

type AddressForm = z.infer<typeof addressSchema>;

export const CheckoutPage = () => {
  const params = useParams();
  const lang = params?.lang ?? "tr";
  const router = useRouter();
  const { status } = useSession();
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { data: cart, isLoading } = useQuery<ICart>({
    queryKey: ["cart"],
    queryFn: () =>
      nextApiClient.get(NEXT_API_URLS.CART).then((r) => r.data),
    enabled: status === "authenticated",
    staleTime: 30_000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (_data: AddressForm) => {
    // Placeholder — order API integration goes here
    await new Promise((resolve) => setTimeout(resolve, 800));
    setOrderSuccess(true);
  };

  if (status === "unauthenticated") {
    return (
      <div className={styles.centered}>
        <p>
          Ödeme yapmak için{" "}
          <Link href={`/${lang}/login`} className={styles.link}>
            giriş yapın
          </Link>
          .
        </p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className={styles.successTitle}>Siparişiniz Alındı!</h1>
        <p className={styles.successDesc}>
          Siparişiniz başarıyla oluşturuldu. Kısa süre içinde size e-posta
          gönderilecektir.
        </p>
        <Link href={`/${lang}/products`} className={styles.backBtn}>
          Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (!isLoading && isEmpty) {
    return (
      <div className={styles.centered}>
        <p>
          Sepetiniz boş.{" "}
          <Link href={`/${lang}/products`} className={styles.link}>
            Ürünlere git
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Left — Form */}
      <div className={styles.formCol}>
        <h1 className={styles.pageTitle}>Teslimat Bilgileri</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Adres</h2>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Ad</label>
                <input
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                  placeholder="Adınız"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className={styles.errorMsg}>{errors.firstName.message}</p>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Soyad</label>
                <input
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                  placeholder="Soyadınız"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className={styles.errorMsg}>{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Telefon</label>
              <input
                className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                placeholder="05xx xxx xx xx"
                type="tel"
                {...register("phone")}
              />
              {errors.phone && (
                <p className={styles.errorMsg}>{errors.phone.message}</p>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Şehir</label>
                <input
                  className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
                  placeholder="İstanbul"
                  {...register("city")}
                />
                {errors.city && (
                  <p className={styles.errorMsg}>{errors.city.message}</p>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>İlçe</label>
                <input
                  className={`${styles.input} ${errors.district ? styles.inputError : ""}`}
                  placeholder="Kadıköy"
                  {...register("district")}
                />
                {errors.district && (
                  <p className={styles.errorMsg}>{errors.district.message}</p>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Açık Adres</label>
              <textarea
                className={`${styles.textarea} ${errors.address ? styles.inputError : ""}`}
                placeholder="Mahalle, sokak, bina no, daire no..."
                rows={3}
                {...register("address")}
              />
              {errors.address && (
                <p className={styles.errorMsg}>{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Payment section — UI only */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ödeme Bilgileri</h2>

            <div className={styles.field}>
              <label className={styles.label}>Kart Numarası</label>
              <input
                className={styles.input}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Son Kullanma</label>
                <input
                  className={styles.input}
                  placeholder="AA/YY"
                  maxLength={5}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>CVV</label>
                <input
                  className={styles.input}
                  placeholder="123"
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Kart Üzerindeki Ad</label>
              <input className={styles.input} placeholder="AD SOYAD" />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "İşleniyor..."
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Siparişi Tamamla
              </>
            )}
          </button>

          <div className={styles.secureNote}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            256-bit SSL ile güvenli ödeme
          </div>
        </form>
      </div>

      {/* Right — Order summary */}
      <aside className={styles.summaryCol}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>
            <Link href={`/${lang}/cart`} className={styles.editCartLink}>
              Sepeti Düzenle
            </Link>
          </div>

          {isLoading ? (
            <div className={styles.skeletonList}>
              {[1, 2].map((i) => (
                <div key={i} className={styles.skeletonItem} />
              ))}
            </div>
          ) : (
            <ul className={styles.itemList}>
              {cart?.items.map((item) => (
                <li key={item.id} className={styles.itemRow}>
                  <div className={styles.itemImageWrap}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="56px"
                        className={styles.itemImage}
                      />
                    ) : (
                      <div className={styles.itemImagePlaceholder} />
                    )}
                    <span className={styles.itemQtyBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.productName}</p>
                    <p className={styles.itemPrice}>
                      {item.lineTotal.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.divider} />

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Ara Toplam</span>
              <span>
                {(cart?.subtotal ?? 0).toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}{" "}
                ₺
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Kargo</span>
              <span className={styles.freeShipping}>Ücretsiz</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span>Toplam</span>
            <span className={styles.totalAmount}>
              {(cart?.total ?? 0).toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
              })}{" "}
              ₺
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};
