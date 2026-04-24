import { ProductGridSkeleton } from "@/components/shop/ProductGrid/ProductGrid";
import styles from "./loading.module.css";

export default function ShopLoading() {
  return (
    <div className={`container ${styles.loading}`}>
      <div className={`${styles.heroSkeleton} skeleton`} />
      <div className={`${styles.titleSkeleton} skeleton`} />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
