import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_CATEGORY_BY_ID, UPDATE_CATEGORY, DELETE_CATEGORY } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/categories/:id — Tek kategori getir
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${GET_CATEGORY_BY_ID}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] GET /api/categories/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Kategori bulunamadı" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 404 }
    );
  }
}

/**
 * PUT /api/categories/:id — Kategori güncelle
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const response = await httpClient.put(UPDATE_CATEGORY, { id, ...body });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] PUT /api/categories/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Kategori güncellenemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * DELETE /api/categories/:id — Kategori sil
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.delete(`${DELETE_CATEGORY}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`[BFF] DELETE /api/categories/${id} error:`, error.message);
    const errorData = error.response?.data || { message: "Kategori silinemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}
