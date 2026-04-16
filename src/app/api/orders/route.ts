import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ALL_ORDERS, CREATE_ORDER } from "@/constants/apiEndpoints";

/**
 * GET /api/orders — Siparişleri listele
 */
export async function GET() {
  try {
    // TODO: Backend endpoint belirlendikten sonra güncellenecek
    const response = await httpClient.get(GET_ALL_ORDERS);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[BFF] GET /api/orders error:", error.message);

    // Mock fallback
    return NextResponse.json({
      success: true,
      data: [
        {
          id: "ORD-001",
          userId: "mock-user",
          items: [
            { id: "1", productId: "1", productName: "Kablosuz Kulaklık Pro", productImage: "", price: 1299.90, quantity: 1 },
          ],
          totalPrice: 1299.90,
          status: "Delivered",
          shippingAddress: "İstanbul, Kadıköy",
          createdAt: "2026-04-10T10:00:00Z",
          updatedAt: "2026-04-12T15:00:00Z",
        },
        {
          id: "ORD-002",
          userId: "mock-user",
          items: [
            { id: "2", productId: "3", productName: "Spor Ayakkabı Runner", productImage: "", price: 899.50, quantity: 2 },
          ],
          totalPrice: 1799.00,
          status: "Shipped",
          shippingAddress: "Ankara, Çankaya",
          createdAt: "2026-04-14T08:00:00Z",
          updatedAt: "2026-04-15T09:00:00Z",
        },
      ],
      totalCount: 2,
    });
  }
}

/**
 * POST /api/orders — Yeni sipariş oluştur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(CREATE_ORDER, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("[BFF] POST /api/orders error:", error.message);
    const errorData = error.response?.data || { message: "Sipariş oluşturulamadı" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}
