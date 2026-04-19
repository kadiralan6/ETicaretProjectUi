import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { CREATE_PRODUCT_IMAGE, UPDATE_PRODUCT_IMAGE } from "@/constants/apiEndpoints";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // FormData is automatically sent as multipart/form-data due to httpClient interceptor!
    const response = await httpClient.post(CREATE_PRODUCT_IMAGE, formData);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("[BFF] POST /api/productImages error:", error.response?.data || error.message);
    const errorData = error.response?.data || { message: "Resim yüklenemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await httpClient.put(UPDATE_PRODUCT_IMAGE, formData);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[BFF] PUT /api/productImages error:", error.response?.data || error.message);
    const errorData = error.response?.data || { message: "Resimler güncellenemedi" };
    return NextResponse.json(
      { success: false, ...errorData },
      { status: error.response?.status || 500 }
    );
  }
}
