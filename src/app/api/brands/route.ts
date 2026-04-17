import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ALLFILTER_BRANDS, CREATE_BRAND } from "@/constants/apiEndpoints";

/**
 * GET /api/brands — Tüm markaları listele
 */
export async function GET() {
  try {
    const response = await httpClient.get(GET_ALLFILTER_BRANDS);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[BFF] GET /api/brands error:", error.message);

    // Mock fallback
    const mockData = {
      success: true,
      data: [
        { id: "1", name: "Apple", description: "Teknoloji", isActive: true, createdAt: new Date().toISOString() },
        { id: "2", name: "Samsung", description: "Elektronik", isActive: true, createdAt: new Date().toISOString() },
        { id: "3", name: "Nike", description: "Spor giyim", isActive: true, createdAt: new Date().toISOString() },
      ],
    };
    return NextResponse.json(mockData);
  }
}

/**
 * POST /api/brands — Yeni marka oluştur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(CREATE_BRAND, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("[BFF] POST /api/brands error:", error.message);
    const errorData = error.response?.data || { message: "Marka oluşturulamadı" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}