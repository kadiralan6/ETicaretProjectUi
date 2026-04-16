import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";

import { GET_ALL_PRODUCTS, CREATE_PRODUCT } from "@/constants/apiEndpoints";

/**
 * GET /api/products — Ürünleri listele
 * Query params: search, category, page, pageSize
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "20";

    const response = await httpClient.get(GET_ALL_PRODUCTS, {
      params: { search, category, page, pageSize },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[BFF] GET /api/products error:", error.message);

    // Mock fallback
    const mockProducts = [
      {
        id: "1", name: "Kablosuz Kulaklık Pro", slug: "kablosuz-kulaklik-pro",
        price: 1299.90, categoryName: "Elektronik", brandName: "Sony",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        rating: 4.5, stock: 50,
      },
      {
        id: "2", name: "Akıllı Saat V2", slug: "akilli-saat-v2",
        price: 3499.00, categoryName: "Elektronik", brandName: "Apple",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        rating: 4.8, stock: 30,
      },
      {
        id: "3", name: "Spor Ayakkabı Runner", slug: "spor-ayakkabi-runner",
        price: 899.50, categoryName: "Moda", brandName: "Nike",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        rating: 4.2, stock: 100,
      },
      {
        id: "4", name: "Modern Masa Lambası", slug: "modern-masa-lambasi",
        price: 450.00, categoryName: "Ev & Yaşam", brandName: "IKEA",
        image: "https://images.unsplash.com/photo-1507473888900-52e1adad5481?w=500&q=80",
        rating: 4.0, stock: 75,
      },
      {
        id: "5", name: "Yoga Matı Premium", slug: "yoga-mati-premium",
        price: 299.90, categoryName: "Spor", brandName: "Decathlon",
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80",
        rating: 4.7, stock: 200,
      },
    ];

    // Client-side filtreleme (mock)
    const { searchParams: sp } = new URL(request.url);
    const searchQuery = sp.get("search")?.toLowerCase() || "";
    const categoryFilter = sp.get("category") || "";

    const filtered = mockProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery);
      const matchCategory = categoryFilter ? p.categoryName === categoryFilter : true;
      return matchSearch && matchCategory;
    });

    return NextResponse.json({
      success: true,
      data: filtered,
      totalCount: filtered.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });
  }
}

/**
 * POST /api/products — Yeni ürün oluştur (admin)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(CREATE_PRODUCT, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("[BFF] POST /api/products error:", error.message);
    const errorData = error.response?.data || { message: "Ürün oluşturulamadı" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}
