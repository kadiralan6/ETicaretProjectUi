import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  categoryName: string;
  brandName: string;
  rating?: number;
  badge?: string;
  priority?: boolean;
}

export function ProductCard({
  name,
  slug,
  price,
  imageUrl,
  categoryName,
  brandName,
  rating,
  badge,
  priority = false,
}: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={styles.image}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{categoryName}</span>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.brand}>{brandName}</span>
        <div className={styles.footer}>
          <span className={styles.price}>
            {price.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
            })}{" "}
            ₺
          </span>
          {rating !== undefined && rating > 0 && (
            <span className={styles.rating}>
              <svg
                className={styles.ratingStar}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`}>
      <div className={`${styles.skeletonImage} skeleton`} />
      <div className={styles.body}>
        <div
          className={`${styles.skeletonLine} ${styles.skeletonLineShort} skeleton`}
        />
        <div className={`${styles.skeletonLine} skeleton`} />
        <div
          className={`${styles.skeletonLine} ${styles.skeletonLineShort} skeleton`}
        />
        <div className={styles.footer}>
          <div
            className={`${styles.skeletonLine} ${styles.skeletonLinePrice} skeleton`}
          />
        </div>
      </div>
    </div>
  );
}
