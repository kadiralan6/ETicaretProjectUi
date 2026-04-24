import { Metadata } from "next";
import Link from "next/link";
import NextImage from "next/image";
import { fetchHomeData, fetchCategories } from "@/infrastructure/api/fetchClient";
import { HomeProductsFeed } from "@/features/home/components/HomeProductsFeed";
import { siteConfig } from "@/core/config/site";
import styles from "./page.module.css";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${siteConfig.name} - Online Alışveriş`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function HomePage() {
  const [homeRes, categoriesRes] = await Promise.all([
    fetchHomeData().catch(() => null),
    fetchCategories().catch(() => null),
  ]);

  const rawFeatured = homeRes?.data?.featuredProducts ?? [];
  const featuredProducts = rawFeatured.map((p) => ({
    name: p.name,
    slug: p.slug,
    price: p.price,
    imageUrl: p.coverImageUrl ?? p.imageUrls[0] ?? null,
    categoryName: p.categoryName,
    brandName: p.brandName,
    rating: p.rating?.average,
  }));
  const categories = Array.isArray(categoriesRes?.data?.results) ? categoriesRes.data.results : [];

  return (
    <div className="container">
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Binlerce Ürün, Tek Adres
          </h1>
          <p className={styles.heroDescription}>
            En yeni ürünleri keşfedin. Uygun fiyat, hızlı teslimat ve
            güvenli alışveriş deneyimi.
          </p>
          <Link href="/category/tum-urunler" className={styles.heroButton}>
            Alışverişe Başla
          </Link>
        </div>
        <div className={styles.heroImageWrapper}>
          <div className={styles.heroImagePlaceholder} />
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Kategoriler</h2>
          <div className={styles.categoryGrid}>
            {categories
              .filter((c) => !c.parentCategoryId && c.isActive)
              .slice(0, 6)
              .map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={styles.categoryCard}
                >
                  {category.imageUrl && (
                    <div className={styles.categoryImageWrapper}>
                      <NextImage
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className={styles.categoryImage}
                      />
                    </div>
                  )}
                  <span className={styles.categoryName}>
                    {category.name}
                  </span>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Öne Çıkan Ürünler</h2>
          <Link
            href="/category/tum-urunler"
            className={styles.sectionLink}
          >
            Tümünü Gör
          </Link>
        </div>
        <HomeProductsFeed initialProducts={featuredProducts} />
      </section>
    </div>
  );
}
