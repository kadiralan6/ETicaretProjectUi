import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProductBySlug } from "@/infrastructure/api/fetchClient";
import { generateProductMetadata } from "@/core/seo/metadata";
import {
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
  JsonLdScript,
} from "@/core/seo/jsonLd";
import { Breadcrumb } from "@/components/shop/Breadcrumb/Breadcrumb";
import { AddToCartButton } from "@/features/product/components/AddToCartButton";
import { ProductImageGallery } from "@/features/product/components/ProductImageGallery";
import styles from "./page.module.css";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchProductBySlug(slug).catch(() => null);

  if (!res?.data) {
    return { title: "Ürün Bulunamadı" };
  }

  return generateProductMetadata({
    name: res.data.name,
    description: res.data.description,
    slug: res.data.slug,
    price: res.data.price,
    imageUrls: res.data.imageUrls,
    categoryName: res.data.categoryName,
    brandName: res.data.brandName,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const res = await fetchProductBySlug(slug).catch(() => null);

  if (!res?.data) {
    notFound();
  }

  const product = res.data;

  const productJsonLd = generateProductJsonLd({
    name: product.name,
    description: product.description,
    slug: product.slug,
    price: product.price,
    imageUrls: product.imageUrls,
    brand: product.brandName,
    category: product.categoryName,
    rating: product.rating,
    reviewCount: product.rating > 0 ? 1 : 0,
    availability: product.stockQuantity > 0 ? "InStock" : "OutOfStock",
    sku: product.code,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Ana Sayfa", url: "/" },
    {
      name: product.categoryName,
      url: `/category/${product.categorySlug}`,
    },
    {
      name: product.name,
      url: `/product/${product.slug}`,
    },
  ]);

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/" },
    {
      label: product.categoryName,
      href: `/category/${product.categorySlug}`,
    },
    { label: product.name },
  ];

  return (
    <>
      <JsonLdScript data={productJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />

      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.product}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            {product.imageUrls.length > 0 ? (
              <ProductImageGallery
                images={product.imageUrls}
                productName={product.name}
              />
            ) : (
              <div className={styles.noImage}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                  />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>Görsel mevcut değil</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            <div className={styles.meta}>
              <span className={styles.brand}>{product.brandName}</span>
              <span className={styles.separator}>|</span>
              <span className={styles.category}>
                {product.categoryName}
              </span>
            </div>

            <h1 className={styles.name}>{product.name}</h1>

            {product.rating > 0 && (
              <div className={styles.rating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className={`${styles.star} ${i < Math.round(product.rating) ? styles.starFilled : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className={styles.ratingText}>
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}

            <div className={styles.priceBlock}>
              <span className={styles.price}>
                {product.price.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}{" "}
                ₺
              </span>
            </div>

            <div className={styles.stock}>
              {product.stockQuantity > 0 ? (
                <span className={styles.inStock}>Stokta var</span>
              ) : (
                <span className={styles.outOfStock}>Stokta yok</span>
              )}
              {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                <span className={styles.lowStock}>
                  Son {product.stockQuantity} ürün!
                </span>
              )}
            </div>

            <AddToCartButton
              product={{
                id: product.id,
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                imageUrl:
                  product.imageUrls[0] || "/placeholder-product.jpg",
              }}
              disabled={product.stockQuantity === 0}
            />

            {/* Product Code */}
            <div className={styles.code}>
              Ürün Kodu: <strong>{product.code}</strong>
            </div>

            {/* Description */}
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionTitle}>Ürün Açıklaması</h2>
              <div className={styles.description}>
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
