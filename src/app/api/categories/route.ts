import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ALL_CATEGORIES, CREATE_CATEGORY } from "@/constants/apiEndpoints";

/**
 * GET /api/categories — Tüm kategorileri listele
 */
export async function GET() {
  try {
    const response = await httpClient.get(GET_ALL_CATEGORIES);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[BFF] GET /api/categories error:", error.message);

    // Mock fallback — backend hazır olana kadar
    const mockData = {
      success: true,
      data: [
        { id: "1", name: "Elektronik", description: "Elektronik ürünler", isActive: true, createdAt: new Date().toISOString() },
        { id: "2", name: "Moda", description: "Giyim ve aksesuar", isActive: true, createdAt: new Date().toISOString() },
        { id: "3", name: "Ev & Yaşam", description: "Ev dekorasyon", isActive: true, createdAt: new Date().toISOString() },
        { id: "4", name: "Spor", description: "Spor ekipmanları", isActive: true, createdAt: new Date().toISOString() },
        { id: "5", name: "Hobi", description: "Hobi ürünleri", isActive: true, createdAt: new Date().toISOString() },
      ],
    };
    return NextResponse.json(mockData);
  }
}

/**
 * POST /api/categories — Yeni kategori oluştur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(CREATE_CATEGORY, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("[BFF] POST /api/categories error:", error.message);
    const errorData = error.response?.data || { message: "Kategori oluşturulamadı" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}
