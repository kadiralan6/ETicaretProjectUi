import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_BRAND_BY_ID, UPDATE_BRAND, DELETE_BRAND } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/brands/:id — Tek marka getir
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${GET_BRAND_BY_ID}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] GET /api/brands/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Marka bulunamadı" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 404 }
    );
  }
}

/**
 * PUT /api/brands/:id — Marka güncelle
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const response = await httpClient.put(UPDATE_BRAND, { id, ...body });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] PUT /api/brands/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Marka güncellenemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * DELETE /api/brands/:id — Marka sil
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.delete(`${DELETE_BRAND}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] DELETE /api/brands/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Marka silinemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}
