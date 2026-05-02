"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./SimilarProductsScroll.module.css";

interface SimilarProduct {
  name: string;
  slug: string;
  price: number;
  imageUrls: string[];
  categoryName: string;
  brandName: string;
  rating?: number;
}

// ─── Mini card with image carousel ───────────────────────────

const SimilarProductCard = ({ product }: { product: SimilarProduct }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const { name, slug, price, imageUrls, categoryName, brandName, rating } =
    product;
  const hasMultiple = imageUrls.length > 1;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i + 1) % imageUrls.length);
  };

  return (
    <Link href={`/product/${slug}`} className={styles.card}>
      <div className={styles.cardImageWrapper}>
        {imageUrls.length > 0 ? (
          <Image
            src={imageUrls[imgIndex]}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, 20vw"
            className={styles.cardImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.cardImagePlaceholder} />
        )}

        {hasMultiple && (
          <>
            <button
              className={`${styles.cardNav} ${styles.cardNavPrev}`}
              onClick={prev}
              aria-label="Önceki görsel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className={`${styles.cardNav} ${styles.cardNavNext}`}
              onClick={next}
              aria-label="Sonraki görsel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className={styles.cardDots}>
              {imageUrls.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.cardDot} ${i === imgIndex ? styles.cardDotActive : ""}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.cardBody}>
        <span className={styles.cardCategory}>{categoryName}</span>
        <h3 className={styles.cardName}>{name}</h3>
        <span className={styles.cardBrand}>{brandName}</span>
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>
            {price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
          </span>
          {rating !== undefined && rating > 0 && (
            <span className={styles.cardRating}>
              <svg className={styles.cardRatingStar} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// ─── Scroll wrapper ───────────────────────────────────────────

interface SimilarProductsScrollProps {
  products: SimilarProduct[];
}

export const SimilarProductsScroll = ({
  products,
}: SimilarProductsScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    return () => el.removeEventListener("scroll", updateButtons);
  }, [updateButtons]);

  const scroll = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth / 4;
    el.scrollBy({ left: dir === "next" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStartX.current = e.pageX - el.offsetLeft;
    dragScrollLeft.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartX.current) * 1.2;
    el.scrollLeft = dragScrollLeft.current - walk;
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => scroll("prev")}
        disabled={!canPrev}
        aria-label="Öncekiler"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div
        className={`${styles.track} ${isDragging ? styles.trackDragging : ""}`}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {products.map((p) => (
          <div key={p.slug} className={styles.item}>
            <SimilarProductCard product={p} />
          </div>
        ))}
      </div>

      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => scroll("next")}
        disabled={!canNext}
        aria-label="Sonrakiler"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
};
