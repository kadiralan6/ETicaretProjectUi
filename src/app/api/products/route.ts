import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";

import { GET_ALLFILTER_PRODUCTS, CREATE_PRODUCT } from "@/constants/apiEndpoints";

/**
 * GET /api/products — Ürünleri listele
 * Query params: Page, PageSize, Name, Code, IsActive, MinPrice, MaxPrice, OrderBy, OrderType
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const Page = searchParams.get("Page") || "1";
    const PageSize = searchParams.get("PageSize") || "10";
    const Name = searchParams.get("Name") || undefined;
    const Code = searchParams.get("Code") || undefined;
    const IsActive = searchParams.get("IsActive");
    const MinPrice = searchParams.get("MinPrice") || undefined;
    const MaxPrice = searchParams.get("MaxPrice") || undefined;
    const OrderBy = searchParams.get("OrderBy") || "0";
    const OrderType = searchParams.get("OrderType") || "0";

    const response = await httpClient.get(GET_ALLFILTER_PRODUCTS, {
      params: {
        Page,
        PageSize,
        Name,
        Code,
        IsActive: IsActive === null || IsActive === "" ? undefined : IsActive,
        MinPrice,
        MaxPrice,
        OrderBy,
        OrderType,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[BFF] GET /api/products error:", error.message);
    const errorData = error.response?.data || { message: "Ürünler getirilemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
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
