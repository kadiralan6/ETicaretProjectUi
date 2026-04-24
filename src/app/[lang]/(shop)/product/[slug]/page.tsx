import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchStorefrontProduct, fetchSimilarProducts } from "@/infrastructure/api/fetchClient";
import { SimilarProductsScroll } from "@/features/product/components/SimilarProductsScroll";
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
  const res = await fetchStorefrontProduct(slug).catch(() => null);

  if (!res?.data) return { title: "Ürün Bulunamadı" };

  const { data: p } = res;
  return generateProductMetadata({
    name: p.name,
    description: p.description,
    slug: p.slug,
    price: p.price,
    imageUrls: p.images.map((img) => img.url),
    categoryName: p.category.name,
    brandName: p.brand.name,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const res = await fetchStorefrontProduct(slug).catch(() => null);

  if (!res?.data) notFound();

  const p = res.data;

  const similarRes = await fetchSimilarProducts(slug, 8).catch(() => null);
  const similarProducts = (similarRes?.data ?? []).map((s) => ({
    name: s.name,
    slug: s.slug,
    price: s.price,
    imageUrl: s.coverImageUrl ?? s.imageUrls[0] ?? null,
    categoryName: s.categoryName,
    brandName: s.brandName,
    rating: s.rating?.average,
  }));
  const coverImage = p.images.find((img) => img.isCover) ?? p.images[0];

  const productJsonLd = generateProductJsonLd({
    name: p.name,
    description: p.description,
    slug: p.slug,
    price: p.price,
    currency: p.currency,
    imageUrls: p.images.map((img) => img.url),
    brand: p.brand.name,
    category: p.category.name,
    rating: p.rating.average,
    reviewCount: p.rating.count,
    availability: p.isInStock ? "InStock" : "OutOfStock",
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Ana Sayfa", url: "/" },
    ...p.breadcrumbs.map((bc) => ({
      name: bc.name,
      url: `/category/${bc.slug}`,
    })),
    { name: p.name, url: `/product/${p.slug}` },
  ]);

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/" },
    ...p.breadcrumbs.map((bc) => ({
      label: bc.name,
      href: `/category/${bc.slug}`,
    })),
    { label: p.name },
  ];

  return (
    <>
      <JsonLdScript data={productJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />

      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.product}>
          {/* ── Gallery ── */}
          <div className={styles.galleryCol}>
            {p.images.length > 0 ? (
              <ProductImageGallery
                images={p.images}
                productName={p.name}
              />
            ) : (
              <div className={styles.noImage}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>Görsel mevcut değil</span>
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className={styles.info}>
            {/* Brand + Category */}
            <div className={styles.badges}>
              <span className={styles.brandBadge}>{p.brand.name}</span>
              <span className={styles.badgeSep}>·</span>
              <span className={styles.categoryBadge}>{p.category.name}</span>
            </div>

            {/* Title */}
            <h1 className={styles.name}>{p.name}</h1>

            {/* Short description */}
            {p.shortDescription && (
              <p className={styles.shortDesc}>{p.shortDescription}</p>
            )}

            {/* Rating */}
            {p.rating.average > 0 && (
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`${styles.star} ${i < Math.round(p.rating.average) ? styles.starFilled : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={styles.ratingAvg}>{p.rating.average.toFixed(1)}</span>
                <span className={styles.ratingCount}>({p.rating.count} değerlendirme)</span>
              </div>
            )}

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.price}>
                {p.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </span>
              <span className={styles.currency}>{p.currency}</span>
            </div>

            {/* Stock */}
            <div className={styles.stock}>
              {p.isInStock ? (
                <span className={styles.inStock}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Stokta var
                </span>
              ) : (
                <span className={styles.outOfStock}>Stokta yok</span>
              )}
              {p.isInStock && p.stockQuantity <= 5 && (
                <span className={styles.lowStock}>Son {p.stockQuantity} ürün!</span>
              )}
            </div>

            {/* Add to cart */}
            <AddToCartButton
              product={{
                id: p.id,
                productId: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                imageUrl: coverImage?.url ?? "",
              }}
              disabled={!p.isInStock}
            />

            {/* Description */}
            {p.description && (
              <div className={styles.descSection}>
                <h2 className={styles.descTitle}>Ürün Açıklaması</h2>
                <p className={styles.desc}>{p.description}</p>
              </div>
            )}
          </div>
        </div>
        {similarProducts.length > 0 && (
          <section className={styles.similar}>
            <h2 className={styles.similarTitle}>Benzer Ürünler</h2>
            <SimilarProductsScroll products={similarProducts} />
          </section>
        )}
      </div>
    </>
  );
}
