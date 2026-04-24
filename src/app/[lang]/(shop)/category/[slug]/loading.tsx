import { ProductGridSkeleton } from "@/components/shop/ProductGrid/ProductGrid";

export default function CategoryLoading() {
  return (
    <div className="container">
      <div style={{ padding: "1rem 0" }}>
        <div
          className="skeleton"
          style={{ width: 200, height: 16, borderRadius: 4 }}
        />
      </div>
      <div style={{ padding: "1rem 0 2rem" }}>
        <div
          className="skeleton"
          style={{
            width: 300,
            height: 36,
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <div
          className="skeleton"
          style={{ width: 120, height: 16, borderRadius: 4 }}
        />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
