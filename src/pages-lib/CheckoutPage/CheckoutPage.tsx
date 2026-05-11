"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import type { ICart } from "@/interfaces/ICart";
import type { IAddress } from "@/interfaces/IAddress";
import type {
  ICreateOrderRequest,
  IPlaceOrderResponse,
} from "@/interfaces/IOrder";
import styles from "./CheckoutPage.module.css";

const cardSchema = z.object({
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{16}$/, "Kart numarası 16 haneli olmalı")),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "AA/YY formatında girin"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV 3 veya 4 haneli olmalı"),
  cardHolderName: z
    .string()
    .min(3, "Kart üzerindeki adı girin")
    .regex(/^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/, "Sadece harf girin"),
});

type CardForm = z.infer<typeof cardSchema>;

const newAddressSchema = z.object({
  title: z.string().min(1, "Adres başlığı gerekli"),
  fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalı"),
  phoneNumber: z
    .string()
    .min(10, "Geçerli bir telefon numarası girin")
    .regex(/^[0-9\s+()-]+$/, "Geçerli bir telefon numarası girin"),
  city: z.string().min(2, "Şehir giriniz"),
  district: z.string().min(2, "İlçe giriniz"),
  fullAddress: z.string().min(10, "Adres en az 10 karakter olmalı"),
  postalCode: z.string().min(4, "Posta kodu giriniz"),
  isDefault: z.boolean().optional(),
});

type NewAddressForm = z.infer<typeof newAddressSchema>;

export const CheckoutPage = () => {
  const params = useParams();
  const lang = params?.lang ?? "tr";
  const { status } = useSession();

  const queryClient = useQueryClient();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { data: cart, isLoading: cartLoading } = useQuery<ICart>({
    queryKey: ["cart"],
    queryFn: () =>
      nextApiClient.get(NEXT_API_URLS.CART).then((r) => r.data),
    enabled: status === "authenticated",
    staleTime: 30_000,
  });

  const {
    data: addresses,
    isLoading: addressesLoading,
    refetch: refetchAddresses,
  } = useQuery<IAddress[]>({
    queryKey: ["addresses"],
    queryFn: () =>
      nextApiClient.get(NEXT_API_URLS.ADDRESSES).then((r) => r.data),
    enabled: status === "authenticated",
    staleTime: 60_000,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewAddressForm>({
    resolver: zodResolver(newAddressSchema),
    defaultValues: { isDefault: false },
  });

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    setValue: setCardValue,
    formState: { errors: cardErrors },
  } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardHolderName: "",
    },
  });

  const createOrderMutation = useMutation<
    IPlaceOrderResponse,
    Error,
    ICreateOrderRequest
  >({
    mutationFn: (payload) =>
      nextApiClient
        .post<IPlaceOrderResponse>(NEXT_API_URLS.ORDERS, payload)
        .then((r) => r.data),
    onSuccess: (order) => {
      setCreatedOrderId(order.orderId);
      setOrderSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
    },
    onError: (err) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setOrderError(
        axiosErr.response?.data?.message || "Sipariş oluşturulamadı.",
      );
    },
  });

  const saveNewAddress = async (data: NewAddressForm) => {
    setAddressSaving(true);
    setAddressError(null);
    try {
      const created: IAddress = await nextApiClient
        .post(NEXT_API_URLS.ADDRESSES, data)
        .then((r) => r.data);
      await refetchAddresses();
      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
      reset();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setAddressError(
        axiosErr.response?.data?.message || "Adres kaydedilemedi.",
      );
    } finally {
      setAddressSaving(false);
    }
  };

  const handlePlaceOrder = handleSubmitCard((card) => {
    if (!cart || selectedAddressId === null) return;
    setOrderError(null);

    const [expiryMonth, expiryYearShort] = card.expiry.split("/");
    const expiryYear =
      expiryYearShort.length === 2 ? "20" + expiryYearShort : expiryYearShort;

    const payload: ICreateOrderRequest = {
      cartId: cart.id,
      addressId: selectedAddressId,
      paymentMethod: 1,
      cardInfo: {
        cardNumber: card.cardNumber,
        expiryMonth,
        expiryYear,
        cvv: card.cvv,
        cardHolderName: card.cardHolderName.trim(),
      },
      amount: cart.total,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    createOrderMutation.mutate(payload);
  });

  useEffect(() => {
    if (addresses && addresses.length > 0 && selectedAddressId === null) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(def.id);
    }
    // selectedAddressId intentionally omitted — only auto-select on first addresses load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

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
          {createdOrderId !== null
            ? `Sipariş No: #${createdOrderId}. `
            : ""}
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
  if (!cartLoading && isEmpty) {
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

  const hasAddresses = addresses && addresses.length > 0;
  const canPlaceOrder =
    !showNewAddressForm && selectedAddressId !== null;

  return (
    <div className={styles.layout}>
      {/* Left — delivery + payment */}
      <div className={styles.formCol}>
        <h1 className={styles.pageTitle}>Teslimat Bilgileri</h1>

        {/* Address section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleNoMargin}`}>
              Teslimat Adresi
            </h2>
            {showNewAddressForm && hasAddresses && (
              <button
                type="button"
                className={styles.backToListBtn}
                onClick={() => {
                  setShowNewAddressForm(false);
                  setAddressError(null);
                }}
              >
                ← Kayıtlı adresler
              </button>
            )}
          </div>

          {addressesLoading ? (
            <div className={styles.skeletonList}>
              {[1, 2].map((i) => (
                <div key={i} className={styles.skeletonItem} />
              ))}
            </div>
          ) : hasAddresses && !showNewAddressForm ? (
            <>
              <div className={styles.addressList}>
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.addressCardSelected : ""}`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <input
                      type="radio"
                      className={styles.addressRadio}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className={styles.addressCardBody}>
                      <p className={styles.addressCardTitle}>{addr.title}</p>
                      <p className={styles.addressCardDetail}>
                        {addr.fullName} · {addr.phoneNumber}
                        <br />
                        {addr.district}, {addr.city}
                        <br />
                        {addr.fullAddress}
                      </p>
                    </div>
                    {addr.isDefault && (
                      <span className={styles.addressDefaultBadge}>
                        Varsayılan
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.addNewAddressBtn}
                onClick={() => setShowNewAddressForm(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Yeni adres ekle
              </button>
            </>
          ) : (
            /* New address form — shown when no saved addresses or user clicks "Yeni adres ekle" */
            <form
              id="new-address-form"
              onSubmit={handleSubmit(saveNewAddress)}
              noValidate
            >
              <div className={styles.field}>
                <label className={styles.label}>Adres Başlığı</label>
                <input
                  className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
                  placeholder="Ev, İş..."
                  {...register("title")}
                />
                {errors.title && (
                  <p className={styles.errorMsg}>{errors.title.message}</p>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Ad Soyad</label>
                  <input
                    className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                    placeholder="Ad Soyad"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className={styles.errorMsg}>{errors.fullName.message}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Telefon</label>
                  <input
                    className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ""}`}
                    placeholder="05xx xxx xx xx"
                    type="tel"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className={styles.errorMsg}>{errors.phoneNumber.message}</p>
                  )}
                </div>
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

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Posta Kodu</label>
                  <input
                    className={`${styles.input} ${errors.postalCode ? styles.inputError : ""}`}
                    placeholder="34710"
                    {...register("postalCode")}
                  />
                  {errors.postalCode && (
                    <p className={styles.errorMsg}>{errors.postalCode.message}</p>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Açık Adres</label>
                <textarea
                  className={`${styles.textarea} ${errors.fullAddress ? styles.inputError : ""}`}
                  placeholder="Mahalle, sokak, bina no, daire no..."
                  rows={3}
                  {...register("fullAddress")}
                />
                {errors.fullAddress && (
                  <p className={styles.errorMsg}>{errors.fullAddress.message}</p>
                )}
              </div>

              {addressError && (
                <p className={styles.errorMsgSpaced}>{addressError}</p>
              )}

              <button
                type="submit"
                className={styles.addressSaveBtn}
                disabled={addressSaving || isSubmitting}
              >
                {addressSaving ? "Kaydediliyor..." : "Bu Adresi Kaydet ve Kullan"}
              </button>
            </form>
          )}
        </div>

        {/* Payment section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ödeme Bilgileri</h2>

          <div className={styles.field}>
            <label className={styles.label}>Kart Numarası</label>
            <input
              className={`${styles.input} ${cardErrors.cardNumber ? styles.inputError : ""}`}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              inputMode="numeric"
              autoComplete="cc-number"
              {...registerCard("cardNumber")}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                const formatted = raw.match(/.{1,4}/g)?.join(" ") ?? "";
                setCardValue("cardNumber", formatted, { shouldValidate: true });
              }}
            />
            {cardErrors.cardNumber && (
              <p className={styles.errorMsg}>{cardErrors.cardNumber.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Son Kullanma</label>
              <input
                className={`${styles.input} ${cardErrors.expiry ? styles.inputError : ""}`}
                placeholder="AA/YY"
                maxLength={5}
                inputMode="numeric"
                autoComplete="cc-exp"
                {...registerCard("expiry")}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const formatted =
                    raw.length >= 2 ? raw.slice(0, 2) + "/" + raw.slice(2) : raw;
                  setCardValue("expiry", formatted, { shouldValidate: true });
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    (e.target as HTMLInputElement).value.endsWith("/")
                  ) {
                    e.preventDefault();
                    const trimmed = (e.target as HTMLInputElement).value.slice(0, -1);
                    setCardValue("expiry", trimmed, { shouldValidate: true });
                  }
                }}
              />
              {cardErrors.expiry && (
                <p className={styles.errorMsg}>{cardErrors.expiry.message}</p>
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>CVV</label>
              <input
                className={`${styles.input} ${cardErrors.cvv ? styles.inputError : ""}`}
                placeholder="123"
                maxLength={4}
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                {...registerCard("cvv")}
              />
              {cardErrors.cvv && (
                <p className={styles.errorMsg}>{cardErrors.cvv.message}</p>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Kart Üzerindeki Ad</label>
            <input
              className={`${styles.input} ${cardErrors.cardHolderName ? styles.inputError : ""}`}
              placeholder="AD SOYAD"
              autoComplete="cc-name"
              {...registerCard("cardHolderName")}
            />
            {cardErrors.cardHolderName && (
              <p className={styles.errorMsg}>
                {cardErrors.cardHolderName.message}
              </p>
            )}
          </div>
        </div>

        {orderError && (
          <p className={styles.errorMsgCentered}>{orderError}</p>
        )}

        <button
          type="button"
          className={styles.submitBtn}
          onClick={handlePlaceOrder}
          disabled={!canPlaceOrder || createOrderMutation.isPending}
        >
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
          {createOrderMutation.isPending ? "İşleniyor..." : "Siparişi Tamamla"}
        </button>

        {!canPlaceOrder && !showNewAddressForm && !hasAddresses && (
          <p className={styles.errorMsgCentered}>
            Lütfen önce bir teslimat adresi ekleyin.
          </p>
        )}
        {showNewAddressForm && (
          <p className={styles.errorMsgCentered}>
            Lütfen adresi kaydedin veya kayıtlı adreslerden birini seçin.
          </p>
        )}

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

          {cartLoading ? (
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
