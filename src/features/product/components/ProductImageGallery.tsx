"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ProductImageGallery.module.css";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Görsel ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.mainImage}
          priority
        />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={index}
              className={`${styles.thumbnail} ${index === selectedIndex ? styles.thumbnailActive : ""}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Görsel ${index + 1}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            >
              <Image
                src={image}
                alt={`${productName} - Küçük görsel ${index + 1}`}
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
