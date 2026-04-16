import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";

import { GET_PRODUCT_BY_ID, UPDATE_PRODUCT, DELETE_PRODUCT } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/products/:id — Tek ürün detay
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${GET_PRODUCT_BY_ID}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] GET /api/products/${id} error:`, error.message);

    // Mock fallback
    const mockProducts: Record<string, any> = {
      "1": {
        id: "1", name: "Kablosuz Kulaklık Pro", slug: "kablosuz-kulaklik-pro",
        description: "Yüksek ses kalitesi ve gürültü engelleme özelliği.",
        price: 1299.90, stock: 50, categoryId: "1", categoryName: "Elektronik",
        brandId: "2", brandName: "Sony",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
        rating: 4.5, isActive: true,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      },
      "2": {
        id: "2", name: "Akıllı Saat V2", slug: "akilli-saat-v2",
        description: "Tüm gün pil ömrü ve sağlık takibi.",
        price: 3499.00, stock: 30, categoryId: "1", categoryName: "Elektronik",
        brandId: "1", brandName: "Apple",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
        rating: 4.8, isActive: true,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      },
    };

    const product = mockProducts[id];
    if (product) {
      return NextResponse.json({ success: true, data: product });
    }
    return NextResponse.json({ success: false, message: "Ürün bulunamadı" }, { status: 404 });
  }
}

/**
 * PUT /api/products/:id — Ürün güncelle
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const response = await httpClient.put(UPDATE_PRODUCT, { id, ...body });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] PUT /api/products/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Ürün güncellenemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * DELETE /api/products/:id — Ürün sil
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.delete(`${DELETE_PRODUCT}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] DELETE /api/products/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Ürün silinemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}
