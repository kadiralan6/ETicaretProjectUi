import { fetchProducts, fetchCategories } from "@/infrastructure/api/fetchClient";
import { ProductsPage } from "@/pages-lib/ProductsPage/ProductsPage";

interface ProductsRoutePageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function ProductsRoutePage({
  params,
  searchParams,
}: ProductsRoutePageProps) {
  const { lang } = await params;
  const { search, category, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [productsRes, categoriesRes] = await Promise.all([
    fetchProducts({
      search,
      categorySlug: category,
      page: currentPage,
      pageSize: 20,
    }).catch(() => null),
    fetchCategories().catch(() => null),
  ]);

  const products = (productsRes?.data?.results ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    categoryName: p.categoryName,
    imageUrls: p.images?.map((img) => img.url) ?? [],
  }));
  const categories = categoriesRes?.data?.results ?? [];
  const totalPages = productsRes?.data?.pageCount ?? 1;

  return (
    <ProductsPage
      lang={lang}
      products={products}
      categories={categories}
      searchQuery={search ?? ""}
      selectedCategory={category ?? ""}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
