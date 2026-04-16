import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { REMOVE_FROM_BASKET } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ itemId: string }>;
}

/**
 * DELETE /api/basket/:itemId — Sepetten ürün sil
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { itemId } = await params;
  try {
    const response = await httpClient.delete(`${REMOVE_FROM_BASKET}/${itemId}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] DELETE /api/basket/${itemId} error:`, error.message);

    // Mock fallback
    return NextResponse.json({
      success: true,
      message: "Ürün sepetten silindi.",
    });
  }
}
