"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./ProductImageGallery.module.css";

export interface ProductImage {
  url: string;
  altText: string | null;
  isCover: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number>(0);

  const handlePrev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  const handleNext = () =>
    setSelectedIndex((i) => (i + 1) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev();
    }
  };

  const selected = images[selectedIndex];
  const hasMultiple = images.length > 1;

  return (
    <div className={styles.gallery}>
      <div
        className={styles.mainImageWrapper}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={selected.url}
          alt={selected.altText || productName}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className={styles.mainImage}
          priority
        />

        {hasMultiple && (
          <>
            <button
              className={`${styles.navBtn} ${styles.navPrev}`}
              onClick={handlePrev}
              aria-label="Önceki görsel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className={`${styles.navBtn} ${styles.navNext}`}
              onClick={handleNext}
              aria-label="Sonraki görsel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className={styles.dots}>
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ""}`}
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`Görsel ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={index}
              className={`${styles.thumbnail} ${index === selectedIndex ? styles.thumbnailActive : ""}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={image.altText || `${productName} görsel ${index + 1}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productName} küçük görsel ${index + 1}`}
                fill
                sizes="80px"
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
