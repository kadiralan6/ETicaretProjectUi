"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import type { IMyOrder, IOrderStatusCode } from "@/interfaces/IOrder";
import styles from "./OrdersPageClient.module.css";

const STATUS_MAP: Record<
  IOrderStatusCode,
  { label: string; cls: string }
> = {
  0: { label: "Beklemede", cls: "statusPending" },
  1: { label: "Onaylandı", cls: "statusConfirmed" },
  2: { label: "Kargoda", cls: "statusShipped" },
  3: { label: "Teslim Edildi", cls: "statusDelivered" },
  4: { label: "İptal Edildi", cls: "statusCancelled" },
  5: { label: "Ödeme Başarısız", cls: "statusFailed" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(amount);
}

export const OrdersPageClient = () => {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang ?? "tr";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${lang}/login`);
    }
  }, [status, router, lang]);

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<IMyOrder[]>({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: () =>
      nextApiClient.get(NEXT_API_URLS.ORDERS).then((r) => r.data),
    enabled: status === "authenticated",
    staleTime: 30_000,
  });

  if (status === "loading" || status === "unauthenticated") {
    return <OrdersSkeleton />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Siparişlerim</h1>
        <p className={styles.subtitle}>
          Geçmiş ve mevcut siparişlerinizi görüntüleyin.
        </p>
      </div>

      {isLoading && <OrdersSkeleton />}

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
          <p>
            Siparişler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
          </p>
        </div>
      )}

      {!isLoading && !isError && orders?.length === 0 && (
        <div className={styles.emptyState}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6M9 16h4" />
          </svg>
          <p className={styles.emptyTitle}>Henüz sipariş vermediniz.</p>
          <p className={styles.emptyText}>
            Alışverişe başlamak için mağazamızı ziyaret edin.
          </p>
          <Link href={`/${lang}`} className={styles.shopBtn}>
            Alışverişe Başla
          </Link>
        </div>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <ul className={styles.list}>
          {orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] ?? {
              label: String(order.status),
              cls: "statusPending",
            };
            return (
              <li key={order.orderNumber} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMeta}>
                    <span className={styles.orderId}>
                      {order.orderNumber}
                    </span>
                    <span className={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${styles[statusInfo.cls]}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <div className={styles.itemRow}>
                  <span className={styles.itemName}>{order.productName}</span>
                  <span className={styles.itemQty}>x{order.quantity}</span>
                </div>

                <div className={styles.cardBottom}>
                  <span className={styles.total}>
                    Toplam:{" "}
                    <strong>{formatPrice(order.totalPrice)}</strong>
                  </span>
                  <Link
                    href={`/${lang}/orders/${order.orderNumber}`}
                    className={styles.detailBtn}
                  >
                    Detayı Gör
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

function OrdersSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.skeletonLine} style={{ width: 180, height: 28 }} />
        <div
          className={styles.skeletonLine}
          style={{ width: 280, height: 16, marginTop: 8 }}
        />
      </div>
      <ul className={styles.list}>
        {[1, 2, 3].map((i) => (
          <li key={i} className={styles.card}>
            <div className={styles.cardTop}>
              <div
                className={styles.skeletonLine}
                style={{ width: 220, height: 18 }}
              />
              <div
                className={styles.skeletonLine}
                style={{ width: 80, height: 24 }}
              />
            </div>
            <div className={styles.skeletonLine} style={{ height: 16, margin: "16px 0" }} />
            <div className={styles.cardBottom}>
              <div
                className={styles.skeletonLine}
                style={{ width: 120, height: 18 }}
              />
              <div
                className={styles.skeletonLine}
                style={{ width: 110, height: 36 }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
