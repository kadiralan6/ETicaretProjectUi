import { Metadata } from "next";
import Link from "next/link";
import { fetchHomeData } from "@/infrastructure/api/fetchClient";
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
  const homeRes = await fetchHomeData({
    page: 1,
    pageSize: 8,
    orderBy: 0,
    orderType: 0,
  }).catch(() => null);

  const rawFeatured = homeRes?.data?.featuredProducts ?? [];
  const featuredProducts = rawFeatured.map((p) => ({
    name: p.name,
    slug: p.slug,
    price: p.price,
    imageUrl: p.coverImageUrl ?? p.imageUrls?.[0] ?? null,
    categoryName: p.categoryName,
    brandName: p.brandName,
    rating:
      typeof p.rating === "object" ? p.rating?.average : undefined,
  }));

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
