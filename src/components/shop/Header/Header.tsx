"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store";
import styles from "./Header.module.css";

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          E-Ticaret
        </Link>

        <form
          className={styles.searchForm}
          onSubmit={handleSearch}
          role="search"
        >
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Ürün ara"
          />
          <button
            type="submit"
            className={styles.searchButton}
            aria-label="Ara"
          >
            <svg
              className={styles.searchIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>

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
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <Link href="/account" className={styles.iconButton} aria-label="Hesabım">
            <svg
              className={styles.icon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          <button
            className={styles.iconButton}
            onClick={toggleCart}
            aria-label={`Sepet (${totalItems} ürün)`}
          >
            <svg
              className={styles.icon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
