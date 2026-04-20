import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { CREATE_PRODUCT_IMAGE, UPDATE_PRODUCT_IMAGE } from "@/constants/apiEndpoints";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await httpClient.post(CREATE_PRODUCT_IMAGE, formData);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await httpClient.put(UPDATE_PRODUCT_IMAGE, formData);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
