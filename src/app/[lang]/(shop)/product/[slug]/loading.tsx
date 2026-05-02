import styles from "./loading.module.css";

export default function ProductLoading() {
  return (
    <div className="container">
      {/* Breadcrumb Skeleton */}
      <div style={{ padding: "1rem 0" }}>
        <div
          className="skeleton"
          style={{ width: 250, height: 16, borderRadius: 4 }}
        />
      </div>

      <div className={styles.grid}>
        {/* Gallery Column Skeleton */}
        <div className={styles.galleryCol}>
          <div className={`${styles.imageSkeleton} skeleton`} />
          <div className={styles.thumbnailSkeletonWrapper}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${styles.thumbnailSkeleton} skeleton`} />
            ))}
          </div>
        </div>

        {/* Info Column Skeleton */}
        <div className={styles.info}>
          {/* Badges */}
          <div className={styles.badgeSkeletonWrapper}>
            <div
              className="skeleton"
              style={{ width: 80, height: 24, borderRadius: 99 }}
            />
            <div
              className="skeleton"
              style={{ width: 100, height: 24, borderRadius: 99 }}
            />
          </div>

          {/* Title */}
          <div
            className="skeleton"
            style={{ width: "90%", height: 36, borderRadius: 6 }}
          />

          {/* Short Desc */}
          <div
            className="skeleton"
            style={{ width: "100%", height: 20, borderRadius: 4 }}
          />

          {/* Rating */}
          <div
            className="skeleton"
            style={{ width: 150, height: 20, borderRadius: 4 }}
          />

          {/* Price Block */}
          <div className={`${styles.priceBlockSkeleton} skeleton`} />

          {/* Stock */}
          <div
            className="skeleton"
            style={{ width: 120, height: 24, borderRadius: 99 }}
          />

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: "var(--color-border-light)", margin: "8px 0" }} />

          {/* CTA Group */}
          <div className={styles.ctaGroupSkeleton}>
            <div
              className="skeleton"
              style={{ width: 120, height: 48, borderRadius: 12 }}
            />
            <div
              className="skeleton"
              style={{ flex: 1, height: 48, borderRadius: 12 }}
            />
            <div
              className="skeleton"
              style={{ flex: 1, height: 48, borderRadius: 12 }}
            />
          </div>

          {/* Trust Badges */}
          <div className={`${styles.trustBadgesSkeleton} skeleton`} />
        </div>
      </div>
    </div>
  );
}
