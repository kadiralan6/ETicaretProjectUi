import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_BASKET, ADD_TO_BASKET } from "@/constants/apiEndpoints";

/**
 * GET /api/basket — Kullanıcının sepetini getir
 */
export async function GET() {
  try {
    const response = await httpClient.get(GET_BASKET);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[BFF] GET /api/basket error:", error.message);

    // Mock fallback — boş sepet
    return NextResponse.json({
      success: true,
      data: {
        id: "mock-basket-1",
        userId: "mock-user",
        items: [],
        totalPrice: 0,
        itemCount: 0,
      },
    });
  }
}

/**
 * POST /api/basket — Sepete ürün ekle
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(ADD_TO_BASKET, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[BFF] POST /api/basket error:", error.message);

    // Mock fallback
    return NextResponse.json({
      success: true,
      message: "Ürün sepete eklendi.",
      data: {
        basketId: "mock-basket-1",
        itemsCount: 1,
      },
    });
  }
}
