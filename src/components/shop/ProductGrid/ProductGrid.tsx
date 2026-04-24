import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/shop/ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

interface Product {
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  categoryName: string;
  brandName: string;
  rating?: number;
}

interface ProductGridProps {
  products: Product[];
  priorityCount?: number;
}

export function ProductGrid({
  products,
  priorityCount = 4,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.empty}>
          <svg
            className={styles.emptyIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <p className={styles.emptyTitle}>Ürün bulunamadı</p>
          <p className={styles.emptyText}>
            Farklı filtreler deneyerek aradığınız ürünü bulabilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product, index) => (
        <ProductCard
          key={product.slug}
          {...product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
