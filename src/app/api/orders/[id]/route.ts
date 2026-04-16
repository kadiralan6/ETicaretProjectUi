import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";

import { GET_ORDER_BY_ID } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/orders/:id — Sipariş detay
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${GET_ORDER_BY_ID}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] GET /api/orders/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Sipariş bulunamadı" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 404 }
    );
  }
}
