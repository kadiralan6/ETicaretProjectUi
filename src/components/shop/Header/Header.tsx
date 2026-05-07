"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/features/cart/store";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import type { ICartItemCount } from "@/interfaces/ICart";
import styles from "./Header.module.css";

export interface CategoryLink {
  name: string;
  slug: string;
}

export function Header({ categories = [] }: { categories?: CategoryLink[] }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAuthenticated = status === "authenticated";

  // Authenticated: fetch badge count from API
  const { data: cartCount } = useQuery<ICartItemCount>({
    queryKey: ["cart-count"],
    queryFn: () =>
      nextApiClient.get(NEXT_API_URLS.CART_COUNT).then((r) => r.data),
    enabled: isAuthenticated,
    // Refetch every 60 s in background to stay fresh
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  // Guest: use local Zustand store
  const guestItemCount = useCartStore((s) => s.getTotalItems());
  console.log("Cart count (API):", cartCount);
  console.log("Cart count (Guest store):", guestItemCount);
  const totalItems = isAuthenticated
    ? (cartCount?.uniqueItemCount ?? 0)
    : guestItemCount;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>

        {/* Left: Logo & Navigation */}
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logoGroup}>
            <div className={styles.logoIcon}>
              <span className={styles.logoInitial}>N</span>
            </div>
            <span className={styles.logoText}>Nova</span>
          </Link>

          <nav className={styles.desktopNav}>
            <Link href="/products" className={styles.navLink}>Ürünler</Link>
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className={styles.navLink}>
                {cat.name}
              </Link>
            ))}
            <Link href="/campaigns" className={styles.navLink}>Kampanyalar</Link>
          </nav>
        </div>

        {/* Center: Search */}
        <form
          className={styles.searchForm}
          onSubmit={handleSearch}
          role="search"
        >
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIconLeft}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search 400+ products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Ürün ara"
            />
          </div>
        </form>

        {/* Right: Actions */}
        <div className={styles.actions}>
          <button
            className={`${styles.iconButton} ${styles.mobileSearchToggle}`}
            aria-label="Arama"
            onClick={() =>
              router.push(
                `/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`,
              )
            }
          >
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link href="/wishlist" className={styles.iconButton} aria-label="Favoriler">
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          <div className={styles.accountWrap} ref={accountRef}>
            {isAuthenticated ? (
              <>
                <button
                  className={`${styles.iconButton} ${accountOpen ? styles.iconButtonActive : ""}`}
                  aria-label="Hesabım"
                  onClick={() => setAccountOpen((prev) => !prev)}
                >
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>

                {accountOpen && (
                  <div className={styles.accountDropdown}>
                    <div className={styles.dropdownAvatar}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <p className={styles.dropdownName}>
                      {session?.user?.name ?? "Kullanıcı"}
                    </p>
                    <p className={styles.dropdownEmail}>
                      {session?.user?.email ?? ""}
                    </p>
                    <div className={styles.dropdownDivider} />
                    <Link
                      href="/account"
                      className={styles.dropdownItem}
                      onClick={() => setAccountOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profilim
                    </Link>
                    <Link
                      href="/orders"
                      className={styles.dropdownItem}
                      onClick={() => setAccountOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="1" />
                      </svg>
                      Siparişlerim
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button
                      className={styles.dropdownLogout}
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        signOut({ callbackUrl: "/tr/login" });
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/tr/login" className={styles.iconButton} aria-label="Giriş Yap">
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
          </div>

          <Link
            href="/cart"
            className={styles.iconButton}
            aria-label={`Sepet (${totalItems} ürün)`}
          >
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
