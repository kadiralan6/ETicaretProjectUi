"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { LoginPromptModal } from "./LoginPromptModal";
import styles from "./AddToCartButton.module.css";

interface AddToCartButtonProps {
  product: {
    id: number;
    productId: number;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
  };
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const { status } = useSession();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated";
  const isSessionLoading = status === "loading";

  // Authenticated: POST to backend via BFF
  const addItemMutation = useMutation({
    mutationFn: () =>
      nextApiClient
        .post(NEXT_API_URLS.CART_ITEMS, {
          productId: product.productId,
          quantity,
        })
        .then((r) => r.data),
    onSuccess: () => {
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    },
    onError: async (error: any) => {
      const httpStatus = error.response?.status;
      // Mutation sadece isAuthenticated=true iken çalışır.
      // Backend 401 → JWT geçersiz/süresi dolmuş → oturumu kapat ve login'e yönlendir.
      if (httpStatus === 401) {
        setErrorMsg("Oturum doğrulanamadı. Lütfen tekrar giriş yapın.");
        setTimeout(() => setErrorMsg(null), 5000);
        return;
      }
      // Backend'den gelen message'ı göster (400, 500 vb.)
      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Sepete eklenirken bir hata oluştu.";
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    },
  });

  const handleAdd = () => {
    if (isSessionLoading) return;
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    addItemMutation.mutate();
  };

  const handleBuyNow = async () => {
    if (isSessionLoading) return;
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      await addItemMutation.mutateAsync();
      router.push(`/${lang}/cart`);
    } catch {
      // error handled by onError
    }
  };

  const toggleWishlist = () => {
    setWishlisted((prev) => {
      const next = !prev;
      // localStorage-based wishlist
      try {
        const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
        if (next) {
          stored.push(product.productId);
          localStorage.setItem("wishlist", JSON.stringify(stored));
        } else {
          localStorage.setItem(
            "wishlist",
            JSON.stringify(
              stored.filter((id: number) => id !== product.productId),
            ),
          );
        }
      } catch {
        // silently fail
      }
      return next;
    });
  };

  const isLoading = addItemMutation.isPending || isSessionLoading;

  return (
    <>
      {showLoginModal && (
        <LoginPromptModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* Success toast */}
      {added && (
        <div className={styles.toast}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>
            <strong>{product.name}</strong> sepetinize eklendi!
          </span>
        </div>
      )}

      {/* Error toast */}
      {errorMsg && (
        <div className={styles.toastError}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}
      <div className={styles.wrapper}>
        {/* Quantity Control */}
        <div className={styles.quantityControl}>
          <button
            className={styles.quantityButton}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={disabled || quantity <= 1 || isLoading}
            aria-label="Miktarı azalt"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className={styles.quantity}>{quantity}</span>
          <button
            className={styles.quantityButton}
            onClick={() => setQuantity((q) => q + 1)}
            disabled={disabled || isLoading}
            aria-label="Miktarı artır"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaGroup}>
          <button
            className={`${styles.addButton} ${added ? styles.added : ""}`}
            onClick={handleAdd}
            disabled={disabled || isLoading}
            aria-label={`${product.name} sepete ekle`}
          >
            {disabled ? (
              "Stokta Yok"
            ) : added ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Sepete Eklendi!
              </>
            ) : isLoading ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" />
                </svg>
                Ekleniyor...
              </>
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
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Sepete Ekle
              </>
            )}
          </button>

          <button
            className={styles.buyNowButton}
            onClick={handleBuyNow}
            disabled={disabled || isLoading}
            aria-label="Hemen satın al"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Hemen Al
          </button>
        </div>

        {/* Wishlist */}
        <button
          className={`${styles.wishlistButton} ${wishlisted ? styles.wishlisted : ""}`}
          onClick={toggleWishlist}
          aria-label={wishlisted ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </>
  );
}
