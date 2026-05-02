"use client";

import { useState, useRef, useCallback } from "react";
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
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number>(0);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

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

  /* ── Zoom Handlers ── */
  const handleMouseEnter = useCallback(() => {
    setIsZooming(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageWrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  /* ── Fullscreen Modal ── */
  const openFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => setIsFullscreen(false);

  const selected = images[selectedIndex];
  const hasMultiple = images.length > 1;

  return (
    <>
      <div className={styles.gallery}>
        <div
          ref={imageWrapperRef}
          className={`${styles.mainImageWrapper} ${isZooming ? styles.zooming : ""}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onClick={openFullscreen}
          role="button"
          tabIndex={0}
          aria-label="Büyütmek için tıklayın"
        >
          <Image
            src={selected.url}
            alt={selected.altText || productName}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className={styles.mainImage}
            priority
          />

          {/* Zoom overlay — desktop only */}
          {isZooming && (
            <div
              className={styles.zoomOverlay}
              style={{
                backgroundImage: `url(${selected.url})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          )}

          {/* Zoom hint icon */}
          <div className={`${styles.zoomHint} ${isZooming ? styles.zoomHintHidden : ""}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </div>

          {hasMultiple && (
            <>
              <button
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Önceki görsel"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className={`${styles.navBtn} ${styles.navNext}`}
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
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
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                    aria-label={`Görsel ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Image counter */}
          {hasMultiple && (
            <span className={styles.imageCounter}>
              {selectedIndex + 1} / {images.length}
            </span>
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

      {/* ── Fullscreen Modal ── */}
      {isFullscreen && (
        <div className={styles.fullscreenOverlay} onClick={closeFullscreen}>
          <button
            className={styles.fullscreenClose}
            onClick={closeFullscreen}
            aria-label="Kapat"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {hasMultiple && (
            <>
              <button
                className={`${styles.fullscreenNav} ${styles.fullscreenNavPrev}`}
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Önceki"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className={`${styles.fullscreenNav} ${styles.fullscreenNavNext}`}
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label="Sonraki"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <div className={styles.fullscreenImageWrapper} onClick={(e) => e.stopPropagation()}>
            <Image
              src={selected.url}
              alt={selected.altText || productName}
              fill
              sizes="100vw"
              className={styles.fullscreenImage}
              priority
            />
          </div>

          {hasMultiple && (
            <span className={styles.fullscreenCounter}>
              {selectedIndex + 1} / {images.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}
