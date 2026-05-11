"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./SearchFilters.module.css";

const SORT_OPTIONS = [
  { label: "İlgililik", value: "" },
  { label: "Fiyat: Düşükten Yükseğe", value: "price:asc" },
  { label: "Fiyat: Yüksekten Düşüğe", value: "price:desc" },
  { label: "İsme Göre (A-Z)", value: "name:asc" },
  { label: "İsme Göre (Z-A)", value: "name:desc" },
];

interface SearchFiltersProps {
  currentMinPrice: string;
  currentMaxPrice: string;
  currentInStock: boolean;
  currentSort: string;
}

export function SearchFilters({
  currentMinPrice,
  currentMaxPrice,
  currentInStock,
  currentSort,
}: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state when URL changes
  useEffect(() => {
    const fmt = (v: string) => {
      const digits = v.replace(/\D/g, "");
      return digits ? Number(digits).toLocaleString("tr-TR") : "";
    };
    setMinPrice(fmt(currentMinPrice));
    setMaxPrice(fmt(currentMaxPrice));
  }, [currentMinPrice, currentMaxPrice]);

  const updateParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceChange = (key: "minPrice" | "maxPrice", rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");
    const formatted = digits ? Number(digits).toLocaleString("tr-TR") : "";

    if (key === "minPrice") setMinPrice(formatted);
    else setMaxPrice(formatted);

    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (digits === "") {
        params.delete(key);
      } else {
        params.set(key, digits);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    }, 600);
  };

  const handleInStock = (checked: boolean) => {
    updateParam("inStock", checked ? "true" : undefined);
  };

  const handleSort = (value: string) => {
    if (!value) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("sortBy");
      params.delete("sortOrder");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
      return;
    }
    const [sortBy, sortOrder] = value.split(":");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters =
    currentMinPrice || currentMaxPrice || currentInStock || currentSort;

  const clearPriceFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.root}>
      {/* Sort */}
      <div className={styles.section}>
        <label className={styles.sectionTitle} htmlFor="sort-select">
          Sıralama
        </label>
        <select
          id="sort-select"
          className={styles.select}
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Fiyat Aralığı</span>
          {(currentMinPrice || currentMaxPrice) && (
            <button
              className={styles.clearBtn}
              onClick={clearPriceFilters}
              type="button"
            >
              Temizle
            </button>
          )}
        </div>
        <div className={styles.priceRow}>
          <div className={styles.priceField}>
            <label className={styles.priceLabel} htmlFor="min-price">
              En az
            </label>
            <div className={styles.priceInputWrap}>
              <input
                id="min-price"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className={styles.priceInput}
                placeholder="0"
                value={minPrice}
                onChange={(e) => handlePriceChange("minPrice", e.target.value)}
              />
              <span className={styles.priceCurrency}>₺</span>
            </div>
          </div>
          <div className={styles.priceField}>
            <label className={styles.priceLabel} htmlFor="max-price">
              En fazla
            </label>
            <div className={styles.priceInputWrap}>
              <input
                id="max-price"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className={styles.priceInput}
                placeholder="0"
                value={maxPrice}
                onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
              />
              <span className={styles.priceCurrency}>₺</span>
            </div>
          </div>
        </div>
      </div>

      {/* In Stock */}
      <div className={styles.section}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={currentInStock}
            onChange={(e) => handleInStock(e.target.checked)}
          />
          <span>Sadece Stokta Olanlar</span>
        </label>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          className={styles.clearAllBtn}
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("minPrice");
            params.delete("maxPrice");
            params.delete("inStock");
            params.delete("sortBy");
            params.delete("sortOrder");
            params.delete("page");
            router.push(`${pathname}?${params.toString()}`);
          }}
        >
          Filtreleri Temizle
        </button>
      )}
    </div>
  );
}
