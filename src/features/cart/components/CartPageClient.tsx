"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/features/cart/store";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import type {
  ICart,
  ICartItem,
  IAppliedCoupon,
  IAppliedCampaign,
} from "@/interfaces/ICart";
import styles from "./CartPageClient.module.css";

const CART_QUERY_KEY = ["cart"] as const;

function fetchCart(): Promise<ICart> {
  return nextApiClient.get(NEXT_API_URLS.CART).then((r) => r.data);
}

export const CartPageClient = () => {
  const params = useParams();
  const lang = params?.lang ?? "tr";
  const { status } = useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = status === "authenticated";

  // Local (guest) cart
  const guestItems = useCartStore((s) => s.items);
  const guestTotal = useCartStore((s) => s.getTotalPrice());
  const guestRemove = useCartStore((s) => s.removeItem);
  const guestUpdateQty = useCartStore((s) => s.updateQuantity);
  const guestClear = useCartStore((s) => s.clearCart);

  // Server cart query (only when authenticated)
  const {
    data: serverCart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useQuery<ICart>({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // ─── Mutations ───────────────────────────────────────────────
  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

  const updateItemMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) =>
      nextApiClient
        .put(NEXT_API_URLS.CART_ITEM(cartItemId), { quantity })
        .then((r) => r.data),
    onSuccess: invalidateCart,
  });

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: number) =>
      nextApiClient
        .delete(NEXT_API_URLS.CART_ITEM(cartItemId))
        .then((r) => r.data),
    onSuccess: invalidateCart,
  });

  const applyCouponMutation = useMutation({
    mutationFn: (couponCode: string) =>
      nextApiClient
        .post(NEXT_API_URLS.CART_COUPON, { couponCode })
        .then((r) => r.data),
    onSuccess: () => {
      setCouponInput("");
      setCouponError("");
      setCouponSuccess("Kupon uygulandı!");
      invalidateCart();
    },
    onError: (err: any) => {
      setCouponSuccess("");
      const status = err?.response?.status;
      const errors = err?.response?.data?.errors;
      const message = err?.response?.data?.message;
      if (status === 404) {
        setCouponError("Sepetinizde ürün yok.");
      } else if (status === 400) {
        setCouponError(
          message ?? "Oturumunuz geçersiz, lütfen tekrar giriş yapın.",
        );
      } else if (status === 422 && errors?.[0]) {
        setCouponError(errors[0]);
      } else {
        setCouponError("Kupon uygulanamadı, lütfen tekrar deneyin.");
      }
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: (cartItemIds: number[]) =>
      Promise.all(
        cartItemIds.map((cartItemId) =>
          nextApiClient
            .delete(NEXT_API_URLS.CART_COUPON_REMOVE(cartItemId))
            .then((r) => r.data),
        ),
      ),
    onSuccess: () => {
      setCouponError("");
      setCouponSuccess("Kupon kaldırıldı.");
      invalidateCart();
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () =>
      nextApiClient.delete(NEXT_API_URLS.CART_CLEAR).then((r) => r.data),
    onSuccess: invalidateCart,
  });

  // ─── Handlers ────────────────────────────────────────────────
  const handleApplyCoupon = () => {
    if (!couponInput.trim() || !serverCart) return;
    // Doc: kupon kodu case-sensitive — kullanıcının girdiği kasayı koru.
    applyCouponMutation.mutate(couponInput.trim());
  };

  // ─── Loading skeleton ─────────────────────────────────────────
  if (status === "loading" || (isAuthenticated && isCartLoading)) {
    return (
      <div className={styles.layout}>
        <div className={styles.itemsCol}>
          <div className={styles.pageHeader}>
            <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.itemCardSkeleton}>
              <div className={`${styles.skeletonBlock} ${styles.skeletonImg}`} />
              <div className={styles.skeletonInfo}>
                <div className={`${styles.skeletonBlock} ${styles.skeletonLine}`} />
                <div
                  className={`${styles.skeletonBlock} ${styles.skeletonLineShort}`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={`${styles.skeletonBlock} ${styles.skeletonSummary}`} />
      </div>
    );
  }

  // ─── Guest cart ───────────────────────────────────────────────
  if (!isAuthenticated) {
    const isEmpty = guestItems.length === 0;
    return (
      <div className={styles.layout}>
        <div className={styles.itemsCol}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              Sepetim
              {!isEmpty && (
                <span className={styles.itemCountBadge}>
                  {guestItems.reduce((s, i) => s + i.quantity, 0)} ürün
                </span>
              )}
            </h1>
            {!isEmpty && (
              <button
                className={styles.clearBtn}
                onClick={guestClear}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Sepeti Temizle
              </button>
            )}
          </div>

          <div className={styles.loginBanner}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              Sepetinizi kaydetmek ve kupon kullanmak için{" "}
              <Link href="/login" className={styles.loginLink}>
                giriş yapın
              </Link>
              .
            </span>
          </div>

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <ul className={styles.itemList}>
              {guestItems.map((item) => (
                <li key={item.productId} className={styles.itemCard}>
                  <div className={styles.itemImageWrap}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className={styles.itemImage}
                      />
                    ) : (
                      <div className={styles.itemImagePlaceholder}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className={styles.itemInfo}>
                    <Link href={`/product/${item.slug}`} className={styles.itemName}>
                      {item.name}
                    </Link>
                    <p className={styles.itemUnitPrice}>
                      {item.price.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺ / adet
                    </p>
                    <div className={styles.itemActions}>
                      <div>
                        <div className={styles.qtyControl}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              guestUpdateQty(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Azalt"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path d="M5 12h14" />
                            </svg>
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              guestUpdateQty(item.productId, item.quantity + 1)
                            }
                            disabled={item.quantity >= 5}
                            aria-label="Artır"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div>
                        {item.quantity >= 5 && (
                          <p className={styles.qtyMaxWarning}>
                            En fazla 5 adet eklenebilir
                          </p>
                        )}
                      </div>

                      <span className={styles.itemTotal}>
                        {(item.price * item.quantity).toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </span>

                      <button
                        className={styles.removeBtn}
                        onClick={() => guestRemove(item.productId)}
                        aria-label="Ürünü kaldır"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!isEmpty && (
            <Link href={`/${lang}/search`} className={styles.continueShoppingLink}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Alışverişe Devam Et
            </Link>
          )}
        </div>

        {/* Summary */}
        {!isEmpty && (
          <aside className={styles.summaryCol}>
            <OrderSummary
              subTotal={guestTotal}
              shippingCost={0}
              totalDiscount={0}
              totalPrice={guestTotal}
              appliedCoupon={null}
              appliedCampaign={null}
              couponInput={couponInput}
              setCouponInput={setCouponInput}
              couponError={couponError}
              couponSuccess=""
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={() => {}}
              isApplyingCoupon={false}
              isRemovingCoupon={false}
              isAuthenticated={false}
              lang={lang}
            />
          </aside>
        )}
      </div>
    );
  }

  // ─── Server cart (authenticated) ─────────────────────────────
  if (isCartError || !serverCart) {
    return (
      <div className={styles.errorState}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <p>Sepet yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.</p>
      </div>
    );
  }

  const isEmpty = serverCart.items.length === 0;
  const totalItemCount = serverCart.totalQuantity;

  return (
    <div className={styles.layout}>
      <div className={styles.itemsCol}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            Sepetim
            {!isEmpty && (
              <span className={styles.itemCountBadge}>
                {totalItemCount} ürün
              </span>
            )}
          </h1>
          {!isEmpty && (
            <button
              className={styles.clearBtn}
              onClick={() => clearCartMutation.mutate()}
              disabled={clearCartMutation.isPending}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Sepeti Temizle
            </button>
          )}
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <ul className={styles.itemList}>
            {serverCart.items.map((item: ICartItem) => (
              <li key={item.cartItemId} className={styles.itemCard}>
                <div className={styles.itemImageWrap}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName ?? ""}
                      fill
                      sizes="96px"
                      className={styles.itemImage}
                    />
                  ) : (
                    <div className={styles.itemImagePlaceholder}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.productName ?? "-"}</p>
                  <p className={styles.itemUnitPrice}>
                    {item.unitPrice.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    ₺ / adet
                  </p>
                  <div className={styles.itemActions}>
                    <div>
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() =>
                            updateItemMutation.mutate({
                              cartItemId: item.cartItemId,
                              quantity: item.quantity - 1,
                            })
                          }
                          disabled={
                            item.quantity <= 1 || updateItemMutation.isPending
                          }
                          aria-label="Azalt"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() =>
                            updateItemMutation.mutate({
                              cartItemId: item.cartItemId,
                              quantity: item.quantity + 1,
                            })
                          }
                          disabled={
                            item.quantity >= item.stockQuantity ||
                            updateItemMutation.isPending
                          }
                          aria-label="Artır"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                      {item.quantity >= item.stockQuantity && (
                        <p className={styles.qtyMaxWarning}>
                          Stok sınırına ulaşıldı
                        </p>
                      )}
                    </div>

                    <span className={styles.itemTotal}>
                      {item.lineTotal.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </span>

                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        removeItemMutation.mutate(item.cartItemId)
                      }
                      disabled={removeItemMutation.isPending}
                      aria-label="Ürünü kaldır"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isEmpty && (
          <Link href={`/${lang}/search`} className={styles.continueShoppingLink}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Alışverişe Devam Et
          </Link>
        )}
      </div>

      {/* Order Summary */}
      {!isEmpty && (
        <aside className={styles.summaryCol}>
          <OrderSummary
            subTotal={serverCart.subTotal}
            shippingCost={serverCart.shippingCost}
            totalDiscount={serverCart.totalDiscount}
            totalPrice={serverCart.total}
            appliedCoupon={serverCart.appliedCoupon}
            appliedCampaign={serverCart.appliedCampaign}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            couponError={couponError}
            couponSuccess={couponSuccess}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={() => {
              const ids = serverCart.items
                .filter((i) => i.couponId !== null)
                .map((i) => i.cartItemId);
              removeCouponMutation.mutate(ids);
            }}
            isApplyingCoupon={applyCouponMutation.isPending}
            isRemovingCoupon={removeCouponMutation.isPending}
            isAuthenticated={true}
            lang={lang}
          />
        </aside>
      )}
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────

function EmptyCart() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <h2 className={styles.emptyTitle}>Sepetiniz boş</h2>
      <p className={styles.emptyDesc}>
        Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın.
      </p>
      <Link href="/products" className={styles.emptyBtn}>
        Ürünleri Keşfet
      </Link>
    </div>
  );
}

interface OrderSummaryProps {
  subTotal: number;
  shippingCost: number;
  totalDiscount: number;
  totalPrice: number;
  appliedCoupon: IAppliedCoupon | null;
  appliedCampaign: IAppliedCampaign | null;
  couponInput: string;
  setCouponInput: (v: string) => void;
  couponError: string;
  couponSuccess: string;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  isApplyingCoupon: boolean;
  isRemovingCoupon: boolean;
  isAuthenticated: boolean;
  lang: string | string[];
}

const fmt = (n: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: 2 });

function OrderSummary({
  subTotal,
  shippingCost,
  totalDiscount,
  totalPrice,
  appliedCoupon,
  appliedCampaign,
  couponInput,
  setCouponInput,
  couponError,
  couponSuccess,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
  isRemovingCoupon,
  isAuthenticated,
  lang,
}: OrderSummaryProps) {
  return (
    <div className={styles.summaryCard}>
      <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>

      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}>
          <span>Ara Toplam</span>
          <span>{fmt(subTotal)} ₺</span>
        </div>

        {appliedCampaign && (
          <div className={`${styles.summaryRow} ${styles.discountRow}`}>
            <span>
              Kampanya
              <span className={styles.campaignChip}>
                {appliedCampaign.name ?? ""}
              </span>
            </span>
            <span>-{fmt(appliedCampaign.discountAmount)} ₺</span>
          </div>
        )}

        {appliedCoupon && (
          <div className={`${styles.summaryRow} ${styles.discountRow}`}>
            <span>
              Kupon
              <span className={styles.couponChip}>{appliedCoupon.code}</span>
            </span>
            <span>-{fmt(appliedCoupon.discountAmount)} ₺</span>
          </div>
        )}

        {totalDiscount > 0 && !appliedCoupon && !appliedCampaign && (
          <div className={`${styles.summaryRow} ${styles.discountRow}`}>
            <span>İndirim</span>
            <span>-{fmt(totalDiscount)} ₺</span>
          </div>
        )}

        <div className={styles.summaryRow}>
          <span>Kargo</span>
          {shippingCost === 0 ? (
            <span className={styles.freeShipping}>Ücretsiz</span>
          ) : (
            <span>{fmt(shippingCost)} ₺</span>
          )}
        </div>
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.summaryTotal}>
        <span>Toplam</span>
        <span>{fmt(totalPrice)} ₺</span>
      </div>

      {/* Coupon section */}
      {isAuthenticated && (
        <div className={styles.couponSection}>
          {appliedCoupon ? (
            <div className={styles.appliedCoupon}>
              <div className={styles.appliedCouponInfo}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>
                  <strong>{appliedCoupon.code}</strong> uygulandı
                </span>
              </div>
              <button
                className={styles.removeCouponBtn}
                onClick={onRemoveCoupon}
                disabled={isRemovingCoupon}
              >
                Kaldır
              </button>
            </div>
          ) : (
            <>
              <div className={styles.couponInputGroup}>
                <input
                  type="text"
                  className={styles.couponInput}
                  placeholder="Kupon kodu"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                  maxLength={32}
                />
                <button
                  className={styles.couponApplyBtn}
                  onClick={onApplyCoupon}
                  disabled={!couponInput.trim() || isApplyingCoupon}
                >
                  {isApplyingCoupon ? "..." : "Uygula"}
                </button>
              </div>
              {couponError && (
                <p className={styles.couponError}>{couponError}</p>
              )}
              {couponSuccess && !couponError && (
                <p className={styles.couponSuccess}>{couponSuccess}</p>
              )}
            </>
          )}
        </div>
      )}

      <Link href={`/${lang}/checkout`} className={styles.checkoutBtn}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        Ödemeye Geç
      </Link>

      <div className={styles.secureNote}>
        <svg
          width="14"
          height="14"
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
  );
}
