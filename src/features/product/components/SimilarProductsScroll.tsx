"use client";

import { useRef, useState, useEffect, useCallback } from "react";

import { ProductCard } from "@/components/shop/ProductCard/ProductCard";
import styles from "./SimilarProductsScroll.module.css";

interface SimilarProduct {
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  categoryName: string;
  brandName: string;
  rating?: number;
}

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
            <ProductCard {...p} priority={false} />
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
