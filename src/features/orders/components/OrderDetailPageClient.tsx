"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import type {
  IOrderDetail,
  IOrderDetailItem,
  IOrderStatusCode,
} from "@/interfaces/IOrder";
import styles from "./OrderDetailPageClient.module.css";

const STATUS_MAP: Record<
  IOrderStatusCode,
  { label: string; cls: string; step: number }
> = {
  0: { label: "Beklemede", cls: "statusPending", step: 0 },
  1: { label: "Onaylandı", cls: "statusConfirmed", step: 1 },
  2: { label: "Kargoda", cls: "statusShipped", step: 3 },
  3: { label: "Teslim Edildi", cls: "statusDelivered", step: 4 },
  4: { label: "İptal Edildi", cls: "statusCancelled", step: -1 },
  5: { label: "Ödeme Başarısız", cls: "statusFailed", step: -1 },
};

// Steps shown in the progress tracker
const PROGRESS_STEPS = [
  { code: 1, label: "Onaylandı" },
  { code: 2, label: "Kargoda" },
  { code: 3, label: "Teslim Edildi" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(amount);
}

function getCoverImage(item: IOrderDetailItem): string | null {
  const cover = item.images.find((img) => img.isCover);
  return cover?.url ?? item.images[0]?.url ?? null;
}

export const OrderDetailPageClient = () => {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang ?? "tr";
  // orderNumber is stored in the [id] segment
  const orderNumber = params?.id as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${lang}/login`);
    }
  }, [status, router, lang]);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<IOrderDetail>({
    queryKey: QUERY_KEYS.ORDER_DETAIL(orderNumber),
    queryFn: () =>
      nextApiClient
        .get(NEXT_API_URLS.ORDER_BY_ID(orderNumber))
        .then((r) => r.data),
    enabled: status === "authenticated" && !!orderNumber,
    staleTime: 30_000,
  });

  if (status === "loading" || status === "unauthenticated") {
    return <DetailSkeleton />;
  }

  const statusInfo = order
    ? (STATUS_MAP[order.status] ?? {
        label: String(order.status),
        cls: "statusPending",
        step: 0,
      })
    : null;

  const showProgress =
    order && order.status !== 4 && order.status !== 5 && order.status !== 0;

  return (
    <div className={styles.wrapper}>
      <Link href={`/${lang}/orders`} className={styles.backLink}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Siparişlerime Dön
      </Link>

      {isLoading && <DetailSkeleton />}

      {isError && (
        <div className={styles.errorState}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>Sipariş bilgileri yüklenemedi. Lütfen tekrar deneyin.</p>
        </div>
      )}

      {!isLoading && !isError && order && statusInfo && (
        <>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>{order.orderNumber}</h1>
              <p className={styles.pageDate}>{formatDate(order.createdAt)}</p>
            </div>
            <span className={`${styles.statusBadge} ${styles[statusInfo.cls]}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Progress tracker */}
          {showProgress && (
            <div className={styles.progressCard}>
              <div className={styles.progressTrack}>
                {PROGRESS_STEPS.map((step, idx) => {
                  const done = order.status >= step.code;
                  const active = order.status === step.code;
                  return (
                    <div
                      key={step.code}
                      className={`${styles.progressStep} ${done ? styles.progressDone : ""} ${active ? styles.progressActive : ""}`}
                    >
                      <div className={styles.progressDot}>
                        {done && !active && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className={styles.progressLabel}>{step.label}</span>
                      {idx < PROGRESS_STEPS.length - 1 && (
                        <div
                          className={`${styles.progressLine} ${order.status > step.code ? styles.progressLineFilled : ""}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.grid}>
            {/* Left: items + summary */}
            <div className={styles.mainCol}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Sipariş Ürünleri</h2>
                <ul className={styles.itemList}>
                  {order.items.map((item) => {
                    const coverUrl = getCoverImage(item);
                    return (
                      <li key={item.productId} className={styles.itemRow}>
                        <div className={styles.itemImageWrap}>
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={item.productName}
                              width={72}
                              height={72}
                              className={styles.itemImage}
                            />
                          ) : (
                            <div className={styles.itemImagePlaceholder}>
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className={styles.itemInfo}>
                          <p className={styles.itemName}>{item.productName}</p>
                          <p className={styles.itemMeta}>
                            {item.brandName} · {item.categoryName}
                          </p>
                          <p className={styles.itemUnit}>
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <p className={styles.itemTotal}>
                          {formatPrice(item.totalNetPrice)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Sipariş Özeti</h2>
                <div className={styles.summaryRows}>
                  <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                    <span>Genel Toplam</span>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: address + buyer */}
            <div className={styles.sideCol}>
              {order.address ? (
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Teslimat Adresi
                  </h2>
                  <div className={styles.addressBlock}>
                    <p className={styles.addressTitle}>
                      {order.address.title}
                    </p>
                    <p className={styles.addressName}>
                      {order.address.fullName}
                    </p>
                    <p className={styles.addressLine}>
                      {order.address.fullAddress}
                    </p>
                    <p className={styles.addressLine}>
                      {order.address.city} {order.address.postalCode}
                    </p>
                    <p className={styles.addressPhone}>
                      {order.address.phoneNumber}
                    </p>
                  </div>
                </section>
              ) : (
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Teslimat Adresi
                  </h2>
                  <p className={styles.nullInfo}>
                    Adres bilgisi bulunamadı.
                  </p>
                </section>
              )}

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Ödeme Yöntemi
                </h2>
                <div className={styles.paymentBlock}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span>Kredi Kartı</span>
                </div>
              </section>

              {order.buyer && (
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Alıcı Bilgileri
                  </h2>
                  <div className={styles.addressBlock}>
                    <p className={styles.addressName}>
                      {order.buyer.firstName} {order.buyer.lastName}
                    </p>
                    <p className={styles.addressLine}>{order.buyer.email}</p>
                    <p className={styles.addressPhone}>
                      {order.buyer.phoneNumber}
                    </p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function DetailSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.skeletonLine}
        style={{ width: 160, height: 18 }}
      />
      <div
        style={{
          marginTop: 24,
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            className={styles.skeletonLine}
            style={{ width: 260, height: 28 }}
          />
          <div
            className={styles.skeletonLine}
            style={{ width: 150, height: 16, marginTop: 8 }}
          />
        </div>
        <div
          className={styles.skeletonLine}
          style={{ width: 90, height: 28 }}
        />
      </div>
      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <div
              className={styles.skeletonLine}
              style={{ width: 140, height: 20, marginBottom: 20 }}
            />
            {[1, 2].map((i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div
                  className={styles.skeletonLine}
                  style={{ width: 72, height: 72, borderRadius: 8, flexShrink: 0 }}
                />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div className={styles.skeletonLine} style={{ height: 16 }} />
                  <div
                    className={styles.skeletonLine}
                    style={{ width: "60%", height: 14 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.sideCol}>
          <div className={styles.card}>
            <div
              className={styles.skeletonLine}
              style={{ width: 120, height: 20, marginBottom: 16 }}
            />
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={styles.skeletonLine}
                style={{ height: 14, marginBottom: 10 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
