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
import { TrustBadges } from "@/features/product/components/TrustBadges";
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
  const similarProducts = (similarRes?.data ?? []).map((s) => {
    const coverUrl = s.coverImageUrl ?? null;
    const allUrls = s.imageUrls ?? [];
    // put cover first, then the rest deduped
    const imageUrls = coverUrl
      ? [coverUrl, ...allUrls.filter((u) => u !== coverUrl)]
      : allUrls;
    return {
      name: s.name,
      slug: s.slug,
      price: s.price,
      imageUrls,
      categoryName: s.categoryName,
      brandName: s.brandName,
      rating: s.rating?.average,
    };
  });
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

  // Conditional data (future-proof for backend extensions)
  const hasOldPrice = false; // p.oldPrice && p.oldPrice > p.price
  const oldPrice = 0;
  const discountPercent = hasOldPrice
    ? Math.round(((oldPrice - p.price) / oldPrice) * 100)
    : 0;

  // Specs & features — conditional render when backend supports them
  const specifications: Array<{ label: string; value: string }> = [];
  const features: string[] = [];

  return (
    <>
      <JsonLdScript data={productJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />

      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.product}>
          {/* ── Gallery Column ── */}
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

          {/* ── Info Column ── */}
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

            {/* Price Block */}
            <div className={styles.priceBlock}>
              <div className={styles.priceRow}>
                {hasOldPrice && (
                  <>
                    <span className={styles.oldPrice}>
                      {oldPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                    </span>
                    <span className={styles.discountBadge}>%{discountPercent} İNDİRİM</span>
                  </>
                )}
              </div>
              <div className={styles.currentPriceRow}>
                <span className={styles.price}>
                  {p.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </span>
                <span className={styles.currency}>{p.currency}</span>
              </div>
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
                <span className={styles.outOfStock}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Stokta yok
                </span>
              )}
              {p.isInStock && p.stockQuantity <= 5 && (
                <span className={styles.lowStock}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Son {p.stockQuantity} ürün!
                </span>
              )}
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Add to cart + Buy Now + Wishlist */}
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

            {/* Trust Badges */}
            <TrustBadges />

            {/* Description */}
            {p.description && (
              <div className={styles.descSection}>
                <h2 className={styles.sectionTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Ürün Açıklaması
                </h2>
                <p className={styles.desc}>{p.description}</p>
              </div>
            )}

            {/* Technical Specifications — conditional */}
            {specifications.length > 0 && (
              <div className={styles.specsSection}>
                <h2 className={styles.sectionTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  Teknik Özellikler
                </h2>
                <table className={styles.specsTable}>
                  <tbody>
                    {specifications.map((spec, i) => (
                      <tr key={i} className={styles.specRow}>
                        <td className={styles.specLabel}>{spec.label}</td>
                        <td className={styles.specValue}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Features List — conditional */}
            {features.length > 0 && (
              <div className={styles.featuresSection}>
                <h2 className={styles.sectionTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  Özellikler
                </h2>
                <ul className={styles.featuresList}>
                  {features.map((feature, i) => (
                    <li key={i} className={styles.featureItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── Similar Products ── */}
        {similarProducts.length > 0 && (
          <section className={styles.similar}>
            <div className={styles.similarHeader}>
              <h2 className={styles.similarTitle}>Benzer Ürünler</h2>
              <p className={styles.similarSubtitle}>Beğenebileceğiniz diğer ürünler</p>
            </div>
            <SimilarProductsScroll products={similarProducts} />
          </section>
        )}
      </div>
    </>
  );
}
